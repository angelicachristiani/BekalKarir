"use client";

import { useState } from "react";
import { X, MapPin, Briefcase, DollarSign, Sparkles, Calendar, Edit3, Save, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ApplicationStatusBadge from "./ApplicationStatusBadge";
import type { Application, ApplicationStatus } from "@/types/application";
import { STATUS_CONFIG, KANBAN_COLUMNS } from "@/types/application";

interface ApplicationDetailProps {
  application: Application;
  jobTitle: string;
  jobCompany: string;
  jobLocation: string;
  jobType: string;
  jobSalaryMin: number;
  jobSalaryMax: number;
  matchScore?: number;
  interviewHistory: any[];
  onClose: () => void;
  onStatusChange: (status: ApplicationStatus) => void;
  onNotesChange: (notes: string) => void;
}

export default function ApplicationDetail({
  application,
  jobTitle,
  jobCompany,
  jobLocation,
  jobType,
  jobSalaryMin,
  jobSalaryMax,
  matchScore,
  interviewHistory,
  onClose,
  onStatusChange,
  onNotesChange,
}: ApplicationDetailProps) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(application.notes);

  const relevantInterviews = interviewHistory.filter(
    (h) => h.jobId === application.jobId
  );

  const handleSaveNotes = () => {
    onNotesChange(notesValue);
    setEditingNotes(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-lg">Detail Lamaran</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">{jobTitle}</h3>
            <p className="text-primary font-semibold">{jobCompany}</p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-3">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {jobLocation}</span>
              <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {jobType}</span>
              <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> Rp{(jobSalaryMin / 1000000).toFixed(0)}Jt–{(jobSalaryMax / 1000000).toFixed(0)}Jt</span>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-400 mb-1">Status</p>
            <ApplicationStatusBadge status={application.status} />
          </div>

          <div>
            <p className="text-xs text-slate-400 mb-2">Ubah Status</p>
            <div className="flex flex-wrap gap-2">
              {KANBAN_COLUMNS.map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(status)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    application.status === status
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {STATUS_CONFIG[status].label}
                </button>
              ))}
            </div>
          </div>

          {matchScore !== undefined && (
            <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl border border-teal-200">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-semibold text-teal-800">Match Score: {matchScore}%</span>
            </div>
          )}

          {application.cvAnalysisScore !== null && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-sm font-semibold text-blue-800">CV Score: {application.cvAnalysisScore}/100</span>
            </div>
          )}

          {application.createdAt && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="w-4 h-4" />
              Dibuat: {new Date(application.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          )}

          {relevantInterviews.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MessageSquare className="w-3 h-3" /> Hasil Latihan Interview
              </p>
              {relevantInterviews.map((h) => (
                <div key={h.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{h.jobTitle}</p>
                    <p className="text-xs text-slate-500">{new Date(h.date).toLocaleDateString("id-ID")}</p>
                  </div>
                  <span className={`text-lg font-extrabold ${h.score >= 80 ? "text-teal-600" : "text-amber-600"}`}>{h.score}</span>
                </div>
              ))}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">Catatan</p>
              {!editingNotes ? (
                <button onClick={() => setEditingNotes(true)} className="text-xs text-primary flex items-center gap-1 hover:underline">
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              ) : (
                <button onClick={handleSaveNotes} className="text-xs text-primary flex items-center gap-1 hover:underline">
                  <Save className="w-3 h-3" /> Simpan
                </button>
              )}
            </div>
            {editingNotes ? (
              <Input
                value={notesValue}
                onChange={(e) => setNotesValue(e.target.value)}
                placeholder="Tambahkan catatan..."
                className="h-12"
              />
            ) : (
              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl min-h-[60px]">
                {application.notes || "Belum ada catatan."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
