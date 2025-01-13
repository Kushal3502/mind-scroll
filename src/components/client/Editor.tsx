"use client";

import { useState } from "react";
import { Content } from "@tiptap/react";
import { MinimalTiptapEditor } from "../minimal-tiptap";

export const Editor = ({
  onChange,
  initialValue,
  ...props
}: {
  onChange: (content: Content) => void;
  initialValue: Content;
}) => {
  const [content, setContent] = useState<Content>(initialValue);

  const handleUpdate = (newContent: Content) => {
    setContent(newContent);
    onChange?.(newContent);
  };

  return (
    <MinimalTiptapEditor
      value={content}
      onChange={handleUpdate}
      className="w-full"
      editorContentClassName="p-5"
      output="html"
      placeholder="Type your description here..."
      autofocus={true}
      editable={true}
      editorClassName="focus:outline-none"
      {...props}
    />
  );
};
