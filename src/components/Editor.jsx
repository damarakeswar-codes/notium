import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNoteStore } from '../store/useNoteStore';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import debounce from 'lodash.debounce';
import { 
  Hash, Clock, Tag as TagIcon, X, Menu, 
  ChevronRight, MoreHorizontal, Share2, 
  CheckCircle2, Loader2, FileText
} from 'lucide-react';
import { Tag, Input, Space, Tooltip } from 'antd';
import CommandMenu from './CommandMenu';
import Toolbar from './Toolbar';
import { motion, AnimatePresence } from 'motion/react';

export default function Editor() {
  const { 
    activeNoteId, getNoteById, updateNote, 
    isDarkMode, toggleSidebar, isSaving, setIsSaving 
  } = useNoteStore();
  const activeNote = getNoteById(activeNoteId);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  
  // Slash Command State
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [commandPosition, setCommandPosition] = useState({ x: 0, y: 0 });
  
  // Selection Toolbar State
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  
  const textareaRef = useRef(null);

  const handleShare = async () => {
    const fileName = `${title || 'Untitled'}.txt`;
    const fileContent = `Title: ${title || 'Untitled'}\n\n${content}`;
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const file = new File([blob], fileName, { type: 'text/plain' });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: title || 'Untitled',
          text: 'Shared from Notium',
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
          downloadFallback(blob, fileName);
        }
      }
    } else {
      downloadFallback(blob, fileName);
    }
  };

  const downloadFallback = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
      setTags(activeNote.tags || []);
    }
  }, [activeNoteId]);

  const debouncedUpdate = useCallback(
    debounce(async (id, updates) => {
      setIsSaving(true);
      await updateNote(id, updates);
      setTimeout(() => setIsSaving(false), 1000);
    }, 1000),
    []
  );

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    debouncedUpdate(activeNoteId, { title: val });
  };

  const handleContentChange = (e) => {
    const val = e.target.value;
    setContent(val);
    
    // Check for slash command
    const cursorPosition = e.target.selectionStart;
    const lastChar = val[cursorPosition - 1];
    
    if (lastChar === '/') {
      const rect = e.target.getBoundingClientRect();
      // Simple heuristic for cursor position
      setCommandPosition({ 
        x: rect.left + 20, 
        y: rect.top + (cursorPosition / 40) * 24 + 40 
      });
      setShowCommandMenu(true);
    } else {
      setShowCommandMenu(false);
    }
    
    debouncedUpdate(activeNoteId, { content: val });
  };

  const handleCommandSelect = (syntax) => {
    const cursorPosition = textareaRef.current.selectionStart;
    const newContent = content.slice(0, cursorPosition - 1) + syntax + content.slice(cursorPosition);
    setContent(newContent);
    updateNote(activeNoteId, { content: newContent });
    setShowCommandMenu(false);
    textareaRef.current.focus();
  };

  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setToolbarPosition({ x: rect.left, y: rect.top });
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  };

  const handleToolbarAction = (action) => {
    const selection = window.getSelection().toString();
    let wrapped = selection;
    if (action === 'bold') wrapped = `**${selection}**`;
    if (action === 'italic') wrapped = `*${selection}*`;
    if (action === 'code') wrapped = `\`${selection}\``;
    
    const newContent = content.replace(selection, wrapped);
    setContent(newContent);
    updateNote(activeNoteId, { content: newContent });
    setShowToolbar(false);
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      const updatedTags = [...tags, newTag];
      setTags(updatedTags);
      updateNote(activeNoteId, { tags: updatedTags });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter(t => t !== tagToRemove);
    setTags(updatedTags);
    updateNote(activeNoteId, { tags: updatedTags });
  };

  if (!activeNote) {
    return (
      <div className={cn(
        "flex-1 flex flex-col items-center justify-center transition-colors duration-200 p-4",
        isDarkMode ? "bg-notion-dark-bg text-gray-500" : "bg-white text-gray-400"
      )}>
        <button 
          onClick={toggleSidebar}
          className="absolute top-4 left-4 p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg md:hidden"
        >
          <Menu size={20} />
        </button>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-20 h-20 bg-gray-50 dark:bg-notion-dark-secondary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <FileText size={40} className="text-gray-300 dark:text-gray-600" />
          </div>
          <h2 className="text-2xl font-display font-semibold text-gray-800 dark:text-gray-200">Select a page</h2>
          <p className="text-sm max-w-xs mx-auto">Choose a page from the sidebar to start writing or create a new one.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex-1 flex flex-col h-screen overflow-hidden transition-colors duration-200",
      isDarkMode ? "bg-notion-dark-bg text-notion-dark-ink" : "bg-white text-notion-ink"
    )}>
      {/* Top Navigation / Breadcrumbs */}
      <div className="flex items-center justify-between px-4 md:px-8 py-3 border-b border-gray-100 dark:border-notion-dark-border glass-panel sticky top-0 z-30">
        <div className="flex items-center gap-3 overflow-hidden">
          <button 
            onClick={toggleSidebar}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg md:hidden"
          >
            <Menu size={18} />
          </button>
          
          <div className="flex items-center gap-2 text-sm font-medium text-notion-ink-muted dark:text-notion-dark-ink-muted overflow-hidden">
            <span className="hover:text-notion-ink dark:hover:text-notion-dark-ink cursor-pointer transition-colors">Notium</span>
            <ChevronRight size={14} className="shrink-0" />
            <span className="text-notion-ink dark:text-notion-dark-ink truncate">{activeNote.title || 'Untitled'}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-400">
            {isSaving ? (
              <div className="flex items-center gap-1.5 text-blue-500">
                <Loader2 size={12} className="animate-spin" />
                <span>Saving</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-green-500">
                <CheckCircle2 size={12} />
                <span>Saved</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Tooltip title="Share as .txt">
              <button 
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-gray-500 transition-all"
              >
                <Share2 size={18} />
              </button>
            </Tooltip>
            <button 
              onClick={() => setIsPreview(!isPreview)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all transform active:scale-95",
                isPreview 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                  : (isDarkMode ? "bg-white/5 hover:bg-white/10" : "bg-gray-100 hover:bg-gray-200")
              )}
            >
              {isPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 sm:px-8 md:px-12 lg:px-24 py-8 md:py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-[700px] mx-auto"
        >
          {/* Tags */}
          <div className="mb-8 flex flex-wrap gap-2 items-center group">
            <TagIcon size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors mr-1" />
            {tags.map(tag => (
              <Tag 
                key={tag} 
                closable 
                onClose={() => removeTag(tag)}
                className={cn(
                  "rounded-lg px-2 py-0.5 border-none",
                  isDarkMode ? "bg-white/5 text-gray-300" : "bg-gray-100 text-gray-600"
                )}
              >
                {tag}
              </Tag>
            ))}
            <input 
              type="text"
              placeholder="Add tag..."
              className="text-xs bg-transparent border-none outline-none placeholder:text-gray-400 w-24 opacity-0 group-hover:opacity-100 transition-opacity"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTag()}
            />
          </div>

          {/* Title */}
          <input 
            type="text" 
            placeholder="Untitled"
            className="w-full text-4xl md:text-5xl font-display font-bold bg-transparent border-none outline-none mb-10 placeholder:text-slate-300 dark:placeholder:text-slate-700 tracking-tight"
            value={title}
            onChange={handleTitleChange}
          />

          {/* Body */}
          <div onMouseUp={handleSelection} className="relative min-h-[500px]">
            {isPreview ? (
              <div className="prose dark:prose-invert max-w-none animate-in fade-in duration-500">
                <ReactMarkdown>{content || '*No content yet*'}</ReactMarkdown>
              </div>
            ) : (
              <textarea 
                ref={textareaRef}
                placeholder="Type '/' for commands or start writing..."
                className="w-full h-full bg-transparent border-none outline-none resize-none text-lg md:text-xl leading-[1.8] placeholder:text-slate-300 dark:placeholder:text-slate-700 font-sans"
                value={content}
                onChange={handleContentChange}
                style={{ height: 'auto', minHeight: '500px' }}
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Floating Menus */}
      {showCommandMenu && (
        <CommandMenu 
          position={commandPosition} 
          onSelect={handleCommandSelect}
          onClose={() => setShowCommandMenu(false)}
        />
      )}
      
      <Toolbar 
        position={showToolbar ? toolbarPosition : null} 
        onAction={handleToolbarAction} 
      />
    </div>
  );
}
