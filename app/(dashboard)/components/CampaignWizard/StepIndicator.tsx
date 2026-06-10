import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const STEPS = ["Type", "Brief", "Tone & Length", "Review"];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4 mb-10">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium border transition-colors",
                  done && "bg-ember border-ember text-cream",
                  active && "border-fg bg-fg text-bg",
                  !done && !active && "border-fg/20 text-fg/40"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : step}
              </span>
              <span
                className={cn(
                  "text-sm hidden sm:block",
                  active ? "text-fg font-medium" : "text-fg/40"
                )}
              >
                {label}
              </span>
            </div>
            {step < STEPS.length && (
              <span className="h-px w-6 sm:w-10 bg-fg/15" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}
