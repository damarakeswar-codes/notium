# Notium

Notium is a modern, fast, and feature-rich note-taking application. Built with a focus on productivity and clean design, it leverages React, Firebase, and Ant Design to deliver a seamless user experience.

## Features

- 📝 **Rich Note Taking**: Create, edit, and organize notes effortlessly.
- 🔄 **Real-time Sync**: Powered by Firebase to keep your notes updated across all devices.
- 🎨 **Modern UI**: Clean and intuitive interface built with Tailwind CSS and Ant Design.
- ⚡ **Fast Performance**: Built on top of Vite for lightning-fast development and optimized production builds.
- 🧠 **State Management**: Uses Zustand for scalable and easy-to-maintain state.
- 📄 **Markdown Support**: Write your notes in Markdown using `react-markdown`.

## Technologies Used

- **Framework**: [React](https://react.dev/) 19 + [Vite](https://vitejs.dev/)
- **Backend & Database**: [Firebase](https://firebase.google.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **UI Library**: [Ant Design](https://ant.design/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm or yarn
- Firebase Account (for setting up the database and authentication)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd notium
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your Firebase configuration and any other required keys.
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Build for Production

To create a production-ready build, run:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

## License

This project is open-source and available under the MIT License.
