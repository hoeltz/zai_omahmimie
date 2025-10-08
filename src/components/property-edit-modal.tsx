"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Home, FileText, Zap, Droplets, Shield, User, Camera, X, Edit } from "lucide-react"
import { toast } from "sonner"
import { PhotoUpload } from "@/components/photo-upload"
import { Property } from "./property-list"

const propertySchema = z.object({
  // Data Dasar & Harga
  jenisProperti: z.string().min(1, "Jenis properti wajib diisi"),
  statusListing: z.string().min(1, "Status listing wajib diisi"),
  hargaJualSewa: z.string().min(1, "Harga jual/sewa wajib diisi"),
  alamatLengkap: z.string().min(1, "Alamat lengkap wajib diisi"),
  
  // Spesifikasi Fisik
  luasTanah: z.string().optional(),
  luasBangunan: z.string().optional(),
  jumlahLantai: z.string().optional(),
  kamarTidur: z.string().optional(),
  kamarMandi: z.string().optional(),
  carportGarasi: z.string().optional(),
  arahHadap: z.string().optional(),
  kondisi: z.string().optional(),
  furnishing: z.string().optional(),
  
  // Legalitas
  jenisSertifikat: z.string().optional(),
  imb: z.string().optional(),
  pbb: z.string().optional(),
  
  // Utilitas & Air
  kapasitasListrik: z.string().optional(),
  tipeMeteran: z.string().optional(),
  sumberAirUtama: z.string().optional(),
  tandonAir: z.string().optional(),
  kapasitasTandon: z.string().optional(),
  
  // Fasilitas Lingkungan
  aksesJalan: z.string().optional(),
  lebarJalan: z.string().optional(),
  bebasBanjir: z.string().optional(),
  keamananKompleks: z.string().optional(),
  iplBulanan: z.string().optional(),
  fasilitasTerdekat: z.string().optional(),
  
  // Data Pemilik
  namaPemilik: z.string().min(1, "Nama pemilik wajib diisi"),
  noKontakAktif: z.string().min(1, "No. kontak aktif wajib diisi"),
  kondisiProperti: z.string().optional(),
  komisiAgen: z.string().optional(),
})

type PropertyFormData = z.infer<typeof propertySchema>

interface PropertyEditModalProps {
  property: Property | null
  open: boolean
  onClose: () => void
  onSave: () => void
}

