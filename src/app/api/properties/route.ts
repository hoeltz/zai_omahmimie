import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      jenisProperti,
      statusListing,
      hargaJualSewa,
      alamatLengkap,
      luasTanah,
      luasBangunan,
      jumlahLantai,
      kamarTidur,
      kamarMandi,
      carportGarasi,
      arahHadap,
      kondisi,
      furnishing,
      jenisSertifikat,
      imb,
      pbb,
      kapasitasListrik,
      tipeMeteran,
      sumberAirUtama,
      tandonAir,
      kapasitasTandon,
      aksesJalan,
      lebarJalan,
      bebasBanjir,
      keamananKompleks,
      iplBulanan,
      fasilitasTerdekat,
      namaPemilik,
      noKontakAktif,
      kondisiProperti,
      komisiAgen,
      photos,
    } = body

    const property = await db.property.create({
      data: {
        jenisProperti,
        statusListing,
        hargaJualSewa,
        alamatLengkap,
        luasTanah: luasTanah ? parseInt(luasTanah) : null,
        luasBangunan: luasBangunan ? parseInt(luasBangunan) : null,
        jumlahLantai: jumlahLantai ? parseInt(jumlahLantai) : null,
        kamarTidur: kamarTidur ? parseInt(kamarTidur) : null,
        kamarMandi: kamarMandi ? parseInt(kamarMandi) : null,
        carportGarasi,
        arahHadap,
        kondisi,
        furnishing,
        jenisSertifikat,
        imb,
        pbb,
        kapasitasListrik: kapasitasListrik ? parseInt(kapasitasListrik) : null,
        tipeMeteran,
        sumberAirUtama,
        tandonAir,
        kapasitasTandon: kapasitasTandon ? parseInt(kapasitasTandon) : null,
        aksesJalan,
        lebarJalan: lebarJalan ? parseInt(lebarJalan) : null,
        bebasBanjir,
        keamananKompleks,
        iplBulanan,
        fasilitasTerdekat,
        namaPemilik,
        noKontakAktif,
        kondisiProperti,
        komisiAgen,
        photos: photos || null,
      },
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const properties = await db.property.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(properties)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}