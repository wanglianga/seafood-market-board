import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useOrderStore } from "@/hooks/useOrderStore";
import { useSeafoodStore } from "@/hooks/useSeafoodStore";
import BgDecoration from "@/components/shared/BgDecoration";
import QueueDisplay from "@/components/order/QueueDisplay";
import ProcessingProgress from "@/components/order/ProcessingProgress";
import WeighingRecord from "@/components/order/WeighingRecord";

export default function OrderTrack() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getOrderById = useOrderStore((s) => s.getOrderById);
  const getSeafoodById = useSeafoodStore((s) => s.getSeafoodById);
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(timer);
  }, []);

  const order = getOrderById(id ?? "");

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-foam-300">
        <BgDecoration />
        <div className="relative z-10 text-center">
          <p className="text-xl mb-4">未找到该订单</p>
          <button onClick={() => navigate("/")} className="text-coral-500 underline">
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const seafood = getSeafoodById(order.seafoodId);

  return (
    <div className="min-h-screen relative">
      <BgDecoration />

      <div className="relative z-10">
        <div className="sticky top-0 z-20 bg-ocean-900/90 backdrop-blur-sm px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-foam-200 hover:text-foam-100">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-foam-100">订单追踪</h1>
        </div>

        <main className="container mx-auto px-4 pt-4 pb-8 space-y-6">
          <div className="bg-ocean-800 rounded-xl p-4">
            <QueueDisplay queueNumber={order.queueNumber} status={order.status} />
          </div>

          <div className="bg-ocean-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-foam-300 text-sm">海鲜</span>
              <span className="text-foam-100 font-medium">
                {seafood ? `${seafood.emoji} ${seafood.name}` : "未知海鲜"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foam-300 text-sm">加工方式</span>
              <span className="text-foam-100 text-sm">{order.processingMethod}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foam-300 text-sm">排号</span>
              <span className="text-coral-500 font-price font-bold">{order.queueNumber}</span>
            </div>
          </div>

          <div className="bg-ocean-800 rounded-xl p-4">
            <ProcessingProgress steps={order.steps} currentStep={order.currentStep} />
          </div>

          {order.actualWeight != null && seafood && (
            <WeighingRecord
              estimatedWeight={order.estimatedWeight}
              actualWeight={order.actualWeight}
              estimatedPrice={order.estimatedPrice}
              actualPrice={order.actualPrice}
              pricePerJin={seafood.pricePerJin}
              processingFee={order.processingFee}
            />
          )}

          {order.status === "ready" && (
            <div className="bg-jade-500/20 border-2 border-jade-500 rounded-xl p-6 text-center jade-glow">
              <span className="text-4xl">🟢</span>
              <p className="text-2xl font-bold text-jade-500 mt-2 jade-glow">可取餐!</p>
              <p className="text-foam-300 text-sm mt-1">
                请到取餐窗口出示排号 {order.queueNumber}
              </p>
            </div>
          )}

          {order.status === "completed" && (
            <div className="bg-ocean-800 rounded-xl p-6 text-center">
              <span className="text-4xl">✅</span>
              <p className="text-xl font-bold text-foam-200 mt-2">已取餐</p>
              <p className="text-foam-300 text-sm mt-1">感谢光临，欢迎下次再来！</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
