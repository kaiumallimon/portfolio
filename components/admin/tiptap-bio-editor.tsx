"use client";

import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link2,
  Unlink,
  Undo2,
  Redo2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CHARACTER_LIMIT = 250;

interface TiptapBioEditorProps {
  defaultValue?: string | null;
  name?: string;
  label?: string;
  limit?: number;
}

export default function TiptapBioEditor({
  defaultValue = "",
  name = "about_bio",
  label = "About Bio",
  limit = CHARACTER_LIMIT,
}: TiptapBioEditorProps) {
  const [content, setContent] = useState(defaultValue || "");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      CharacterCount.configure({
        limit,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-indigo-400 underline hover:text-indigo-300 transition-colors",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Placeholder.configure({
        placeholder: "Write a punchy, impactful bio (up to 250 characters)...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: defaultValue || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // If empty paragraph, keep string empty
      const isCleanEmpty = editor.state.doc.textContent.trim().length === 0;
      setContent(isCleanEmpty ? "" : html);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm max-w-none min-h-[90px] focus:outline-none text-foreground text-sm leading-relaxed p-3.5",
      },
    },
  });

  useEffect(() => {
    if (editor && defaultValue !== undefined) {
      const currentHtml = editor.getHTML();
      if (currentHtml !== defaultValue) {
        editor.commands.setContent(defaultValue || "");
      }
    }
  }, [defaultValue, editor]);

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  const characterCount = editor?.storage.characterCount.characters() ?? 0;
  const charsRemaining = limit - characterCount;
  const isNearLimit = characterCount >= limit - 25;
  const isAtLimit = characterCount >= limit;

  return (
    <div className="space-y-2">
      {/* Label and Live Character Count Badge */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>{label}</span>
        </label>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "text-[11px] font-mono px-2 py-0.5 rounded-full border transition-colors",
              isAtLimit
                ? "bg-rose-500/10 text-rose-400 border-rose-500/30 font-semibold"
                : isNearLimit
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30 font-medium"
                : "bg-muted/40 text-muted-foreground border-border/40"
            )}
          >
            <span>
              {characterCount} / {limit} chars
            </span>
            {isNearLimit && !isAtLimit && (
              <span className="ml-1 text-[10px]">({charsRemaining} left)</span>
            )}
          </div>
        </div>
      </div>

      {/* Tiptap Container */}
      <div className="rounded-xl border border-border/60 bg-muted/20 overflow-hidden focus-within:border-indigo-500/60 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all">
        {/* Rich Formatting Toolbar */}
        <div className="flex flex-wrap items-center gap-1 border-b border-border/40 bg-muted/40 px-2 py-1.5">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            disabled={!editor}
            className={cn(
              "h-7 w-7 rounded-lg flex items-center justify-center text-xs transition-colors cursor-target",
              editor?.isActive("bold")
                ? "bg-indigo-600 text-white font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            disabled={!editor}
            className={cn(
              "h-7 w-7 rounded-lg flex items-center justify-center text-xs transition-colors cursor-target",
              editor?.isActive("italic")
                ? "bg-indigo-600 text-white font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            disabled={!editor}
            className={cn(
              "h-7 w-7 rounded-lg flex items-center justify-center text-xs transition-colors cursor-target",
              editor?.isActive("strike")
                ? "bg-indigo-600 text-white font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            title="Strikethrough"
          >
            <Strikethrough className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleCode().run()}
            disabled={!editor}
            className={cn(
              "h-7 w-7 rounded-lg flex items-center justify-center text-xs transition-colors cursor-target",
              editor?.isActive("code")
                ? "bg-indigo-600 text-white font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            title="Inline Code"
          >
            <Code className="h-3.5 w-3.5" />
          </button>

          <div className="h-4 w-px bg-border/60 mx-1" />

          {/* Link Button */}
          <button
            type="button"
            onClick={setLink}
            disabled={!editor}
            className={cn(
              "h-7 px-2 rounded-lg flex items-center gap-1 text-xs transition-colors cursor-target",
              editor?.isActive("link")
                ? "bg-indigo-600 text-white font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            title="Add Link"
          >
            <Link2 className="h-3.5 w-3.5" />
            <span className="text-[11px]">Link</span>
          </button>

          {editor?.isActive("link") && (
            <button
              type="button"
              onClick={() => editor?.chain().focus().unsetLink().run()}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-target"
              title="Remove Link"
            >
              <Unlink className="h-3.5 w-3.5" />
            </button>
          )}

          <div className="h-4 w-px bg-border/60 mx-1" />

          {/* Undo / Redo */}
          <button
            type="button"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-xs text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 transition-colors cursor-target"
            title="Undo"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-xs text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 transition-colors cursor-target"
            title="Redo"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Editor Area */}
        <EditorContent editor={editor} />
      </div>

      {/* Hidden input to pass formatted HTML into the form */}
      <input type="hidden" name={name} value={content} />

      <p className="text-[11px] text-muted-foreground">
        Use formatting like <strong>bold</strong>, <em>italic</em>, <code>code</code>, or links. The bio is capped at {limit} characters for visual harmony in the About section.
      </p>
    </div>
  );
}
