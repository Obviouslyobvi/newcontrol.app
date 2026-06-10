import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        "w-full appearance-none px-4 py-2.5 pr-10 rounded-xl bg-surface border border-fg/15 text-fg focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/20 transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fg/40" />
  </div>
));
Select.displayName = "Select";
