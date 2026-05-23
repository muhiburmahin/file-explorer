Markdown# 💻 Mini File Explorer

A lightweight, high-performance, and fully responsive hierarchical file management web application built for the **Webbly Media** frontend evaluation. It simulates a desktop-like file explorer interface allowing users to seamlessly manage, navigate, and edit nested folder and file structures.

[![Live Demo](https://img.shields.io/badge/Demo-Vercel-blue?style=for-the-badge&logo=vercel)](https://file-explorer-virid.vercel.app)
[![Repository](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/muhiburmahin/file-explorer)

---

## ✨ Features

- **Hierarchical Tree View:** Dynamic sidebar with intuitive expand/collapse states for deeply nested directory navigation.
- **Context-Aware Main Panel:** Responsive grid layout showcasing structural inner-contents (files & folders) based on the active folder pointer.
- **Core Virtual File Operations:**
  - **Create:** Instantly instantiate subfolders or `.txt` file models.
  - **Inline Rename:** Localized state integration allowing clean, inline text editing without invasive browser prompts.
  - **Cascading Delete:** Recursive state sanitation that automatically flushes nested child layers safely.
- **Built-in Workspace Workspace:** Dedicated micro-editor panel to fetch, modify, and save individual text file contents instantly.
- **Data Persistence:** Self-contained hydration layer backed by browser `localStorage` ensuring full runtime data preservation.
- **Universal Responsiveness:** Desktop-first configuration gracefully adapting to modern multi-tiered mobile breakpoints.
- **Strict SSR Safety:** Complete immunity to client-side layout flashes or Next.js server-hydration mismatches caused by localized browser extensions.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Library:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Orchestration:** Pure React Custom Hooks (Zero external global state dependencies)

---

## 📂 Project Architecture

```text
src/
├── app/               # Application entry points, global layouts, and SSR configurations
├── components/        # Reusable presentation atomic UI components (Sidebar, MainPanel, FileEditor, TreeItem)
├── hooks/             # useFileSystem custom engine hook (Normalized lookups & LocalStorage bridges)
└── types.ts           # Unified TypeScript structural data definitions
📦 Getting StartedTo spin up a local copy of this project for review, execute the following commands:1. InstallationClone the repository and install the system dependencies:Bashgit clone [https://github.com/muhiburmahin/file-explorer.git](https://github.com/muhiburmahin/file-explorer.git)
cd file-explorer
npm install
2. Run Development ServerFire up the local optimization engine:Bashnpm run dev
Open http://localhost:3000 in your browser to interact with the application.🎛️ ScriptsAvailable automation configurations inside package.json:CommandDescriptionnpm run devSpins up the local development instance using Turbopack compiler.npm run buildCompiles and optimizes the code tree for production-ready deployment.npm run startRestarts the compiled server-ready builds locally.npm run lintAsserts standard ESLint code-quality and TypeScript type safety configurations.🧩 Architectural Decisions & ConstraintsNormalized Flat State Map: To avoid performance degradation from multi-nested array recursions during state transitions, the entire virtual file tree is stored as a flat normalized map structure where individual objects use atomic structural metadata pointers (children: []). This optimizes lookup speeds to a constant $O(1)$ complexity.Zero Third-Party Dependencies: Adhered strictly to the assignment rules of avoiding extra libraries. All modular behaviors, dropdown/inline inputs, and tree toggles are custom-engineered using primitive React hooks and native APIs, maintaining an exceptionally lightweight production bundle size.
