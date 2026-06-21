import { useEffect, useState } from "react";
import { useSeafoodStore } from "@/hooks/useSeafoodStore";
import { useOrderStore } from "@/hooks/useOrderStore";
import BgDecoration from "@/components/shared/BgDecoration";
import VitalityIndicator from "@/components/seafood/VitalityIndicator";
import { cn } from "@/lib/utils";
import { AlertTriangle, Sparkles, ArrowRight, XCircle, Droplets } from "lucide-react";

export default function BoardView() {
  const seafoodList = useSeafoodStore((s) => s.seafoodList);
  const orders = useOrderStore((s) => s.orders);
  const getSubstituteInfo = useSeafoodStore((s) => s.getSubstituteInfo);
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(timer);
  }, []);

  const readyOrders = orders.filter((o) => o.status === "ready");

  const getEventBadge = (seafood: typeof seafoodList[0]) => {
    if (seafood.isNewArrival) {
      return (
        <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-20 animate-pulse">
          <Sparkles className="w-3 h-3" />
          新货
        </div>
      );
    }
    if (seafood.isLowOxygen) {
      return (
        <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-20 animate-pulse">
          <AlertTriangle className="w-3 h-3" />
          缺氧
        </div>
      );
    }
    if (seafood.isTemporaryTransferred) {
      return (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-20">
          <ArrowRight className="w-3 h-3" />
          换池
        </div>
      );
    }
    if (seafood.isSoldOut) {
      return (
        <div className="absolute -top-2 -right-2 bg-ocean-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-20">
          <XCircle className="w-3 h-3" />
          售罄
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-ocean-950 relative overflow-hidden">
      <BgDecoration />

      <div className="relative z-10 flex flex-col h-screen p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foam-100">
            🐟 海鲜市集 今日时价
          </h1>
          <p className="text-foam-400 mt-2 text-sm">
            实时更新 · 鲜活保证 · 称重计价
          </p>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {seafoodList.map((seafood) => {
              const substitute = seafood.isSoldOut || seafood.isLowOxygen
                ? getSubstituteInfo(seafood.id)
                : undefined;

              return (
                <div
                  key={seafood.id}
                  className={cn(
                    "bg-ocean-800/80 rounded-2xl p-6 backdrop-blur-sm relative",
                    seafood.isSoldOut && "opacity-60",
                    seafood.isNewArrival && "ring-2 ring-emerald-500/50",
                    seafood.isLowOxygen && "ring-2 ring-amber-500/50"
                  )}
                >
                  {getEventBadge(seafood)}

                  {seafood.isSoldOut && (
                    <div className="absolute inset-0 bg-ocean-950/70 rounded-2xl flex items-center justify-center z-10">
                      <span className="text-3xl font-bold text-amber-500">售罄</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <span className="text-5xl">{seafood.emoji}</span>
                    <VitalityIndicator status={seafood.vitalityStatus} showLabel size="sm" />
                  </div>

                  <h3 className="text-xl font-bold text-foam-100 mb-1">
                    {seafood.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-foam-300 bg-ocean-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Droplets className="w-3 h-3" />
                      池 {seafood.poolNumber}
                    </span>
                    {seafood.isTemporaryTransferred && (
                      <span className="text-xs text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded-full">
                        原池: {seafood.originalPoolNumber}
                      </span>
                    )}
                  </div>

                  {seafood.eventMessage && !seafood.isSoldOut && (
                    <div className={cn(
                      "text-xs mb-3 px-2 py-1 rounded",
                      seafood.isLowOxygen && "bg-amber-500/20 text-amber-400",
                      seafood.isTemporaryTransferred && "bg-blue-500/20 text-blue-400",
                      seafood.isNewArrival && "bg-emerald-500/20 text-emerald-400"
                    )}>
                      {seafood.eventMessage}
                    </div>
                  )}

                  <div className="mt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-price text-5xl font-bold text-coral-500 price-glow">
                        ¥{seafood.pricePerJin}
                      </span>
                      <span className="text-sm text-foam-300">/斤</span>
                    </div>
                    {seafood.pricePerJin !== seafood.originalPricePerJin && (
                      <span className="text-xs text-amber-400">
                        原价 ¥{seafood.originalPricePerJin}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-foam-300 mt-1">
                    {seafood.weightMin}-{seafood.weightMax}{seafood.unit}
                  </p>

                  {substitute && (
                    <div className="mt-4 pt-4 border-t border-ocean-700/50">
                      <p className="text-xs text-foam-400 mb-2">推荐替代：</p>
                      <div className="flex items-center gap-2 bg-ocean-900/50 rounded-lg p-2">
                        <span className="text-2xl">{substitute.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foam-200 truncate">
                            {substitute.name}
                          </p>
                          <p className="text-xs text-foam-400">
                            ¥{substitute.pricePerJin}/斤
                            <span className={cn(
                              "ml-1",
                              substitute.priceDiff > 0 ? "text-amber-400" : "text-jade-400"
                            )}>
                              ({substitute.priceDiff > 0 ? "+" : ""}¥{substitute.priceDiff})
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {readyOrders.length > 0 && (
          <div className="mt-6 pt-6 border-t border-ocean-700/50">
            <h2 className="text-xl font-bold text-jade-500 mb-3">🟢 可取餐</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {readyOrders.map((order) => (
                <span
                  key={order.id}
                  className="bg-jade-500 text-white font-price text-2xl font-bold px-6 py-3 rounded-xl jade-glow shrink-0"
                >
                  {order.queueNumber}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
