import Link from "next/link";
import { Article } from "@/content/articles";
import { Badge } from "@/components/ui/Badge";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/resources/${article.slug}`}
      className="group block overflow-hidden rounded-xl2 border border-ink-100 bg-white shadow-card transition-shadow duration-300 ease-soft hover:shadow-soft"
    >
      <PhotoPlaceholder label="Article image needed" aspect="aspect-[16/9]" />
      <div className="p-6">
        <Badge tone="plum">{article.category}</Badge>
        <h3 className="mb-2 mt-3 font-display text-lg leading-snug text-ink-900 group-hover:text-sage-800">
          {article.title}
        </h3>
        <p className="mb-3 line-clamp-2 text-sm text-ink-500">{article.excerpt}</p>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-300">
          {article.readTime}
        </p>
      </div>
    </Link>
  );
}
