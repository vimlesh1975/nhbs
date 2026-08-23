'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedTheme = localStorage.getItem('casparcg_theme');
      if (savedTheme === 'light') {
        setTheme('light');
        document.documentElement.classList.remove('dark');
      } else {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    try {
      localStorage.setItem('casparcg_theme', nextTheme);
    } catch (e) {}
  };

  const isDark = theme === 'dark';

  if (!mounted) {
    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-bold text-slate-400 opacity-60 ${className}`}>
        <Moon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Theme</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      title={`Switch to ${isDark ? 'Light Mode' : 'Dark Mode'}`}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-300 select-none shadow-sm group ${
        isDark
          ? 'bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-amber-300 hover:text-amber-200 shadow-slate-950/50'
          : 'bg-white/95 hover:bg-slate-50 border-slate-200 text-indigo-700 hover:text-indigo-800 shadow-slate-200'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300 group-hover:-rotate-12" />
        )}
      </div>

      <span className="font-semibold tracking-wide hidden sm:inline text-[11px]">
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </span>

      {/* Pill state indicator */}
      <span
        className={`w-2 h-2 rounded-full transition-all duration-300 ${
          isDark
            ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
            : 'bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]'
        }`}
      />
    </button>
  );
}
