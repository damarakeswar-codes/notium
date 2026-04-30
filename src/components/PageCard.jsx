import React from 'react';
import { FileText, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function PageCard({ note, isActive, onClick, onDelete, isDarkMode }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200",
        isActive 
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
          : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400"
      )}
    >
      <div className={cn(
        "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
        isActive ? "bg-blue-100 dark:bg-blue-800/40" : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
      )}>
        <FileText size={16} className={isActive ? "text-blue-500" : "text-gray-400"} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className={cn(
            "text-sm font-medium truncate",
            isActive ? "text-blue-700 dark:text-blue-300" : "text-notion-ink dark:text-notion-dark-ink"
          )}>
            {note.title || 'Untitled'}
          </h3>
          <span className="text-[10px] text-notion-ink-muted dark:text-notion-dark-ink-muted opacity-0 group-hover:opacity-100 transition-opacity">
            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-xs text-notion-ink-muted dark:text-notion-dark-ink-muted truncate mt-0.5">
          {note.content?.substring(0, 40) || 'No content yet...'}
        </p>
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(note.id);
        }}
        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded-lg transition-all"
      >
        <MoreHorizontal size={14} />
      </button>
    </div>
  );
}
