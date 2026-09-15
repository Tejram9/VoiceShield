import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    let variantStyle = "bg-blue-600 hover:bg-blue-500 text-white shadow-subtle border border-blue-500/40";
    
    if (variant === "outline") {
      variantStyle = "bg-soc-850 hover:bg-soc-800 text-soc-200 hover:text-white border border-soc-700";
    } else if (variant === "ghost") {
      variantStyle = "bg-transparent hover:bg-soc-800 text-soc-300 hover:text-white";
    } else if (variant === "destructive") {
      variantStyle = "bg-rose-600 hover:bg-rose-500 text-white shadow-subtle border border-rose-500/40";
    }

    let sizeStyle = "px-3.5 py-2 text-xs min-h-[38px]";
    if (size === "sm") sizeStyle = "px-2.5 py-1.5 text-[11px] min-h-[32px]";
    if (size === "lg") sizeStyle = "px-5 py-2.5 text-sm min-h-[44px]";
    if (size === "icon") sizeStyle = "p-2 min-h-[36px] min-w-[36px]";

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
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
