import { Droplets, Wind, XCircle } from "lucide-react";
import { useSeafoodStore } from "@/hooks/useSeafoodStore";
import { VITALITY_LABELS } from "@/lib/types";

const VITALITY_CLASS: Record<string, string> = {
  alive: "vitality-dot vitality-alive",
  weak: "vitality-dot vitality-weak",
  dead: "vitality-dot vitality-dead",
  low_oxygen: "vitality-dot vitality-low-oxygen",
};

export default function PoolStatusManager() {
  const { seafoodList, updateWaterChange, toggleLowOxygen, toggleSoldOut } =
    useSeafoodStore();

  return (
    <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
      {seafoodList.map((item) => (
        <div
          key={item.id}
          className="bg-ocean-900/60 rounded-lg p-3 flex items-center gap-3"
        >
          <span className="text-xl">{item.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-foam-200 font-medium text-sm truncate">
                {item.name}
              </span>
              <span className="text-ocean-400 text-xs">池{item.poolNumber}</span>
              {item.isSoldOut && (
                <span className="text-amber-500 text-xs font-medium">售罄</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <div className={VITALITY_CLASS[item.vitalityStatus]} />
              <span className="text-ocean-300 text-xs">
                {VITALITY_LABELS[item.vitalityStatus]}
              </span>
            </div>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button
              className="staff-btn-secondary flex items-center gap-1 text-xs px-2.5 py-1.5"
              onClick={() =>
                updateWaterChange(item.id, new Date().toISOString())
              }
            >
              <Droplets className="w-3.5 h-3.5" />
              换水
            </button>
            <button
              className="staff-btn-danger flex items-center gap-1 text-xs px-2.5 py-1.5"
              onClick={() => toggleLowOxygen(item.id)}
            >
              <Wind className="w-3.5 h-3.5" />
              缺氧切换
            </button>
            <button
              className="staff-btn-danger flex items-center gap-1 text-xs px-2.5 py-1.5"
              onClick={() => toggleSoldOut(item.id)}
            >
              <XCircle className="w-3.5 h-3.5" />
              售罄切换
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
