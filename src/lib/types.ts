export interface ProcessingMethod {
  id: string;
  name: string;
  fee: number;
  estimatedMinutes: number;
}

export type PoolEventType = "low_oxygen" | "temporary_transfer" | "sold_out" | "new_arrival" | "normal";

export interface SubstituteInfo {
  id: string;
  name: string;
  emoji: string;
  pricePerJin: number;
  weightMin: number;
  weightMax: number;
  specDiff: string;
  priceDiff: number;
}

export interface SeafoodItem {
  id: string;
  name: string;
  category: string;
  emoji: string;
  poolNumber: string;
  originalPoolNumber: string;
  vitalityStatus: "alive" | "weak" | "dead" | "low_oxygen";
  pricePerJin: number;
  originalPricePerJin: number;
  weightMin: number;
  weightMax: number;
  unit: string;
  processingMethods: ProcessingMethod[];
  isSoldOut: boolean;
  substituteId?: string;
  substituteInfo?: SubstituteInfo;
  lastWaterChange: string;
  isLowOxygen: boolean;
  isNewArrival: boolean;
  isTemporaryTransferred: boolean;
  poolEvent: PoolEventType;
  eventMessage?: string;
  needsOrderReconfirm: boolean;
  description: string;
  priceChangeReason?: string;
  arrivalTime?: string;
}

export type ProcessingStepName =
  | "weighing"
  | "slaughtering"
  | "cooking"
  | "packing"
  | "pickup";

export interface WeightModificationRecord {
  id: string;
  previousWeight: number;
  newWeight: number;
  previousPrice: number;
  newPrice: number;
  reason: string;
  modifiedAt: string;
  modifiedBy: string;
}

export interface Order {
  id: string;
  seafoodId: string;
  estimatedWeight: number;
  estimatedPrice: number;
  actualWeight?: number;
  actualPrice?: number;
  processingMethod: string;
  processingFee: number;
  queueNumber: string;
  currentStep: ProcessingStepName;
  createdAt: string;
  completedAt?: string;
  status: "pending" | "processing" | "ready" | "completed" | "cancelled" | "waiting_confirm";
  weightConfirmed: boolean;
  weightModifications: WeightModificationRecord[];
  supplementAmount?: number;
  refundAmount?: number;
  needsCustomerConfirm: boolean;
  steps: ProcessingStepRecord[];
}

export interface ProcessingStepRecord {
  stepName: ProcessingStepName;
  status: "pending" | "in_progress" | "completed" | "skipped";
  timestamp?: string;
}

export type DeviceType = "phone" | "tablet" | "desktop" | "board";

export const PROCESSING_STEP_LABELS: Record<ProcessingStepName, string> = {
  weighing: "称重",
  slaughtering: "宰杀",
  cooking: "蒸煮",
  packing: "打包",
  pickup: "取餐",
};

export const PROCESSING_STEPS: ProcessingStepName[] = [
  "weighing",
  "slaughtering",
  "cooking",
  "packing",
  "pickup",
];

export const VITALITY_LABELS: Record<SeafoodItem["vitalityStatus"], string> = {
  alive: "鲜活",
  weak: "活力不足",
  dead: "已死亡",
  low_oxygen: "缺氧",
};
