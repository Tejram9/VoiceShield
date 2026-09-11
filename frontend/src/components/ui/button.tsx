import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    let variantStyle = "bg-[#451ebb] hover:bg-[#5d3fd3] text-white shadow-sm hover:shadow-[0_6px_16px_rgba(69,30,187,0.25)] active:scale-[0.98]";
    
    if (variant === "outline") {
      variantStyle = "bg-[#eff4ff] hover:bg-[#e6eeff] text-[#451ebb] border border-[#dee9fc] active:scale-[0.98]";
    } else if (variant === "ghost") {
      variantStyle = "bg-transparent hover:bg-[#eff4ff] text-[#484554] hover:text-[#121c2a] active:scale-[0.98]";
    } else if (variant === "destructive") {
      variantStyle = "bg-[#ba1a1a] hover:bg-[#93000a] text-white shadow-sm active:scale-[0.98]";
    }

    let sizeStyle = "px-4 py-2.5 text-sm min-h-[44px]";
    if (size === "sm") sizeStyle = "px-3 py-1.5 text-xs min-h-[36px]";
    if (size === "lg") sizeStyle = "px-6 py-3.5 text-base min-h-[48px]";
    if (size === "icon") sizeStyle = "p-2.5 min-h-[44px] min-w-[44px]";

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold rounded-[16px] transition-all focus:outline-none focus:ring-2 focus:ring-[#451ebb] focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
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
