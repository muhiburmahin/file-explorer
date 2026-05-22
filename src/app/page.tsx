'use client';

import React, { useState } from 'react';
import { useFileSystem } from '../hooks/useFileSystem';
import { Sidebar } from '../components/Sidebar';
import { MainPanel } from '../components/MainPanel'; 
import { FileEditor } from '../components/FileEditor'; 

export default function Home() {
  const {
    fileSystem,
    isReady,
    createItem,
    renameItem,
    deleteItem,
    updateFileContent,
  } = useFileSystem();

  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const handleSelectFolder = (id: string) => {
    setCurrentFolderId(id);
    setActiveFileId(null);
  };

  if (!isReady) {
    return <div className="min-h-screen w-full bg-gray-50" />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-gray-50 text-gray-800 font-sans overflow-hidden">
       <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 bg-white shrink-0 max-h-[40vh] md:max-h-screen overflow-y-auto">
        <Sidebar
          fileSystem={fileSystem}
          currentFolderId={currentFolderId}
          onSelectFolder={handleSelectFolder}
        />
      </div>

      <div className="flex-1 min-w-0 h-[60vh] md:h-screen flex flex-col bg-slate-50 overflow-hidden">
        {activeFileId && fileSystem[activeFileId] ? (
          <div className="p-4 md:p-6 h-full flex-1 overflow-hidden">
            <FileEditor
              fileName={fileSystem[activeFileId].name}
              initialContent={fileSystem[activeFileId].content || ''}
              onSave={(newContent) => updateFileContent(activeFileId, newContent)}
              onClose={() => setActiveFileId(null)}
            />
          </div>
        ) : (
          <MainPanel
            currentFolderId={currentFolderId}
            fileSystem={fileSystem}
            onSelectFolder={handleSelectFolder}
            onOpenFile={(id) => setActiveFileId(id)}
            onCreate={createItem}
            onRename={renameItem}
            onDelete={(id) => {
              deleteItem(id);
              if (id === currentFolderId) {
                setCurrentFolderId('root');
              }
            }}
          />
        )}
      </div>
    </div>
  );
}