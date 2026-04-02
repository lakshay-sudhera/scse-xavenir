"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error" | "info";
interface ToastItem { id: number; message: string; type: ToastType; }

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const colors: Record<ToastType, { border: string; icon: string; glow: string }> = {
    success: { border: "#00ff88", icon: "✓", glow: "rgba(0,255,136,0.25)" },
    error:   { border: "#ff0080", icon: "✕", glow: "rgba(255,0,128,0.25)" },
    info:    { border: "#00f5ff", icon: "◈", glow: "rgba(0,245,255,0.25)" },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: "fixed", bottom: "2rem", right: "2rem",
        zIndex: 99999, display: "flex", flexDirection: "column", gap: "10px",
        pointerEvents: "none",
      }}>
        {toasts.map(t => {
          const c = colors[t.type];
          return (
            <div key={t.id} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "14px 20px",
              background: "rgba(2,0,18,0.97)",
              border: `1px solid ${c.border}`,
              boxShadow: `0 0 24px ${c.glow}, 0 4px 20px rgba(0,0,0,0.5)`,
              fontFamily: "'Orbitron', monospace",
              fontSize: "0.72rem", letterSpacing: "2px",
              color: "#e0e8ff",
              animation: "toast-in 0.3s ease forwards",
              backdropFilter: "blur(12px)",
              minWidth: "260px", maxWidth: "380px",
            }}>
              <span style={{ color: c.border, fontSize: "1rem", flexShrink: 0 }}>{c.icon}</span>
              <span>{t.message}</span>
              <div style={{
                position: "absolute", bottom: 0, left: 0,
                height: "2px", background: c.border,
                boxShadow: `0 0 8px ${c.border}`,
                animation: "toast-bar 3.5s linear forwards",
                width: "100%",
              }} />
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes toast-bar {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
