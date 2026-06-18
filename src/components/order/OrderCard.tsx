import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  PROCESSING_STEPS,
  PROCESSING_STEP_LABELS,
  type Order,
} from "@/lib/types";
import { useSeafoodStore } from "@/hooks/useSeafoodStore";

const STATUS_BORDER: Record<Order["status"], string> = {
  pending: "border-l-yellow-400",
  processing: "border-l-coral-500",
  ready: "border-l-jade-500",
  completed: "border-l-gray-500",
  cancelled: "border-l-gray-600",
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "刚刚";
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  return `${Math.floor(diff / 86400)}天前`;
}

export default function OrderCard({ order }: { order: Order }) {
  const seafood = useSeafoodStore((s) => s.getSeafoodById(order.seafoodId));
  const currentIdx = PROCESSING_STEPS.indexOf(order.currentStep);

  return (
    <Link
      to={`/order/${order.id}`}
      className={cn(
        "block bg-ocean-900 rounded-xl border-l-4 p-4 card-hover",
        STATUS_BORDER[order.status]
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="font-price text-xl font-bold text-coral-500">
          {order.queueNumber}
        </span>
        <span className="text-xs text-foam-300">
          {timeAgo(order.createdAt)}
        </span>
      </div>

      <div className="space-y-1 mb-3">
        <p className="text-sm font-medium text-foam-100">
          {seafood ? `${seafood.emoji} ${seafood.name}` : "未知海鲜"}
        </p>
        <p className="text-xs text-foam-300">{order.processingMethod}</p>
      </div>

      <div className="flex items-center gap-1.5">
        {PROCESSING_STEPS.map((step, idx) => {
          const stepRecord = order.steps.find(
            (s) => s.stepName === step
          );
          const isCompleted = stepRecord?.status === "completed";
          const isActive = step === order.currentStep;

          return (
            <div key={step} className="flex items-center gap-1.5">
              <div
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  isCompleted && "bg-jade-500",
                  isActive && "bg-coral-500 animate-breathe",
                  !isCompleted && !isActive && "bg-ocean-600"
                )}
                title={PROCESSING_STEP_LABELS[step]}
              />
              {idx < PROCESSING_STEPS.length - 1 && (
                <div
                  className={cn(
                    "w-3 h-0.5",
                    idx < currentIdx ? "bg-jade-500" : "bg-ocean-600"
                  )}
                />
              )}
            </div>
          );
        })}
        <span className="text-xs text-foam-300 ml-1">
          {PROCESSING_STEP_LABELS[order.currentStep]}
        </span>
      </div>
    </Link>
  );
}
