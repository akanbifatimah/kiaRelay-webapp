import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Eye, ThumbsDown, ThumbsUp } from "lucide-react";
import { Card } from "../../components/Card";
import { Avatar } from "../../components/Avatar";
import { ConfirmModal } from "../../components/ConfirmModal";
import { useToast } from "../../components/toast/ToastContext";
import { audienceLabels, formatUpdated, helpfulPct, updateArticle, useArticle } from "./knowledgeBase";
import { ArticleContent } from "./components/ArticleContent";
import { ArticleSidebar } from "./components/ArticleSidebar";
import { CategoryChip, InternalOnlyChip } from "./components/ArticleMetaTags";
import { SupportNotFound } from "./components/SupportNotFound";

export function ArticleDetailPage() {
  const { id = "" } = useParams();
  const [params] = useSearchParams();
  const isPreview = params.get("preview") === "1";
  const { showToast } = useToast();
  const article = useArticle(id);
  const [vote, setVote] = useState<"yes" | "no" | null>(null);
  const [isConfirmingUnpublish, setIsConfirmingUnpublish] = useState(false);
  const countedView = useRef(false);

  // One view per visit to a published article (never for previews).
  // TODO: POST /support/knowledge-base/:id/views once analytics exist.
  useEffect(() => {
    if (article?.status === "published" && !isPreview && !countedView.current) {
      countedView.current = true;
      updateArticle(article.id, { views: article.views + 1 });
    }
  }, [article, isPreview]);

  if (!article) return <SupportNotFound what="article" id={id} />;

  const pct = helpfulPct(article);
  const internal = article.audiences.length === 1 && article.audiences[0] === "support-staff";
  const audience = article.audiences.map((a) => audienceLabels[a]).join(", ");

  function copyLink() {
    const url = `${window.location.origin}/support/knowledge-base/${id}${isPreview ? "?preview=1" : ""}`;
    navigator.clipboard.writeText(url).then(
      () => showToast("success", `${isPreview ? "Preview" : "Article"} link copied to clipboard.`),
      () => showToast("error", "Couldn't access the clipboard — copy the link from the address bar instead."),
    );
  }

  function castVote(value: "yes" | "no") {
    if (!article || vote) return;
    setVote(value);
    updateArticle(article.id, value === "yes" ? { helpfulYes: article.helpfulYes + 1 } : { helpfulNo: article.helpfulNo + 1 });
    showToast("success", "Thanks for the feedback.");
  }

  return (
    <div className="flex flex-col gap-4">
      <Link to="/support/knowledge-base" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Knowledge Base
      </Link>
      {isPreview && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-tag-overnight-fg/20 bg-tag-overnight-bg px-4 py-2 text-xs text-tag-overnight-fg">
          <span className="flex items-center gap-1.5 font-semibold uppercase">
            <Eye className="h-3.5 w-3.5" />
            Preview Mode
          </span>
          <span>This is how the article will appear to {audience}.</span>
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <Card className="flex min-w-0 flex-col gap-6 p-8">
          <div className="flex flex-col gap-4 border-b border-border pb-6">
            <div className="flex flex-wrap gap-2">
              <CategoryChip category={article.category} tone="strong" />
              {internal && <InternalOnlyChip />}
            </div>
            <h1 className="text-3xl font-bold leading-tight text-text">{article.title}</h1>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar name={article.author} src="/profile_img.png" />
                <div>
                  <p className="text-sm font-semibold text-text">{article.author}</p>
                  <p className="text-xs text-text-muted">Last updated {formatUpdated(article.updatedDaysAgo)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                {pct !== null && <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" />{pct}% Helpful</span>}
                <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{article.views >= 1000 ? `${(article.views / 1000).toFixed(1)}k` : article.views} Views</span>
              </div>
            </div>
          </div>
          <ArticleContent content={article.content} />
          {article.status === "published" && !isPreview && (
            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5 text-sm">
              <span className="font-medium text-text">{vote ? "Thanks — your feedback was recorded." : "Was this article helpful?"}</span>
              {!vote && (
                <>
                  <button type="button" onClick={() => castVote("yes")} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 hover:border-success hover:text-success">
                    <ThumbsUp className="h-4 w-4" /> Yes
                  </button>
                  <button type="button" onClick={() => castVote("no")} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 hover:border-danger hover:text-danger">
                    <ThumbsDown className="h-4 w-4" /> No
                  </button>
                </>
              )}
            </div>
          )}
        </Card>
        <ArticleSidebar
          article={article}
          isPreview={isPreview}
          onPublish={() => {
            updateArticle(article.id, { status: "published", updatedDaysAgo: 0 });
            showToast("success", "Article published to the knowledge base.");
          }}
          onUnpublish={() => setIsConfirmingUnpublish(true)}
          onCopyLink={copyLink}
        />
      </div>
      {isConfirmingUnpublish && (
        <ConfirmModal
          title="Unpublish this article?"
          message={`"${article.title}" will be hidden from ${audience} and moved back to Draft.`}
          confirmLabel="Unpublish"
          tone="danger"
          onCancel={() => setIsConfirmingUnpublish(false)}
          onConfirm={() => {
            updateArticle(article.id, { status: "draft", updatedDaysAgo: 0 });
            setIsConfirmingUnpublish(false);
            showToast("success", "Article moved back to Draft.");
          }}
        />
      )}
    </div>
  );
}
