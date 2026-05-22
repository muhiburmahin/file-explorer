import React, { useState } from 'react';
import { FileSystemState, ItemType, FileSystemItem } from '../types';
import { Dialog } from './Dialog';

interface MainPanelProps {
  currentFolderId: string;
  fileSystem: FileSystemState;
  onSelectFolder: (id: string) => void;
  onOpenFile: (id: string) => void;
  onCreate: (parentId: string, name: string, type: ItemType) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

function getBreadcrumb(
  fileSystem: FileSystemState,
  folderId: string
): { id: string; name: string }[] {
  const path: { id: string; name: string }[] = [];
  let current: FileSystemItem | undefined = fileSystem[folderId];

  while (current) {
    path.unshift({ id: current.id, name: current.name });
    current = current.parentId ? fileSystem[current.parentId] : undefined;
  }

  return path;
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
  const breadcrumb = getBreadcrumb(fileSystem, currentFolderId);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [createType, setCreateType] = useState<ItemType | null>(null);
  const [createName, setCreateName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const openCreateDialog = (type: ItemType) => {
    setCreateType(type);
    setCreateName(type === 'folder' ? 'Untitled Folder' : 'untitled.txt');
  };

  const submitCreate = () => {
    if (createType && createName.trim()) {
      onCreate(currentFolderId, createName.trim(), createType);
    }
    setCreateType(null);
    setCreateName('');
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

  const confirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <main className="flex-1 p-4 md:p-6 flex flex-col h-full overflow-y-auto bg-slate-50/50 select-none">
      <div className="flex flex-col gap-3 mb-6 border-b border-gray-200 pb-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-gray-500 flex-wrap">
          {breadcrumb.map((crumb, index) => (
            <React.Fragment key={crumb.id}>
              {index > 0 && <span className="text-gray-300">/</span>}
              <button
                type="button"
                onClick={() => onSelectFolder(crumb.id)}
                className={`hover:text-blue-600 transition-colors truncate max-w-[120px] sm:max-w-none ${
                  crumb.id === currentFolderId ? 'text-blue-600 font-semibold' : ''
                }`}
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
        </nav>

        <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 truncate flex items-center gap-2">
            <span>📁</span> {currentFolder?.name || 'Unknown Folder'}
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => openCreateDialog('folder')}
              className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              📂 New Folder
            </button>
            <button
              type="button"
              onClick={() => openCreateDialog('file')}
              className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              📄 New File
            </button>
          </div>
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isEditing) {
                    isFolder ? onSelectFolder(item.id) : onOpenFile(item.id);
                  }
                }}
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

                <div className="absolute top-2 right-2 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 transition-opacity bg-white/95 p-1 rounded-xl shadow-sm border border-gray-100">
                  <button
                    type="button"
                    onClick={(e) => startRename(id, item.name, e)}
                    className="text-xs hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                    title="Rename"
                    aria-label={`Rename ${item.name}`}
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget({ id, name: item.name });
                    }}
                    className="text-xs hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                    title="Delete"
                    aria-label={`Delete ${item.name}`}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog
        open={createType !== null}
        title={createType === 'folder' ? 'New Folder' : 'New File'}
        confirmLabel="Create"
        onClose={() => setCreateType(null)}
        onConfirm={submitCreate}
      >
        <label className="block text-sm text-gray-600 mb-2" htmlFor="create-name">
          Name
        </label>
        <input
          id="create-name"
          type="text"
          value={createName}
          onChange={(e) => setCreateName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submitCreate();
          }}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-800"
        />
      </Dialog>

      <Dialog
        open={deleteTarget !== null}
        title="Delete Item"
        confirmLabel="Delete"
        variant="danger"
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-900">&quot;{deleteTarget?.name}&quot;</span>?
          {fileSystem[deleteTarget?.id ?? '']?.type === 'folder' && (
            <span className="block mt-1 text-red-600 text-xs">
              All contents inside this folder will also be deleted.
            </span>
          )}
        </p>
      </Dialog>
    </main>
  );
};
