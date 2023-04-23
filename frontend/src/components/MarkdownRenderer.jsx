import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownRenderer({ content }) {
  if (!content) {
    return <p className="text-slate-500 italic text-sm">No content to preview.</p>;
  }

  return (
    <div className="prose prose-invert max-w-none text-slate-200 text-sm space-y-3">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-slate-100 border-b border-slate-700 pb-1 mt-4 mb-2" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-lg font-semibold text-slate-100 mt-3 mb-1.5" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-base font-semibold text-slate-200 mt-2 mb-1" {...props} />,
          p: ({ node, ...props }) => <p className="leading-relaxed text-slate-300 my-1.5" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 my-2 text-slate-300" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 my-2 text-slate-300" {...props} />,
          blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-emerald-500 pl-3 italic text-slate-400 my-2" {...props} />,
          code: ({ node, inline, ...props }) =>
            inline ? (
              <code className="bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded text-xs font-mono" {...props} />
            ) : (
              <pre className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl overflow-x-auto text-xs font-mono text-emerald-300 my-2">
                <code {...props} />
              </pre>
            ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}