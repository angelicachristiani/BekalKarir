import { OnboardingForm } from "@/components/onboarding-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <header className="p-6 md:px-12 w-full flex items-center">
        <Link href="/" className="flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>
      </header>

      <div className="flex-1 px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Mulai Perjalanan Karirmu</h1>
          <p className="text-slate-600 text-lg">Isi data di bawah ini untuk mendapatkan rekomendasi dan profil karir terbaik untukmu.</p>
        </div>

        <OnboardingForm />
      </div>
    </main>
  );
}
