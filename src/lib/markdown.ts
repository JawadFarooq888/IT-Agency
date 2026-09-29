import { Marked, type Tokens } from "marked";

export type TocItem = { id: string; text: string; level: 2 | 3 };

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * Renders Markdown to HTML with heading ids and returns a table of contents.
 * Raw HTML in the Markdown is escaped, so posts cannot inject scripts.
 */
export function renderMarkdown(markdown: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Map<string, number>();

  const marked = new Marked({ gfm: true, breaks: false });
  marked.use({
    renderer: {
      heading(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, token: Tokens.Heading) {
        const inner = this.parser.parseInline(token.tokens);
        // Shift levels down so the page H1 stays unique (# -> h2)
        const level = Math.min(Math.max(token.depth, 2), 4);
        let id = slugify(token.text) || "section";
        const n = used.get(id) ?? 0;
        used.set(id, n + 1);
        if (n > 0) id = `${id}-${n}`;
        if (level === 2 || level === 3) toc.push({ id, text: token.text.replace(/[*_`]/g, ""), level });
        return `<h${level} id="${id}">${inner}</h${level}>\n`;
      },
      html(token: Tokens.HTML | Tokens.Tag) {
        return escapeHtml(token.text);
      },
      link(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, token: Tokens.Link) {
        const text = this.parser.parseInline(token.tokens);
        const href = token.href ?? "";
        if (!/^(https?:|mailto:|\/|#)/i.test(href)) return text;
        const external = /^https?:/i.test(href);
        return `<a href="${escapeHtml(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${text}</a>`;
      },
      image(token: Tokens.Image) {
        const src = token.href ?? "";
        if (!/^(https?:|\/)/i.test(src)) return "";
        return `<img src="${escapeHtml(src)}" alt="${escapeHtml(token.text ?? "")}" loading="lazy" decoding="async" />`;
      },
    },
  });

  const html = marked.parse(markdown, { async: false }) as string;
  return { html, toc };
}

export function readingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
