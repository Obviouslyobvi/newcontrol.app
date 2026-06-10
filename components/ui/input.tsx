import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full px-4 py-2.5 rounded-xl bg-surface border border-fg/15 text-fg placeholder:text-fg/40 focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/20 transition-colors",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
