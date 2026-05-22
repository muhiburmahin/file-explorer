import React, { useEffect, useState } from 'react';
import { FileSystemState } from '../types';

interface TreeItemProps {
  itemId: string;
  fileSystem: FileSystemState;
  currentFolderId: string;
  onSelectFolder: (id: string) => void;
}

function containsFolder(
  fileSystem: FileSystemState,
  folderId: string,
  targetId: string
): boolean {
  if (folderId === targetId) return true;

  const folder = fileSystem[folderId];
  if (!folder?.children) return false;

  return folder.children.some((childId) => {
    const child = fileSystem[childId];
    if (child?.type !== 'folder') return false;
    return containsFolder(fileSystem, childId, targetId);
  });
}

export const TreeItem: React.FC<TreeItemProps> = ({
  itemId,
  fileSystem,
  currentFolderId,
  onSelectFolder,
}) => {
  const item = fileSystem[itemId];
  const [isExpanded, setIsExpanded] = useState(itemId === 'root');

  useEffect(() => {
    if (itemId !== currentFolderId && containsFolder(fileSystem, itemId, currentFolderId)) {
      setIsExpanded(true);
    }
  }, [currentFolderId, itemId, fileSystem]);

  if (!item || item.type === 'file') return null;

  const hasSubFolders = item.children?.some(
    (childId) => fileSystem[childId]?.type === 'folder'
  );

  const isSelected = currentFolderId === itemId;

  const handleToggle = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (hasSubFolders) setIsExpanded(!isExpanded);
  };

  const handleSelect = () => {
    onSelectFolder(item.id);
    if (hasSubFolders) setIsExpanded(true);
  };

  return (
    <div className="pl-2.5 select-none transition-all">
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={handleSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect();
          }
        }}
        className={`flex items-center gap-2.5 py-2 md:py-1.5 px-2.5 my-0.5 rounded-lg text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${
          isSelected
            ? 'bg-blue-50 text-blue-600 font-semibold border-l-2 border-blue-600 shadow-sm'
            : 'hover:bg-gray-50 text-gray-700 active:bg-gray-100'
        }`}
      >
        <button
          type="button"
          onClick={handleToggle}
          aria-label={isExpanded ? 'Collapse folder' : 'Expand folder'}
          className={`text-[10px] text-gray-400 w-3 text-center shrink-0 transition-transform duration-200 ${
            isExpanded && hasSubFolders ? 'rotate-90' : ''
          } ${hasSubFolders ? 'hover:text-gray-600' : 'invisible'}`}
        >
          ▶
        </button>

        <span className="text-base shrink-0" aria-hidden="true">
          {isExpanded ? '📂' : '📁'}
        </span>
        <span className="truncate flex-1 tracking-wide">{item.name}</span>
      </div>

      {isExpanded && item.children && (
        <div className="border-l border-gray-100 ml-4 pl-1.5 space-y-0.5" role="group">
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
