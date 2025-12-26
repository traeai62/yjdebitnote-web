---
description: Deploy aplikasi ke Vercel
---

# Workflow: Deploy ke Vercel

Workflow ini menjelaskan cara deploy aplikasi Debit Note ke Vercel.

## Prasyarat

1. Akun Vercel (gratis di [vercel.com](https://vercel.com))
2. Repository Git (GitHub/GitLab/Bitbucket)
3. Credentials Supabase:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Langkah-langkah

### Metode 1: Via Vercel Dashboard (Recommended)

#### 1. Push kode ke Git repository
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### 2. Login ke Vercel
- Buka https://vercel.com
- Login dengan akun GitHub/GitLab/Bitbucket

#### 3. Import Project
- Klik "Add New..." → "Project"
- Pilih repository Anda
- Vercel akan auto-detect Next.js

#### 4. Configure Project
**PENTING**: Set Root Directory ke `web`

- **Root Directory**: `web`
- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

#### 5. Set Environment Variables
Tambahkan environment variables berikut di Vercel Dashboard:

| Variable Name | Description | Example |
|--------------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase project | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

**Cara mendapatkan Supabase credentials**:
1. Login ke https://supabase.com/dashboard
2. Pilih project Anda
3. Buka Settings → API
4. Copy "Project URL" dan "anon public" key

#### 6. Deploy
- Klik "Deploy"
- Tunggu proses build selesai (2-3 menit)
- Aplikasi akan live di `https://your-project.vercel.app`

---

### Metode 2: Via Vercel CLI

#### 1. Install Vercel CLI (jika belum)
```bash
npm install -g vercel
```

#### 2. Login ke Vercel
```bash
vercel login
```

#### 3. Deploy dari folder web
```bash
cd web
vercel
```

Ikuti prompt:
- Set up and deploy? **Yes**
- Which scope? (pilih akun Anda)
- Link to existing project? **No**
- Project name? (biarkan default atau custom)
- In which directory is your code located? `./`
- Want to modify settings? **No**

#### 4. Set Environment Variables
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Input nilai URL Supabase Anda

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Input nilai Anon Key Supabase Anda
```

#### 5. Deploy ke Production
```bash
vercel --prod
```

---

## Troubleshooting

### Build Error: "Command npm run build exited with 1"
**Penyebab**: Environment variables belum di-set

**Solusi**:
1. Pastikan environment variables sudah ditambahkan di Vercel Dashboard
2. Redeploy dengan klik "Redeploy" di Vercel Dashboard

### Error: "NEXT_PUBLIC_SUPABASE_URL is not defined"
**Penyebab**: Environment variables tidak terbaca

**Solusi**:
1. Cek apakah environment variables dimulai dengan `NEXT_PUBLIC_`
2. Pastikan environment variables di-set untuk environment "Production"
3. Redeploy aplikasi

### Build berhasil tapi aplikasi error saat diakses
**Penyebab**: Database Supabase tidak accessible atau credentials salah

**Solusi**:
1. Verifikasi credentials Supabase benar
2. Cek apakah tabel `debit_notes` sudah dibuat di Supabase
3. Pastikan Row Level Security (RLS) di Supabase sudah dikonfigurasi dengan benar

---

## Update Deployment

Setelah deployment pertama, setiap kali Anda push ke branch `main`, Vercel akan otomatis rebuild dan redeploy aplikasi.

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel akan otomatis:
1. Detect perubahan
2. Build aplikasi
3. Deploy ke production

---

## Custom Domain (Opsional)

Untuk menggunakan domain custom:

1. Buka project di Vercel Dashboard
2. Klik "Settings" → "Domains"
3. Tambahkan domain Anda
4. Update DNS records sesuai instruksi Vercel
5. Tunggu DNS propagation (5-48 jam)

---

## Monitoring

Setelah deploy, Anda bisa monitor aplikasi di:
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Analytics**: Lihat traffic dan performance
- **Logs**: Debug errors dan issues
