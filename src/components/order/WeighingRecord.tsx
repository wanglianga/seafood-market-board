import { cn } from "@/lib/utils";
import { Scale, TrendingUp, TrendingDown } from "lucide-react";

interface WeighingRecordProps {
  estimatedWeight: number;
  actualWeight?: number;
  estimatedPrice: number;
  actualPrice?: number;
  pricePerJin: number;
  processingFee: number;
}

export default function WeighingRecord({
  estimatedWeight,
  actualWeight,
  estimatedPrice,
  actualPrice,
  pricePerJin,
  processingFee,
}: WeighingRecordProps) {
  const weightDiff =
    actualWeight != null ? actualWeight - estimatedWeight : undefined;
  const priceDiff =
    actualPrice != null ? actualPrice - estimatedPrice : undefined;

  return (
    <div className="bg-ocean-900 rounded-xl p-4 space-y-4">
      <div className="flex items-center gap-2 text-foam-200">
        <Scale className="w-4 h-4" />
        <span className="text-sm font-medium">称重记录</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="text-xs text-foam-300">预估重量</span>
          <p className="font-price text-sm text-foam-200">
            {estimatedWeight.toFixed(1)}
            <span className="text-xs ml-0.5">斤</span>
          </p>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-foam-300">实际称重</span>
          {actualWeight != null ? (
            <p className="font-price text-xl font-bold text-foam-50">
              {actualWeight.toFixed(1)}
              <span className="text-xs ml-0.5">斤</span>
            </p>
          ) : (
            <p className="font-price text-sm text-ocean-500">待称重</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="text-xs text-foam-300">预估价格</span>
          <p className="font-price text-sm text-foam-200">
            ¥{estimatedPrice.toFixed(2)}
          </p>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-foam-300">最终价格</span>
          {actualPrice != null ? (
            <p className="font-price text-xl font-bold text-foam-50">
              ¥{actualPrice.toFixed(2)}
            </p>
          ) : (
            <p className="font-price text-sm text-ocean-500">待称重</p>
          )}
        </div>
      </div>

      {weightDiff != null && priceDiff != null && (
        <div className="pt-3 border-t border-ocean-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-foam-300">差额</span>
            <div className="flex items-center gap-1.5">
              {priceDiff > 0 ? (
                <TrendingUp className="w-4 h-4 text-amber-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-jade-500" />
              )}
              <span
                className={cn(
                  "font-price text-lg font-bold",
                  priceDiff > 0 ? "text-amber-500" : "text-jade-500"
                )}
              >
                {priceDiff > 0 ? "+" : ""}¥{priceDiff.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between text-xs text-foam-300 pt-2 border-t border-ocean-700">
        <span>单价: ¥{pricePerJin.toFixed(2)}/斤</span>
        <span>加工费: ¥{processingFee.toFixed(2)}</span>
      </div>
    </div>
  );
}
