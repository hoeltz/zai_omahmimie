"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Home, FileText, Zap, Droplets, Shield, User, Download, Camera } from "lucide-react"
import { toast } from "sonner"
import { PhotoUpload } from "@/components/photo-upload"

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

export function PropertyForm() {
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

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true)
    try {
      const payload = {
        ...data,
        photos: JSON.stringify(photos)
      }
      
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Gagal menyimpan data properti')
      }

      toast.success('Data properti berhasil disimpan!')
      form.reset()
      setPhotos([])
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan data')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const exportToPDF = async () => {
    try {
      const response = await fetch('/api/properties/export/pdf')
      if (!response.ok) throw new Error('Gagal export PDF')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `property-data-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('PDF berhasil diunduh!')
    } catch (error) {
      toast.error('Gagal mengunduh PDF')
      console.error(error)
    }
  }

  const exportToExcel = async () => {
    try {
      const response = await fetch('/api/properties/export/excel')
      if (!response.ok) throw new Error('Gagal export Excel')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `property-data-${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Excel berhasil diunduh!')
    } catch (error) {
      toast.error('Gagal mengunduh Excel')
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Formulir Pendataan Properti
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Isi data properti secara lengkap untuk keperluan listing
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant="outline"
            onClick={exportToPDF}
            className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
          <Button
            variant="outline"
            onClick={exportToExcel}
            className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export Excel</span>
            <span className="sm:hidden">Excel</span>
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="dasar" className="w-full">
              <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 text-xs md:text-sm bg-gradient-to-r from-blue-100 to-purple-100 p-1 rounded-lg">
                <TabsTrigger value="dasar" className="flex items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                  <Home className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden md:inline">Data Dasar</span>
                  <span className="md:hidden">Dasar</span>
                </TabsTrigger>
                <TabsTrigger value="spesifikasi" className="flex items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                  <Home className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden md:inline">Spesifikasi</span>
                  <span className="md:hidden">Spes</span>
                </TabsTrigger>
                <TabsTrigger value="legalitas" className="flex items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                  <FileText className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden md:inline">Legalitas</span>
                  <span className="md:hidden">Legal</span>
                </TabsTrigger>
                <TabsTrigger value="utilitas" className="flex items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                  <Zap className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden md:inline">Utilitas</span>
                  <span className="md:hidden">Util</span>
                </TabsTrigger>
                <TabsTrigger value="lingkungan" className="flex items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                  <Droplets className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden md:inline">Lingkungan</span>
                  <span className="md:hidden">Ling</span>
                </TabsTrigger>
                <TabsTrigger value="foto" className="flex items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                  <Camera className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden md:inline">Foto</span>
                  <span className="md:hidden">Foto</span>
                </TabsTrigger>
                <TabsTrigger value="pemilik" className="flex items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                  <User className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden md:inline">Pemilik</span>
                  <span className="md:hidden">Pemilik</span>
                </TabsTrigger>
              </TabsList>

              {/* Data Dasar & Harga */}
              <TabsContent value="dasar" className="space-y-4">
                <Card className="border-2 border-blue-100 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <Home className="h-5 w-5" />
                      Data Dasar & Harga
                    </CardTitle>
                    <CardDescription className="text-blue-600">
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih arah" />
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih furnishing" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                              <SelectItem value="Semi">Semi Furnished</SelectItem>
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
                      Legalitas (Surat)
                    </CardTitle>
                    <CardDescription>
                      Dokumen kepemilikan dan perizinan
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <Input placeholder="Nomor PBB" {...field} />
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
                      Ketersediaan utilitas dan sumber air
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Fasilitas Lingkungan */}
              <TabsContent value="lingkungan" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Droplets className="h-5 w-5" />
                      Fasilitas Lingkungan
                    </CardTitle>
                    <CardDescription>
                      Kondisi lingkungan sekitar properti
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih akses jalan" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Aspal">Aspal</SelectItem>
                                <SelectItem value="Paving">Paving</SelectItem>
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
                              <Input type="number" placeholder="0" {...field} />
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <Input placeholder="Contoh: Rp 200.000" {...field} />
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
                              placeholder="Masukkan fasilitas terdekat (mall, sekolah, rumah sakit, dll)" 
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

              {/* Foto Properti */}
              <TabsContent value="foto" className="space-y-4">
                <PhotoUpload 
                  photos={photos}
                  onPhotosChange={setPhotos}
                  maxPhotos={12}
                />
              </TabsContent>

              {/* Data Pemilik */}
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
                              <Input placeholder="Masukkan nama lengkap" {...field} />
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
                              <Input placeholder="0812-3456-7890" {...field} />
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih kondisi" />
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
                              <Input placeholder="Contoh: 2.5%" {...field} />
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

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting}
              >
                Reset
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Data"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}