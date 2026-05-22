// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import { useFileSystem } from '../hooks/useFileSystem';
import { Sidebar } from '../components/Sidebar';

export default function Home() {
  // ১. কাস্টম হুক থেকে সব স্টেট এবং ফাংশন নিয়ে আসা
  const { 
    fileSystem, 
    createItem, 
    renameItem, 
    deleteItem, 
    updateFileContent 
  } = useFileSystem();
  
  // ২. কোন ফোল্ডারটি বর্তমানে ওপেন আছে তা ট্র্যাক করার স্টেট (ডিফল্ট: root)
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  
  // ৩. কোন ফাইলটি বর্তমানে ওপেন বা এডিট করা হচ্ছে তা ট্র্যাক করার স্টেট
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  // ফোল্ডার সিলেক্ট করার হ্যান্ডলার
  const handleSelectFolder = (id: string) => {
    setCurrentFolderId(id);
    setActiveFileId(null); // ফোল্ডার চেঞ্জ করলে ফাইল এডিটর বন্ধ হয়ে যাবে
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">
      
      {/* 📁 বাম পাশের সাইডবার প্যানেল */}
      <Sidebar
        fileSystem={fileSystem}
        currentFolderId={currentFolderId}
        onSelectFolder={handleSelectFolder}
      />

   

    </div>
  );
}