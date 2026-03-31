"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";

type ToastType = "success" | "error" | "info";
interface Toast { id: number; message: string; type: ToastType; }
interface ToastCtx { toast: (msg: string, type?: ToastType) => void; }

const ToastContext = createContext<ToastCtx>({ toast: () => {} });

export function useToast() { return useContext(ToastContext); }

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++counter.current;
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const colors: Record<ToastType, string> = {
    success: "#00ff88",
    error:   "var(--pink, #ff0080)",
    info:    "var(--cyan, #00f5ff)",
  };
  const icons: Record<ToastType, string> = { success: "✓", error: "✕", info: "◈" };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 99999, display: "flex", flexDirection: "column", gap: "0.6rem", pointerEvents: "none" }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            display: "flex", alignItems: "center", gap: "0.7rem",
            padding: "10px 16px",
            background: "rgba(2,0,18,0.97)",
            border: `1px solid ${colors[t.type]}`,
            boxShadow: `0 0 18px ${colors[t.type]}33`,
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.78rem", letterSpacing: "0.06em",
            color: "#e0e8ff",
            animation: "toast-in 0.25s ease",
            clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
            maxWidth: "min(340px, 90vw)",
          }}>
            <span style={{ color: colors[t.type], fontSize: "0.9rem", flexShrink: 0 }}>{icons[t.type]}</span>
            {t.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
