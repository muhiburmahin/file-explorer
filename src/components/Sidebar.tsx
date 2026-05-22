import React from 'react';
import { FileSystemState } from '../types';
import { TreeItem } from './TreeItem';

interface SidebarProps {
  fileSystem: FileSystemState;
  currentFolderId: string;
  onSelectFolder: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  fileSystem,
  currentFolderId,
  onSelectFolder,
}) => {
  return (
    <aside 
      className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 h-auto md:h-full flex flex-col shadow-sm shrink-0"
      aria-label="File Explorer Navigation"
    >
      <div className="p-3 md:p-4 border-b border-gray-100 flex items-center gap-2.5 bg-gray-50/50">
        <span className="text-lg md:text-xl" aria-hidden="true">💻</span>
        <h1 className="text-sm md:text-base font-bold text-gray-900 tracking-tight select-none">
          Mini File Explorer
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-2 max-h-[40vh] md:max-h-none">
        <nav className="space-y-1">
          <TreeItem
            itemId="root"
            fileSystem={fileSystem}
            currentFolderId={currentFolderId}
            onSelectFolder={onSelectFolder}
          />
        </nav>
      </div>
    </aside>
  );
};