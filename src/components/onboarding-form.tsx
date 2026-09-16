"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, ChevronRight, ChevronLeft, ArrowRight, User, GraduationCap, Briefcase, Settings2, Target, Zap, LayoutList } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const steps = [
  { id: 1, title: "Tentang Kamu", icon: User },
  { id: 2, title: "Pendidikan", icon: GraduationCap },
  { id: 3, title: "Skill", icon: Zap },
  { id: 4, title: "Pengalaman", icon: Briefcase },
  { id: 5, title: "Preferensi Kerja", icon: Settings2 },
  { id: 6, title: "Ekspektasi Karier", icon: Target },
  { id: 7, title: "Ringkasan Profil", icon: LayoutList },
];

const SKILL_PROFICIENCIES = ["Pemula", "Menengah", "Mahir"];

export function OnboardingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nama: "",
    lokasi: "",
    email: "",
    status_pendidikan: "",
    institusi: "",
    jurusan: "",
    skills: [{ nama: "", level: "Pemula" }],
    pengalaman: [{ perusahaan: "", posisi: "", durasi: "" }],
    preferensi_lokasi: "Hybrid",
    tipe_pekerjaan: "Full-time",
    ekspektasi_gaji: "",
    bidang_karir: "",
  });

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addSkill = () => updateFormData("skills", [...formData.skills, { nama: "", level: "Pemula" }]);
  const updateSkill = (index: number, key: string, value: string) => {
    const newSkills = [...formData.skills];
    newSkills[index] = { ...newSkills[index], [key]: value };
    updateFormData("skills", newSkills);
  };
  const removeSkill = (index: number) => {
    updateFormData("skills", formData.skills.filter((_, i) => i !== index));
  };

  const addPengalaman = () => updateFormData("pengalaman", [...formData.pengalaman, { perusahaan: "", posisi: "", durasi: "" }]);
  const updatePengalaman = (index: number, key: string, value: string) => {
    const newPengalaman = [...formData.pengalaman];
    newPengalaman[index] = { ...newPengalaman[index], [key]: value };
    updateFormData("pengalaman", newPengalaman);
  };
  const removePengalaman = (index: number) => {
    updateFormData("pengalaman", formData.pengalaman.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Mock API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Save to local storage for the Profile page to read
    localStorage.setItem("bekalkarir_profile", JSON.stringify(formData));
    
    // Redirect to profile
    router.push("/profile");
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
      {/* Progress Header */}
      <div className="bg-slate-50 p-6 md:p-8 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-primary font-medium">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
              {currentStep}
            </span>
            <span>Langkah {currentStep} dari {steps.length}</span>
          </div>
          <span className="text-slate-500 text-sm font-medium">{Math.round(progress)}% Selesai</span>
        </div>
        <Progress value={progress} className="h-2 bg-slate-200" />
        
        <div className="mt-8 flex items-center justify-between overflow-x-auto pb-4 hide-scrollbar">
          {steps.map((step) => (
            <div key={step.id} className={`flex flex-col items-center min-w-[80px] gap-2 ${currentStep === step.id ? 'text-primary' : currentStep > step.id ? 'text-teal-600' : 'text-slate-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentStep === step.id ? 'bg-primary text-white shadow-md shadow-primary/20' : currentStep > step.id ? 'bg-primary/20 text-primary' : 'bg-slate-100'}`}>
                {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
              </div>
              <span className="text-xs font-medium text-center">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 md:p-10 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Step 1: Tentang Kamu */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Halo! Boleh kita kenalan?</h2>
                  <p className="text-slate-500 mt-1">Beritahu kami sedikit tentang dirimu agar kami bisa menyesuaikan pengalamanmu.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nama">Nama Lengkap</Label>
                    <Input id="nama" placeholder="Cth: Budi Santoso" value={formData.nama} onChange={(e) => updateFormData("nama", e.target.value)} className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Cth: budi@email.com" value={formData.email} onChange={(e) => updateFormData("email", e.target.value)} className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lokasi">Lokasi Saat Ini</Label>
                    <Input id="lokasi" placeholder="Cth: Jakarta Selatan" value={formData.lokasi} onChange={(e) => updateFormData("lokasi", e.target.value)} className="h-12" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Pendidikan */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Latar Belakang Pendidikan</h2>
                  <p className="text-slate-500 mt-1">Ceritakan perjalanan pendidikanmu sejauh ini.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Status Pendidikan Terakhir</Label>
                    <Select value={formData.status_pendidikan} onValueChange={(val) => updateFormData("status_pendidikan", val || "")}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Pilih Status Pendidikan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SMA/SMK">SMA/SMK</SelectItem>
                        <SelectItem value="Diploma (D3/D4)">Diploma (D3/D4)</SelectItem>
                        <SelectItem value="Sarjana (S1)">Sarjana (S1)</SelectItem>
                        <SelectItem value="Magister (S2)">Magister (S2)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="institusi">Nama Institusi / Universitas</Label>
                    <Input id="institusi" placeholder="Cth: Universitas Indonesia" value={formData.institusi} onChange={(e) => updateFormData("institusi", e.target.value)} className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jurusan">Jurusan</Label>
                    <Input id="jurusan" placeholder="Cth: Sistem Informasi" value={formData.jurusan} onChange={(e) => updateFormData("jurusan", e.target.value)} className="h-12" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Skill */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Keahlian & Kemampuan</h2>
                  <p className="text-slate-500 mt-1">Tambahkan skill yang kamu miliki beserta tingkat penguasaannya.</p>
                </div>
                <div className="space-y-4">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex-1 space-y-2">
                        <Label>Nama Skill</Label>
                        <Input placeholder="Cth: React.js, Public Speaking" value={skill.nama} onChange={(e) => updateSkill(index, "nama", e.target.value)} className="bg-white" />
                      </div>
                      <div className="sm:w-1/3 space-y-2">
                        <Label>Tingkat Penguasaan</Label>
                        <Select value={skill.level} onValueChange={(val) => updateSkill(index, "level", val || "")}>
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SKILL_PROFICIENCIES.map((lvl) => (
                              <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {formData.skills.length > 1 && (
                        <div className="flex items-end pb-1">
                          <Button variant="ghost" onClick={() => removeSkill(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3">Hapus</Button>
                        </div>
                      )}
                    </div>
                  ))}
                  <Button onClick={addSkill} variant="outline" className="w-full border-dashed border-2 py-6 text-slate-500 hover:text-primary hover:border-primary hover:bg-primary/5">
                    + Tambah Skill Baru
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Pengalaman */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Pengalaman Kerja / Organisasi</h2>
                  <p className="text-slate-500 mt-1">Punya pengalaman magang, kerja, atau organisasi? Ceritakan di sini.</p>
                </div>
                <div className="space-y-4">
                  {formData.pengalaman.map((pengalaman, index) => (
                    <div key={index} className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                      {formData.pengalaman.length > 1 && (
                        <button onClick={() => removePengalaman(index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                          <span className="text-sm font-medium">Hapus</span>
                        </button>
                      )}
                      <div className="space-y-2">
                        <Label>Nama Perusahaan / Organisasi</Label>
                        <Input placeholder="Cth: PT Teknologi Masa Depan" value={pengalaman.perusahaan} onChange={(e) => updatePengalaman(index, "perusahaan", e.target.value)} className="bg-white" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Posisi</Label>
                          <Input placeholder="Cth: Frontend Developer" value={pengalaman.posisi} onChange={(e) => updatePengalaman(index, "posisi", e.target.value)} className="bg-white" />
                        </div>
                        <div className="space-y-2">
                          <Label>Durasi</Label>
                          <Input placeholder="Cth: Jan 2023 - Sekarang" value={pengalaman.durasi} onChange={(e) => updatePengalaman(index, "durasi", e.target.value)} className="bg-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button onClick={addPengalaman} variant="outline" className="w-full border-dashed border-2 py-6 text-slate-500 hover:text-primary hover:border-primary hover:bg-primary/5">
                    + Tambah Pengalaman Baru
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Preferensi Kerja */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Preferensi Lingkungan Kerja</h2>
                  <p className="text-slate-500 mt-1">Bagaimana gaya kerja ideal menurutmu?</p>
                </div>
                
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Tipe Pekerjaan</Label>
                  <RadioGroup value={formData.tipe_pekerjaan} onValueChange={(val) => updateFormData("tipe_pekerjaan", val)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Full-time', 'Part-time', 'Freelance / Contract'].map((type) => (
                      <div key={type} className={`flex items-center space-x-2 border-2 rounded-xl p-4 cursor-pointer transition-colors ${formData.tipe_pekerjaan === type ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`} onClick={() => updateFormData("tipe_pekerjaan", type)}>
                        <RadioGroupItem value={type} id={`type-${type}`} />
                        <Label htmlFor={`type-${type}`} className="cursor-pointer font-medium">{type}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold">Lokasi Kerja</Label>
                  <RadioGroup value={formData.preferensi_lokasi} onValueChange={(val) => updateFormData("preferensi_lokasi", val)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: 'WFO', label: 'Di Kantor (WFO)' },
                      { id: 'WFH', label: 'Remote (WFH)' },
                      { id: 'Hybrid', label: 'Hybrid' },
                    ].map((loc) => (
                      <div key={loc.id} className={`flex items-center space-x-2 border-2 rounded-xl p-4 cursor-pointer transition-colors ${formData.preferensi_lokasi === loc.id ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`} onClick={() => updateFormData("preferensi_lokasi", loc.id)}>
                        <RadioGroupItem value={loc.id} id={`loc-${loc.id}`} />
                        <Label htmlFor={`loc-${loc.id}`} className="cursor-pointer font-medium">{loc.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 6: Ekspektasi Karier */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Ekspektasi Karirmu</h2>
                  <p className="text-slate-500 mt-1">Kami akan mencocokkan ini dengan peluang kerja yang ada.</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="bidang_karir">Bidang Karir yang Diminati</Label>
                    <Select value={formData.bidang_karir} onValueChange={(val) => updateFormData("bidang_karir", val || "")}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Pilih Bidang Karir" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Teknologi / IT">Teknologi / IT</SelectItem>
                        <SelectItem value="Desain & Kreatif">Desain & Kreatif</SelectItem>
                        <SelectItem value="Pemasaran & Bisnis">Pemasaran & Bisnis</SelectItem>
                        <SelectItem value="Keuangan">Keuangan</SelectItem>
                        <SelectItem value="Lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ekspektasi_gaji">Ekspektasi Gaji per Bulan (IDR)</Label>
                    <Select value={formData.ekspektasi_gaji} onValueChange={(val) => updateFormData("ekspektasi_gaji", val || "")}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Pilih Rentang Gaji" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="< 5 Juta">&lt; 5 Juta</SelectItem>
                        <SelectItem value="5 - 10 Juta">5 - 10 Juta</SelectItem>
                        <SelectItem value="10 - 15 Juta">10 - 15 Juta</SelectItem>
                        <SelectItem value="> 15 Juta">&gt; 15 Juta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Ringkasan */}
            {currentStep === 7 && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Hampir Selesai!</h2>
                  <p className="text-slate-500 mt-1">Pastikan kembali data dirimu sudah benar.</p>
                </div>
                
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <div>
                      <span className="text-slate-400 block mb-1">Nama Lengkap</span>
                      <span className="font-semibold text-slate-900">{formData.nama || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">Lokasi</span>
                      <span className="font-semibold text-slate-900">{formData.lokasi || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">Pendidikan</span>
                      <span className="font-semibold text-slate-900">{formData.institusi || '-'} ({formData.jurusan || '-'})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">Ekspektasi Gaji</span>
                      <span className="font-semibold text-slate-900">{formData.ekspektasi_gaji || '-'}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200">
                    <span className="text-slate-400 block mb-2 text-sm">Top Skills</span>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.filter(s => s.nama).map((skill, i) => (
                        <div key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-700 flex items-center gap-2">
                          {skill.nama} <span className="w-1 h-1 rounded-full bg-slate-300"></span> <span className="text-primary">{skill.level}</span>
                        </div>
                      ))}
                      {formData.skills.filter(s => s.nama).length === 0 && (
                        <span className="text-sm font-semibold text-slate-900">-</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrev} 
          disabled={currentStep === 1 || isSubmitting}
          className="rounded-full px-6 border-slate-200 text-slate-600 hover:bg-white"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        
        {currentStep < steps.length ? (
          <Button 
            onClick={handleNext}
            className="rounded-full px-8 bg-primary hover:bg-teal-800 text-white shadow-md shadow-primary/20"
          >
            Selanjutnya
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-full px-8 bg-primary hover:bg-teal-800 text-white shadow-md shadow-primary/20"
          >
            {isSubmitting ? "Menyimpan..." : "Selesai & Buat Profil"}
            {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        )}
      </div>
    </div>
  );
}
