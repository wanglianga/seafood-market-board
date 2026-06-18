import { useState } from "react";
import { ClipboardList, Fish, Scale } from "lucide-react";
import { useOrderStore } from "@/hooks/useOrderStore";
import { useSeafoodStore } from "@/hooks/useSeafoodStore";
import { PROCESSING_STEP_LABELS } from "@/lib/types";
import PoolStatusManager from "./PoolStatusManager";
import WeighingInput from "./WeighingInput";
import StepUpdateButtons from "./StepUpdateButtons";

const TABS = [
  { key: "orders", label: "订单管理", icon: ClipboardList },
  { key: "pool", label: "池状态", icon: Fish },
  { key: "weighing", label: "称重录入", icon: Scale },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function StaffPanel() {
  const [activeTab, setActiveTab] = useState<TabKey>("orders");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const orders = useOrderStore((s) => s.orders);
  const getSeafoodById = useSeafoodStore((s) => s.getSeafoodById);

  const activeOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "processing" || o.status === "ready"
  );

  return (
    <div className="bg-ocean-800 rounded-2xl overflow-hidden">
      <div className="flex border-b border-ocean-700">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={[
                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "text-coral-500 border-b-2 border-coral-500 bg-ocean-900/40"
                  : "text-ocean-400 hover:text-foam-200",
              ].join(" ")}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-4">
        {activeTab === "orders" && (
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {activeOrders.length === 0 && (
              <div className="text-ocean-400 text-center py-8">
                暂无进行中的订单
              </div>
            )}
            {activeOrders.map((order) => {
              const seafood = getSeafoodById(order.seafoodId);
              return (
                <div
                  key={order.id}
                  className="bg-ocean-900/60 rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-coral-500 font-bold font-price">
                        {order.queueNumber}
                      </span>
                      <span className="text-foam-200 text-sm">
                        {seafood?.emoji} {seafood?.name}
                      </span>
                    </div>
                    <span className="text-ocean-400 text-xs">
                      {PROCESSING_STEP_LABELS[order.currentStep]}
                    </span>
                  </div>
                  <StepUpdateButtons orderId={order.id} />
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "pool" && <PoolStatusManager />}

        {activeTab === "weighing" && (
          <div className="space-y-4">
            <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-1">
              {activeOrders
                .filter((o) => o.currentStep === "weighing")
                .map((order) => {
                  const seafood = getSeafoodById(order.seafoodId);
                  const isSelected = selectedOrderId === order.id;
                  return (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className={[
                        "w-full text-left bg-ocean-900/60 rounded-lg p-3 transition-colors",
                        isSelected
                          ? "ring-2 ring-coral-500"
                          : "hover:bg-ocean-900/80",
                      ].join(" ")}
                    >
                      <span className="text-coral-500 font-bold font-price">
                        {order.queueNumber}
                      </span>
                      <span className="text-foam-200 ml-2 text-sm">
                        {seafood?.emoji} {seafood?.name}
                      </span>
                    </button>
                  );
                })}
              {activeOrders.filter((o) => o.currentStep === "weighing")
                .length === 0 && (
                <div className="text-ocean-400 text-center py-4 text-sm">
                  暂无待称重订单
                </div>
              )}
            </div>
            {selectedOrderId && (
              <WeighingInput orderId={selectedOrderId} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
