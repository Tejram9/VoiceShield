import React from "react";
import { cn } from "@/lib/utils";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children?: React.ReactNode;
}

export function Heading({ level = 2, className, children, ...props }: HeadingProps) {
  const Component = `h${level}` as const;

  const levelStyles = {
    1: "text-2xl font-semibold tracking-tight text-content-primary leading-tight",
    2: "text-xl font-semibold tracking-tight text-content-primary leading-snug",
    3: "text-lg font-medium text-content-primary leading-snug",
    4: "text-md font-medium text-content-primary leading-normal",
    5: "text-base font-medium text-content-primary leading-normal",
    6: "text-sm font-medium text-content-secondary uppercase tracking-wider",
  };

  return (
    <Component className={cn(levelStyles[level], className)} {...props}>
      {children}
    </Component>
  );
}

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "2xs" | "xs" | "sm" | "base" | "md" | "lg";
  variant?: "primary" | "secondary" | "muted" | "subtle" | "danger" | "success" | "warning";
  weight?: "normal" | "medium" | "semibold";
  as?: "p" | "span" | "div";
  children?: React.ReactNode;
}

export function Text({
  size = "base",
  variant = "primary",
  weight = "normal",
  as: Component = "p",
  className,
  children,
  ...props
}: TextProps) {
  const sizeStyles = {
    "2xs": "text-2xs",
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    md: "text-md",
    lg: "text-lg",
  };

  const variantStyles = {
    primary: "text-content-primary",
    secondary: "text-content-secondary",
    muted: "text-content-muted",
    subtle: "text-content-subtle",
    danger: "text-risk-critical",
    success: "text-risk-safe",
    warning: "text-risk-caution",
  };

  const weightStyles = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
  };

  return (
    <Component
      className={cn(sizeStyles[size], variantStyles[variant], weightStyles[weight], className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export interface MonoProps extends React.HTMLAttributes<HTMLElement> {
  size?: "xs" | "sm" | "base";
  children?: React.ReactNode;
}

export function Mono({ size = "xs", className, children, ...props }: MonoProps) {
  const sizeStyles = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
  };

  return (
    <code
      className={cn(
        "font-mono tracking-tight text-content-secondary select-all",
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}

export interface DataLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

export function DataLabel({ className, children, ...props }: DataLabelProps) {
  return (
    <span
      className={cn(
        "text-2xs font-medium uppercase tracking-wider text-content-muted block",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export interface MetricValueProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  unit?: string;
  subtext?: string;
}

export function MetricValue({ value, unit, subtext, className, ...props }: MetricValueProps) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)} {...props}>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-semibold tracking-tight text-content-primary font-mono">
          {value}
        </span>
        {unit && (
          <span className="text-xs text-content-muted font-normal">
            {unit}
          </span>
        )}
      </div>
      {subtext && (
        <span className="text-2xs text-content-secondary">
          {subtext}
        </span>
      )}
    </div>
  );
}
