import { Check, ClipboardCheck } from "lucide-react";
import { useOrderStore } from "@/hooks/useOrderStore";
import {
  PROCESSING_STEPS,
  PROCESSING_STEP_LABELS,
  type ProcessingStepName,
} from "@/lib/types";

interface StepUpdateButtonsProps {
  orderId: string;
}

export default function StepUpdateButtons({ orderId }: StepUpdateButtonsProps) {
  const order = useOrderStore((s) => s.getOrderById(orderId));
  const advanceStep = useOrderStore((s) => s.advanceStep);
  const completeOrder = useOrderStore((s) => s.completeOrder);

  if (!order) return null;

  const currentStepIndex = PROCESSING_STEPS.indexOf(order.currentStep);

  const getStepStatus = (
    stepName: ProcessingStepName,
    index: number
  ): "completed" | "active" | "pending" => {
    const stepRecord = order.steps.find((s) => s.stepName === stepName);
    if (stepRecord?.status === "completed") return "completed";
    if (index === currentStepIndex) return "active";
    return "pending";
  };

  const canAdvanceTo = (index: number): boolean => {
    const status = getStepStatus(PROCESSING_STEPS[index], index);
    return status === "pending" && index === currentStepIndex + 1;
  };

  const handleStepClick = (index: number) => {
    if (!canAdvanceTo(index)) return;
    advanceStep(orderId);
  };

  const nextStepLabel =
    currentStepIndex < PROCESSING_STEPS.length - 1
      ? PROCESSING_STEP_LABELS[PROCESSING_STEPS[currentStepIndex + 1]]
      : null;

  const isLastStepReady =
    order.currentStep === "pickup" &&
    order.steps.find((s) => s.stepName === "pickup")?.status === "in_progress";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-ocean-300">当前:</span>
        <span className="text-coral-500 font-medium">
          {PROCESSING_STEP_LABELS[order.currentStep]}
        </span>
        {nextStepLabel && (
          <>
            <span className="text-ocean-500">→</span>
            <span className="text-jade-500">{nextStepLabel}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {PROCESSING_STEPS.map((stepName, index) => {
          const status = getStepStatus(stepName, index);
          const canClick = canAdvanceTo(index);

          return (
            <button
              key={stepName}
              onClick={() => handleStepClick(index)}
              disabled={!canClick}
              className={[
                "progress-step",
                status === "completed"
                  ? "progress-step-completed"
                  : status === "active"
                  ? "progress-step-active"
                  : "progress-step-pending",
                canClick ? "cursor-pointer hover:scale-110" : "cursor-default",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {status === "completed" ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-xs font-medium">
                  {PROCESSING_STEP_LABELS[stepName].charAt(0)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {isLastStepReady && (
        <button
          className="staff-btn-success w-full flex items-center justify-center gap-2 py-3"
          onClick={() => completeOrder(orderId)}
        >
          <ClipboardCheck className="w-4 h-4" />
          完成取餐
        </button>
      )}
    </div>
  );
}
