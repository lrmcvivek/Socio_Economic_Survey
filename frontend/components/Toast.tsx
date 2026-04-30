"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

const toastContext = React.createContext<{
  showToast: (
    message: string,
    type: ToastMessage["type"],
    duration?: number,
  ) => void;
}>({
  showToast: () => {},
});

export function useToast() {
  return React.useContext(toastContext);
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (
    message: string,
    type: ToastMessage["type"],
    duration = 3000,
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <toastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-20 right-6 space-y-2 pointer-events-none z-9999 max-w-sm">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </toastContext.Provider>
  );
}

function Toast({
  message,
  type,
  onClose,
  duration = 3000,
}: ToastMessage & { onClose: () => void }) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(), 200);
  };

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 16);

    const autoClose = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(autoClose);
    };
  }, [duration]);

  const config = {
    success: {
      bg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      border: "border-emerald-400/50",
      icon: CheckCircle,
      shadow: "shadow-emerald-500/25",
    },
    error: {
      bg: "bg-gradient-to-br from-red-500 to-red-600",
      border: "border-red-400/50",
      icon: XCircle,
      shadow: "shadow-red-500/25",
    },
    info: {
      bg: "bg-gradient-to-br from-blue-500 to-blue-600",
      border: "border-blue-400/50",
      icon: Info,
      shadow: "shadow-blue-500/25",
    },
    warning: {
      bg: "bg-gradient-to-br from-amber-500 to-amber-600",
      border: "border-amber-400/50",
      icon: AlertTriangle,
      shadow: "shadow-amber-500/25",
    },
  };

  const { bg, border, icon: Icon, shadow } = config[type];

  return (
    <div
      className={`
        pointer-events-auto
        ${bg}
        ${shadow}
        border ${border}
        rounded-lg shadow-xl backdrop-blur-sm
        transform transition-all duration-300 ease-out
        ${isExiting ? "opacity-0 translate-x-full scale-95" : "opacity-100 translate-x-0 scale-100 animate-slide-in-right"}
      `}
    >
      <div className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="shrink-0">
            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <p className="text-xs text-white font-medium leading-snug flex-1">
            {message}
          </p>

          <button
            onClick={handleClose}
            className="shrink-0 p-1 rounded-md hover:bg-white/20 backdrop-blur-sm transition-all duration-200 group"
            aria-label="Close notification"
          >
            <X
              className="w-3.5 h-3.5 text-white/80 group-hover:text-white transition-all duration-200"
              strokeWidth={2.5}
            />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-0.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-white/80 rounded-full transition-all duration-100 ease-linear shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
