import React, { useState } from 'react';

interface FileEditorProps {
  fileName: string;
  initialContent: string;
  onSave: (content: string) => void;
  onClose: () => void;
}

export const FileEditor: React.FC<FileEditorProps> = ({
  fileName,
  initialContent,
  onSave,
  onClose,
}) => {
  const [content, setContent] = useState(initialContent);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all animate-in fade-in duration-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/70">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base shrink-0">📄</span>
          <h3 className="font-semibold text-sm text-gray-800 truncate tracking-wide">
            {fileName}
          </h3>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onSave(content)}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            💾 Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-600 text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
          >
            ❌ Close
          </button>
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 p-5 resize-none outline-none text-gray-800 font-mono text-sm leading-relaxed bg-slate-50/20 focus:bg-white transition-colors"
        placeholder="Type your text content here..."
        spellCheck={false}
      />
    </div>
  );
};