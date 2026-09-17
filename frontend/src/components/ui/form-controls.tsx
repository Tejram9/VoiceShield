import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, prefixIcon, suffixIcon, className, disabled, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {prefixIcon && (
          <span className="absolute left-3 flex items-center text-content-muted pointer-events-none">
            {prefixIcon}
          </span>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full h-9 bg-surface-1 text-content-primary placeholder:text-content-subtle text-sm px-3 rounded border transition-colors",
            "focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus",
            error
              ? "border-risk-critical focus:border-risk-critical focus:ring-risk-critical"
              : "border-border-default hover:border-border-strong",
            prefixIcon && "pl-9",
            suffixIcon && "pr-9",
            disabled && "opacity-50 cursor-not-allowed bg-surface-base",
            className
          )}
          {...props}
        />
        {suffixIcon && (
          <span className="absolute right-3 flex items-center text-content-muted pointer-events-none">
            {suffixIcon}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  children?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ error = false, className, disabled, children, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full h-9 bg-surface-1 text-content-primary text-sm px-3 pr-8 rounded border transition-colors appearance-none cursor-pointer",
            "focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus",
            error
              ? "border-risk-critical focus:border-risk-critical focus:ring-risk-critical"
              : "border-border-default hover:border-border-strong",
            disabled && "opacity-50 cursor-not-allowed bg-surface-base",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <span className="absolute right-3 pointer-events-none text-content-muted text-xs">
          ▼
        </span>
      </div>
    );
  }
);
Select.displayName = "Select";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error = false, className, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={cn(
          "w-full min-h-[5rem] bg-surface-1 text-content-primary placeholder:text-content-subtle text-sm p-3 rounded border transition-colors",
          "focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus",
          error
            ? "border-risk-critical focus:border-risk-critical focus:ring-risk-critical"
            : "border-border-default hover:border-border-strong",
          disabled && "opacity-50 cursor-not-allowed bg-surface-base",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className, disabled, id, ...props }, ref) => {
    const inputId = id || (label ? `cb-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex items-start gap-2.5 select-none cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          className={cn(
            "mt-0.5 h-4 w-4 rounded-sm bg-surface-1 border border-border-default text-content-primary",
            "focus:ring-1 focus:ring-border-focus focus:ring-offset-0 cursor-pointer",
            disabled && "cursor-not-allowed"
          )}
          {...props}
        />
        {(label || description) && (
          <div className="flex flex-col">
            {label && <span className="text-sm font-medium text-content-primary">{label}</span>}
            {description && <span className="text-xs text-content-secondary">{description}</span>}
          </div>
        )}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  id?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  label,
  description,
  id,
}: SwitchProps) {
  const switchId = id || (label ? `sw-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  return (
    <div className={cn("inline-flex items-center justify-between gap-3", disabled && "opacity-50")}>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label htmlFor={switchId} className="text-sm font-medium text-content-primary cursor-pointer">
              {label}
            </label>
          )}
          {description && <span className="text-xs text-content-secondary">{description}</span>}
        </div>
      )}
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-focus",
          checked ? "bg-risk-safe" : "bg-surface-2",
          disabled && "cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-fast mt-0.5",
            checked ? "translate-x-4" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  helperText?: string;
  errorMessage?: string;
  children?: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  required = false,
  helperText,
  errorMessage,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <label className="text-xs font-medium text-content-secondary flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-risk-critical" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {errorMessage ? (
        <p className="text-xs text-risk-critical font-medium">{errorMessage}</p>
      ) : helperText ? (
        <p className="text-2xs text-content-muted">{helperText}</p>
      ) : null}
    </div>
  );
}
