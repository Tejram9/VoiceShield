import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    let variantStyle = "bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/50 shadow-sm";
    
    if (variant === "outline") {
      variantStyle = "bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700";
    } else if (variant === "ghost") {
      variantStyle = "bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white";
    } else if (variant === "destructive") {
      variantStyle = "bg-rose-600 hover:bg-rose-500 text-white border border-rose-500/50 shadow-sm";
    }

    let sizeStyle = "px-4 py-2 text-sm";
    if (size === "sm") sizeStyle = "px-3 py-1.5 text-xs";
    if (size === "lg") sizeStyle = "px-6 py-3 text-base";
    if (size === "icon") sizeStyle = "p-2";

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none",
          variantStyle,
          sizeStyle,
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
