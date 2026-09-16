# BekalKarir — Project Context

## Project

Nama:
BekalKarir

Konsep:
Platform pencarian dan persiapan kerja berbasis AI untuk mahasiswa, fresh graduate, dan early-career job seekers.

Tema lomba:

"Shaping Tomorrow: Digital Innovation, Artificial Intelligence, and Sustainable Communities"

## Bahasa Produk

Seluruh website menggunakan Bahasa Indonesia.

Tone:
- modern
- profesional
- friendly
- suportif
- tidak menghakimi

---

# PRODUCT VISION

BekalKarir membantu pengguna menemukan pekerjaan yang sesuai dengan skill nyata, lokasi, pengalaman, ekspektasi gaji, dan preferensi kerja.

Prinsip utama:

## Skill Integrity

Pengguna tidak boleh didorong untuk mengarang atau melebih-lebihkan skill.

AI boleh membantu:
- memperbaiki struktur CV
- memperjelas deskripsi pengalaman
- meningkatkan grammar
- memberikan rekomendasi skill gap

AI tidak boleh mengarang:
- skill
- pengalaman
- sertifikasi
- proyek
- pencapaian

---

# TARGET USER

Prioritas:
- mahasiswa
- mahasiswa tingkat akhir
- fresh graduate
- first-job seekers
- early-career job seekers

---

# DESIGN SYSTEM

Palette:

#0F766E
#2DD4BF
#99F6E4
#FDE68A
#FFF7ED

Dominan:
- warm yellow
- cream

Accent:
- teal

Gaya:
- modern
- minimal
- premium
- youthful
- professional
- clean
- whitespace
- strong typography
- subtle micro-interactions

Hindari:
- corporate blue generik
- excessive gradients
- excessive glassmorphism
- terlalu banyak rounded cards
- childish UI
- generic AI dashboard

---

# TECH STACK

Frontend:
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

Icons:
- Lucide

Backend:
- Next.js server/API architecture

Database:
- Supabase / PostgreSQL

AI:
- Gemini melalui abstraction/service layer

AI API key harus berada di environment variable.

Jangan hardcode API key.

---

# PRODUCT ARCHITECTURE

User
↓
Smart Onboarding
↓
Career Profile
↓
Skill Profile
↓
AI Job Matching
↓
Job Discovery
↓
CV Analyzer
↓
AI Interview
↓
Application Tracking
↓
Local/Sustainable Opportunities

---

# FASE 1 — SELESAI

## Foundation & Onboarding

Sudah selesai:

- Next.js project initialization
- TypeScript
- Tailwind
- shadcn/ui
- Design System
- Landing Page
- Smart Onboarding
- Career Profile
- Skill Profile
- Supabase setup
- Authentication

Smart Onboarding mencakup informasi seperti:

- nama
- pendidikan
- jurusan
- lokasi
- skill
- proficiency
- pengalaman
- proyek
- sertifikasi
- preferensi kerja
- ekspektasi gaji
- bidang karier

Skill proficiency:
- Pemula
- Menengah
- Mahir

Output onboarding:
Career Profile

---

# FASE 2 — SELESAI

## AI Core Services: Matching & Discovery

Sudah selesai:

- mock job data
- mock local/community opportunities
- Gemini API service abstraction
- AI Job Matching
- Match Score
- Match Score Breakdown
- Job Discovery UI
- Job Detail
- Search
- Filter
- Sorting
- Save/Unsave Job
- Local Opportunities
- AI explanation

Match Score terdiri dari:

Skill Match
Location Match
Salary Match
Experience Match
Work Preference Match

Contoh:

94% Cocok

Matched:
- Python
- SQL
- Excel

Missing:
- Power BI

AI harus menjelaskan:

"Kenapa pekerjaan ini cocok untukmu?"

---

# SUSTAINABLE COMMUNITY

Fitur:

"Peluang di Sekitarmu"

Menampilkan:
- pekerjaan lokal
- UMKM
- startup lokal
- community projects
- social impact
- green opportunities

Tujuannya:
Menghubungkan skill pengguna dengan peluang yang relevan di komunitas sekitar.

---

# FASE 3 — BERIKUTNYA

## AI Interview Simulator

Jangan mengerjakan Fase 4 sebelum Fase 3 selesai.

Target flow:

Dashboard
↓
AI Interview Simulator
↓
Pilih pekerjaan
↓
Pilih jenis interview
↓
Briefing
↓
Camera + Microphone Check
↓
Interview Room
↓
AI Questions
↓
User Answer
↓
Transcript
↓
AI Follow-up
↓
Interview selesai
↓
AI Feedback
↓
Score
↓
Improvement Recommendations

Jenis interview:

1. Interview HR
2. Interview Teknis
3. Interview Campuran

---

# AI INTERVIEW

AI harus dapat:

- membuat pertanyaan relevan
- membuat follow-up
- mempertimbangkan job description
- mempertimbangkan skill user
- menganalisis jawaban
- memberikan feedback
- memberikan score

Feedback berdasarkan:

- relevance
- structure
- communication
- clarity
- examples
- STAR method
- filler words
- speaking pace

Untuk visual presentation:
boleh menganalisis:
- camera framing
- lighting
- eye contact
- camera position

JANGAN menilai:
- attractiveness
- beauty
- body shape
- skin color
- ethnicity
- karakteristik fisik yang tidak relevan

---

# BROWSER FEATURES

Gunakan:

Webcam
Microphone
Web Speech API
SpeechSynthesis

Jika Speech Recognition tidak tersedia:

Gunakan text input fallback.

Jika Gemini tidak tersedia:

Gunakan deterministic/mock interview fallback.

Prototype harus tetap bisa berjalan tanpa API.

---

# IMPORTANT IMPLEMENTATION RULES

1. Jangan merusak fitur Fase 1.
2. Jangan merusak fitur Fase 2.
3. Jangan mengubah design system tanpa alasan.
4. Jangan menghapus data/model existing tanpa memeriksa dependency.
5. Jangan langsung membuat production-level architecture yang terlalu kompleks.
6. Prioritaskan functional prototype.
7. Semua UI Bahasa Indonesia.
8. Jangan hardcode API key.
9. Gunakan environment variables.
10. Gunakan mock fallback jika external API tidak tersedia.
11. Jangan lanjut ke Fase 4 sebelum Fase 3 selesai.

---

# CURRENT STATUS

FASE 1: ✅ SELESAI
FASE 2: ✅ SELESAI
FASE 3: ⏳ NEXT
FASE 4: ⏳
FASE 5: ⏳

---

# CURRENT OBJECTIVE

Implementasikan FASE 3:

AI INTERVIEW SIMULATOR

Prioritaskan:

1. Interview selection
2. Camera permission
3. Microphone permission
4. Interview room
5. Speech-to-text
6. Text-to-speech
7. AI interview agent
8. Follow-up questions
9. Interview feedback
10. Score
11. Result page
12. Interview history
13. Fallback mode
14. Responsive design

STOP setelah Fase 3.

Jangan lanjut ke Fase 4.
