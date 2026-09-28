import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronDown, LifeBuoy, Mail, Search } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Card } from "../../components/Card";
import { cn } from "../../lib/cn";
import { hasModule, useCurrentUser } from "../access/permissions";
import { HELP_TOPICS, SUPPORT_EMAIL } from "./helpContent";

// Help Center (TC-04, 2026-09-28, no design), opened from the header's Help
// icon. Every signed-in admin has it; topics follow their modules.
export function HelpCenterPage() {
  const user = useCurrentUser();
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const topics = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return HELP_TOPICS.filter((topic) => topic.module === "general" || hasModule(user, topic.module))
      .map((topic) => ({
        ...topic,
        articles: topic.articles.filter((a) => !needle || `${a.question} ${a.answer}`.toLowerCase().includes(needle)),
      }))
      .filter((topic) => topic.articles.length > 0);
  }, [user, query]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Help Center" subtitle="Answers for the modules you use, and how to reach the support team." />

      <label className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 sm:max-w-lg">
        <Search className="h-4 w-4 shrink-0 text-text-muted" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search help articles..."
          aria-label="Search help articles"
          className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
        />
      </label>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {topics.length === 0 && (
            <Card className="text-sm text-text-muted">No help articles match "{query}". Try another word, or contact support.</Card>
          )}
          {topics.map((topic) => (
            <Card key={topic.title} className="flex flex-col gap-1 p-0">
              <h2 className="px-5 pt-4 pb-2 text-base font-semibold text-text">{topic.title}</h2>
              {topic.articles.map((article) => {
                const isOpen = openId === article.id || query.trim() !== "";
                return (
                  <div key={article.id} className="border-t border-border">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenId(openId === article.id ? null : article.id)}
                      className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left text-sm font-medium text-text hover:bg-bg"
                    >
                      {article.question}
                      <ChevronDown className={cn("h-4 w-4 shrink-0 text-text-muted transition-transform", isOpen && "rotate-180")} />
                    </button>
                    {isOpen && (
                      <div className="flex flex-col items-start gap-2 px-5 pb-4 text-sm text-text-muted">
                        <p>{article.answer}</p>
                        {article.link && (
                          <Link to={article.link.to} className="font-medium text-primary hover:underline">
                            {article.link.label} →
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <Card className="flex flex-col gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <LifeBuoy className="h-5 w-5" />
            </span>
            <h2 className="text-base font-semibold text-text">Still need help?</h2>
            <p className="text-sm text-text-muted">The platform support team replies within one business day. Include the page and any order or ticket ID.</p>
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Admin dashboard help")}`}
              className="flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Mail className="h-4 w-4" />
              Email {SUPPORT_EMAIL}
            </a>
          </Card>
          {hasModule(user, "support") && (
            <Card className="flex flex-col gap-2">
              <h2 className="flex items-center gap-2 text-base font-semibold text-text">
                <BookOpen className="h-4 w-4 text-primary" />
                Knowledge Base
              </h2>
              <p className="text-sm text-text-muted">Published guides for staff, customers and drivers.</p>
              <Link to="/support/knowledge-base" className="text-sm font-medium text-primary hover:underline">
                Browse articles →
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
