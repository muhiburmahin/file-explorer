import React, { useState } from 'react';
import { FileSystemState, ItemType } from '../types';

interface MainPanelProps {
  currentFolderId: string;
  fileSystem: FileSystemState;
  onSelectFolder: (id: string) => void;
  onOpenFile: (id: string) => void;
  onCreate: (parentId: string, name: string, type: ItemType) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

export const MainPanel: React.FC<MainPanelProps> = ({
  currentFolderId,
  fileSystem,
  onSelectFolder,
  onOpenFile,
  onCreate,
  onRename,
  onDelete,
}) => {
  const currentFolder = fileSystem[currentFolderId];
  const childrenIds = currentFolder?.children || [];
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreate = (type: ItemType) => {
    const defaultName = type === 'folder' ? 'Untitled Folder' : 'untitled.txt';
    const name = prompt(`Enter ${type} name:`, defaultName);
    if (name && name.trim()) {
      onCreate(currentFolderId, name.trim(), type);
    }
  };

  const startRename = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditName(currentName);
  };

  const submitRename = (id: string) => {
    if (editName.trim() && editName.trim() !== fileSystem[id]?.name) {
      onRename(id, editName.trim());
    }
    setEditingId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this item?')) {
      onDelete(id);
    }
  };

  return (
    <main className="flex-1 p-4 md:p-6 flex flex-col h-full overflow-y-auto bg-slate-50/50 select-none">
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 truncate flex items-center gap-2">
          <span>📁</span> {currentFolder?.name || 'Unknown Folder'}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleCreate('folder')}
            className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            📂 New Folder
          </button>
          <button
            onClick={() => handleCreate('file')}
            className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            📄 New File
          </button>
        </div>
      </div>

      {childrenIds.length === 0 ? (
        <div className="text-gray-400 text-sm flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-white p-8 shadow-sm">
          <span className="text-4xl mb-3 animate-bounce">📂</span>
          <p className="font-medium text-gray-500">This folder is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {childrenIds.map((id) => {
            const item = fileSystem[id];
            if (!item) return null;

            const isFolder = item.type === 'folder';
            const isEditing = editingId === id;

            return (
              <div
                key={id}
                role="button"
                tabIndex={0}
                onClick={() => !isEditing && (isFolder ? onSelectFolder(item.id) : onOpenFile(item.id))}
                className="group relative flex flex-col items-center p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-200">
                  {isFolder ? '📁' : '📄'}
                </span>

                {isEditing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => submitRename(id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') submitRename(id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-medium text-center w-full px-1 py-0.5 border border-blue-500 rounded bg-blue-50 text-gray-800 outline-none"
                    autoFocus
                  />
                ) : (
                  <span className="text-xs font-medium text-gray-700 text-center truncate w-full px-1 tracking-wide">
                    {item.name}
                  </span>
                )}

                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity bg-white/95 p-1 rounded-xl shadow-sm border border-gray-100">
                  <button
                    onClick={(e) => startRename(id, item.name, e)}
                    className="text-xs hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                    title="Rename"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => handleDelete(id, e)}
                    className="text-xs hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};