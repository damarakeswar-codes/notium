import React, { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Login from './components/Login';
import { useNoteStore } from './store/useNoteStore';
import { auth, onAuthStateChanged, db, doc, setDoc, getDoc } from './firebase';
import { ConfigProvider, theme, Spin } from 'antd';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { isDarkMode, user, setUser, isAuthReady, syncNotes, isSidebarCollapsed } = useNoteStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        
        // Sync user to firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, { ...userDoc, role: 'user' });
        }
        
        setUser(userDoc);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubscribeNotes = () => {};
    if (user) {
      unsubscribeNotes = syncNotes();
    }
    return () => unsubscribeNotes();
  }, [user]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (!isAuthReady) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-notion-bg dark:bg-notion-dark-bg">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#2563EB',
          borderRadius: 12,
          fontFamily: 'Inter, sans-serif',
        },
      }}
    >
      {!user ? (
        <Login />
      ) : (
        <div className="flex h-screen w-full overflow-hidden font-sans antialiased bg-white dark:bg-notion-dark-bg transition-colors duration-300">
          <Sidebar />
          <motion.main 
            layout
            className="flex-1 relative flex flex-col min-w-0"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Editor />
          </motion.main>
        </div>
      )}
    </ConfigProvider>
  );
}
