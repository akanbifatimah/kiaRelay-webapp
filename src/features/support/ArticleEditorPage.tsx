import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Controller, useForm, type FieldErrors } from "react-hook-form";
import { ArrowLeft, Eye, Save, Send } from "lucide-react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { useToast } from "../../components/toast/ToastContext";
import { CURRENT_AGENT_ID, getAgent } from "./agents";
import { articlesStore, nextArticleId, saveArticle, type ArticleStatus } from "./knowledgeBase";
import { articleFromForm, EMPTY_ARTICLE_FORM, formFromArticle, type ArticleFormValues } from "./articleForm";
import { ArticleEditorToolbar } from "./components/ArticleEditorToolbar";
import { ArticleSettingsCard } from "./components/ArticleSettingsCard";
import { TagInput } from "./components/TagInput";
import { SupportNotFound } from "./components/SupportNotFound";

// Create (/support/knowledge-base/new) and Edit (/:id/edit) share this page.
// Publish validates everything; Save Draft and Preview only need a title.
export function ArticleEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const existing = id ? articlesStore.get().find((article) => article.id === id) : undefined;
  const [articleId] = useState(() => existing?.id ?? nextArticleId());
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const agent = getAgent(CURRENT_AGENT_ID);
  const author = { name: existing?.author ?? agent?.name ?? "Support", role: existing?.authorRole ?? "Logistics Analyst" };
  const status: ArticleStatus = existing?.status ?? "draft";
  const { control, handleSubmit, getValues, setValue, trigger } = useForm<ArticleFormValues>({
    defaultValues: existing ? formFromArticle(existing) : EMPTY_ARTICLE_FORM,
  });

  if (id && !existing) return <SupportNotFound what="article" id={id} />;

  function persist(nextStatus: ArticleStatus) {
    saveArticle(articleFromForm(articleId, getValues(), nextStatus, author, existing));
  }

  async function requireTitle(): Promise<boolean> {
    const ok = await trigger("title");
    if (!ok) showToast("error", "Give the article a title first.");
    return ok;
  }

  async function saveDraft() {
    if (!(await requireTitle())) return;
    // Saving a published article's edits keeps it published; only new or
    // unpublished articles are stored as drafts.
    persist(status === "published" ? "published" : "draft");
    showToast("success", status === "published" ? "Changes saved to the published article." : "Draft saved.");
    if (!existing) navigate(`/support/knowledge-base/${articleId}/edit`, { replace: true });
  }

  async function preview() {
    if (!(await requireTitle())) return;
    persist(status === "published" ? "published" : "draft");
    navigate(`/support/knowledge-base/${articleId}?preview=1`);
  }

  function publish() {
    persist("published");
    showToast("success", "Article published to the knowledge base.");
    navigate(`/support/knowledge-base/${articleId}`);
  }

  function onInvalid(errors: FieldErrors<ArticleFormValues>) {
    const first = Object.values(errors)[0]?.message;
    showToast("error", typeof first === "string" ? first : "Complete the required fields before publishing.");
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/support/knowledge-base" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Knowledge Base
      </Link>
      <div>
        <p className="text-xs text-text-muted">Knowledge Base / <span className="font-semibold text-text">{existing ? "Edit Article" : "Create Article"}</span></p>
        <h1 className="text-heading-1 mt-1 text-text">{existing ? "Edit Knowledge Base Article" : "New Knowledge Base Article"}</h1>
      </div>
      <form onSubmit={handleSubmit(publish, onInvalid)} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="flex min-w-0 flex-col gap-4">
          <Controller
            name="title"
            control={control}
            rules={{ validate: (value) => value.trim().length > 0 || "Give the article a title." }}
            render={({ field, fieldState }) => (
              <Card className="p-0">
                <input {...field} placeholder="Enter article title here..." className="w-full rounded-[var(--radius-card)] bg-transparent px-5 py-4 text-xl font-semibold text-text placeholder:text-text-muted focus:outline-none" />
                {fieldState.error && <p className="px-5 pb-3 text-xs text-danger">{fieldState.error.message}</p>}
              </Card>
            )}
          />
          <Controller
            name="content"
            control={control}
            rules={{ validate: (value) => value.trim().length >= 20 || "Write the article body (at least 20 characters) before publishing." }}
            render={({ field, fieldState }) => (
              <Card className="overflow-hidden p-0">
                <ArticleEditorToolbar textareaRef={textareaRef} onChange={(value) => setValue("content", value, { shouldDirty: true })} />
                <textarea
                  {...field}
                  ref={(el) => {
                    field.ref(el);
                    textareaRef.current = el;
                  }}
                  rows={18}
                  placeholder="Start writing the article content..."
                  className="w-full resize-y bg-transparent px-5 py-4 text-sm leading-relaxed text-text placeholder:text-text-muted focus:outline-none"
                />
                {fieldState.error && <p className="px-5 pb-3 text-xs text-danger">{fieldState.error.message}</p>}
              </Card>
            )}
          />
          <Card className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-text">Tags &amp; Keywords</h2>
            <p className="text-xs text-text-muted">Add tags to improve searchability within the support portal.</p>
            <Controller name="tags" control={control} render={({ field }) => <TagInput value={field.value} onChange={field.onChange} />} />
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          <ArticleSettingsCard control={control} status={status} author={author} />
          <Card className="flex flex-col gap-2">
            <Button type="submit" className="w-full">
              <Send className="h-4 w-4" />
              {status === "published" ? "Update Article" : "Publish Article"}
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="secondary" onClick={saveDraft}>
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              <Button type="button" variant="secondary" onClick={preview}>
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
