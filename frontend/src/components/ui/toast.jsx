import { CheckCircle2, Info, LoaderCircle, X, XCircle } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

const styles = {
  success: {
    icon: CheckCircle2,
    className: "border-green-200 bg-green-50 text-green-800",
  },
  error: {
    icon: XCircle,
    className: "border-red-200 bg-red-50 text-red-800",
  },
  loading: {
    icon: LoaderCircle,
    className: "border-yellow-200 bg-yellow-50 text-yellow-800",
  },
  info: {
    icon: Info,
    className: "border-gray-200 bg-white text-gray-800",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, description = "", type = "info", duration = 4000, id }) => {
      const toastId = id || `${Date.now()}-${Math.random()}`;
      const toast = { id: toastId, title, description, type };

      setToasts((current) => [
        toast,
        ...current.filter((item) => item.id !== toastId),
      ].slice(0, 4));

      if (duration > 0) {
        window.setTimeout(() => dismiss(toastId), duration);
      }

      return toastId;
    },
    [dismiss]
  );

  const value = useMemo(() => ({ showToast, dismiss }), [showToast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}

function ToastItem({ toast, onDismiss }) {
  const config = styles[toast.type] || styles.info;
  const Icon = config.icon;

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg ${config.className}`}
    >
      <Icon
        size={18}
        className={`mt-0.5 shrink-0 ${toast.type === "loading" ? "animate-spin" : ""}`}
      />
      <div className="min-w-0 flex-1">
        <div className="font-semibold">{toast.title}</div>
        {toast.description && (
          <div className="mt-1 text-xs leading-relaxed opacity-80">{toast.description}</div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="rounded p-0.5 opacity-60 transition hover:opacity-100"
        aria-label="Dismiss notification"
      >
        <X size={15} />
      </button>
    </div>
  );
}
