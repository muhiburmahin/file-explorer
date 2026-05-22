import { useState, useEffect } from 'react';
import { FileSystemState, ItemType, FileSystemItem } from '../types';

// Initial Mock Data
const initialData: FileSystemState = {
  'root': { id: 'root', name: 'Root', type: 'folder', parentId: null, children: ['f1', 'file1'] },
  'f1': { id: 'f1', name: 'Documents', type: 'folder', parentId: 'root', children: [] },
  'file1': { id: 'file1', name: 'readme.txt', type: 'file', parentId: 'root', content: 'Welcome to File Explorer!' }
};

export const useFileSystem = () => {
  const [fileSystem, setFileSystem] = useState<FileSystemState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mini_explorer_data');
      return saved ? JSON.parse(saved) : initialData;
    }
    return initialData;
  });

  useEffect(() => {
    localStorage.setItem('file_explorer_data', JSON.stringify(fileSystem));
  }, [fileSystem]);

  
  const createItem = (parentId: string, name: string, type: ItemType) => {
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
        children: [...(prev[parentId].children || []), newId], 
      },
    }));
  };


  const renameItem = (id:string, newName: string) => {
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
    setFileSystem((prev) => ({
      ...prev,
      [id]: { ...prev[id], content: newContent },
    }));
  };

  return { 
    fileSystem, 
    createItem, 
    renameItem, 
    deleteItem, 
    updateFileContent 
  };
};