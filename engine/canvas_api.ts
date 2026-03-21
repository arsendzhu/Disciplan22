export {
  getAssignments,
  getCourses,
  getSyllabus,
  getCanvasAuthorizationUrl as beginCanvasAuth,
  stripHtml as parseCanvasHtml,
} from "@/lib/canvas";

export const canvasApiModuleNotes = {
  purpose:
    "DisciPlan-compatible Canvas engine barrel. Keeps Canvas sync logic separate from UI modules.",
  sources: ["@/lib/canvas", "@/app/api/canvas/*"],
};
