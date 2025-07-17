# Outcome Based Education (OBE)

Platform dashboard berbasis website untuk mendukung proses bisnis Outcome Based Education (OBE), yang dibuat untuk dosen. Dibuat menggunakan **Next.js**, **TypeScript**, **Tailwind CSS**, dan **Material UI** untuk modern dan responsive UI Experience.

## 🚀 Tech Stack

- **Next.js** – Framework React sebagai framework utama
- **TypeScript** – Bahasa Strongly Typed agar project lebih type safe, dan mudah untuk dimaintain
- **Tailwind CSS 4** – Utility-first CSS framework
- **Material UI (MUI)** – Component library Tailwind

---

## 🤖 Project Requirements

- **Node.js v18+**
- **npm v9+ / yarn v1.22+**

## 🪜 Project Structure

```bash
BTIK-Frontend-Irfansyah/
├── src/
│   ├── app/              # App Router pages and layouts (Next.js 13+)
│   ├── components/       # Reusable UI components
│   ├── context/          # Context di aplikasi
│   ├── data/             # Dummy data untuk frontend
│   ├── layouts/          # Reusable Layouts UI
│   ├── lib/              # Utilities and helper functions
│   ├── types/            # TypeScript type definitions
│   └── hooks/            # Custom React hooks
├── public/               # Static assets (images, icons, etc.)
├── docs/                 # Screenshots, diagrams, and documentation assets
├── package.json          # Project metadata and dependencies
├── tsconfig.json         # TypeScript compiler configuration
├── README.md             # Setup instructions & project overview
├── SOLUTION.md           # Design decisions, architecture & technical rationale
├── AI-COLLABORATION.md   # Documentation of AI-assisted development
└── USER-GUIDE.md         # End-user manual & walkthrough
```

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sayakanikan/BTIK-Frontend-Irfansyah.git
cd BTIK-Frontend-Irfansyah
```

### 2. Install Dependency
```bash
npm install
# or
yarn install
```

### 3. Run the Development Server
```bash
npm run dev
# or
yarn dev
```

## 📄 Scripts

| Command       | Description                       |
|---------------|-----------------------------------|
| `dev`         | Start the development server      |
| `build`       | Build the project for production  |
| `start`       | Start the production server       |
| `lint`        | Run ESLint for code linting       |
