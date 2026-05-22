import React, { useState } from 'react';
import { FileSystemState } from '../types';

interface TreeItemProps {
  itemId: string;
  fileSystem: FileSystemState;
  currentFolderId: string;
  onSelectFolder: (id: string) => void;
}
export const TreeItem: React.FC<TreeItemProps> = ({
  itemId,
  fileSystem,
  currentFolderId,
  onSelectFolder,
}) => {
  const item = fileSystem[itemId];
  const [isExpanded, setIsExpanded] = useState(false);
  if (!item || item.type === 'file') return null;

  const hasSubFolders = item.children?.some(
    (childId) => fileSystem[childId]?.type === 'folder'
  );

  const isSelected = currentFolderId === itemId;
  const handleAction = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    onSelectFolder(item.id);
  };
  return (
    <div className="pl-2.5 select-none transition-all">
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={handleAction}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleAction(e);
          }
        }}
        className={`flex items-center gap-2.5 py-2 md:py-1.5 px-2.5 my-0.5 rounded-lg text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${
          isSelected 
            ? 'bg-blue-50 text-blue-600 font-semibold border-l-2 border-blue-600 shadow-sm' 
            : 'hover:bg-gray-50 text-gray-700 active:bg-gray-100'
        }`}
      >
        <span 
          className={`text-[10px] text-gray-400 w-3 text-center block transition-transform duration-200 ${
            isExpanded && hasSubFolders ? 'rotate-90' : ''
          }`}
          aria-hidden="true"
        >
          {hasSubFolders ? '▶' : ''}
        </span>

        <span className="text-base shrink-0" aria-hidden="true">
          {isExpanded ? '📂' : '📁'}
        </span>
        <span className="truncate flex-1 tracking-wide">{item.name}</span>
      </div>

      {isExpanded && item.children && (
        <div 
          className="border-l border-gray-100 ml-4 pl-1.5 space-y-0.5"
          role="group"
        >
          {item.children.map((childId) => (
            <TreeItem
              key={childId}
              itemId={childId}
              fileSystem={fileSystem}
              currentFolderId={currentFolderId}
              onSelectFolder={onSelectFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
};