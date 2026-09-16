"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, MapPin, Mail, GraduationCap, Briefcase, Settings2, Target, Download, Zap } from "lucide-react";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem("bekalkarir_profile");
    if (data) {
      setProfileData(JSON.parse(data));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>;
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center space-y-4">
        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
          <User className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Profil Belum Ditemukan</h1>
        <p className="text-slate-500 max-w-md">Sepertinya kamu belum menyelesaikan Smart Onboarding. Yuk, isi profilmu sekarang!</p>
        <Link href="/onboarding" className={buttonVariants({ className: "mt-4 rounded-full px-8 bg-primary" })}>Mulai Onboarding</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header / Navbar Profile */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-xl text-primary flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white">
            <Zap className="w-4 h-4" />
          </div>
          BekalKarir
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="rounded-full text-slate-600">
            <Download className="w-4 h-4 mr-2" />
            Unduh CV
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8">
        {/* Profile Hero section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-5xl font-bold shadow-lg shadow-primary/20 shrink-0">
            {profileData.nama ? profileData.nama.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{profileData.nama || 'Pengguna Baru'}</h1>
              <p className="text-lg text-slate-500 mt-1">{profileData.bidang_karir || 'Eksplorasi Karir'}</p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-600">
              {profileData.lokasi && (
                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> {profileData.lokasi}</div>
              )}
              {profileData.email && (
                <div className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-primary" /> {profileData.email}</div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-secondary/30 text-teal-800 rounded-full text-xs font-semibold">Tipe: {profileData.tipe_pekerjaan}</span>
              <span className="px-3 py-1 bg-secondary/30 text-teal-800 rounded-full text-xs font-semibold">Lokasi: {profileData.preferensi_lokasi}</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Skill Profile */}
            <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Zap className="w-5 h-5 text-primary" />
                  Skill Profile & Proficiency
                </CardTitle>
                <CardDescription>Keahlian yang kamu miliki saat ini</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {profileData.skills?.filter((s: any) => s.nama).length > 0 ? (
                    profileData.skills.filter((s: any) => s.nama).map((skill: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-primary/30 transition-colors">
                        <span className="font-semibold text-slate-800">{skill.nama}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          skill.level === 'Mahir' ? 'bg-primary/10 text-primary' : 
                          skill.level === 'Menengah' ? 'bg-accent/20 text-teal-800' : 
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {skill.level}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-500 text-sm">Belum ada skill yang ditambahkan.</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pengalaman */}
            <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Pengalaman
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {profileData.pengalaman?.filter((p: any) => p.perusahaan).length > 0 ? (
                    profileData.pengalaman.filter((p: any) => p.perusahaan).map((pengalaman: any, i: number) => (
                      <div key={i} className="relative pl-6 pb-6 border-l-2 border-slate-100 last:border-0 last:pb-0">
                        <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 shadow-[0_0_0_4px_white]"></div>
                        <h4 className="font-bold text-slate-900 text-lg">{pengalaman.posisi}</h4>
                        <p className="text-primary font-medium">{pengalaman.perusahaan}</p>
                        <p className="text-slate-500 text-sm mt-1">{pengalaman.durasi}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-500 text-sm">Belum ada pengalaman yang ditambahkan.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Pendidikan */}
            <Card className="rounded-3xl border-slate-100 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Pendidikan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-bold text-slate-800">{profileData.institusi || '-'}</p>
                  <p className="text-slate-600">{profileData.jurusan || '-'}</p>
                  <p className="text-slate-400 text-sm">{profileData.status_pendidikan || '-'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Ekspektasi & Preferensi */}
            <Card className="rounded-3xl border-slate-100 shadow-sm bg-slate-900 text-white border-0">
              <CardHeader className="pb-3 border-b border-slate-800">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <Target className="w-5 h-5 text-accent" />
                  Target Karir
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <span className="text-slate-400 block text-xs mb-1 uppercase tracking-wider font-semibold">Ekspektasi Gaji</span>
                  <span className="font-medium text-lg">{profileData.ekspektasi_gaji || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs mb-1 uppercase tracking-wider font-semibold">Bidang Karir</span>
                  <span className="font-medium text-lg text-accent">{profileData.bidang_karir || '-'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
