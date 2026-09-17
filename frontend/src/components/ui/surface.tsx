import React from "react";
import { cn } from "@/lib/utils";

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "base" | "surface-1" | "surface-2" | "elevated" | "outlined" | "canvas";
  border?: boolean | "subtle" | "default" | "strong";
  padding?: "none" | "xs" | "sm" | "md" | "lg";
  rounded?: "none" | "sm" | "default" | "md" | "lg";
  children?: React.ReactNode;
}

export function Surface({
  variant = "surface-1",
  border = "default",
  padding = "md",
  rounded = "md",
  className,
  children,
  ...props
}: SurfaceProps) {
  const variantStyles = {
    canvas: "bg-canvas",
    base: "bg-surface-base",
    "surface-1": "bg-surface-1",
    "surface-2": "bg-surface-2",
    elevated: "bg-surface-elevated shadow-subtle",
    outlined: "bg-transparent",
  };

  const borderStyles = {
    false: "border-0",
    true: "border border-border-default",
    subtle: "border border-border-subtle",
    default: "border border-border-default",
    strong: "border border-border-strong",
  };

  const paddingStyles = {
    none: "p-0",
    xs: "p-2",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-sm",
    default: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
  };

  const borderClass = typeof border === "boolean" ? borderStyles[border ? "true" : "false"] : borderStyles[border];

  return (
    <div
      className={cn(
        variantStyles[variant],
        borderClass,
        paddingStyles[padding],
        roundedStyles[rounded],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  children?: React.ReactNode;
}

export function Container({ size = "lg", className, children, ...props }: ContainerProps) {
  const sizeStyles = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    xl: "max-w-[96rem]",
    full: "max-w-full",
  };

  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizeStyles[size], className)} {...props}>
      {children}
    </div>
  );
}

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
  variant?: "subtle" | "default" | "strong";
}

export function Divider({
  orientation = "horizontal",
  variant = "default",
  className,
  ...props
}: DividerProps) {
  const variantStyles = {
    subtle: "border-border-subtle",
    default: "border-border-default",
    strong: "border-border-strong",
  };

  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn("inline-block w-px self-stretch border-l", variantStyles[variant], className)}
      />
    );
  }

  return (
    <hr
      role="separator"
      aria-orientation="horizontal"
      className={cn("w-full border-t border-0 my-4", variantStyles[variant], className)}
      {...props}
    />
  );
}

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
  badge,
  actions,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 mb-4 border-b border-border-default",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-semibold text-content-primary tracking-tight">
            {title}
          </h2>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs text-content-secondary">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
