import { Scale, Swords, Flame, Package, Hand, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PROCESSING_STEPS,
  PROCESSING_STEP_LABELS,
  type ProcessingStepName,
  type ProcessingStepRecord,
} from "@/lib/types";

const STEP_ICONS: Record<ProcessingStepName, React.ElementType> = {
  weighing: Scale,
  slaughtering: Swords,
  cooking: Flame,
  packing: Package,
  pickup: Hand,
};

interface ProcessingProgressProps {
  steps: ProcessingStepRecord[];
  currentStep: ProcessingStepName;
}

function getStepStatus(
  steps: ProcessingStepRecord[],
  stepName: ProcessingStepName
): "completed" | "active" | "pending" {
  const record = steps.find((s) => s.stepName === stepName);
  if (!record || record.status === "pending") return "pending";
  if (record.status === "completed") return "completed";
  return "active";
}

function getLineColor(status: "completed" | "active" | "pending") {
  if (status === "completed") return "bg-jade-500";
  if (status === "active") return "bg-coral-500";
  return "bg-ocean-600";
}

export default function ProcessingProgress({
  steps,
  currentStep,
}: ProcessingProgressProps) {
  const currentIndex = PROCESSING_STEPS.indexOf(currentStep);

  return (
    <div className="w-full">
      <div className="hidden sm:flex items-center justify-between relative">
        {PROCESSING_STEPS.map((stepName, index) => {
          const status = getStepStatus(steps, stepName);
          const Icon = STEP_ICONS[stepName];

          return (
            <div key={stepName} className="flex flex-col items-center relative z-10 flex-1">
              {index > 0 && (
                <div
                  className={cn(
                    "absolute top-5 -left-1/2 w-full h-0.5 -z-0",
                    getLineColor(
                      index <= currentIndex ? "completed" : "pending"
                    )
                  )}
                />
              )}
              <div
                className={cn(
                  "progress-step",
                  status === "completed" && "progress-step-completed",
                  status === "active" && "progress-step-active",
                  status === "pending" && "progress-step-pending"
                )}
              >
                {status === "completed" ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
                {status === "active" && (
                  <span className="absolute inset-0 rounded-full border-2 border-coral-500 animate-pulse-ring" />
                )}
              </div>
              <span className="text-xs mt-2 text-foam-200">
                {PROCESSING_STEP_LABELS[stepName]}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex sm:hidden flex-col gap-3">
        {PROCESSING_STEPS.map((stepName, index) => {
          const status = getStepStatus(steps, stepName);
          const Icon = STEP_ICONS[stepName];

          return (
            <div key={stepName} className="flex items-center gap-3">
              <div
                className={cn(
                  "progress-step w-8 h-8",
                  status === "completed" && "progress-step-completed",
                  status === "active" && "progress-step-active",
                  status === "pending" && "progress-step-pending"
                )}
              >
                {status === "completed" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
                {status === "active" && (
                  <span className="absolute inset-0 rounded-full border-2 border-coral-500 animate-pulse-ring" />
                )}
              </div>
              <span className="text-xs text-foam-200">
                {PROCESSING_STEP_LABELS[stepName]}
              </span>
              {index < PROCESSING_STEPS.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 h-3 ml-[15px] -mt-1 -mb-1",
                    index < currentIndex ? "bg-jade-500" : "bg-ocean-600"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
