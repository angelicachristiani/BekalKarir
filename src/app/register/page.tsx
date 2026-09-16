import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl mx-auto flex items-center justify-center text-white mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Coba BekalKarir</h1>
          <p className="text-slate-500 mt-2">Mulai perjalanan karirmu dalam mode demo.</p>
        </div>

        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 mb-6">
          <p className="text-sm text-teal-800 text-center">
            <span className="font-bold">Prototype Demo</span> — Tidak perlu email atau password. Data tersimpan lokal di browser.
          </p>
        </div>

        <Link
          href="/onboarding"
          className={buttonVariants({ className: "w-full h-12 rounded-xl bg-primary text-white text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform" })}
        >
          Mulai Onboarding
        </Link>

        <div className="mt-8 text-center text-slate-500 text-sm">
          Sudah mencoba? <Link href="/login" className="font-bold text-primary hover:underline">Lihat mode demo</Link>
        </div>
      </div>
    </div>
  );
}
