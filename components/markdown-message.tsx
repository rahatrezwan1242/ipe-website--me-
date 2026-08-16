import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders AI-generated Markdown inside a chat bubble. No @tailwindcss/typography
 * plugin in this project, so element styling is hand-rolled via descendant
 * selectors on the wrapper — theme CSS vars only, matches both chat widgets.
 */
export function MarkdownMessage({ text }: { text: string }) {
  return (
    <div
      className={[
        "space-y-2 text-sm leading-relaxed",
        "[&_p]:m-0",
        "[&_ul]:m-0 [&_ul]:list-disc [&_ul]:space-y-0.5 [&_ul]:pl-4",
        "[&_ol]:m-0 [&_ol]:list-decimal [&_ol]:space-y-0.5 [&_ol]:pl-4",
        "[&_strong]:font-semibold",
        "[&_a]:underline [&_a]:underline-offset-2",
        "[&_code]:rounded [&_code]:bg-background/40 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]",
        "[&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-background/40 [&_pre]:p-2 [&_pre]:font-mono [&_pre]:text-[0.85em]",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:opacity-80",
        "[&_h1]:text-base [&_h1]:font-semibold [&_h2]:text-base [&_h2]:font-semibold [&_h3]:text-sm [&_h3]:font-semibold",
        "[&_table]:w-full [&_table]:border-collapse [&_table]:text-xs",
        "[&_th]:border [&_th]:border-border [&_th]:px-2 [&_th]:py-1 [&_th]:text-left",
        "[&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1",
      ].join(" ")}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  );
}
