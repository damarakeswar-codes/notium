import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy 
} from '../firebase';

const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const useNoteStore = create(
  persist(
    (set, get) => ({
      notes: [],
      activeNoteId: null,
      searchQuery: '',
      isDarkMode: false,
      isSidebarOpen: false,
      isSidebarCollapsed: false,
      isSaving: false,
      user: null,
      isAuthReady: false,

      setUser: (user) => set({ user, isAuthReady: true }),
      setNotes: (notes) => set({ notes }),
      setActiveNoteId: (id) => set({ activeNoteId: id, isSidebarOpen: false }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      toggleSidebarCollapse: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      setIsSaving: (isSaving) => set({ isSaving }),

      addNote: async () => {
        const user = get().user;
        if (!user) return;

        const newNote = {
          id: crypto.randomUUID(),
          title: 'Untitled',
          content: '',
          tags: [],
          authorUid: user.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        try {
          await setDoc(doc(db, 'notes', newNote.id), newNote);
          set((state) => ({
            activeNoteId: newNote.id,
          }));
          return newNote.id;
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `notes/${newNote.id}`);
        }
      },

      updateNote: async (id, updates) => {
        try {
          const noteRef = doc(db, 'notes', id);
          await updateDoc(noteRef, { 
            ...updates, 
            updatedAt: new Date().toISOString() 
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `notes/${id}`);
        }
      },

      deleteNote: async (id) => {
        try {
          await deleteDoc(doc(db, 'notes', id));
          set((state) => ({
            activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
          }));
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, `notes/${id}`);
        }
      },

      getNoteById: (id) => get().notes.find((note) => note.id === id),

      filteredNotes: () => {
        const { notes, searchQuery } = get();
        if (!searchQuery) return notes;
        const queryStr = searchQuery.toLowerCase();
        return notes.filter(
          (note) =>
            note.title.toLowerCase().includes(queryStr) ||
            note.content.toLowerCase().includes(queryStr) ||
            note.tags.some((tag) => tag.toLowerCase().includes(queryStr))
        );
      },

      syncNotes: () => {
        const user = get().user;
        if (!user) return () => {};

        const q = query(
          collection(db, 'notes'), 
          where('authorUid', '==', user.uid),
          orderBy('updatedAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const notes = snapshot.docs.map(doc => doc.data());
          set({ notes });
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, 'notes');
        });

        return unsubscribe;
      }
    }),
    {
      name: 'notion-notes-storage',
      partialize: (state) => ({ isDarkMode: state.isDarkMode }), // Only persist theme locally
    }
  )
);
