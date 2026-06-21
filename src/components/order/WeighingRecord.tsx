import { useState } from "react";
import { cn } from "@/lib/utils";
import { Scale, TrendingUp, TrendingDown, Clock, ChefHat, Ticket, ChevronDown, ChevronUp, User, History } from "lucide-react";
import type { WeightModificationRecord } from "@/lib/types";

interface WeighingRecordProps {
  estimatedWeight: number;
  actualWeight?: number;
  estimatedPrice: number;
  actualPrice?: number;
  pricePerJin: number;
  processingFee: number;
  queueNumber?: string;
  processingMethod?: string;
  needsConfirm?: boolean;
  weightConfirmed?: boolean;
  weightModifications?: WeightModificationRecord[];
  onConfirm?: () => void;
}

export default function WeighingRecord({
  estimatedWeight,
  actualWeight,
  estimatedPrice,
  actualPrice,
  pricePerJin,
  processingFee,
  queueNumber,
  processingMethod,
  needsConfirm,
  weightConfirmed,
  weightModifications = [],
  onConfirm,
}: WeighingRecordProps) {
  const [showHistory, setShowHistory] = useState(false);

  const weightDiff =
    actualWeight != null ? actualWeight - estimatedWeight : undefined;
  const priceDiff =
    actualPrice != null ? actualPrice - estimatedPrice : undefined;

  const isSupplement = priceDiff != null && priceDiff > 0;
  const isRefund = priceDiff != null && priceDiff < 0;

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="bg-ocean-900 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foam-200">
          <Scale className="w-4 h-4" />
          <span className="text-sm font-medium">称重记录</span>
        </div>
        {weightConfirmed && (
          <span className="text-xs bg-jade-500/20 text-jade-400 px-2 py-0.5 rounded-full">
            已确认
          </span>
        )}
        {needsConfirm && !weightConfirmed && (
          <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full animate-pulse">
            待确认
          </span>
        )}
      </div>

      {queueNumber && (
        <div className="flex items-center justify-between bg-ocean-800/50 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 text-foam-300 text-sm">
            <Ticket className="w-4 h-4 text-coral-500" />
            <span>排号</span>
          </div>
          <span className="font-price text-xl font-bold text-coral-500 price-glow">
            {queueNumber}
          </span>
        </div>
      )}

      {processingMethod && (
        <div className="flex items-center justify-between bg-ocean-800/50 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 text-foam-300 text-sm">
            <ChefHat className="w-4 h-4 text-foam-400" />
            <span>加工方式</span>
          </div>
          <span className="text-foam-200 text-sm font-medium">
            {processingMethod}
          </span>
        </div>
      )}

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
        <div className="pt-3 border-t border-ocean-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-foam-300">重量差异</span>
            <div className="flex items-center gap-1.5">
              {weightDiff > 0 ? (
                <TrendingUp className="w-4 h-4 text-amber-500" />
              ) : weightDiff < 0 ? (
                <TrendingDown className="w-4 h-4 text-jade-500" />
              ) : null}
              <span
                className={cn(
                  "font-price font-bold",
                  weightDiff > 0
                    ? "text-amber-500"
                    : weightDiff < 0
                    ? "text-jade-500"
                    : "text-foam-400"
                )}
              >
                {weightDiff > 0 ? "+" : ""}
                {weightDiff.toFixed(1)}斤
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-foam-300">价格差额</span>
            <div className="flex items-center gap-1.5">
              {priceDiff > 0 ? (
                <TrendingUp className="w-4 h-4 text-amber-500" />
              ) : priceDiff < 0 ? (
                <TrendingDown className="w-4 h-4 text-jade-500" />
              ) : null}
              <span
                className={cn(
                  "font-price text-lg font-bold",
                  priceDiff > 0
                    ? "text-amber-500"
                    : priceDiff < 0
                    ? "text-jade-500"
                    : "text-foam-400"
                )}
              >
                {priceDiff > 0 ? "+" : ""}¥{priceDiff.toFixed(2)}
              </span>
            </div>
          </div>

          {isSupplement && (
            <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-amber-400">
                <TrendingUp className="w-4 h-4" />
                <span className="font-bold text-sm">需补差价</span>
              </div>
              <p className="font-price text-2xl font-bold text-amber-500 mt-1">
                ¥{Math.abs(priceDiff).toFixed(2)}
              </p>
              <p className="text-amber-300/70 text-xs mt-1">
                请到档口支付差价后开始制作
              </p>
            </div>
          )}

          {isRefund && (
            <div className="bg-jade-500/20 border border-jade-500/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-jade-400">
                <TrendingDown className="w-4 h-4" />
                <span className="font-bold text-sm">应退金额</span>
              </div>
              <p className="font-price text-2xl font-bold text-jade-500 mt-1">
                ¥{Math.abs(priceDiff).toFixed(2)}
              </p>
              <p className="text-jade-300/70 text-xs mt-1">
                取餐时统一退还差价
              </p>
            </div>
          )}
        </div>
      )}

      {needsConfirm && !weightConfirmed && onConfirm && (
        <button
          onClick={onConfirm}
          className="w-full py-3 rounded-xl bg-coral-500 text-white font-bold hover:bg-coral-600 active:scale-[0.98] transition-all"
        >
          确认称重并开始制作
        </button>
      )}

      {weightModifications.length > 0 && (
        <div className="pt-3 border-t border-ocean-700">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between text-foam-300 text-sm"
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span>重量修改记录 ({weightModifications.length})</span>
            </div>
            {showHistory ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showHistory && (
            <div className="mt-3 space-y-2">
              {weightModifications.map((mod, index) => (
                <div
                  key={mod.id}
                  className="bg-ocean-800/50 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-ocean-400">
                      <User className="w-3 h-3" />
                      <span>{mod.modifiedBy}</span>
                    </div>
                    <div className="flex items-center gap-1 text-ocean-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(mod.modifiedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foam-400">
                      {mod.previousWeight.toFixed(1)}斤 →{" "}
                      <span className="text-foam-200 font-medium">
                        {mod.newWeight.toFixed(1)}斤
                      </span>
                    </span>
                    <span
                      className={cn(
                        "font-price font-bold",
                        mod.newPrice > mod.previousPrice
                          ? "text-amber-400"
                          : "text-jade-400"
                      )}
                    >
                      {mod.newPrice > mod.previousPrice ? "+" : ""}¥
                      {Math.abs(mod.newPrice - mod.previousPrice).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-ocean-400 bg-ocean-900/50 rounded px-2 py-1">
                    原因: {mod.reason}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between text-xs text-foam-300 pt-2 border-t border-ocean-700">
        <span>单价: ¥{pricePerJin.toFixed(2)}/斤</span>
        <span>加工费: ¥{processingFee.toFixed(2)}</span>
      </div>
    </div>
  );
}
