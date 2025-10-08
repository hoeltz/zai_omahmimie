import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    const property = await db.property.findUnique({
      where: {
        id: id,
      },
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
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

    const property = await db.property.update({
      where: {
        id: id,
      },
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

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    const property = await db.property.delete({
      where: {
        id: id,
      },
    })

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}