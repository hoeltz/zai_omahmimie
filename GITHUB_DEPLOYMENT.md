# 🚀 GitHub Deployment Guide

## 📋 Langkah-langkah Deploy ke GitHub

### 1. Buat Repository GitHub

1. Login ke [GitHub](https://github.com)
2. Klik **"New repository"**
3. Isi detail:
   - **Repository name**: `omah-mimie` (atau nama pilihan Anda)
   - **Description**: `Aplikasi Manajemen Properti Modern`
   - **Visibility**: Pilih **Public** atau **Private**
   - **Jangan centang** "Add a README file" (karena sudah ada)
4. Klik **"Create repository"**

### 2. Push ke GitHub

Setelah repository dibuat, GitHub akan menampilkan perintah. Ikuti langkah ini:

```bash
# Tambahkan remote repository
git remote add origin https://github.com/USERNAME/omah-mimie.git

# Push ke GitHub
git push -u origin master
```

**Ganti `USERNAME` dengan username GitHub Anda**

### 3. Deploy ke Vercel (Recommended)

1. Buka [Vercel](https://vercel.com)
2. Login dengan akun GitHub Anda
3. Klik **"New Project"**
4. Pilih repository `omah-mimie`
5. Klik **"Import"**
6. Vercel akan otomatis mendeteksi Next.js project
7. Klik **"Deploy"**

### 4. Environment Variables di Vercel

Jika menggunakan environment variables:

1. Di dashboard Vercel, klik project Anda
2. Pergi ke **Settings → Environment Variables**
3. Tambahkan variables yang diperlukan:
   ```
   DATABASE_URL=file:./dev.db
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-secret-key
   ```

### 5. Alternative: GitHub Pages

Jika ingin deploy ke GitHub Pages:

1. Di repository GitHub, buka **Settings**
2. Pergi ke **Pages**
3. Di **Source**, pilih **GitHub Actions**
4. Buat file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ master ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build project
      run: npm run build
    
    - name: Export static files
      run: npm run export
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
```

## 🔧 Konfigurasi Tambahan

### Update package.json untuk Static Export

Tambahkan script berikut di `package.json`:

```json
{
  "scripts": {
    "export": "next build && next export"
  }
}
```

### Update next.config.ts

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

export default nextConfig
```

## 📱 Deployment Checklist

Sebelum deploy, pastikan:

- [ ] Semua dependencies terinstall
- [ ] Database sudah di-setup
- [ ] Environment variables sudah dikonfigurasi
- [ ] Build berhasil tanpa error
- [ ] Testing di production environment

## 🌐 Akses Aplikasi

Setelah deploy:

- **Vercel**: `https://your-project.vercel.app`
- **GitHub Pages**: `https://username.github.io/omah-mimie`

## 🔄 Auto-Deploy

Setup auto-deploy untuk setiap push:

### Vercel (Auto)
- Otomatis deploy setiap push ke main branch

### GitHub Pages
- Deploy otomatis via GitHub Actions

## 🐛 Troubleshooting

### Build Errors
```bash
# Clean build
rm -rf .next node_modules
npm install
npm run build
```

### Database Issues
- Pastikan `DATABASE_URL` benar
- Check database permissions

### Environment Variables
- Verify semua variables ter-set dengan benar
- Check naming conventions

## 📞 Support

Jika mengalami masalah:

1. Check deployment logs
2. Verify environment variables
3. Test locally dengan production build
4. Contact support platform yang digunakan

---

**Selamat deploy! 🎉**