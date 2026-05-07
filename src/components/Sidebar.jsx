import React, { useState } from 'react';
import { useNoteStore } from '../store/useNoteStore';
import { 
  Plus, 
  Search, 
  Trash2, 
  FileText, 
  Moon, 
  Sun,
  Hash,
  X,
  LogOut,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  Settings,
  LayoutGrid,
  Clock,
  Star,
  Archive
} from 'lucide-react';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { logout } from '../firebase';
import PageCard from './PageCard';
import { motion, AnimatePresence } from 'motion/react';

import Logo from './Logo';

export default function Sidebar() {
  const { 
    notes, 
    activeNoteId, 
    setActiveNoteId, 
    addNote, 
    deleteNote, 
    searchQuery, 
    setSearchQuery,
    isDarkMode,
    toggleDarkMode,
    filteredNotes,
    isSidebarOpen,
    setSidebarOpen,
    isSidebarCollapsed,
    toggleSidebarCollapse,
    user
  } = useNoteStore();

  const displayNotes = filteredNotes();

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div 
        animate={{ 
          width: isSidebarCollapsed ? 0 : (isSidebarOpen ? 280 : 260),
          x: isSidebarOpen ? 0 : (isSidebarCollapsed ? -260 : 0)
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          "fixed md:relative inset-y-0 left-0 h-full flex flex-col border-r transition-colors duration-300 z-50 overflow-hidden",
          isDarkMode ? "bg-notion-dark-sidebar border-notion-dark-border text-gray-300" : "bg-notion-sidebar border-notion-border text-gray-700",
          !isSidebarOpen && "hidden md:flex"
        )}
      >
        {/* Header / User Profile */}
        <div className="p-4 border-b border-gray-100 dark:border-notion-dark-border flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm">
            {/* <span className="font-display tracking-tight text-notion-ink dark:text-notion-dark-ink">Notium</span> */}
            <img alt='Logo' src='../../logo.png' className='w-24 object-contain' />
          </div>
          <div className="flex items-center gap-1">
            {/* <button 
              onClick={toggleDarkMode}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button> */}
            <button 
              onClick={toggleSidebarCollapse}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/5 rounded-lg transition-colors hidden md:block"
            >
              <ChevronLeft size={14} />
            </button>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/5 rounded-lg transition-colors md:hidden"
            >
              <X size={14} />
            </button>
          </div>
        </div>
 
        {/* Search Input (Integrated) */}
        <div className="px-3 mt-4">
          <div className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/20",
            isDarkMode ? "bg-notion-dark-secondary border-notion-dark-border" : "bg-white border-notion-border"
          )}>
            <Search size={14} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Quick find..." 
              className="bg-transparent border-none outline-none w-full placeholder:text-gray-500 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="px-3 mt-6 mb-2">
          <button 
            onClick={addNote}
            className={cn(
              "flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 transform active:scale-95 shadow-sm",
              isDarkMode ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            <Plus size={18} />
            <span>New Page</span>
          </button>
        </div>

        {/* Note List */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-notion-ink-muted/60 dark:text-notion-dark-ink-muted/60 px-3 mb-2 font-bold">
            Private Pages
          </div>
          {displayNotes.length === 0 ? (
            <div className="text-center py-10 text-xs text-gray-500 italic">
              No pages found
            </div>
          ) : (
            displayNotes.map((note) => (
              <PageCard 
                key={note.id}
                note={note}
                isActive={activeNoteId === note.id}
                onClick={() => setActiveNoteId(note.id)}
                onDelete={deleteNote}
                isDarkMode={isDarkMode}
              />
            ))
          )}
        </div>
        
        <div className="flex items-center justify-between group p-2 transition-all mb-4">
          <div className="flex items-center gap-3 overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm" />
            ) : (
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <UserIcon size={14} />
              </div>
            )}
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate text-notion-ink dark:text-notion-dark-ink">{user?.displayName || 'User'}</span>
              <span className="text-[10px] text-notion-ink-muted dark:text-notion-dark-ink-muted truncate">{user?.email}</span>
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); logout(); }}
            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded-lg transition-all"
          >
            <LogOut size={14} />
          </button>
        </div>
      </motion.div>

      {/* Collapse Trigger (Floating) */}
      <AnimatePresence>
        {isSidebarCollapsed && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={toggleSidebarCollapse}
            className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-notion-dark-secondary border border-notion-border dark:border-notion-dark-border rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            <ChevronRight size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({ icon: Icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-notion-ink-muted hover:text-notion-ink dark:text-notion-dark-ink-muted dark:hover:text-notion-dark-ink hover:bg-gray-100 dark:hover:bg-white/5 transition-all group"
    >
      <Icon size={18} className="text-notion-ink-muted/50 group-hover:text-blue-500 transition-colors" />
      <span>{label}</span>
    </button>
  );
}
