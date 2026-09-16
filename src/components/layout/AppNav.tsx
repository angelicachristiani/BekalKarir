"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, LayoutDashboard, Briefcase, FileText, MessageSquare, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Cari Lowongan", icon: Briefcase },
  { href: "/interview", label: "Interview", icon: MessageSquare },
  { href: "/cv", label: "CV", icon: FileText },
  { href: "/applications", label: "Lamaran", icon: FileText },
];

export default function AppNav() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("bekalkarir_profile");
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* ── Desktop Header ── */}
      <header className="fixed top-0 w-full z-30 bg-white/80 backdrop-blur border-b border-slate-100 px-6 md:px-12 lg:px-24 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-xl text-primary flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-md shadow-primary/20">
            <Sparkles className="w-4 h-4" />
          </div>
          BekalKarir
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive(item.href)
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-slate-600 hover:text-primary hover:bg-slate-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
          >
            <span className="font-bold text-primary text-sm">
              {profile?.nama ? profile.nama.charAt(0).toUpperCase() : "U"}
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-[72px] right-4 left-4 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
            <Link
              href="/profile"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <User className="w-5 h-5" />
              Profil
            </Link>
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-100 md:hidden px-2 py-2 flex justify-around">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-all min-w-[56px] ${
              isActive(item.href)
                ? "text-primary"
                : "text-slate-400"
            }`}
          >
            <item.icon className={`w-5 h-5 ${isActive(item.href) ? "text-primary" : ""}`} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
