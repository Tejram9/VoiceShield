import React from "react";
import { cn } from "@/lib/utils";

export interface NavTabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface NavTabsProps {
  tabs: NavTabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function NavTabs({ tabs, activeId, onChange, className }: NavTabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center gap-1 border-b border-border-default overflow-x-auto no-scrollbar",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
              isActive
                ? "border-content-primary text-content-primary"
                : "border-transparent text-content-muted hover:text-content-secondary hover:border-border-strong"
            )}
          >
            {tab.icon && <span className="text-content-muted">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  "font-mono text-2xs px-1.5 py-0.2 rounded-full",
                  isActive
                    ? "bg-surface-elevated text-content-primary"
                    : "bg-surface-2 text-content-muted"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-xs font-medium", className)}>
      <ol className="flex items-center gap-1.5 text-content-muted">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              {idx > 0 && <span className="text-content-subtle select-none">/</span>}
              {isLast || (!item.href && !item.onClick) ? (
                <span className={cn(isLast ? "text-content-primary font-semibold" : "text-content-secondary")}>
                  {item.label}
                </span>
              ) : item.onClick ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="hover:text-content-primary transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ) : (
                <a href={item.href} className="hover:text-content-primary transition-colors">
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export interface HeaderBarProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export function HeaderBar({
  title,
  subtitle,
  badge,
  actions,
  className,
  ...props
}: HeaderBarProps) {
  return (
    <header
      className={cn(
        "h-14 w-full bg-surface-base border-b border-border-default px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-content-primary tracking-tight truncate">
              {title}
            </span>
            {badge}
          </div>
          {subtitle && (
            <span className="text-2xs text-content-muted truncate">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  );
}
