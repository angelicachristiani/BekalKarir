export type ApplicationStatus =
  | "saved"
  | "ready"
  | "applied"
  | "interview"
  | "offer"
  | "rejected";

export interface Application {
  id: string;
  jobId: string;
  status: ApplicationStatus;
  appliedAt: string | null;
  interviewAt: string | null;
  notes: string;
  cvAnalysisScore: number | null;
  interviewScore: number | null;
  createdAt: string;
  updatedAt: string;
}

export const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bg: string }> = {
  saved: { label: "Disimpan", color: "text-slate-600", bg: "bg-slate-100" },
  ready: { label: "Siap Dilamar", color: "text-blue-700", bg: "bg-blue-50" },
  applied: { label: "Sudah Dilamar", color: "text-amber-700", bg: "bg-amber-50" },
  interview: { label: "Interview", color: "text-primary", bg: "bg-teal-50" },
  offer: { label: "Diterima", color: "text-green-700", bg: "bg-green-50" },
  rejected: { label: "Ditolak", color: "text-red-600", bg: "bg-red-50" },
};

export const KANBAN_COLUMNS: ApplicationStatus[] = ["saved", "ready", "applied", "interview", "offer", "rejected"];
