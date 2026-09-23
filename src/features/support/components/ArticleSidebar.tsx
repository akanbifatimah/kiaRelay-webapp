import { Link } from "react-router-dom";
import { Copy, EyeOff, Pencil, Send } from "lucide-react";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { audienceLabels, type KnowledgeArticle } from "../knowledgeBase";
import { ArticleStatusPill } from "./ArticleMetaTags";

interface ArticleSidebarProps {
  article: KnowledgeArticle;
  isPreview: boolean;
  onPublish: () => void;
  onUnpublish: () => void;
  onCopyLink: () => void;
}

export function ArticleSidebar({ article, isPreview, onPublish, onUnpublish, onCopyLink }: ArticleSidebarProps) {
  const isPublished = article.status === "published";
  const internal = article.audiences.length === 1 && article.audiences[0] === "support-staff";

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-2">
        <h2 className="mb-1 text-sm font-semibold text-text">{isPreview ? "Preview Actions" : "Article Actions"}</h2>
        {!isPublished && (
          <Button onClick={onPublish} className="w-full">
            <Send className="h-4 w-4" />
            Publish Article
          </Button>
        )}
        <Link
          to={`/support/knowledge-base/${article.id}/edit`}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-bg"
        >
          <Pencil className="h-4 w-4" />
          {isPreview ? "Back to Edit" : "Edit Article"}
        </Link>
        <Button variant="secondary" onClick={onCopyLink} className="w-full">
          <Copy className="h-4 w-4" />
          {isPreview ? "Copy Preview Link" : "Copy Article Link"}
        </Button>
        {isPublished && !isPreview && (
          <Button variant="ghost" onClick={onUnpublish} className="w-full">
            <EyeOff className="h-4 w-4" />
            Unpublish
          </Button>
        )}
      </Card>
      <Card className="flex flex-col gap-3 text-sm">
        <h2 className="text-sm font-semibold text-text">Article Metadata</h2>
        <div>
          <p className="text-xs text-text-muted">Status</p>
          <div className="mt-1"><ArticleStatusPill status={article.status} /></div>
        </div>
        <div>
          <p className="text-xs text-text-muted">Visibility</p>
          <p className="font-medium text-text">{internal ? "Internal Support Agents" : "Shared with external users"}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">Target Audience</p>
          <p className="font-medium text-text">{article.audiences.map((audience) => audienceLabels[audience]).join(", ")}</p>
        </div>
        {article.tags.length > 0 && (
          <div>
            <p className="text-xs text-text-muted">Tags</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {article.tags.map((tag) => <span key={tag} className="rounded bg-bg px-1.5 py-0.5 text-xs text-text">{tag}</span>)}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
