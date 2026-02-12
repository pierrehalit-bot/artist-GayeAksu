# Artist Website & Admin Panel

Production-ready artist website with a built-in admin panel, powered by Next.js 14 (App Router), Firebase, and Tailwind CSS.

## 🚀 Features

- **Public Site:**
  - Countdown Hero with video background
  - Announcements & News
  - Projects Gallery
  - "Bio Link" page (Drag & drop builder)
  - YouTube Video Integration

- **Admin Panel:**
  - Secure Login (Firebase Auth)
  - Manage Countdowns, Announcements, Projects
  - Visual Bio Page Builder
  - Settings Management

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Firebase (Auth, Firestore, Storage)
- **State/Data:** TanStack Query + React Hook Form + Zod
- **Drag & Drop:** dnd-kit

## 📦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd artist-website
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Copy `.env.example` to `.env.local` and fill in your Firebase credentials.
    ```bash
    cp .env.example .env.local
    ```

    > **Note:** You need to create a project in [Firebase Console](https://console.firebase.google.com/), enable Authentication (Email/Password), Firestore, and Storage.

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to see the site.
    Admin panel is at [http://localhost:3000/admin](http://localhost:3000/admin).

## 🌍 Deployment

### 1. Vercel (Recommended)

This project is optimized for Vercel.

1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  Add the **Environment Variables** from your `.env.local` file to Vercel Project Settings.
    - **Important:** For `FIREBASE_PRIVATE_KEY`, copy the entire content including `-----BEGIN PRIVATE KEY-----` and newlines.
4.  Deploy!

### 2. Firebase Rules

For security, make sure to deploy your Firestore and Storage rules.
If you have Firebase CLI installed:

```bash
firebase deploy --only firestore:rules,storage
```

Or copy the contents of `firestore.rules` and `storage.rules` to the Firebase Console manually.

## 🛡 Security

- Admin routes are protected by `AdminGuard` component and Server-Side verification.
- API routes verify Firebase ID Tokens using `firebase-admin`.
- Only UIDs listed in `ADMIN_UIDS` env var or `admins` Firestore collection can access write operations.
