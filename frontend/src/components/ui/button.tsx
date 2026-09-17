import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "subtle" | "destructive" | "caution";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
}

export function Button({
  variant = "secondary",
  size = "md",
  isLoading = false,
  disabled = false,
  iconLeft,
  iconRight,
  className,
  children,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary:
      "bg-content-primary text-canvas hover:bg-white active:bg-slate-200 border border-transparent font-medium shadow-subtle",
    secondary:
      "bg-surface-2 text-content-primary border border-border-default hover:bg-surface-elevated hover:border-border-strong active:bg-surface-1 font-medium",
    outline:
      "bg-transparent text-content-primary border border-border-default hover:bg-surface-1 hover:border-border-strong active:bg-surface-2 font-medium",
    subtle:
      "bg-transparent text-content-secondary hover:text-content-primary hover:bg-surface-1 active:bg-surface-2 border border-transparent",
    destructive:
      "bg-risk-critical text-white hover:bg-red-700 active:bg-red-800 border border-transparent font-medium shadow-subtle",
    caution:
      "bg-risk-caution-subtle text-amber-300 border border-risk-caution-border hover:bg-amber-500/20 active:bg-amber-500/30 font-medium",
  };

  const sizeStyles = {
    xs: "h-7 px-2 text-xs gap-1.5 rounded-sm",
    sm: "h-8 px-3 text-xs gap-2 rounded",
    md: "h-9 px-4 text-sm gap-2 rounded-md",
    lg: "h-11 px-5 text-base gap-2.5 rounded-md",
  };

  return (
    <button
      type={props.type || "button"}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={cn(
        "inline-flex items-center justify-center select-none transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus disabled:opacity-50 disabled:pointer-events-none shrink-0",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span
          className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : (
        iconLeft && <span className="inline-flex shrink-0 items-center justify-center">{iconLeft}</span>
      )}
      <span>{children}</span>
      {!isLoading && iconRight && (
        <span className="inline-flex shrink-0 items-center justify-center">{iconRight}</span>
      )}
    </button>
  );
}

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  attached?: boolean;
  children?: React.ReactNode;
}

export function ButtonGroup({ attached = false, className, children, ...props }: ButtonGroupProps) {
  if (attached) {
    return (
      <div
        role="group"
        className={cn(
          "inline-flex rounded-md shadow-subtle [&>button]:rounded-none [&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md [&>button:not(:last-child)]:border-r-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div role="group" className={cn("inline-flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}
