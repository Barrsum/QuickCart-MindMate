# QuickCart - Walmart Hackathon Project

A modern, mobile-first e-commerce web application designed to enhance the digital shopping experience. This project was built for the Walmart Hackathon.

The core innovation is an **intelligent, multi-category search** that allows users to input their entire shopping list (e.g., "soap, detergent, milk") and receive a streamlined, single-page result with swipe-able carousels for each category, enabling rapid carting and checkout.

## Tech Stack

-   **Frontend:** [React](https://reactjs.org/) (with Vite)
-   **Backend & Database:** [Firebase](https://firebase.google.com/) (Authentication, Firestore, Storage)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [Shadcn/UI](https://ui.shadcn.com/)
-   **State Management:** [Zustand](https://github.com/pmndrs/zustand)
-   **Animation:** [Framer Motion](https://www.framer.com/motion/)
-   **Routing:** [React Router](https://reactrouter.com/)

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
-   [Node.js](https://nodejs.org/en/) (v18.x or later)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js)
-   A code editor like [VS Code](https://code.visualstudio.com/)

## Getting Started

Follow these steps to get the project running on your local machine for development and testing purposes.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd walmart-hackathon
```

### 2. Install Dependencies

Install all the required npm packages.

```bash
npm install
```

### 3. Set Up Firebase

This project requires a Firebase backend. If you are the first person setting this up, follow these steps. If your team already has a project, get the necessary credentials from them.

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Add project"** and create a new project.
3.  Inside your new project, click the Web icon `</>` to register a new web app.
4.  After registering, Firebase will provide you with a `firebaseConfig` object. **Copy this object.** You will need it for the next step.
5.  In the Firebase Console, navigate to the **"Build"** section in the left-hand menu and enable the following services:
    -   **Authentication:** Enable the **Email/Password** sign-in method.
    -   **Firestore Database:** Create a database and start in **Test Mode**.
    -   **Storage:** Create a storage bucket and start in **Test Mode**.

### 4. Configure Environment Variables

1.  In the root of the project directory, create a new file named `.env.local`.
2.  Copy the contents of `.env.example` (see below) into your new `.env.local` file.
3.  Paste the values from your `firebaseConfig` object into the corresponding variables.

**`.env.example` (Template)**
```env
VITE_API_KEY="YOUR_API_KEY"
VITE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
VITE_PROJECT_ID="YOUR_PROJECT_ID"
VITE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
VITE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
VITE_APP_ID="YOUR_APP_ID"
```
**Important:** The `.env.local` file is listed in `.gitignore` and should never be committed to the repository.

### 5. Update Firebase Security Rules

For the application to function correctly, you must update your Firestore and Storage security rules.

**Firestore Rules:**
Go to **Firestore Database > Rules** and replace the contents with the following:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /settings/signup {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.isAdmin == true;
    }
    
    match /users/{userId}/{documents=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /admins/{adminId} {
        allow read, write: if request.auth != null && get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.isAdmin == true;
    }

    match /products/{productId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.isAdmin == true;
    }
    match /categories/{categoryId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

**Storage Rules:**
Go to **Storage > Rules** and replace the contents with the following:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 6. Run the Development Server

You are now ready to start the application!

```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) (or the URL provided in your terminal) to view it in the browser.

## Available Scripts

In the project directory, you can run:

-   `npm run dev`: Runs the app in development mode.
-   `npm run build`: Builds the app for production to the `dist` folder.
-   `npm run preview`: Serves the production build locally to preview it.

## Project Structure

A high-level overview of the project's folder structure:

```
/
├── public/
├── src/
│   ├── components/
│   │   ├── admin/      # Components specific to the Admin Dashboard
│   │   ├── home/       # Components specific to the user-facing storefront
│   │   └── ui/         # Shadcn/UI generated components
│   ├── context/
│   │   └── AuthContext.jsx # Global state for user authentication
│   ├── lib/
│   │   ├── firebase.js   # Firebase configuration and initialization
│   │   └── utils.js      # Shadcn utility functions (e.g., cn)
│   ├── pages/            # Top-level page components for each route
│   ├── store/
│   │   └── cartStore.js  # Zustand store for shopping cart state
│   ├── App.jsx           # Main application component with routing
│   ├── index.css         # Global styles and Tailwind directives
│   └── main.jsx          # Entry point of the React application
├── .env.local            # Local environment variables (DO NOT COMMIT)
├── package.json
└── README.md
```