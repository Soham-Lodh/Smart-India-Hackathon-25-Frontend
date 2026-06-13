import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components = {
  p: ({ children }) => <p className="my-2 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  h1: ({ children }) => <h1 className="mb-2 mt-3 text-lg font-bold text-gray-900">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-2 mt-3 text-base font-bold text-gray-900">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-2 mt-3 text-sm font-bold text-gray-900">{children}</h3>,
  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
  code: ({ children }) => (
    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-900">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-3 overflow-x-auto rounded-lg bg-gray-900 p-3 text-xs text-white">
      {children}
    </pre>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-green-700 underline underline-offset-2"
    >
      {children}
    </a>
  ),
};

export default function MarkdownMessage({ content }) {
  return (
    <div className="max-w-none text-sm text-gray-800">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
