import React, { useEffect } from "react";
import { Button } from "./button";

export interface ActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "destructive" | "caution";
  isLoading?: boolean;
  onConfirm: () => void;
  children?: React.ReactNode;
}

export function ActionDialog({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel = "Confirm Action",
  cancelLabel = "Cancel",
  variant = "primary",
  isLoading = false,
  onConfirm,
  children,
}: ActionDialogProps) {
  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const confirmButtonVariant = variant === "destructive" ? "destructive" : variant === "caution" ? "caution" : "primary";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-sm"
    >
      <div
        className="w-full max-w-lg bg-surface-1 border border-border-strong rounded-lg shadow-overlay p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          <h3 id="dialog-title" className="text-lg font-semibold text-content-primary tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-content-secondary leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {children && <div className="py-2">{children}</div>}

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border-default">
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={onClose}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmButtonVariant}
            size="sm"
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
