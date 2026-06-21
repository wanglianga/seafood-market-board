import { create } from "zustand";
import type { SeafoodItem, PoolEventType, SubstituteInfo } from "@/lib/types";
import { MOCK_SEAFOOD } from "@/lib/mockData";

interface SeafoodState {
  seafoodList: SeafoodItem[];
  updateVitality: (id: string, status: SeafoodItem["vitalityStatus"]) => void;
  updateWaterChange: (id: string, time: string) => void;
  toggleLowOxygen: (id: string) => void;
  toggleSoldOut: (id: string) => void;
  getSeafoodById: (id: string) => SeafoodItem | undefined;
  setPoolEvent: (id: string, event: PoolEventType, message?: string) => void;
  temporaryTransferPool: (id: string, newPoolNumber: string, reason?: string) => void;
  revertTemporaryTransfer: (id: string) => void;
  markNewArrival: (id: string, arrivalTime?: string) => void;
  clearNewArrival: (id: string) => void;
  updatePrice: (id: string, newPrice: number, reason?: string) => void;
  getSubstituteInfo: (id: string) => SubstituteInfo | undefined;
  setNeedsReconfirm: (id: string, needs: boolean) => void;
}

export const useSeafoodStore = create<SeafoodState>((set, get) => ({
  seafoodList: MOCK_SEAFOOD,

  updateVitality: (id, status) =>
    set((state) => ({
      seafoodList: state.seafoodList.map((s) =>
        s.id === id ? { ...s, vitalityStatus: status } : s
      ),
    })),

  updateWaterChange: (id, time) =>
    set((state) => ({
      seafoodList: state.seafoodList.map((s) =>
        s.id === id ? { ...s, lastWaterChange: time } : s
      ),
    })),

  toggleLowOxygen: (id) =>
    set((state) => ({
      seafoodList: state.seafoodList.map((s) => {
        if (s.id !== id) return s;
        const isLowOxygen = !s.isLowOxygen;
        return {
          ...s,
          isLowOxygen,
          vitalityStatus: isLowOxygen ? "low_oxygen" : "alive",
          poolEvent: isLowOxygen ? "low_oxygen" : "normal",
          eventMessage: isLowOxygen ? "含氧量偏低，正在处理中" : undefined,
          needsOrderReconfirm: isLowOxygen,
        };
      }),
    })),

  toggleSoldOut: (id) =>
    set((state) => ({
      seafoodList: state.seafoodList.map((s) => {
        if (s.id !== id) return s;
        const isSoldOut = !s.isSoldOut;
        return {
          ...s,
          isSoldOut,
          poolEvent: isSoldOut ? "sold_out" : "normal",
          eventMessage: isSoldOut ? "今日已售罄" : undefined,
          needsOrderReconfirm: isSoldOut,
        };
      }),
    })),

  getSeafoodById: (id) => get().seafoodList.find((s) => s.id === id),

  setPoolEvent: (id, event, message) =>
    set((state) => ({
      seafoodList: state.seafoodList.map((s) =>
        s.id === id
          ? {
              ...s,
              poolEvent: event,
              eventMessage: message,
              needsOrderReconfirm: event !== "normal",
            }
          : s
      ),
    })),

  temporaryTransferPool: (id, newPoolNumber, reason) =>
    set((state) => ({
      seafoodList: state.seafoodList.map((s) =>
        s.id === id
          ? {
              ...s,
              poolNumber: newPoolNumber,
              isTemporaryTransferred: true,
              poolEvent: "temporary_transfer",
              eventMessage: reason || `临时移至${newPoolNumber}池`,
            }
          : s
      ),
    })),

  revertTemporaryTransfer: (id) =>
    set((state) => ({
      seafoodList: state.seafoodList.map((s) =>
        s.id === id
          ? {
              ...s,
              poolNumber: s.originalPoolNumber,
              isTemporaryTransferred: false,
              poolEvent: "normal",
              eventMessage: undefined,
            }
          : s
      ),
    })),

  markNewArrival: (id, arrivalTime) =>
    set((state) => ({
      seafoodList: state.seafoodList.map((s) =>
        s.id === id
          ? {
              ...s,
              isNewArrival: true,
              poolEvent: "new_arrival",
              eventMessage: "新货到港，新鲜直达",
              arrivalTime: arrivalTime || "刚刚",
            }
          : s
      ),
    })),

  clearNewArrival: (id) =>
    set((state) => ({
      seafoodList: state.seafoodList.map((s) =>
        s.id === id
          ? {
              ...s,
              isNewArrival: false,
              poolEvent: s.isLowOxygen
                ? "low_oxygen"
                : s.isSoldOut
                ? "sold_out"
                : s.isTemporaryTransferred
                ? "temporary_transfer"
                : "normal",
              arrivalTime: undefined,
            }
          : s
      ),
    })),

  updatePrice: (id, newPrice, reason) =>
    set((state) => ({
      seafoodList: state.seafoodList.map((s) =>
        s.id === id
          ? {
              ...s,
              pricePerJin: newPrice,
              priceChangeReason: reason,
            }
          : s
      ),
    })),

  getSubstituteInfo: (id): SubstituteInfo | undefined => {
    const seafood = get().seafoodList.find((s) => s.id === id);
    if (!seafood || !seafood.substituteId) return undefined;

    const substitute = get().seafoodList.find((s) => s.id === seafood.substituteId);
    if (!substitute) return undefined;

    return {
      id: substitute.id,
      name: substitute.name,
      emoji: substitute.emoji,
      pricePerJin: substitute.pricePerJin,
      weightMin: substitute.weightMin,
      weightMax: substitute.weightMax,
      specDiff: `规格: ${substitute.weightMin}-${substitute.weightMax}${substitute.unit}`,
      priceDiff: substitute.pricePerJin - seafood.pricePerJin,
    };
  },

  setNeedsReconfirm: (id, needs) =>
    set((state) => ({
      seafoodList: state.seafoodList.map((s) =>
        s.id === id ? { ...s, needsOrderReconfirm: needs } : s
      ),
    })),
}));
