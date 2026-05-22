export type ItemType = 'folder' | 'file';

export interface FileSystemItem {
  id: string;
  name: string;
  type: ItemType;
  parentId: string | null;
  children?: string[];
  content?: string;
}

export interface FileSystemState {
  [id: string]: FileSystemItem;
}
