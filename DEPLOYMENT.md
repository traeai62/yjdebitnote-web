# 🚀 Panduan Deploy ke Vercel - Debit Note App

## ✅ Status Persiapan
- [x] Build test berhasil
- [x] Konfigurasi Vercel dibuat
- [x] Dokumentasi deployment lengkap
- [x] Template environment variables

---

## 📝 Langkah Cepat Deploy (5 Menit)

### 1️⃣ Push ke GitHub (Jika belum)
```bash
git push origin main
```

### 2️⃣ Login ke Vercel
🔗 Buka: https://vercel.com
- Login dengan GitHub

### 3️⃣ Import Project
- Klik **"Add New..."** → **"Project"**
- Pilih repository **yjdebitnote**

### 4️⃣ Configure (PENTING!)
```
Root Directory: web  ⚠️ JANGAN LUPA!
Framework: Next.js (auto-detected)
Build Command: npm run build
Output Directory: .next
```

### 5️⃣ Environment Variables
Tambahkan 2 variables ini:

**Variable 1:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: [URL Supabase Anda]
```

**Variable 2:**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [Anon Key Supabase Anda]
```

**📍 Cara dapat credentials Supabase:**
1. Buka https://supabase.com/dashboard
2. Pilih project Anda
3. Settings → API
4. Copy "Project URL" dan "anon public" key

### 6️⃣ Deploy!
- Klik **"Deploy"**
- Tunggu 2-3 menit ⏱️
- Done! 🎉

---

## 🔍 Troubleshooting

### ❌ Build Error
**Masalah:** "Command npm run build exited with 1"

**Solusi:**
1. Pastikan environment variables sudah di-set
2. Klik "Redeploy" di Vercel Dashboard

### ❌ Environment Variables Tidak Terbaca
**Masalah:** "NEXT_PUBLIC_SUPABASE_URL is not defined"

**Solusi:**
1. Cek nama variable dimulai dengan `NEXT_PUBLIC_`
2. Pastikan di-set untuk environment "Production"
3. Redeploy

---

## 📚 Dokumentasi Lengkap
Lihat file: `.agent/workflows/deploy-vercel.md`

---

## 🎯 Checklist Deployment

- [ ] Push kode ke GitHub
- [ ] Login ke Vercel
- [ ] Import project
- [ ] Set Root Directory ke `web`
- [ ] Tambahkan environment variables (2 variables)
- [ ] Deploy
- [ ] Test aplikasi di URL Vercel
- [ ] (Opsional) Setup custom domain

---

## 📞 Butuh Bantuan?
Baca dokumentasi lengkap di `.agent/workflows/deploy-vercel.md`
