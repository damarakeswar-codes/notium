import React from 'react';
import { cn } from '../lib/utils';

export default function Logo({ className, size = 32 }) {
  return (
    <div className={cn("relative flex items-center justify-center shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="24" fill="url(#logo-gradient)" />
        <path
          d="M30 70V30H40L60 55V30H70V70H60L40 45V70H30Z"
          fill="white"
        />
      </svg>
    </div>
  );
}
