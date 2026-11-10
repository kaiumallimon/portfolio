"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { sanitizeAndResolveReadme } from "@/lib/github";

interface MonochromeReadmeRendererProps {
  content: string;
  rawBase?: string;
  className?: string;
}

export function MonochromeReadmeRenderer({
  content,
  rawBase,
  className = "",
}: MonochromeReadmeRendererProps) {
  // Normalize raw HTML <img> tags, center divs, and relative links into clean markdown
  const sanitizedContent = useMemo(() => {
    return sanitizeAndResolveReadme(content, rawBase);
  }, [content, rawBase]);

  return (
    <div
      className={cn(
        "text-xs sm:text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 select-text overflow-hidden",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ className: c, ...props }) => (
            <h1
              className={cn(
                "text-lg sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-8 mb-3 pb-2 border-b border-zinc-200 dark:border-zinc-800 font-sans first:mt-0",
                c
              )}
              {...props}
            />
          ),
          h2: ({ className: c, ...props }) => (
            <h2
              className={cn(
                "text-base sm:text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 mt-7 mb-3 pb-1.5 border-b border-zinc-100 dark:border-zinc-900 font-sans",
                c
              )}
              {...props}
            />
          ),
          h3: ({ className: c, ...props }) => (
            <h3
              className={cn(
                "text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-5 mb-2 font-sans",
                c
              )}
              {...props}
            />
          ),
          h4: ({ className: c, ...props }) => (
            <h4
              className={cn(
                "text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-4 mb-1.5 font-sans",
                c
              )}
              {...props}
            />
          ),
          p: ({ className: c, ...props }) => (
            <p
              className={cn(
                "my-3 text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed text-xs sm:text-sm",
                c
              )}
              {...props}
            />
          ),
          a: ({ className: c, ...props }) => (
            <a
              className={cn(
                "text-blue-600 dark:text-blue-400 hover:underline underline-offset-2 break-words font-medium transition-colors",
                c
              )}
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          ul: ({ className: c, ...props }) => (
            <ul
              className={cn("my-3 list-disc pl-5 space-y-1.5 text-zinc-700 dark:text-zinc-300", c)}
              {...props}
            />
          ),
          ol: ({ className: c, ...props }) => (
            <ol
              className={cn("my-3 list-decimal pl-5 space-y-1.5 text-zinc-700 dark:text-zinc-300", c)}
              {...props}
            />
          ),
          li: ({ className: c, ...props }) => (
            <li className={cn("text-zinc-700 dark:text-zinc-300 leading-relaxed", c)} {...props} />
          ),
          blockquote: ({ className: c, ...props }) => (
            <blockquote
              className={cn(
                "my-4 border-l-2 border-zinc-300 dark:border-zinc-700 pl-4 italic text-zinc-600 dark:text-zinc-400 font-serif",
                c
              )}
              {...props}
            />
          ),
          img: ({ className: c, alt, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={alt || ""}
              loading="lazy"
              className={cn(
                "my-3 max-w-full max-h-[520px] w-auto inline-block rounded-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shadow-xs align-top m-1.5",
                c
              )}
              {...props}
            />
          ),
          hr: () => <hr className="my-6 border-zinc-200 dark:border-zinc-800" />,
          code: ({ className: c, children, ...props }) => {
            const isBlock = /language-/.test(c || "");
            if (isBlock) {
              return (
                <code
                  className={cn("text-xs font-mono text-zinc-200", c)}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className="rounded-xs bg-zinc-100 dark:bg-zinc-800/80 px-1.5 py-0.5 text-[11px] font-mono text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700/80"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ className: c, ...props }) => (
            <pre
              data-lenis-prevent
              className={cn(
                "my-4 overflow-x-auto rounded-xs border border-zinc-800 bg-zinc-950 p-4 text-xs font-mono text-zinc-200 shadow-inner",
                c
              )}
              {...props}
            />
          ),
          table: ({ className: c, ...props }) => (
            <div data-lenis-prevent className="my-4 overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-xs">
              <table
                className={cn(
                  "w-full border-collapse text-left text-xs font-mono",
                  c
                )}
                {...props}
              />
            </div>
          ),
          th: ({ className: c, ...props }) => (
            <th
              className={cn(
                "border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 px-3 py-2 font-semibold text-zinc-900 dark:text-zinc-100",
                c
              )}
              {...props}
            />
          ),
          td: ({ className: c, ...props }) => (
            <td
              className={cn(
                "border-b border-zinc-100 dark:border-zinc-900 px-3 py-2 align-top text-zinc-700 dark:text-zinc-300",
                c
              )}
              {...props}
            />
          ),
        }}
      >
        {sanitizedContent}
      </ReactMarkdown>
    </div>
  );
}
