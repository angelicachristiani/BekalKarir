"use client";

import { User, Mail, Phone, MapPin, GraduationCap, Briefcase, Zap, FolderOpen, Award, Globe, Languages } from "lucide-react";
import type { ExtractedCV } from "@/types/cv";

interface CVExtractionPreviewProps {
  extracted: ExtractedCV;
}

export default function CVExtractionPreview({ extracted }: CVExtractionPreviewProps) {
  const sections = [
    { icon: User, label: "Nama", value: extracted.nama },
    { icon: Mail, label: "Email", value: extracted.email },
    { icon: Phone, label: "Telepon", value: extracted.phone },
    { icon: MapPin, label: "Lokasi", value: extracted.lokasi },
    { icon: Languages, label: "Summary", value: extracted.summary },
  ].filter((s) => s.value);

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
      <h3 className="font-bold text-slate-900 text-lg">Informasi yang Terdeteksi</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
            <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-slate-500 font-medium">{label}</p>
              <p className="text-sm text-slate-800 font-semibold mt-0.5">{value as string}</p>
            </div>
          </div>
        ))}
      </div>

      {extracted.pendidikan.length > 0 && (
        <div>
          <h4 className="font-semibold text-slate-700 text-sm mb-2 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary" /> Pendidikan
          </h4>
          <div className="space-y-2">
            {extracted.pendidikan.map((edu, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl text-sm">
                <p className="font-semibold text-slate-800">{edu.institusi}</p>
                {edu.jurusan && <p className="text-slate-600">{edu.jurusan}</p>}
                {edu.tahun && <p className="text-slate-400 text-xs mt-1">{edu.tahun}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {extracted.pengalaman.length > 0 && (
        <div>
          <h4 className="font-semibold text-slate-700 text-sm mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" /> Pengalaman
          </h4>
          <div className="space-y-2">
            {extracted.pengalaman.map((exp, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl text-sm">
                <p className="font-semibold text-slate-800">{exp.posisi || exp.perusahaan}</p>
                {exp.perusahaan && exp.posisi && <p className="text-primary text-xs">{exp.perusahaan}</p>}
                {exp.durasi && <p className="text-slate-400 text-xs">{exp.durasi}</p>}
                {exp.deskripsi && <p className="text-slate-600 mt-1 text-xs line-clamp-2">{exp.deskripsi}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {extracted.skills.length > 0 && (
        <div>
          <h4 className="font-semibold text-slate-700 text-sm mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" /> Skill
          </h4>
          <div className="flex flex-wrap gap-2">
            {extracted.skills.map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-full text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {extracted.proyek.length > 0 && (
        <div>
          <h4 className="font-semibold text-slate-700 text-sm mb-2 flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-primary" /> Proyek
          </h4>
          <div className="space-y-2">
            {extracted.proyek.map((proj, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl text-sm">
                <p className="font-semibold text-slate-800">{proj.nama}</p>
                {proj.deskripsi && <p className="text-slate-600 text-xs mt-1">{proj.deskripsi}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {extracted.sertifikasi.length > 0 && (
        <div>
          <h4 className="font-semibold text-slate-700 text-sm mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" /> Sertifikasi
          </h4>
          <div className="flex flex-wrap gap-2">
            {extracted.sertifikasi.map((cert, i) => (
              <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium">
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}

      {extracted.bahasa.length > 0 && (
        <div>
          <h4 className="font-semibold text-slate-700 text-sm mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> Bahasa
          </h4>
          <div className="flex flex-wrap gap-2">
            {extracted.bahasa.map((lang, i) => (
              <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium">
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
