# 🏠 Omah Mimie - Aplikasi Manajemen Properti

Aplikasi manajemen properti modern yang dibangun dengan Next.js 15, TypeScript, dan Prisma. Dirancang khusus untuk kebutuhan agen properti dan manajemen real estat di Indonesia.

## ✨ Fitur Utama

### 📊 Manajemen Data Properti
- **Input Data Terstruktur**: Form lengkap sesuai standar industri properti Indonesia
- **Kategori Lengkap**: Data dasar, spesifikasi fisik, legalitas, utilitas, fasilitas lingkungan
- **Validasi Otomatis**: Memastikan semua data penting terisi dengan benar

### 📸 Manajemen Foto & Media
- **Upload Multiple**: Upload hingga 20 foto per properti
- **Photo Carousel**: Viewer foto dengan zoom hingga 300%
- **Navigasi Lengkap**: Keyboard navigation, thumbnail preview, touch support
- **Optimasi Otomatis**: Resize dan kompres foto untuk loading cepat

### 🎨 Desain Modern & Responsif
- **Colorful Themes**: Gradien warna menarik untuk setiap kategori
- **Mobile First**: Tampilan sempurna di desktop, tablet, dan mobile
- **Dark Mode Support**: Mode gelap untuk kenyamanan mata
- **Smooth Animations**: Transisi halus dan micro-interactions

### 🔍 Pencarian & Filter
- **Multi-kriteria**: Cari berdasarkan harga, lokasi, tipe, dll
- **Real-time Search**: Hasil pencarian instant tanpa reload
- **Advanced Filters**: Filter detail untuk spesifikasi properti

### 💾 Data Management
- **CRUD Operations**: Create, Read, Update, Delete dengan mudah
- **Data Export**: Export data ke format Excel/CSV
- **Backup & Restore**: Sistem backup data otomatis

## 🛠️ Teknologi Stack

### Core Framework
- **Next.js 15** - React framework dengan App Router
- **TypeScript 5** - Type safety dan developer experience
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Component library modern

### Database & Storage
- **Prisma ORM** - Database toolkit modern
- **SQLite** - Database lokal untuk development
- **Local Storage** - Client-side data persistence

### UI/UX
- **Lucide Icons** - Icon library modern
- **Framer Motion** - Animation library
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📁 Struktur Proyek

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── property-form.tsx  # Form input properti
│   ├── property-list.tsx  # Daftar properti
│   ├── property-view-modal.tsx  # Modal detail properti
│   └── photo-carousel.tsx  # Photo viewer dengan zoom
├── lib/                   # Utility libraries
│   ├── db.ts             # Database client
│   ├── utils.ts          # Helper functions
│   └── types.ts          # TypeScript definitions
└── types/                 # Type definitions
    └── property.ts        # Property types
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Installation

1. **Clone repository**
```bash
git clone <your-repo-url>
cd omah-mimie
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup database**
```bash
npm run db:push
```

4. **Run development server**
```bash
npm run dev
```

5. **Buka browser**
```
http://localhost:3000
```

## 📖 Panduan Penggunaan

### Menambah Properti Baru

1. Klik tombol **"Tambah Properti"** 
2. Isi data pada setiap tab:
   - **Data Dasar**: Jenis properti, harga, alamat
   - **Spesifikasi**: Luas, kamar, kondisi, furnishing
   - **Legalitas**: Sertifikat, IMB, PBB
   - **Utilitas**: Listrik, air, tandon
   - **Lingkungan**: Akses, keamanan, IPL
   - **Data Pemilik**: Kontak dan komisi
3. Upload foto properti (maks 20 foto)
4. Klik **"Simpan Properti"**

### Melihat Detail Properti

1. Klik properti dari daftar
2. Gunakan **Photo Carousel** untuk melihat foto:
   - Klik foto untuk zoom
   - Gunakan **+/-** untuk zoom in/out
   - Gunakan **←→** untuk navigasi
   - Klik **ESC** untuk keluar
3. Lihat semua data properti yang terorganisir

### Mengedit Properti

1. Klik tombol **Edit** pada detail properti
2. Ubah data yang diperlukan
3. Upload foto tambahan jika perlu
4. Klik **"Update Properti"**

### Menghapus Properti

1. Klik tombol **Delete** pada detail properti
2. Konfirmasi penghapusan
3. Properti akan dihapus permanen

## 🎨 Customization

### Mengubah Warna Tema

Edit file `src/app/globals.css`:

```css
:root {
  --primary: 210 40% 98%;
  --secondary: 210 40% 96%;
  /* ... */
}
```

### Menambah Kategori Data

Edit file `src/types/property.ts`:

```typescript
export interface Property {
  // ... existing fields
  newField?: string;
}
```

### Custom Photo Carousel

Edit file `src/components/photo-carousel.tsx` untuk mengubah:
- Zoom level maksimal
- Animasi transisi
- Layout thumbnail

## 🔧 Configuration

### Environment Variables

Buat file `.env.local`:

```env
# Database
DATABASE_URL="file:./dev.db"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# API (jika diperlukan)
API_BASE_URL="your-api-url"
```

### Database Schema

Edit file `prisma/schema.prisma` untuk mengubah struktur database:

```prisma
model Property {
  id          String   @id @default(cuid())
  // ... fields
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 📱 Mobile App

Aplikasi ini sudah dioptimasi untuk mobile:
- **Responsive Design**: Adaptif ke semua ukuran layar
- **Touch Gestures**: Swipe untuk navigasi foto
- **PWA Ready**: Bisa diinstall sebagai mobile app

## 🚀 Deployment

### Vercel (Recommended)

1. Push ke GitHub
2. Hubungkan ke Vercel
3. Deploy otomatis

### Manual Deployment

```bash
# Build untuk production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork repository
2. Buat branch baru: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push ke branch: `git push origin feature/new-feature`
5. Submit Pull Request

## 📝 Development Notes

### Performance Tips
- Gunakan `next/image` untuk optimasi foto
- Implementasi lazy loading untuk daftar panjang
- Gunakan React.memo untuk component optimization

### Best Practices
- Follow TypeScript strict mode
- Gunakan semantic HTML5
- Implementasi proper error boundaries
- Test di multiple devices

## 🐛 Troubleshooting

### Common Issues

**Database tidak terhubung:**
```bash
npm run db:push
```

**Foto tidak muncul:**
- Periksa format file (JPG/PNG)
- Pastikan ukuran < 10MB
- Refresh browser

**Performance lambat:**
- Hapus foto yang tidak perlu
- Clear browser cache
- Restart development server

## 📄 License

MIT License - lihat file [LICENSE](LICENSE) untuk detail

## 👥 Team

- **Developer**: Your Name
- **Designer**: Your Designer
- **Product Manager**: Your PM

## 📞 Support

Hubungi kami untuk support:
- Email: support@omahmimie.com
- WA: +62 812-3456-7890
- Website: www.omahmimie.com

---

**Omah Mimie** - Solusi lengkap manajemen properti modern 🏠✨