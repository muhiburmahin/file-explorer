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
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col shadow-sm">
      <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
        <span className="text-xl">💻</span>
        <h1 className="text-base font-bold text-gray-800 tracking-tight">
          Mini File Explorer
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <TreeItem
          itemId="root"
          fileSystem={fileSystem}
          currentFolderId={currentFolderId}
          onSelectFolder={onSelectFolder}
        />
      </div>
    </div>
  );
};