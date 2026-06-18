import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  isEstimated?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  showUnit?: boolean;
  weightDiff?: { min: number; max: number };
}

const sizeClasses: Record<NonNullable<PriceDisplayProps["size"]>, string> = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl",
};

export default function PriceDisplay({
  price,
  isEstimated = false,
  size = "md",
  showUnit = true,
  weightDiff,
}: PriceDisplayProps) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className={cn(
          "font-price text-coral-500 price-glow font-bold",
          sizeClasses[size]
        )}
      >
        ¥{price.toFixed(2)}
        {showUnit && (
          <span className="text-sm font-normal text-foam-300 ml-1">/斤</span>
        )}
      </span>

      {isEstimated && (
        <span className="warning-glow text-amber-500 font-bold text-sm flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded">
          ⚠ 以实际称重为准
        </span>
      )}

      {weightDiff && (
        <span className="text-xs text-amber-500/80">
          重量差额范围: ¥{weightDiff.min.toFixed(2)} ~ ¥{weightDiff.max.toFixed(2)}
        </span>
      )}
    </div>
  );
}
