import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Order, ProcessingStepRecord, WeightModificationRecord } from "@/lib/types";
import { MOCK_ORDERS, createMockOrder } from "@/lib/mockData";
import { useSeafoodStore } from "./useSeafoodStore";

interface OrderState {
  orders: Order[];
  currentQueueNumber: number;
  createOrder: (
    seafoodId: string,
    estimatedWeight: number,
    processingMethod: string,
    processingFee: number
  ) => Order;
  updateOrderWeight: (orderId: string, actualWeight: number, reason?: string) => void;
  confirmWeight: (orderId: string) => void;
  modifyWeight: (orderId: string, newWeight: number, reason: string, modifiedBy?: string) => void;
  advanceStep: (orderId: string) => void;
  completeOrder: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByStatus: (status: Order["status"]) => Order[];
  getWeightDiff: (orderId: string) => { weightDiff: number; priceDiff: number } | undefined;
}

const ORDER_STORE_KEY = "seafood-order-store";

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
  orders: MOCK_ORDERS,
  currentQueueNumber: 105,

  createOrder: (seafoodId, estimatedWeight, processingMethod, processingFee) => {
    const seafood = useSeafoodStore.getState().getSeafoodById(seafoodId);
    if (!seafood) throw new Error("Seafood not found");

    const estimatedPrice = Math.round(estimatedWeight * seafood.pricePerJin + processingFee);
    const order = createMockOrder(seafoodId, estimatedWeight, processingMethod, processingFee);
    order.estimatedPrice = estimatedPrice;

    set((state) => ({
      orders: [...state.orders, order],
      currentQueueNumber: state.currentQueueNumber + 1,
    }));

    return order;
  },

  updateOrderWeight: (orderId, actualWeight, reason) =>
    set((state) => ({
      orders: state.orders.map((o) => {
        if (o.id !== orderId) return o;
        const seafood = useSeafoodStore.getState().getSeafoodById(o.seafoodId);
        if (!seafood) return o;
        const actualPrice = Math.round(actualWeight * seafood.pricePerJin + o.processingFee);
        const priceDiff = actualPrice - o.estimatedPrice;
        const needsCustomerConfirm = Math.abs(priceDiff) > 5;

        return {
          ...o,
          actualWeight,
          actualPrice,
          supplementAmount: priceDiff > 0 ? priceDiff : undefined,
          refundAmount: priceDiff < 0 ? Math.abs(priceDiff) : undefined,
          needsCustomerConfirm,
          status: needsCustomerConfirm ? "waiting_confirm" : o.status,
        };
      }),
    })),

  confirmWeight: (orderId) =>
    set((state) => ({
      orders: state.orders.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          weightConfirmed: true,
          needsCustomerConfirm: false,
          status: o.currentStep === "weighing" ? "pending" : o.status,
        };
      }),
    })),

  modifyWeight: (orderId, newWeight, reason, modifiedBy = "员工") =>
    set((state) => ({
      orders: state.orders.map((o) => {
        if (o.id !== orderId) return o;
        const seafood = useSeafoodStore.getState().getSeafoodById(o.seafoodId);
        if (!seafood) return o;

        const previousWeight = o.actualWeight ?? o.estimatedWeight;
        const previousPrice = o.actualPrice ?? o.estimatedPrice;
        const newPrice = Math.round(newWeight * seafood.pricePerJin + o.processingFee);

        const modification: WeightModificationRecord = {
          id: `WM-${Date.now()}`,
          previousWeight,
          newWeight,
          previousPrice,
          newPrice,
          reason,
          modifiedAt: new Date().toISOString(),
          modifiedBy,
        };

        const priceDiff = newPrice - o.estimatedPrice;

        return {
          ...o,
          actualWeight: newWeight,
          actualPrice: newPrice,
          weightModifications: [...o.weightModifications, modification],
          supplementAmount: priceDiff > 0 ? priceDiff : undefined,
          refundAmount: priceDiff < 0 ? Math.abs(priceDiff) : undefined,
          needsCustomerConfirm: true,
          status: "waiting_confirm",
        };
      }),
    })),

  advanceStep: (orderId) =>
    set((state) => ({
      orders: state.orders.map((o) => {
        if (o.id !== orderId) return o;

        if (o.currentStep === "slaughtering" && !o.weightConfirmed && o.actualWeight != null) {
          return o;
        }

        const inProgressIndex = o.steps.findIndex(
          (s) => s.status === "in_progress"
        );

        const currentActiveIndex = inProgressIndex !== -1
          ? inProgressIndex
          : o.steps.findIndex((s) => s.stepName === o.currentStep);

        if (currentActiveIndex === -1 || currentActiveIndex >= o.steps.length - 1) {
          return o;
        }

        const nextStepIndex = currentActiveIndex + 1;
        const now = new Date().toISOString();

        const newSteps = o.steps.map((s, i) => {
          if (i <= currentActiveIndex) {
            return {
              ...s,
              status: "completed" as const,
              timestamp: s.timestamp || now,
            };
          }
          if (i === nextStepIndex) {
            return {
              ...s,
              status: "in_progress" as const,
              timestamp: now,
            };
          }
          return s;
        });

        const newCurrentStep = o.steps[nextStepIndex].stepName;
        let newStatus: Order["status"] = o.status;

        if (newCurrentStep === "pickup") {
          newStatus = "ready";
        } else if (newCurrentStep === "weighing") {
          newStatus = "pending";
        } else {
          newStatus = "processing";
        }

        return {
          ...o,
          steps: newSteps as ProcessingStepRecord[],
          currentStep: newCurrentStep,
          status: newStatus,
        };
      }),
    })),

  completeOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.map((o) => {
        if (o.id !== orderId) return o;
        const now = new Date().toISOString();

        return {
          ...o,
          currentStep: "pickup" as const,
          status: "completed" as const,
          completedAt: now,
          steps: o.steps.map((s) => ({
            ...s,
            status: "completed" as const,
            timestamp: s.timestamp || now,
          })),
        };
      }),
    })),

  cancelOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status: "cancelled" as const } : o
      ),
    })),

  getOrderById: (id) => get().orders.find((o) => o.id === id),

  getOrdersByStatus: (status) => get().orders.filter((o) => o.status === status),

  getWeightDiff: (orderId) => {
    const order = get().orders.find((o) => o.id === orderId);
    if (!order || order.actualWeight == null || order.actualPrice == null) return undefined;
    return {
      weightDiff: order.actualWeight - order.estimatedWeight,
      priceDiff: order.actualPrice - order.estimatedPrice,
    };
  },
    }),
    {
      name: ORDER_STORE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        orders: state.orders,
        currentQueueNumber: state.currentQueueNumber,
      }),
    }
  )
);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === ORDER_STORE_KEY) {
      void useOrderStore.persist.rehydrate();
    }
  });
}
