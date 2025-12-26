# Debit Note Application

Aplikasi untuk membuat dan mengelola debit note dengan integrasi Supabase.

## Tech Stack

- **Framework**: Next.js 16
- **Database**: Supabase
- **Styling**: Tailwind CSS v4
- **Form Management**: React Hook Form + Zod
- **PDF Generation**: html2pdf.js

## Environment Variables

Aplikasi ini memerlukan environment variables berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Buat file `.env.local` dan isi dengan environment variables di atas

3. Jalankan development server:
```bash
npm run dev
```

4. Buka [http://localhost:3000](http://localhost:3000)

## Deploy ke Vercel

### Metode 1: Deploy via Vercel Dashboard (Recommended)

1. **Push kode ke Git repository** (GitHub, GitLab, atau Bitbucket)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Login ke Vercel**
   - Kunjungi [vercel.com](https://vercel.com)
   - Login dengan akun GitHub/GitLab/Bitbucket Anda

3. **Import Project**
   - Klik "Add New..." → "Project"
   - Pilih repository Anda
   - Vercel akan otomatis mendeteksi Next.js

4. **Configure Project**
   - **Root Directory**: `web` (karena projek Next.js ada di folder `web`)
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. **Set Environment Variables**
   Tambahkan environment variables berikut di Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL Supabase Anda
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon key dari Supabase

6. **Deploy**
   - Klik "Deploy"
   - Tunggu proses build selesai
   - Aplikasi Anda akan live di `https://your-project.vercel.app`

### Metode 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login ke Vercel**
   ```bash
   vercel login
   ```

3. **Deploy dari folder web**
   ```bash
   cd web
   vercel
   ```

4. **Ikuti prompt**
   - Set up and deploy? Yes
   - Which scope? (pilih akun Anda)
   - Link to existing project? No
   - What's your project's name? (nama projek)
   - In which directory is your code located? `./`
   - Want to override the settings? No

5. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

6. **Deploy Production**
   ```bash
   vercel --prod
   ```

## Supabase Setup

Pastikan Anda sudah membuat tabel di Supabase dengan struktur yang sesuai. Aplikasi ini menggunakan tabel `debit_notes` dengan kolom-kolom yang diperlukan.

## Features

- ✅ Buat debit note baru
- ✅ Edit debit note
- ✅ Lihat detail debit note
- ✅ Export ke PDF
- ✅ Import dari Excel
- ✅ Responsive design

## Troubleshooting

### Build Error di Vercel

Jika terjadi error saat build:
1. Pastikan semua environment variables sudah diset
2. Cek versi Node.js (Vercel menggunakan Node.js 18+ by default)
3. Pastikan tidak ada TypeScript errors

### Environment Variables Tidak Terbaca

- Pastikan environment variables dimulai dengan `NEXT_PUBLIC_` untuk client-side access
- Redeploy setelah menambahkan environment variables baru

## License

Private
