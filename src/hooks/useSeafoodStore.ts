import { create } from "zustand";
import type { SeafoodItem } from "@/lib/types";
import { MOCK_SEAFOOD } from "@/lib/mockData";

interface SeafoodState {
  seafoodList: SeafoodItem[];
  updateVitality: (id: string, status: SeafoodItem["vitalityStatus"]) => void;
  updateWaterChange: (id: string, time: string) => void;
  toggleLowOxygen: (id: string) => void;
  toggleSoldOut: (id: string) => void;
  getSeafoodById: (id: string) => SeafoodItem | undefined;
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
      seafoodList: state.seafoodList.map((s) =>
        s.id === id
          ? { ...s, isLowOxygen: !s.isLowOxygen, vitalityStatus: !s.isLowOxygen ? "low_oxygen" : "alive" }
          : s
      ),
    })),

  toggleSoldOut: (id) =>
    set((state) => ({
      seafoodList: state.seafoodList.map((s) =>
        s.id === id ? { ...s, isSoldOut: !s.isSoldOut } : s
      ),
    })),

  getSeafoodById: (id) => get().seafoodList.find((s) => s.id === id),
}));
