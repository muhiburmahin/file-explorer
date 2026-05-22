import { useState, useEffect } from 'react';
import { FileSystemState, ItemType, FileSystemItem } from '../types';

const STORAGE_KEY = 'mini_explorer_data';

const initialData: FileSystemState = {
  root: { id: 'root', name: 'Root', type: 'folder', parentId: null, children: ['f1', 'file1'] },
  f1: { id: 'f1', name: 'Documents', type: 'folder', parentId: 'root', children: [] },
  file1: {
    id: 'file1',
    name: 'readme.txt',
    type: 'file',
    parentId: 'root',
    content: 'Welcome to File Explorer!',
  },
};

export const useFileSystem = () => {
  const [fileSystem, setFileSystem] = useState<FileSystemState>(initialData);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setFileSystem(JSON.parse(saved));
      }
    } catch {
      setFileSystem(initialData);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fileSystem));
  }, [fileSystem, isReady]);

  const createItem = (parentId: string, name: string, type: ItemType) => {
    const parentFolder = fileSystem[parentId];
    if (!parentFolder) return;

    const newId = Date.now().toString();
    const newItem: FileSystemItem = {
      id: newId,
      name,
      type,
      parentId,
      children: type === 'folder' ? [] : undefined,
      content: type === 'file' ? 'New file content' : undefined,
    };

    setFileSystem((prev) => ({
      ...prev,
      [newId]: newItem,
      [parentId]: {
        ...prev[parentId],
        children: [...(prev[parentId]?.children || []), newId],
      },
    }));
  };

  const renameItem = (id: string, newName: string) => {
    if (!fileSystem[id]) return;
    setFileSystem((prev) => ({
      ...prev,
      [id]: { ...prev[id], name: newName },
    }));
  };

  const deleteItem = (id: string) => {
    setFileSystem((prev) => {
      const copy = { ...prev };
      const itemToDelete = copy[id];
      if (!itemToDelete) return prev;

      const removeNodeRecursively = (currentId: string) => {
        if (copy[currentId]?.children) {
          copy[currentId].children?.forEach((childId) => removeNodeRecursively(childId));
        }
        delete copy[currentId];
      };
      removeNodeRecursively(id);

      if (itemToDelete.parentId && copy[itemToDelete.parentId]) {
        const parent = copy[itemToDelete.parentId];
        copy[itemToDelete.parentId] = {
          ...parent,
          children: parent.children?.filter((cId) => cId !== id) || [],
        };
      }
      return copy;
    });
  };

  const updateFileContent = (id: string, newContent: string) => {
    if (!fileSystem[id]) return;
    setFileSystem((prev) => ({
      ...prev,
      [id]: { ...prev[id], content: newContent },
    }));
  };

  return {
    fileSystem,
    isReady,
    createItem,
    renameItem,
    deleteItem,
    updateFileContent,
  };
};
