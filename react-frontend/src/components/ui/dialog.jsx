// src/components/ui/dialog.jsx
import { createPortal } from "react-dom";

export function Dialog({ open, children, onOpenChange }) {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {children}
    </div>,
    document.body
  );
}

export function DialogContent({ children }) {
  return <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">{children}</div>;
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-xl font-bold">{children}</h2>;
}
