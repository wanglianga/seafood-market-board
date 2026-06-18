import { useState } from "react";
import { Scale, Send } from "lucide-react";
import { useOrderStore } from "@/hooks/useOrderStore";
import { useSeafoodStore } from "@/hooks/useSeafoodStore";

interface WeighingInputProps {
  orderId: string;
}

export default function WeighingInput({ orderId }: WeighingInputProps) {
  const [weight, setWeight] = useState<string>("");
  const order = useOrderStore((s) => s.getOrderById(orderId));
  const seafood = useSeafoodStore((s) =>
    order ? s.getSeafoodById(order.seafoodId) : undefined
  );
  const updateOrderWeight = useOrderStore((s) => s.updateOrderWeight);
  const advanceStep = useOrderStore((s) => s.advanceStep);

  if (!order || !seafood) {
    return (
      <div className="text-ocean-400 text-center py-8">
        请先选择一个订单
      </div>
    );
  }

  const numWeight = parseFloat(weight) || 0;
  const calculatedPrice = Math.round(
    numWeight * seafood.pricePerJin + order.processingFee
  );

  const handleSubmit = () => {
    if (numWeight <= 0) return;
    updateOrderWeight(orderId, numWeight);
    advanceStep(orderId);
    setWeight("");
  };

  return (
    <div className="space-y-4">
      <div className="bg-ocean-900/60 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-coral-500 font-bold text-lg font-price">
              {order.queueNumber}
            </span>
            <span className="text-foam-200 ml-3 font-medium">
              {seafood.emoji} {seafood.name}
            </span>
          </div>
          <span className="text-ocean-300 text-sm">
            参考重量: {order.estimatedWeight}{seafood.unit}
          </span>
        </div>
      </div>

      <div className="bg-ocean-900/60 rounded-lg p-4 space-y-3">
        <label className="flex items-center gap-2 text-foam-200 text-sm font-medium">
          <Scale className="w-4 h-4 text-coral-500" />
          实际称重（斤）
        </label>
        <input
          type="number"
          step="0.1"
          min="0"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full bg-ocean-950 border border-ocean-600 rounded-lg px-4 py-3 text-foam-200 font-price text-2xl focus:outline-none focus:border-coral-500 transition-colors"
          placeholder="0.0"
        />

        {numWeight > 0 && (
          <div className="flex items-center justify-between bg-ocean-950/50 rounded-lg px-4 py-2">
            <span className="text-ocean-300 text-sm">实时价格</span>
            <span className="text-coral-500 font-price text-xl font-bold price-glow">
              ¥{calculatedPrice}
            </span>
          </div>
        )}

        <div className="text-ocean-400 text-xs">
          单价: ¥{seafood.pricePerJin}/斤 + 加工费: ¥{order.processingFee}
        </div>
      </div>

      <button
        className="staff-btn-primary w-full flex items-center justify-center gap-2 py-3"
        onClick={handleSubmit}
        disabled={numWeight <= 0}
      >
        <Send className="w-4 h-4" />
        确认称重并推进
      </button>
    </div>
  );
}
