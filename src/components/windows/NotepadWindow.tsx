import React, { useState } from 'react';

export function NotepadWindow() {
  const [content, setContent] = useState('');

  return (
    <div className="flex flex-col gap-2 h-full min-h-[300px]">
      <div className="flex items-center gap-2 text-xs text-muted-foreground border-b border-border pb-2">
        <span>Untitled - Notepad</span>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing..."
        className="flex-1 min-h-[250px] w-full resize-none bg-background text-foreground p-2 rounded border border-border focus:outline-none focus:ring-1 focus:ring-ring font-mono text-sm"
      />
      <div className="text-xs text-muted-foreground">
        {content.length} characters | {content.split(/\s+/).filter(Boolean).length} words
      </div>
    </div>
  );
}
