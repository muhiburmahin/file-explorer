# Mini File Explorer

A lightweight file manager web app built for the Webbly Media frontend task. Manage folders and text files in a tree hierarchy with create, rename, delete, and edit operations.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**

## Features

- Sidebar tree view with expand/collapse
- Main panel grid for folder contents
- Create folders and text files
- Rename and delete items (recursive folder delete)
- Open, edit, and save text file content
- Breadcrumb navigation
- Data persisted in `localStorage`
- Responsive layout for mobile and desktop

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js pages and layout
├── components/       # UI components (Sidebar, MainPanel, TreeItem, FileEditor, Dialog)
├── hooks/            # useFileSystem state hook
└── types.ts          # Shared TypeScript types
```

## Scripts

| Command       | Description              |
|---------------|--------------------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production   |
| `npm run start` | Start production server |
| `npm run lint`  | Run ESLint             |
