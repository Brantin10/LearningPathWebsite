'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const TOAST_COLORS = {
  success: 'border-l-primary text-primary',
  error: 'border-l-error text-error',
  warning: 'border-l-warning text-warning',
  info: 'border-l-accent text-accent',
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const Icon = TOAST_ICONS[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`glass-card-elevated rounded-xl px-4 py-3 flex items-center gap-3 min-w-[280px] max-w-[400px] border-l-4 ${TOAST_COLORS[toast.type]} shadow-lg shadow-black/20`}
    >
      <Icon size={24} className="shrink-0" />
      <p className="text-sm text-text-primary flex-1">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-text-muted hover:text-text-secondary transition-colors shrink-0"
        aria-label="Dismiss"
      >
        <X size={24} />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => dismiss(id), 3500);
  }, [dismiss]);

  const value: ToastContextValue = {
    success: useCallback((msg: string) => addToast(msg, 'success'), [addToast]),
    error: useCallback((msg: string) => addToast(msg, 'error'), [addToast]),
    warning: useCallback((msg: string) => addToast(msg, 'warning'), [addToast]),
    info: useCallback((msg: string) => addToast(msg, 'info'), [addToast]),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col-reverse gap-2" role="status" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
