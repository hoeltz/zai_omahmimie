import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jsPDF from 'jspdf'

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

    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(20)
    doc.text('LAPORAN DATA PROPERTI', 105, 20, { align: 'center' })
    
    doc.setFontSize(12)
    doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 105, 30, { align: 'center' })
    doc.text(`Total Properti: ${properties.length}`, 105, 37, { align: 'center' })
    
    let yPosition = 50
    
    properties.forEach((property, index) => {
      // Check if we need a new page
      if (yPosition > 240) {
        doc.addPage()
        yPosition = 20
      }
      
      // Property number
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text(`${index + 1}. ${property.jenisProperti} - ${property.statusListing}`, 20, yPosition)
      yPosition += 10
      
      // Property details
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      
      const details = [
        `Harga: ${property.hargaJualSewa}`,
        `Alamat: ${property.alamatLengkap}`,
        `Luas Tanah: ${property.luasTanah || '-'} m²`,
        `Luas Bangunan: ${property.luasBangunan || '-'} m²`,
        `Kamar Tidur: ${property.kamarTidur || '-'}`,
        `Kamar Mandi: ${property.kamarMandi || '-'}`,
        `Sertifikat: ${property.jenisSertifikat || '-'}`,
        `Pemilik: ${property.namaPemilik}`,
        `Kontak: ${property.noKontakAktif}`,
      ]
      
      details.forEach(detail => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(detail, 25, yPosition)
        yPosition += 6
      })
      
      yPosition += 8
    })
    
    // Add simple footer
    doc.setFontSize(8)
    doc.text(`Generated on ${new Date().toLocaleDateString('id-ID')} by Omah Mimie`, 105, 285, { align: 'center' })
    
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="property-data-${new Date().toISOString().split('T')[0]}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Gagal generate PDF: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}