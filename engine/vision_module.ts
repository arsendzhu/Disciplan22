export type FatigueSignal = {
  blinkRate?: number;
  focusConfidence?: number;
  postureConfidence?: number;
  timestamp: string;
};

export type VisionModuleState = {
  status: "idle" | "unsupported" | "ready";
  latestSignal?: FatigueSignal;
};

export const visionModuleNotes = {
  purpose:
    "Future browser-side fatigue and focus sensing bridge for webcam-based biometrics.",
  nextSteps: [
    "Add MediaPipe or face-landmark detection behind explicit user consent.",
    "Convert fatigue signals into gentle break nudges instead of punitive alerts.",
    "Keep all raw webcam processing local in-browser whenever possible.",
  ],
};
