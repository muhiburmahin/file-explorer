import React, { useEffect, useState } from 'react';
import { Dialog } from './Dialog';

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
  const [savedMessage, setSavedMessage] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const isDirty = content !== initialContent;

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent, fileName]);

  const handleSave = () => {
    onSave(content);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const handleClose = () => {
    if (isDirty) {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  };

  return (
    <>
      <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/70 gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base shrink-0">📄</span>
            <h3 className="font-semibold text-sm text-gray-800 truncate tracking-wide">
              {fileName}
            </h3>
            {isDirty && (
              <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                Unsaved
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {savedMessage && (
              <span className="text-xs font-medium text-emerald-600">
                Saved!
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              💾 Save
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-600 text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            >
              Close
            </button>
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 p-5 resize-none outline-none text-gray-800 font-mono text-sm leading-relaxed bg-slate-50/20 focus:bg-white transition-colors min-h-[200px]"
          placeholder="Type your text content here..."
          spellCheck={false}
        />
      </div>

      <Dialog
        open={showCloseConfirm}
        title="Unsaved Changes"
        confirmLabel="Discard"
        variant="danger"
        onClose={() => setShowCloseConfirm(false)}
        onConfirm={() => {
          setShowCloseConfirm(false);
          onClose();
        }}
      >
        <p className="text-sm text-gray-600">
          You have unsaved changes. Are you sure you want to close without saving?
        </p>
      </Dialog>
    </>
  );
};
