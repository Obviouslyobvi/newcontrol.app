import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-fg text-bg hover:bg-ember hover:text-cream",
        secondary: "border border-fg/15 text-fg hover:bg-fg/5",
        ghost: "text-fg/70 hover:text-fg hover:bg-fg/5",
        danger: "bg-ember text-cream hover:bg-ember/90",
      },
      size: {
        sm: "text-sm px-4 py-2 rounded-full",
        md: "text-sm px-5 py-2.5 rounded-full",
        lg: "text-base px-7 py-3.5 rounded-full",
        icon: "h-9 w-9 rounded-full",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { buttonVariants };
