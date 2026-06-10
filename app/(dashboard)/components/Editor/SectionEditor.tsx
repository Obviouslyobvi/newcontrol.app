"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

function textToHtml(text: string): string {
  return text
    .split("\n\n")
    .filter((p) => p.trim())
    .map((p) => `<p>${p.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\n/g, "<br/>")}</p>`)
    .join("");
}

/**
 * Multi-paragraph section editor. The letter data model is plain text, so
 * the editor runs paragraph-only and serializes back with \n\n separators.
 */
export default function SectionEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        bold: false,
        italic: false,
        strike: false,
        code: false,
        horizontalRule: false,
      }),
      Placeholder.configure({ placeholder: placeholder ?? "Write…" }),
    ],
    content: textToHtml(value),
    editorProps: {
      attributes: {
        class:
          "prose-sm focus:outline-none min-h-[80px] text-[15px] leading-relaxed [&_p]:mb-3",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getText({ blockSeparator: "\n\n" }));
    },
  });

  // Sync external changes (e.g. section regeneration) into the editor.
  useEffect(() => {
    if (!editor) return;
    const current = editor.getText({ blockSeparator: "\n\n" });
    if (current !== value) {
      editor.commands.setContent(textToHtml(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  return (
    <div className="px-4 py-3 rounded-xl bg-surface border border-fg/15 focus-within:border-ember focus-within:ring-2 focus-within:ring-ember/20 transition-colors">
      <EditorContent editor={editor} />
    </div>
  );
}
