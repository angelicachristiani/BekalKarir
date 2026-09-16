import type { Application, ApplicationStatus } from "@/types/application";

const STORAGE_KEY = "bekalkarir_applications";

export function getApplications(): Application[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveApplications(apps: Application[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch {
    // localStorage full or unavailable
  }
}

export function createApplication(jobId: string, status: ApplicationStatus = "saved"): Application {
  const apps = getApplications();
  const existing = apps.find((a) => a.jobId === jobId);

  if (existing) return existing;

  const now = new Date().toISOString();
  const app: Application = {
    id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    jobId,
    status,
    appliedAt: null,
    interviewAt: null,
    notes: "",
    cvAnalysisScore: null,
    interviewScore: null,
    createdAt: now,
    updatedAt: now,
  };

  apps.unshift(app);
  saveApplications(apps);
  return app;
}

export function updateApplicationStatus(jobId: string, status: ApplicationStatus): Application | null {
  const apps = getApplications();
  const idx = apps.findIndex((a) => a.jobId === jobId);

  if (idx === -1) {
    return createApplication(jobId, status);
  }

  apps[idx].status = status;
  apps[idx].updatedAt = new Date().toISOString();

  if (status === "applied") {
    apps[idx].appliedAt = new Date().toISOString();
  }
  if (status === "interview") {
    apps[idx].interviewAt = new Date().toISOString();
  }

  saveApplications(apps);
  return apps[idx];
}

export function updateApplicationNotes(jobId: string, notes: string): void {
  const apps = getApplications();
  const idx = apps.findIndex((a) => a.jobId === jobId);
  if (idx !== -1) {
    apps[idx].notes = notes;
    apps[idx].updatedAt = new Date().toISOString();
    saveApplications(apps);
  }
}

export function updateApplicationCVScore(jobId: string, score: number): void {
  const apps = getApplications();
  const idx = apps.findIndex((a) => a.jobId === jobId);
  if (idx !== -1) {
    apps[idx].cvAnalysisScore = score;
    apps[idx].updatedAt = new Date().toISOString();
    saveApplications(apps);
  }
}

export function updateApplicationInterviewScore(jobId: string, score: number): void {
  const apps = getApplications();
  const idx = apps.findIndex((a) => a.jobId === jobId);
  if (idx !== -1) {
    apps[idx].interviewScore = score;
    apps[idx].updatedAt = new Date().toISOString();
    saveApplications(apps);
  }
}

export function deleteApplication(jobId: string): void {
  const apps = getApplications();
  const filtered = apps.filter((a) => a.jobId !== jobId);
  saveApplications(filtered);
}

export function syncFromLegacyKeys(): void {
  if (typeof window === "undefined") return;

  try {
    const savedRaw = localStorage.getItem("bekalkarir_saved_jobs");
    const readyRaw = localStorage.getItem("bekalkarir_ready_jobs");

    if (savedRaw) {
      const savedIds: string[] = JSON.parse(savedRaw);
      for (const id of savedIds) {
        createApplication(id, "saved");
      }
    }

    if (readyRaw) {
      const readyIds: string[] = JSON.parse(readyRaw);
      for (const id of readyIds) {
        const apps = getApplications();
        const existing = apps.find((a) => a.jobId === id);
        if (existing) {
          updateApplicationStatus(id, "ready");
        } else {
          createApplication(id, "ready");
        }
      }
    }
  } catch {
    // ignore
  }
}
