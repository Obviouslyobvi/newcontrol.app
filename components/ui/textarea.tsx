import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full px-4 py-3 rounded-xl bg-surface border border-fg/15 text-fg placeholder:text-fg/40 focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/20 transition-colors min-h-[96px] resize-y",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
