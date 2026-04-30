import React, { useState, useEffect, useRef } from 'react';
import { 
  Heading1, Heading2, Heading3, 
  List, ListOrdered, 
  Code, Image, 
  CheckSquare, Quote 
} from 'lucide-react';
import { cn } from '../lib/utils';

const COMMANDS = [
  { id: 'h1', label: 'Heading 1', icon: Heading1, syntax: '# ' },
  { id: 'h2', label: 'Heading 2', icon: Heading2, syntax: '## ' },
  { id: 'h3', label: 'Heading 3', icon: Heading3, syntax: '### ' },
  { id: 'bullet', label: 'Bullet List', icon: List, syntax: '- ' },
  { id: 'number', label: 'Numbered List', icon: ListOrdered, syntax: '1. ' },
  { id: 'todo', label: 'To-do List', icon: CheckSquare, syntax: '- [ ] ' },
  { id: 'quote', label: 'Quote', icon: Quote, syntax: '> ' },
  { id: 'code', label: 'Code Block', icon: Code, syntax: '```\n\n```' },
];

export default function CommandMenu({ onSelect, onClose, position }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % COMMANDS.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + COMMANDS.length) % COMMANDS.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onSelect(COMMANDS[selectedIndex].syntax);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, onSelect, onClose]);

  return (
    <div 
      ref={menuRef}
      className="fixed z-50 w-64 glass-panel rounded-xl shadow-2xl p-2 animate-in fade-in zoom-in duration-200"
      style={{ top: position.y, left: position.x }}
    >
      <div className="text-[10px] uppercase tracking-wider text-notion-ink-muted/50 dark:text-notion-dark-ink-muted/50 px-3 py-2 font-semibold">
        Basic Blocks
      </div>
      <div className="space-y-0.5">
        {COMMANDS.map((cmd, idx) => (
          <button
            key={cmd.id}
            onClick={() => onSelect(cmd.syntax)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 text-left",
              selectedIndex === idx 
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
                : "hover:bg-gray-100 dark:hover:bg-white/5 text-notion-ink-muted dark:text-notion-dark-ink-muted hover:text-notion-ink dark:hover:text-notion-dark-ink"
            )}
          >
            <cmd.icon size={18} className={cn(selectedIndex === idx ? "text-blue-500" : "text-notion-ink-muted/50")} />
            <span className="font-medium">{cmd.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
