import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Clock, AlertTriangle, Sparkles, ArrowRight, Droplets, RefreshCw } from "lucide-react";
import { useSeafoodStore } from "@/hooks/useSeafoodStore";
import { useOrderStore } from "@/hooks/useOrderStore";
import BgDecoration from "@/components/shared/BgDecoration";
import VitalityIndicator from "@/components/seafood/VitalityIndicator";
import PriceDisplay from "@/components/shared/PriceDisplay";
import { cn } from "@/lib/utils";

export default function SeafoodDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getSeafoodById = useSeafoodStore((s) => s.getSeafoodById);
  const getSubstituteInfo = useSeafoodStore((s) => s.getSubstituteInfo);
  const createOrder = useOrderStore((s) => s.createOrder);
  const seafood = getSeafoodById(id ?? "");
  const substitute = seafood ? getSubstituteInfo(seafood.id) : undefined;
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (!seafood) {
    return (
      <div className="min-h-screen flex items-center justify-center text-foam-300">
        <BgDecoration />
        <div className="relative z-10 text-center">
          <p className="text-xl mb-4">未找到该海鲜</p>
          <button onClick={() => navigate("/")} className="text-coral-500 underline">
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const method = seafood.processingMethods.find((m) => m.id === selectedMethod);
  const processingFee = method?.fee ?? 0;
  const avgWeight = (seafood.weightMin + seafood.weightMax) / 2;
  const estimatedWeight = avgWeight * quantity;
  const estimatedPrice = Math.round(estimatedWeight * seafood.pricePerJin + processingFee);
  const minPrice = Math.round(seafood.weightMin * quantity * seafood.pricePerJin + processingFee);
  const maxPrice = Math.round(seafood.weightMax * quantity * seafood.pricePerJin + processingFee);
  const weightDiffMin = Math.round((seafood.weightMin - avgWeight) * quantity * seafood.pricePerJin);
  const weightDiffMax = Math.round((seafood.weightMax - avgWeight) * quantity * seafood.pricePerJin);

  const handleOrder = () => {
    if (!selectedMethod) return;
    const order = createOrder(seafood.id, estimatedWeight, method!.name, processingFee);
    navigate(`/order/${order.id}`);
  };

  const getEventInfo = () => {
    if (seafood.isNewArrival) {
      return {
        icon: Sparkles,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/20",
        borderColor: "border-emerald-500",
        label: "新货到港",
        message: seafood.eventMessage || "新鲜直达，品质更佳",
      };
    }
    if (seafood.isLowOxygen) {
      return {
        icon: AlertTriangle,
        color: "text-amber-400",
        bgColor: "bg-amber-500/20",
        borderColor: "border-amber-500",
        label: "含氧量偏低",
        message: seafood.eventMessage || "正在处理中，可能影响品质",
      };
    }
    if (seafood.isTemporaryTransferred) {
      return {
        icon: ArrowRight,
        color: "text-blue-400",
        bgColor: "bg-blue-500/20",
        borderColor: "border-blue-500",
        label: "临时换池",
        message: seafood.eventMessage || "原池清洁维护中",
      };
    }
    return null;
  };

  const eventInfo = getEventInfo();

  return (
    <div className="min-h-screen relative">
      <BgDecoration />

      <div className="relative z-10">
        <div className="sticky top-0 z-20 bg-ocean-900/90 backdrop-blur-sm px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-foam-200 hover:text-foam-100">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-foam-100">海鲜详情</h1>
        </div>

        <main className="container mx-auto px-4 pb-32 space-y-6">
          <div className="flex items-center gap-4 pt-4">
            <span className="text-6xl">{seafood.emoji}</span>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foam-100">{seafood.name}</h2>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <VitalityIndicator status={seafood.vitalityStatus} showLabel size="md" />
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
            </div>
          </div>

          {eventInfo && (
            <div className={cn(
              "border-l-4 rounded-r-lg p-4",
              eventInfo.bgColor,
              eventInfo.borderColor,
              "border-l-4"
            )}>
              <div className="flex items-center gap-2">
                <eventInfo.icon className={cn("w-5 h-5", eventInfo.color)} />
                <span className={cn("font-bold", eventInfo.color)}>{eventInfo.label}</span>
              </div>
              <p className="text-foam-300 text-sm mt-1">{eventInfo.message}</p>
              {seafood.arrivalTime && (
                <p className="text-foam-400 text-xs mt-1">到货时间: {seafood.arrivalTime}</p>
              )}
            </div>
          )}

          {seafood.needsOrderReconfirm && (
            <div className="bg-amber-500/20 border-2 border-amber-500 rounded-xl p-4">
              <div className="flex items-center gap-2 text-amber-400">
                <RefreshCw className="w-5 h-5" />
                <span className="font-bold">需重新确认订单</span>
              </div>
              <p className="text-amber-300/80 text-sm mt-1">
                由于当前海鲜状态变化，已预订的订单可能需要重新确认或更换品种
              </p>
            </div>
          )}

          <div className="bg-ocean-800 rounded-xl p-6">
            <PriceDisplay
              price={seafood.pricePerJin}
              isEstimated
              size="xl"
              weightDiff={{ min: weightDiffMin, max: weightDiffMax }}
            />
            <p className="text-foam-300 text-sm mt-2">
              重量范围: {seafood.weightMin}-{seafood.weightMax}{seafood.unit}
            </p>
            {seafood.pricePerJin !== seafood.originalPricePerJin && (
              <p className="text-amber-400 text-sm mt-1">
                原价: ¥{seafood.originalPricePerJin}/斤
                {seafood.priceChangeReason && ` (${seafood.priceChangeReason})`}
              </p>
            )}
            <div className="mt-4 bg-amber-500/15 border-l-4 border-amber-500 rounded-r-lg p-4">
              <p className="text-amber-500 font-bold text-base warning-glow">
                ⚠ 此为预估价格，以实际称重为准
              </p>
              <p className="text-amber-400/80 text-sm mt-1">
                价格范围: ¥{minPrice} ~ ¥{maxPrice}
              </p>
            </div>
          </div>

          {substitute && (
            <div className="bg-ocean-800 rounded-xl p-4">
              <h3 className="text-lg font-bold text-foam-100 mb-3 flex items-center gap-2">
                🔄 推荐替代品种
              </h3>
              <Link
                to={`/seafood/${substitute.id}`}
                className="flex items-center gap-4 bg-ocean-900/60 rounded-xl p-4 hover:bg-ocean-900/80 transition-colors"
              >
                <span className="text-5xl">{substitute.emoji}</span>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-foam-100">{substitute.name}</h4>
                  <p className="text-sm text-foam-400">{substitute.specDiff}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-price text-xl text-coral-500 font-bold">
                      ¥{substitute.pricePerJin}/斤
                    </span>
                    <span className={cn(
                      "text-sm",
                      substitute.priceDiff > 0 ? "text-amber-400" : "text-jade-400"
                    )}>
                      {substitute.priceDiff > 0 ? "贵" : "便宜"} ¥{Math.abs(substitute.priceDiff)}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-foam-400" />
              </Link>
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold text-foam-100 mb-3">加工方式</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {seafood.processingMethods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id)}
                  className={cn(
                    "text-left bg-ocean-800 rounded-xl p-4 border-2 transition-all",
                    selectedMethod === m.id
                      ? "border-coral-500 shadow-lg shadow-coral-500/10"
                      : "border-transparent hover:border-ocean-600"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foam-100">{m.name}</span>
                    <span className="text-coral-500 font-price text-sm">
                      +¥{m.fee}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-foam-300">
                    <Clock size={12} />
                    <span>约{m.estimatedMinutes}分钟</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-foam-100 mb-3">数量</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg bg-ocean-800 text-foam-200 flex items-center justify-center hover:bg-ocean-700"
              >
                <Minus size={18} />
              </button>
              <span className="text-2xl font-bold text-foam-100 w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(5, quantity + 1))}
                className="w-10 h-10 rounded-lg bg-ocean-800 text-foam-200 flex items-center justify-center hover:bg-ocean-700"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="bg-ocean-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-foam-300">预估总价</span>
              <PriceDisplay price={estimatedPrice} size="lg" showUnit={false} />
            </div>
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 z-20 bg-ocean-900/95 backdrop-blur-sm border-t border-ocean-700/50 p-4">
          <div className="container mx-auto">
            <button
              onClick={handleOrder}
              disabled={!selectedMethod || seafood.isSoldOut}
              className={cn(
                "w-full py-3.5 rounded-xl text-lg font-bold transition-all",
                selectedMethod && !seafood.isSoldOut
                  ? "bg-coral-500 text-white hover:bg-coral-600 active:scale-[0.98]"
                  : "bg-ocean-700 text-ocean-400 cursor-not-allowed"
              )}
            >
              {seafood.isSoldOut ? "已售罄" : "预订"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
