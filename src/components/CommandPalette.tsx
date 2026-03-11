'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Command } from 'lucide-react';
import { APP_ROUTES, CATEGORY_LABELS, AppRoute } from '@/data/routes';

// Exclude auth pages from quick nav
const SEARCHABLE_ROUTES = APP_ROUTES.filter(
  (r) => !['login', 'signup', 'forgot-password', 'onboarding'].includes(r.path.replace('/', ''))
);

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return true;
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filtered = query.trim()
    ? SEARCHABLE_ROUTES.filter(
        (r) => fuzzyMatch(query, r.label) || fuzzyMatch(query, r.description) || fuzzyMatch(query, r.category)
      )
    : SEARCHABLE_ROUTES;

  // Group by category
  const grouped = filtered.reduce<Record<string, AppRoute[]>>((acc, route) => {
    if (!acc[route.category]) acc[route.category] = [];
    acc[route.category].push(route);
    return acc;
  }, {});

  const flatList = Object.values(grouped).flat();

  const navigate = useCallback(
    (path: string) => {
      setOpen(false);
      setQuery('');
      router.push(path);
    },
    [router]
  );

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setActiveIndex(0);
    }
  }, [open]);

  // Reset active index on query change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, flatList.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && flatList[activeIndex]) {
      e.preventDefault();
      navigate(flatList[activeIndex].path);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  let itemIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4"
          onClick={() => { setOpen(false); setQuery(''); }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-lg glass-card-elevated rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search size={24} className="text-text-muted shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search pages..."
                className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted text-sm outline-none"
              />
              <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-text-muted bg-bg-card px-1.5 py-0.5 rounded border border-border">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
              {flatList.length === 0 ? (
                <p className="text-center text-text-muted text-sm py-8">No results found</p>
              ) : (
                Object.entries(grouped).map(([category, routes]) => (
                  <div key={category}>
                    <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                      {CATEGORY_LABELS[category as AppRoute['category']] || category}
                    </p>
                    {routes.map((route) => {
                      itemIndex++;
                      const idx = itemIndex;
                      return (
                        <button
                          key={route.path}
                          data-index={idx}
                          onClick={() => navigate(route.path)}
                          onMouseEnter={() => setActiveIndex(idx)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                            activeIndex === idx
                              ? 'bg-primary/15 text-text-primary'
                              : 'text-text-secondary hover:bg-bg-card-hover'
                          }`}
                        >
                          <span className="text-lg shrink-0">{route.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{route.label}</p>
                            <p className="text-xs text-text-muted truncate">{route.description}</p>
                          </div>
                          {activeIndex === idx && (
                            <kbd className="text-[10px] text-text-muted">Enter</kbd>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-border text-[10px] text-text-muted">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Open</span>
                <span>ESC Close</span>
              </div>
              <div className="flex items-center gap-1">
                <Command size={24} />
                <span>K to toggle</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
