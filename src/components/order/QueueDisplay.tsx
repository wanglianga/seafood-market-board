import { cn } from "@/lib/utils";
import type { Order } from "@/lib/types";

interface QueueDisplayProps {
  queueNumber: string;
  status: Order["status"];
}

const STATUS_CONFIG: Record<
  Order["status"],
  { label: string; bgClass: string; textClass: string; pulse: boolean }
> = {
  pending: {
    label: "待处理",
    bgClass: "bg-yellow-500/20",
    textClass: "text-yellow-400",
    pulse: false,
  },
  waiting_confirm: {
    label: "待确认称重",
    bgClass: "bg-amber-500/20",
    textClass: "text-amber-400",
    pulse: true,
  },
  processing: {
    label: "加工中",
    bgClass: "bg-coral-500/20",
    textClass: "text-coral-500",
    pulse: false,
  },
  ready: {
    label: "可取餐",
    bgClass: "bg-jade-500/20",
    textClass: "text-jade-500",
    pulse: true,
  },
  completed: {
    label: "已完成",
    bgClass: "bg-gray-500/20",
    textClass: "text-gray-400",
    pulse: false,
  },
  cancelled: {
    label: "已取消",
    bgClass: "bg-gray-500/20",
    textClass: "text-gray-500",
    pulse: false,
  },
};

export default function QueueDisplay({
  queueNumber,
  status,
}: QueueDisplayProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="animate-flip-in">
        <span className="font-price text-7xl font-bold text-coral-500 price-glow leading-none">
          {queueNumber}
        </span>
      </div>

      <div className="relative">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium",
            config.bgClass,
            config.textClass
          )}
        >
          {config.label}
        </span>
        {config.pulse && (
          <span className="absolute inset-0 rounded-full border-2 border-jade-500 animate-pulse-ring" />
        )}
      </div>
    </div>
  );
}
