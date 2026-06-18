import { create } from "zustand";
import type { Order, ProcessingStepRecord } from "@/lib/types";
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
  updateOrderWeight: (orderId: string, actualWeight: number) => void;
  advanceStep: (orderId: string) => void;
  completeOrder: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByStatus: (status: Order["status"]) => Order[];
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: MOCK_ORDERS,
  currentQueueNumber: 104,

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

  updateOrderWeight: (orderId, actualWeight) =>
    set((state) => ({
      orders: state.orders.map((o) => {
        if (o.id !== orderId) return o;
        const seafood = useSeafoodStore.getState().getSeafoodById(o.seafoodId);
        if (!seafood) return o;
        const actualPrice = Math.round(actualWeight * seafood.pricePerJin + o.processingFee);
        return { ...o, actualWeight, actualPrice };
      }),
    })),

  advanceStep: (orderId) =>
    set((state) => ({
      orders: state.orders.map((o) => {
        if (o.id !== orderId) return o;

        const stepIndex = o.steps.findIndex(
          (s) => s.status === "in_progress" || s.status === "pending"
        );
        if (stepIndex === -1) return o;

        const newSteps = o.steps.map((s, i) => {
          if (i < stepIndex) return { ...s, status: "completed" as const, timestamp: s.timestamp || new Date().toISOString() };
          if (i === stepIndex) return { ...s, status: "in_progress" as const, timestamp: new Date().toISOString() };
          return s;
        });

        const currentStep = o.steps[stepIndex].stepName;
        let newStatus = o.status;
        if (currentStep === "weighing" || currentStep === "slaughtering" || currentStep === "cooking") {
          newStatus = "processing";
        } else if (currentStep === "packing") {
          newStatus = "processing";
        } else if (currentStep === "pickup") {
          newStatus = "ready";
        }

        return { ...o, steps: newSteps as ProcessingStepRecord[], currentStep, status: newStatus };
      }),
    })),

  completeOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "completed" as const,
              completedAt: new Date().toISOString(),
              steps: o.steps.map((s) => ({ ...s, status: "completed" as const })),
            }
          : o
      ),
    })),

  cancelOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status: "cancelled" as const } : o
      ),
    })),

  getOrderById: (id) => get().orders.find((o) => o.id === id),

  getOrdersByStatus: (status) => get().orders.filter((o) => o.status === status),
}));
