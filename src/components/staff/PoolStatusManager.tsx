import { useState } from "react";
import { Droplets, Wind, XCircle, Sparkles, ArrowRightLeft, RefreshCw, TrendingUp, TrendingDown, Edit2, Check } from "lucide-react";
import { useSeafoodStore } from "@/hooks/useSeafoodStore";
import { VITALITY_LABELS } from "@/lib/types";
import { cn } from "@/lib/utils";

const VITALITY_CLASS: Record<string, string> = {
  alive: "vitality-dot vitality-alive",
  weak: "vitality-dot vitality-weak",
  dead: "vitality-dot vitality-dead",
  low_oxygen: "vitality-dot vitality-low-oxygen",
};

export default function PoolStatusManager() {
  const {
    seafoodList,
    updateWaterChange,
    toggleLowOxygen,
    toggleSoldOut,
    markNewArrival,
    clearNewArrival,
    temporaryTransferPool,
    revertTemporaryTransfer,
    updatePrice,
  } = useSeafoodStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [editReason, setEditReason] = useState<string>("");
  const [transferId, setTransferId] = useState<string | null>(null);
  const [transferPool, setTransferPool] = useState<string>("");

  const handleStartEditPrice = (id: string, currentPrice: number) => {
    setEditingId(id);
    setEditPrice(currentPrice.toString());
    setEditReason("");
    setTransferId(null);
  };

  const handleSavePrice = (id: string) => {
    const newPrice = parseFloat(editPrice);
    if (newPrice > 0) {
      updatePrice(id, newPrice, editReason || undefined);
    }
    setEditingId(null);
    setEditPrice("");
    setEditReason("");
  };

  const handleStartTransfer = (id: string) => {
    setTransferId(id);
    setTransferPool("");
    setEditingId(null);
  };

  const handleConfirmTransfer = (id: string) => {
    if (transferPool.trim()) {
      temporaryTransferPool(id, transferPool.trim());
    }
    setTransferId(null);
    setTransferPool("");
  };

  return (
    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
      {seafoodList.map((item) => (
        <div
          key={item.id}
          className={cn(
            "bg-ocean-900/60 rounded-lg p-3 space-y-3",
            item.isNewArrival && "ring-1 ring-emerald-500/50",
            item.isLowOxygen && "ring-1 ring-amber-500/50",
            item.isTemporaryTransferred && "ring-1 ring-blue-500/50"
          )}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{item.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-foam-200 font-medium text-sm truncate">
                  {item.name}
                </span>
                <span className="text-ocean-400 text-xs">池{item.poolNumber}</span>
                {item.isTemporaryTransferred && (
                  <span className="text-blue-400 text-xs">
                    (原{item.originalPoolNumber})
                  </span>
                )}
                {item.isSoldOut && (
                  <span className="text-amber-500 text-xs font-medium">售罄</span>
                )}
                {item.isNewArrival && (
                  <span className="text-emerald-400 text-xs font-medium">新货</span>
                )}
                {item.isLowOxygen && (
                  <span className="text-amber-400 text-xs font-medium">缺氧</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={VITALITY_CLASS[item.vitalityStatus]} />
                <span className="text-ocean-300 text-xs">
                  {VITALITY_LABELS[item.vitalityStatus]}
                </span>
                {item.eventMessage && (
                  <span className="text-ocean-400 text-xs ml-2 truncate">
                    · {item.eventMessage}
                  </span>
                )}
              </div>
            </div>
          </div>

          {editingId === item.id ? (
            <div className="bg-ocean-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-foam-300 text-sm">新价格:</span>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="flex-1 bg-ocean-950 border border-ocean-600 rounded px-2 py-1 text-foam-200 text-sm focus:outline-none focus:border-coral-500"
                  placeholder="输入新价格"
                />
                <span className="text-foam-300 text-sm">元/斤</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-foam-300 text-sm">原因:</span>
                <input
                  type="text"
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  className="flex-1 bg-ocean-950 border border-ocean-600 rounded px-2 py-1 text-foam-200 text-sm focus:outline-none focus:border-coral-500"
                  placeholder="调价原因（选填）"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSavePrice(item.id)}
                  className="staff-btn-success flex-1 flex items-center justify-center gap-1 text-xs py-2"
                >
                  <Check className="w-3.5 h-3.5" />
                  确认调价
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="staff-btn-secondary flex-1 flex items-center justify-center gap-1 text-xs py-2"
                >
                  取消
                </button>
              </div>
            </div>
          ) : null}

          {transferId === item.id ? (
            <div className="bg-ocean-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-foam-300 text-sm">新池号:</span>
                <input
                  type="text"
                  value={transferPool}
                  onChange={(e) => setTransferPool(e.target.value)}
                  className="flex-1 bg-ocean-950 border border-ocean-600 rounded px-2 py-1 text-foam-200 text-sm focus:outline-none focus:border-coral-500"
                  placeholder="例如: D2"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleConfirmTransfer(item.id)}
                  className="staff-btn-primary flex-1 flex items-center justify-center gap-1 text-xs py-2"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  确认换池
                </button>
                <button
                  onClick={() => setTransferId(null)}
                  className="staff-btn-secondary flex-1 flex items-center justify-center gap-1 text-xs py-2"
                >
                  取消
                </button>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-1.5">
            <button
              className="staff-btn-secondary flex items-center justify-center gap-1 text-xs px-2 py-1.5"
              onClick={() =>
                updateWaterChange(item.id, new Date().toISOString())
              }
            >
              <Droplets className="w-3.5 h-3.5" />
              换水
            </button>
            <button
              className={cn(
                "flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded transition-colors",
                item.isLowOxygen
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "staff-btn-danger"
              )}
              onClick={() => toggleLowOxygen(item.id)}
            >
              <Wind className="w-3.5 h-3.5" />
              {item.isLowOxygen ? "恢复" : "缺氧"}
            </button>
            <button
              className={cn(
                "flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded transition-colors",
                item.isSoldOut
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "staff-btn-danger"
              )}
              onClick={() => toggleSoldOut(item.id)}
            >
              <XCircle className="w-3.5 h-3.5" />
              {item.isSoldOut ? "补货" : "售罄"}
            </button>
            <button
              className={cn(
                "flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded transition-colors",
                item.isNewArrival
                  ? "bg-ocean-600 text-foam-200 hover:bg-ocean-500"
                  : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
              )}
              onClick={() => item.isNewArrival ? clearNewArrival(item.id) : markNewArrival(item.id)}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {item.isNewArrival ? "取消新货" : "新货到"}
            </button>
            <button
              className={cn(
                "flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded transition-colors",
                item.isTemporaryTransferred
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
              )}
              onClick={() =>
                item.isTemporaryTransferred
                  ? revertTemporaryTransfer(item.id)
                  : handleStartTransfer(item.id)
              }
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              {item.isTemporaryTransferred ? "换回原池" : "临时换池"}
            </button>
            <button
              className="staff-btn-secondary flex items-center justify-center gap-1 text-xs px-2 py-1.5"
              onClick={() => handleStartEditPrice(item.id, item.pricePerJin)}
            >
              <Edit2 className="w-3.5 h-3.5" />
              调价
            </button>
          </div>

          {item.pricePerJin !== item.originalPricePerJin && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-ocean-400">原价: ¥{item.originalPricePerJin}</span>
              <span className={item.pricePerJin > item.originalPricePerJin ? "text-amber-400" : "text-emerald-400"}>
                {item.pricePerJin > item.originalPricePerJin ? (
                  <TrendingUp className="w-3 h-3 inline" />
                ) : (
                  <TrendingDown className="w-3 h-3 inline" />
                )}
                {" "}¥{Math.abs(item.pricePerJin - item.originalPricePerJin)}
              </span>
              {item.priceChangeReason && (
                <span className="text-ocean-500">({item.priceChangeReason})</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
