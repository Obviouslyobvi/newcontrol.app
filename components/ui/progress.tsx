import { cn } from "@/lib/utils/cn";

export function Progress({
  value,
  className,
}: {
  value: number; // 0-100
  className?: string;
}) {
  return (
    <div
      className={cn("h-2 w-full rounded-full bg-fg/10 overflow-hidden", className)}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-ember rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
