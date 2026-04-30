import React from 'react';
import { Bold, Italic, Link, Code, Type } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Toolbar({ onAction, position }) {
  if (!position) return null;

  return (
    <div 
      className="fixed z-50 glass-panel rounded-lg shadow-xl p-1 flex items-center gap-1 animate-in fade-in slide-in-from-bottom-2 duration-200"
      style={{ top: position.y - 45, left: position.x }}
    >
      <ToolbarButton icon={Bold} onClick={() => onAction('bold')} label="Bold" />
      <ToolbarButton icon={Italic} onClick={() => onAction('italic')} label="Italic" />
      <div className="w-px h-4 bg-notion-border dark:bg-notion-dark-border mx-1" />
      <ToolbarButton icon={Link} onClick={() => onAction('link')} label="Link" />
      <ToolbarButton icon={Code} onClick={() => onAction('code')} label="Inline Code" />
      <ToolbarButton icon={Type} onClick={() => onAction('highlight')} label="Highlight" />
    </div>
  );
}

function ToolbarButton({ icon: Icon, onClick, label }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors text-notion-ink-muted dark:text-notion-dark-ink-muted hover:text-notion-ink dark:hover:text-notion-dark-ink"
    >
      <Icon size={16} />
    </button>
  );
}
