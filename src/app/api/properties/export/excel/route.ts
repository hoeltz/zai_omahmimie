import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import * as XLSX from 'xlsx'

export async function GET() {
  try {
    const properties = await db.property.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Check if there are properties to export
    if (properties.length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada data properti untuk diekspor' },
        { status: 404 }
      )
    }

    // Transform data for Excel
    const excelData = properties.map((property, index) => ({
      'No': index + 1,
      'Jenis Properti': property.jenisProperti || '-',
      'Status Listing': property.statusListing || '-',
      'Harga Jual/Sewa': property.hargaJualSewa || '-',
      'Alamat Lengkap': property.alamatLengkap || '-',
      'Luas Tanah (m²)': property.luasTanah || '-',
      'Luas Bangunan (m²)': property.luasBangunan || '-',
      'Jumlah Lantai': property.jumlahLantai || '-',
      'Kamar Tidur': property.kamarTidur || '-',
      'Kamar Mandi': property.kamarMandi || '-',
      'Carport/Garasi': property.carportGarasi || '-',
      'Arah Hadap': property.arahHadap || '-',
      'Kondisi': property.kondisi || '-',
      'Furnishing': property.furnishing || '-',
      'Jenis Sertifikat': property.jenisSertifikat || '-',
      'IMB': property.imb || '-',
      'PBB': property.pbb || '-',
      'Kapasitas Listrik (VA)': property.kapasitasListrik || '-',
      'Tipe Meteran': property.tipeMeteran || '-',
      'Sumber Air Utama': property.sumberAirUtama || '-',
      'Tandon Air': property.tandonAir || '-',
      'Kapasitas Tandon (liter)': property.kapasitasTandon || '-',
      'Akses Jalan': property.aksesJalan || '-',
      'Lebar Jalan (m)': property.lebarJalan || '-',
      'Bebas Banjir': property.bebasBanjir || '-',
      'Keamanan Kompleks': property.keamananKompleks || '-',
      'IPL Bulanan': property.iplBulanan || '-',
      'Fasilitas Terdekat': property.fasilitasTerdekat || '-',
      'Nama Pemilik': property.namaPemilik || '-',
      'No. Kontak Aktif': property.noKontakAktif || '-',
      'Kondisi Properti': property.kondisiProperti || '-',
      'Komisi Agen': property.komisiAgen || '-',
      'Tanggal Dibuat': new Date(property.createdAt).toLocaleDateString('id-ID'),
    }))

    // Create workbook
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(excelData)

    // Set column widths
    const colWidths = [
      { wch: 5 },  // No
      { wch: 15 }, // Jenis Properti
      { wch: 12 }, // Status Listing
      { wch: 15 }, // Harga
      { wch: 30 }, // Alamat
      { wch: 12 }, // Luas Tanah
      { wch: 15 }, // Luas Bangunan
      { wch: 12 }, // Jumlah Lantai
      { wch: 12 }, // Kamar Tidur
      { wch: 12 }, // Kamar Mandi
      { wch: 15 }, // Carport/Garasi
      { wch: 12 }, // Arah Hadap
      { wch: 12 }, // Kondisi
      { wch: 15 }, // Furnishing
      { wch: 15 }, // Jenis Sertifikat
      { wch: 8 },  // IMB
      { wch: 15 }, // PBB
      { wch: 15 }, // Kapasitas Listrik
      { wch: 12 }, // Tipe Meteran
      { wch: 15 }, // Sumber Air
      { wch: 12 }, // Tandon Air
      { wch: 18 }, // Kapasitas Tandon
      { wch: 12 }, // Akses Jalan
      { wch: 12 }, // Lebar Jalan
      { wch: 12 }, // Bebas Banjir
      { wch: 18 }, // Keamanan Kompleks
      { wch: 12 }, // IPL Bulanan
      { wch: 30 }, // Fasilitas Terdekat
      { wch: 20 }, // Nama Pemilik
      { wch: 15 }, // No. Kontak
      { wch: 15 }, // Kondisi Properti
      { wch: 12 }, // Komisi Agen
      { wch: 15 }, // Tanggal Dibuat
    ]
    ws['!cols'] = colWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Data Properti')

    // Generate buffer
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="property-data-${new Date().toISOString().split('T')[0]}.xlsx"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Error generating Excel:', error)
    return NextResponse.json(
      { error: 'Gagal generate Excel: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}