import { useEffect, useState } from "react";
import { useSeafoodStore } from "@/hooks/useSeafoodStore";
import { useOrderStore } from "@/hooks/useOrderStore";
import BgDecoration from "@/components/shared/BgDecoration";
import VitalityIndicator from "@/components/seafood/VitalityIndicator";
import { cn } from "@/lib/utils";

export default function BoardView() {
  const seafoodList = useSeafoodStore((s) => s.seafoodList);
  const orders = useOrderStore((s) => s.orders);
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(timer);
  }, []);

  const readyOrders = orders.filter((o) => o.status === "ready");

  return (
    <div className="min-h-screen bg-ocean-950 relative overflow-hidden">
      <BgDecoration />

      <div className="relative z-10 flex flex-col h-screen p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foam-100">
            🐟 海鲜市集 今日时价
          </h1>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {seafoodList.map((seafood) => (
              <div
                key={seafood.id}
                className={cn(
                  "bg-ocean-800/80 rounded-2xl p-6 backdrop-blur-sm relative",
                  seafood.isSoldOut && "opacity-50"
                )}
              >
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

                <span className="text-xs text-foam-300 bg-ocean-700 px-2 py-0.5 rounded-full">
                  池 {seafood.poolNumber}
                </span>

                <div className="mt-4">
                  <span className="font-price text-5xl font-bold text-coral-500 price-glow">
                    ¥{seafood.pricePerJin}
                  </span>
                  <span className="text-sm text-foam-300 ml-1">/斤</span>
                </div>

                <p className="text-sm text-foam-300 mt-1">
                  {seafood.weightMin}-{seafood.weightMax}{seafood.unit}
                </p>
              </div>
            ))}
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