export function PropertyEditModal({ property, open, onClose, onSave }: PropertyEditModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  
  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      jenisProperti: "",
      statusListing: "",
      hargaJualSewa: "",
      alamatLengkap: "",
      luasTanah: "",
      luasBangunan: "",
      jumlahLantai: "",
      kamarTidur: "",
      kamarMandi: "",
      carportGarasi: "",
      arahHadap: "",
      kondisi: "",
      furnishing: "",
      jenisSertifikat: "",
      imb: "",
      pbb: "",
      kapasitasListrik: "",
      tipeMeteran: "",
      sumberAirUtama: "",
      tandonAir: "",
      kapasitasTandon: "",
      aksesJalan: "",
      lebarJalan: "",
      bebasBanjir: "",
      keamananKompleks: "",
      iplBulanan: "",
      fasilitasTerdekat: "",
      namaPemilik: "",
      noKontakAktif: "",
      kondisiProperti: "",
      komisiAgen: "",
    },
  })

  useEffect(() => {
    if (property) {
      const propertyPhotos = property.photos ? JSON.parse(property.photos) : []
      setPhotos(propertyPhotos)
      
      form.reset({
        jenisProperti: property.jenisProperti || "",
        statusListing: property.statusListing || "",
        hargaJualSewa: property.hargaJualSewa || "",
        alamatLengkap: property.alamatLengkap || "",
        luasTanah: property.luasTanah?.toString() || "",
        luasBangunan: property.luasBangunan?.toString() || "",
        jumlahLantai: property.jumlahLantai?.toString() || "",
        kamarTidur: property.kamarTidur?.toString() || "",
        kamarMandi: property.kamarMandi?.toString() || "",
        carportGarasi: property.carportGarasi || "",
        arahHadap: property.arahHadap || "",
        kondisi: property.kondisi || "",
        furnishing: property.furnishing || "",
        jenisSertifikat: property.jenisSertifikat || "",
        imb: property.imb || "",
        pbb: property.pbb || "",
        kapasitasListrik: property.kapasitasListrik?.toString() || "",
        tipeMeteran: property.tipeMeteran || "",
        sumberAirUtama: property.sumberAirUtama || "",
        tandonAir: property.tandonAir || "",
        kapasitasTandon: property.kapasitasTandon?.toString() || "",
        aksesJalan: property.aksesJalan || "",
        lebarJalan: property.lebarJalan?.toString() || "",
        bebasBanjir: property.bebasBanjir || "",
        keamananKompleks: property.keamananKompleks || "",
        iplBulanan: property.iplBulanan || "",
        fasilitasTerdekat: property.fasilitasTerdekat || "",
        namaPemilik: property.namaPemilik || "",
        noKontakAktif: property.noKontakAktif || "",
        kondisiProperti: property.kondisiProperti || "",
        komisiAgen: property.komisiAgen || "",
      })
    }
  }, [property, form])

  const onSubmit = async (data: PropertyFormData) => {
    if (!property) return
    
    setIsSubmitting(true)
    try {
      const payload = {
        ...data,
        photos: JSON.stringify(photos)
      }
      
      const response = await fetch(`/api/properties/${property.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Gagal memperbarui data properti')
      }

      toast.success('Data properti berhasil diperbarui!')
      onSave()
      onClose()
    } catch (error) {
      toast.error('Terjadi kesalahan saat memperbarui data')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Properti - {property?.jenisProperti}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="dasar" className="w-full">
              <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 text-xs md:text-sm">
                <TabsTrigger value="dasar" className="flex items-center gap-1">
                  <Home className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden md:inline">Data Dasar</span>
                  <span className="md:hidden">Dasar</span>
                </TabsTrigger>
                <TabsTrigger value="spesifikasi" className="flex items-center gap-1">
                  <Home className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden md:inline">Spesifikasi</span>
                  <span className="md:hidden">Spes</span>
                </TabsTrigger>
                <TabsTrigger value="legalitas" className="flex items-center gap-1">
                  <FileText className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden md:inline">Legalitas</span>
                  <span className="md:hidden">Legal</span>
                </TabsTrigger>
                <TabsTrigger value="utilitas" className="flex items-center gap-1">
                  <Zap className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden md:inline">Utilitas</span>
                  <span className="md:hidden">Util</span>
                </TabsTrigger>
                <TabsTrigger value="lingkungan" className="flex items-center gap-1">
                  <Droplets className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden md:inline">Lingkungan</span>
                  <span className="md:hidden">Ling</span>
                </TabsTrigger>
                <TabsTrigger value="foto" className="flex items-center gap-1">
                  <Camera className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden md:inline">Foto</span>
                  <span className="md:hidden">Foto</span>
                </TabsTrigger>
                <TabsTrigger value="pemilik" className="flex items-center gap-1">
                  <User className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden md:inline">Pemilik</span>
                  <span className="md:hidden">Pemilik</span>
                </TabsTrigger>
              </TabsList>

              {/* Data Dasar & Harga */}
              <TabsContent value="dasar" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      Data Dasar & Harga
                    </CardTitle>
                    <CardDescription>
                      Informasi fundamental tentang properti
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="jenisProperti"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jenis Properti</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih jenis properti" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Rumah">Rumah</SelectItem>
                                <SelectItem value="Apartemen">Apartemen</SelectItem>
                                <SelectItem value="Tanah">Tanah</SelectItem>
                                <SelectItem value="Ruko">Ruko</SelectItem>
                                <SelectItem value="Gudang">Gudang</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="statusListing"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status Listing</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Dijual">Dijual</SelectItem>
                                <SelectItem value="Disewa">Disewa</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="hargaJualSewa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Harga Jual/Sewa</FormLabel>
                          <FormControl>
                            <Input placeholder="Contoh: Rp 500.000.000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="alamatLengkap"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alamat Lengkap</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Masukkan alamat lengkap properti" 
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Spesifikasi Fisik */}
              <TabsContent value="spesifikasi" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Spesifikasi Fisik</CardTitle>
                    <CardDescription>
                      Detail fisik dan kondisi bangunan
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="luasTanah"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Luas Tanah (m²)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="luasBangunan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Luas Bangunan (m²)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="jumlahLantai"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jumlah Lantai</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="kamarTidur"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kamar Tidur</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="kamarMandi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kamar Mandi</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="carportGarasi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Carport/Garasi</FormLabel>
                            <FormControl>
                              <Input placeholder="Contoh: 1 mobil" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="arahHadap"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Arah Hadap</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih arah hadap" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Utara">Utara</SelectItem>
                                <SelectItem value="Selatan">Selatan</SelectItem>
                                <SelectItem value="Timur">Timur</SelectItem>
                                <SelectItem value="Barat">Barat</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="kondisi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kondisi</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih kondisi" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Baru">Baru</SelectItem>
                                <SelectItem value="Seken">Seken</SelectItem>
                                <SelectItem value="Butuh Renovasi">Butuh Renovasi</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="furnishing"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Furnishing</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih furnishing" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                              <SelectItem value="Semi Furnished">Semi Furnished</SelectItem>
                              <SelectItem value="Full Furnished">Full Furnished</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Legalitas */}
              <TabsContent value="legalitas" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Legalitas & Dokumen
                    </CardTitle>
                    <CardDescription>
                      Informasi dokumen kepemilikan dan perizinan
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="jenisSertifikat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jenis Sertifikat</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih jenis sertifikat" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="SHM">SHM</SelectItem>
                                <SelectItem value="HGB">HGB</SelectItem>
                                <SelectItem value="SHMRS">SHMRS</SelectItem>
                                <SelectItem value="Lainnya">Lainnya</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="imb"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>IMB</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih status IMB" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Ada">Ada</SelectItem>
                                <SelectItem value="Tidak Ada">Tidak Ada</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="pbb"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PBB</FormLabel>
                          <FormControl>
                            <Input placeholder="Nomor PBB atau status pembayaran" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Utilitas & Air */}
              <TabsContent value="utilitas" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Utilitas & Air
                    </CardTitle>
                    <CardDescription>
                      Informasi listrik dan sumber air
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="kapasitasListrik"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kapasitas Listrik (VA)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Contoh: 2200" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tipeMeteran"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipe Meteran</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih tipe meteran" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Token">Token</SelectItem>
                                <SelectItem value="Pascabayar">Pascabayar</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sumberAirUtama"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sumber Air Utama</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih sumber air" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="PDAM">PDAM</SelectItem>
                                <SelectItem value="Sumur Bor">Sumur Bor</SelectItem>
                                <SelectItem value="Sumur Gali">Sumur Gali</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tandonAir"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tandon Air</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih status tandon air" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Ada">Ada</SelectItem>
                                <SelectItem value="Tidak Ada">Tidak Ada</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="kapasitasTandon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kapasitas Tandon (liter)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Contoh: 500" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Lingkungan */}
              <TabsContent value="lingkungan" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Droplets className="h-5 w-5" />
                      Lingkungan & Fasilitas
                    </CardTitle>
                    <CardDescription>
                      Informasi sekitar properti dan fasilitas umum
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="aksesJalan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Akses Jalan</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih akses jalan" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Aspal">Aspal</SelectItem>
                                <SelectItem value="Paving">Paving</SelectItem>
                                <SelectItem value="Tanah">Tanah</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lebarJalan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lebar Jalan (m)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Contoh: 4" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bebasBanjir"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bebas Banjir</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Ya">Ya</SelectItem>
                                <SelectItem value="Tidak">Tidak</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="keamananKompleks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Keamanan Kompleks</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih keamanan" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="24 Jam">24 Jam</SelectItem>
                                <SelectItem value="One Gate System">One Gate System</SelectItem>
                                <SelectItem value="Tidak Ada">Tidak Ada</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="iplBulanan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IPL Bulanan</FormLabel>
                          <FormControl>
                            <Input placeholder="Contoh: Rp 300.000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fasilitasTerdekat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fasilitas Terdekat</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Masukkan fasilitas terdekat seperti sekolah, rumah sakit, pusat perbelanjaan, dll" 
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Foto */}
              <TabsContent value="foto" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Foto Properti
                    </CardTitle>
                    <CardDescription>
                      Upload foto properti (maksimal 12 foto, format JPEG/PNG, maksimal 5MB per foto)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PhotoUpload photos={photos} setPhotos={setPhotos} maxPhotos={12} />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pemilik */}
              <TabsContent value="pemilik" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Data Pemilik
                    </CardTitle>
                    <CardDescription>
                      Informasi kontak pemilik properti
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="namaPemilik"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama Pemilik</FormLabel>
                            <FormControl>
                              <Input placeholder="Masukkan nama pemilik" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="noKontakAktif"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>No. Kontak Aktif</FormLabel>
                            <FormControl>
                              <Input placeholder="Masukkan nomor telepon/WhatsApp" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="kondisiProperti"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kondisi Properti</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih kondisi properti" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Kosong">Kosong</SelectItem>
                                <SelectItem value="Dihuni Pemilik">Dihuni Pemilik</SelectItem>
                                <SelectItem value="Sedang Disewa">Sedang Disewa</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="komisiAgen"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Komisi Agen</FormLabel>
                            <FormControl>
                              <Input placeholder="Contoh: 2.5% atau Rp 5.000.000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}