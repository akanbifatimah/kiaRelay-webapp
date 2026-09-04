import { useCallback, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ToastContext, type ToastVariant } from "./ToastContext";
import { ToastItem } from "./ToastItem";

interface ToastMessage {
  id: string;
  variant: ToastVariant;
  message: string;
}

const AUTO_DISMISS_MS = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (variant: ToastVariant, message: string) => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { id, variant, message }]);
      window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="fixed right-4 top-4 z-[100] flex flex-col gap-2">
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              variant={toast.variant}
              message={toast.message}
              onDismiss={() => dismiss(toast.id)}
            />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
