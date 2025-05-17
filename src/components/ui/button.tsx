import { cn } from "@/lib/utils"; // utility to join classNames (optional)
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors \
      focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 \
      disabled:pointer-events-none h-10 px-4 py-2 cursor-pointer";

    const variants = {
      default: "bg-gray-900 text-white hover:bg-gray-800",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
