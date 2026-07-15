"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export function ReadmeRenderer({ content }: { content: string }) {
  return (
    <div className="text-sm leading-relaxed text-slate-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ className, ...props }) => (
            <h1
              className={cn(
                "text-2xl font-semibold text-white mt-8 mb-3 pb-2 border-b border-white/10",
                className,
              )}
              {...props}
            />
          ),
          h2: ({ className, ...props }) => (
            <h2
              className={cn(
                "text-xl font-semibold text-white mt-7 mb-2 pb-2 border-b border-white/10",
                className,
              )}
              {...props}
            />
          ),
          h3: ({ className, ...props }) => (
            <h3
              className={cn(
                "text-lg font-semibold text-white mt-5 mb-2",
                className,
              )}
              {...props}
            />
          ),
          p: ({ className, ...props }) => (
            <p className={cn("my-3 text-slate-300", className)} {...props} />
          ),
          a: ({ className, ...props }) => (
            <a
              className={cn(
                "text-indigo-400 hover:text-indigo-300 underline underline-offset-2 break-words",
                className,
              )}
              target="_blank"
              rel="noreferrer"
              {...props}
            />
          ),
          ul: ({ className, ...props }) => (
            <ul
              className={cn("my-3 list-disc pl-5 space-y-1.5", className)}
              {...props}
            />
          ),
          ol: ({ className, ...props }) => (
            <ol
              className={cn("my-3 list-decimal pl-5 space-y-1.5", className)}
              {...props}
            />
          ),
          li: ({ className, ...props }) => (
            <li className={cn("text-slate-300", className)} {...props} />
          ),
          blockquote: ({ className, ...props }) => (
            <blockquote
              className={cn(
                "my-4 border-l-2 border-indigo-500/50 pl-4 italic text-slate-400",
                className,
              )}
              {...props}
            />
          ),
          img: ({ className, alt, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={alt || ""}
              className={cn(
                "my-4 max-w-full rounded-xl border border-white/10",
                className,
              )}
              {...props}
            />
          ),
          hr: () => <hr className="my-6 border-white/10" />,
          code: ({ className, children, ...props }) => {
            const isBlock = /language-/.test(className || "");
            if (isBlock) {
              return (
                <code
                  className={cn("text-xs text-slate-200", className)}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-indigo-300"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ className, ...props }) => (
            <pre
              className={cn(
                "my-4 overflow-x-auto rounded-xl border border-white/10 bg-slate-900 p-4 text-xs",
                className,
              )}
              {...props}
            />
          ),
          table: ({ className, ...props }) => (
            <div className="my-4 overflow-x-auto">
              <table
                className={cn(
                  "w-full border-collapse text-left text-sm",
                  className,
                )}
                {...props}
              />
            </div>
          ),
          th: ({ className, ...props }) => (
            <th
              className={cn(
                "border border-white/10 bg-slate-800/50 px-3 py-2 font-medium text-white",
                className,
              )}
              {...props}
            />
          ),
          td: ({ className, ...props }) => (
            <td
              className={cn(
                "border border-white/10 px-3 py-2 align-top text-slate-300",
                className,
              )}
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
