"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  action?: { label: string; href: string };
}

interface ToastContextValue {
  toast: (
    type: ToastType,
    message: string,
    action?: Toast["action"]
  ) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    (type: ToastType, message: string, action?: Toast["action"]) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, type, message, action }]);
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        5000
      );
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-surface px-4 py-3 shadow-lg backdrop-blur-sm"
            >
              {t.type === "success" && (
                <CheckCircle size={16} className="flex-shrink-0 text-trading-green" />
              )}
              {t.type === "error" && (
                <AlertTriangle size={16} className="flex-shrink-0 text-trading-red" />
              )}
              {t.type === "info" && (
                <Info size={16} className="flex-shrink-0 text-accent-amber" />
              )}
              <p className="max-w-xs text-sm text-text-primary">{t.message}</p>
              {t.action && (
                <a
                  href={t.action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-xs text-accent-amber underline"
                >
                  {t.action.label}
                </a>
              )}
              <button
                onClick={() => dismiss(t.id)}
                className="ml-1 flex-shrink-0 text-text-tertiary transition-colors hover:text-text-primary"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
