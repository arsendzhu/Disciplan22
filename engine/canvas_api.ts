export {
  getAssignments,
  getCourses,
  getSyllabus,
  getCanvasAuthorizationUrl as beginCanvasAuth,
  stripHtml as parseCanvasHtml,
} from "@/lib/canvas";

export const canvasApiModuleNotes = {
  purpose:
    "DisciPlan-compatible Canvas engine barrel. Canvas HTTP logic lives in @/lib/canvas (OAuth + server session from .env).",
  sources: ["@/lib/canvas", "@/app/api/canvas/*"],
};
