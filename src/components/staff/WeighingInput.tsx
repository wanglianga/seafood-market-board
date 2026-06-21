import { useState } from "react";
import { Scale, Send, Edit3, History, ChevronDown, ChevronUp, User } from "lucide-react";
import { useOrderStore } from "@/hooks/useOrderStore";
import { useSeafoodStore } from "@/hooks/useSeafoodStore";
import { cn } from "@/lib/utils";

interface WeighingInputProps {
  orderId: string;
}

export default function WeighingInput({ orderId }: WeighingInputProps) {
  const [weight, setWeight] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [showHistory, setShowHistory] = useState(false);
  const [isModifying, setIsModifying] = useState(false);

  const order = useOrderStore((s) => s.getOrderById(orderId));
  const seafood = useSeafoodStore((s) =>
    order ? s.getSeafoodById(order.seafoodId) : undefined
  );
  const updateOrderWeight = useOrderStore((s) => s.updateOrderWeight);
  const advanceStep = useOrderStore((s) => s.advanceStep);
  const confirmWeight = useOrderStore((s) => s.confirmWeight);
  const modifyWeight = useOrderStore((s) => s.modifyWeight);

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

  const hasActualWeight = order.actualWeight != null;

  const handleSubmit = () => {
    if (numWeight <= 0) return;

    if (hasActualWeight && isModifying) {
      if (!reason.trim()) return;
      modifyWeight(orderId, numWeight, reason.trim());
      setIsModifying(false);
      setReason("");
    } else {
      updateOrderWeight(orderId, numWeight);
    }

    setWeight("");
  };

  const handleConfirmAndAdvance = () => {
    if (order.needsCustomerConfirm) {
      confirmWeight(orderId);
    }
    advanceStep(orderId);
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
  };

  const canConfirm =
    order.actualWeight != null &&
    (order.weightConfirmed || order.needsCustomerConfirm);

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
        <div className="flex items-center gap-2 mt-2 text-xs text-ocean-400">
          <span>加工方式: {order.processingMethod}</span>
          <span>·</span>
          <span>加工费: ¥{order.processingFee}</span>
        </div>
      </div>

      {hasActualWeight && (
        <div className="bg-ocean-900/60 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-foam-300 text-sm">当前称重</span>
            <div className="text-right">
              <span className="font-price text-2xl font-bold text-foam-50">
                {order.actualWeight?.toFixed(1)}斤
              </span>
              <span className="text-coral-500 font-price text-lg font-bold ml-2">
                ¥{order.actualPrice?.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ocean-400 text-xs">
              状态:{" "}
              {order.weightConfirmed ? (
                <span className="text-jade-400">已确认</span>
              ) : order.needsCustomerConfirm ? (
                <span className="text-amber-400">待顾客确认</span>
              ) : (
                <span className="text-foam-300">待确认</span>
              )}
            </span>
            {order.weightModifications.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-1 text-ocean-400 text-xs hover:text-foam-300"
              >
                <History className="w-3.5 h-3.5" />
                修改记录 ({order.weightModifications.length})
                {showHistory ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>

          {showHistory && order.weightModifications.length > 0 && (
            <div className="mt-3 pt-3 border-t border-ocean-700 space-y-2">
              {order.weightModifications.map((mod) => (
                <div
                  key={mod.id}
                  className="bg-ocean-800/50 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-ocean-400">
                      <User className="w-3 h-3" />
                      <span>{mod.modifiedBy}</span>
                    </div>
                    <span className="text-ocean-500">
                      {formatTime(mod.modifiedAt)}
                    </span>
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

      <div className="bg-ocean-900/60 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-foam-200 text-sm font-medium">
            <Scale className="w-4 h-4 text-coral-500" />
            {hasActualWeight && isModifying ? "修改重量（斤）" : "实际称重（斤）"}
          </label>
          {hasActualWeight && !isModifying && (
            <button
              onClick={() => {
                setIsModifying(true);
                setWeight(order.actualWeight?.toString() || "");
                setReason("");
              }}
              className="flex items-center gap-1 text-xs text-coral-400 hover:text-coral-300"
            >
              <Edit3 className="w-3.5 h-3.5" />
              修改重量
            </button>
          )}
        </div>

        <input
          type="number"
          step="0.1"
          min="0"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full bg-ocean-950 border border-ocean-600 rounded-lg px-4 py-3 text-foam-200 font-price text-2xl focus:outline-none focus:border-coral-500 transition-colors"
          placeholder="0.0"
        />

        {isModifying && (
          <div className="space-y-2">
            <label className="text-foam-300 text-sm">修改原因</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-ocean-950 border border-ocean-600 rounded-lg px-3 py-2 text-foam-200 text-sm focus:outline-none focus:border-coral-500 transition-colors"
              placeholder="请输入修改原因"
            />
          </div>
        )}

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

      {(!hasActualWeight || (hasActualWeight && isModifying)) && (
        <button
          className="staff-btn-primary w-full flex items-center justify-center gap-2 py-3"
          onClick={handleSubmit}
          disabled={numWeight <= 0 || (isModifying && !reason.trim())}
        >
          <Send className="w-4 h-4" />
          {hasActualWeight && isModifying ? "确认修改" : "确认称重"}
        </button>
      )}

      {isModifying && (
        <button
          onClick={() => {
            setIsModifying(false);
            setWeight("");
            setReason("");
          }}
          className="staff-btn-secondary w-full flex items-center justify-center gap-2 py-2"
        >
          取消修改
        </button>
      )}

      {canConfirm && (
        <button
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors",
            order.weightConfirmed
              ? "staff-btn-success"
              : "staff-btn-primary"
          )}
          onClick={handleConfirmAndAdvance}
        >
          <Send className="w-4 h-4" />
          {order.weightConfirmed
            ? "推进到下一步"
            : "确认并开始制作"}
        </button>
      )}
    </div>
  );
}
