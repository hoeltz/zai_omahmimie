"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Home, MapPin, User, Phone, FileText, Zap, Droplets, Shield, Camera, X, Edit, Trash2, Maximize2 } from "lucide-react"
import { Property } from "./property-list"
import { PhotoCarousel } from "./photo-carousel"

interface PropertyViewModalProps {
  property: Property | null
  open: boolean
  onClose: () => void
  onEdit: (property: Property) => void
  onDelete: (property: Property) => void
}

export function PropertyViewModal({ property, open, onClose, onEdit, onDelete }: PropertyViewModalProps) {
  const [carouselOpen, setCarouselOpen] = useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)

  if (!property) return null

  const photos = property.photos ? JSON.parse(property.photos) : []

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index)
    setCarouselOpen(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg p-6 -m-6 mb-4">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Detail Properti - {property.jenisProperti}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={() => onEdit(property)}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => onDelete(property)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Hapus
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Foto Section */}
            <div className="space-y-4">
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Camera className="h-5 w-5" />
                    Foto Properti ({photos.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {photos.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {photos.map((photo: string, index: number) => (
                        <div 
                          key={index} 
                          className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
                          onClick={() => handlePhotoClick(index)}
                        >
                          <div className="aspect-square rounded-lg overflow-hidden shadow-md">
                            <img
                              src={photo}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-all">
                              <Maximize2 className="h-8 w-8 text-white" />
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Belum ada foto</p>
                    </div>
                  )}
                  {photos.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      💡 Klik foto untuk melihat dengan zoom dan carousel
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Data Pemilik */}
              <Card className="border-2 border-green-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <User className="h-5 w-5" />
                    Data Pemilik
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <User className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">{property.namaPemilik}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-800">{property.noKontakAktif}</span>
                  </div>
                  {property.kondisiProperti && (
                    <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                      <Home className="h-4 w-4 text-purple-600" />
                      <span className="text-purple-800">Kondisi: {property.kondisiProperti}</span>
                    </div>
                  )}
                  {property.komisiAgen && (
                    <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg">
                      <span className="text-amber-700 font-medium">Komisi:</span>
                      <span className="text-amber-800">{property.komisiAgen}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Detail Information */}
            <div className="space-y-4">
              {/* Data Dasar */}
              <Card className="border-2 border-orange-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Home className="h-5 w-5" />
                    Data Dasar & Harga
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                    <span className="text-gray-600">Jenis Properti:</span>
                    <Badge className="bg-orange-500 hover:bg-orange-600">{property.jenisProperti}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                    <span className="text-gray-600">Status Listing:</span>
                    <Badge className={property.statusListing === 'Dijual' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}>
                      {property.statusListing}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <span className="text-gray-600">Harga:</span>
                    <span className="font-bold text-green-600 text-lg">{property.hargaJualSewa}</span>
                  </div>
                  <div className="space-y-1 p-2 bg-purple-50 rounded-lg">
                    <span className="text-gray-600">Alamat:</span>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-purple-800">{property.alamatLengkap}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Spesifikasi Fisik */}
              <Card className="border-2 border-indigo-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
                  <CardTitle className="text-indigo-700">Spesifikasi Fisik</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {property.luasTanah && (
                      <div className="flex justify-between p-2 bg-indigo-50 rounded-lg">
                        <span className="text-indigo-600">LT:</span>
                        <span className="font-medium text-indigo-800">{property.luasTanah}m²</span>
                      </div>
                    )}
                    {property.luasBangunan && (
                      <div className="flex justify-between p-2 bg-blue-50 rounded-lg">
                        <span className="text-blue-600">LB:</span>
                        <span className="font-medium text-blue-800">{property.luasBangunan}m²</span>
                      </div>
                    )}
                    {property.jumlahLantai && (
                      <div className="flex justify-between p-2 bg-purple-50 rounded-lg">
                        <span className="text-purple-600">Lantai:</span>
                        <span className="font-medium text-purple-800">{property.jumlahLantai}</span>
                      </div>
                    )}
                    {property.kamarTidur && (
                      <div className="flex justify-between p-2 bg-pink-50 rounded-lg">
                        <span className="text-pink-600">KT:</span>
                        <span className="font-medium text-pink-800">{property.kamarTidur}</span>
                      </div>
                    )}
                    {property.kamarMandi && (
                      <div className="flex justify-between p-2 bg-cyan-50 rounded-lg">
                        <span className="text-cyan-600">KM:</span>
                        <span className="font-medium text-cyan-800">{property.kamarMandi}</span>
                      </div>
                    )}
                    {property.carportGarasi && (
                      <div className="flex justify-between p-2 bg-emerald-50 rounded-lg">
                        <span className="text-emerald-600">Carport:</span>
                        <span className="font-medium text-emerald-800">{property.carportGarasi}</span>
                      </div>
                    )}
                    {property.arahHadap && (
                      <div className="flex justify-between p-2 bg-amber-50 rounded-lg">
                        <span className="text-amber-600">Hadap:</span>
                        <span className="font-medium text-amber-800">{property.arahHadap}</span>
                      </div>
                    )}
                    {property.kondisi && (
                      <div className="flex justify-between p-2 bg-red-50 rounded-lg">
                        <span className="text-red-600">Kondisi:</span>
                        <span className="font-medium text-red-800">{property.kondisi}</span>
                      </div>
                    )}
                    {property.furnishing && (
                      <div className="flex justify-between col-span-2 p-2 bg-teal-50 rounded-lg">
                        <span className="text-teal-600">Furnishing:</span>
                        <span className="font-medium text-teal-800">{property.furnishing}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Legalitas */}
              <Card className="border-2 border-violet-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50">
                  <CardTitle className="flex items-center gap-2 text-violet-700">
                    <FileText className="h-5 w-5" />
                    Legalitas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm p-4">
                  {property.jenisSertifikat && (
                    <div className="flex justify-between p-2 bg-violet-50 rounded-lg">
                      <span className="text-violet-600">Sertifikat:</span>
                      <span className="font-medium text-violet-800">{property.jenisSertifikat}</span>
                    </div>
                  )}
                  {property.imb && (
                    <div className="flex justify-between p-2 bg-purple-50 rounded-lg">
                      <span className="text-purple-600">IMB:</span>
                      <Badge className={property.imb === 'Ada' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}>
                        {property.imb}
                      </Badge>
                    </div>
                  )}
                  {property.pbb && (
                    <div className="flex justify-between p-2 bg-indigo-50 rounded-lg">
                      <span className="text-indigo-600">PBB:</span>
                      <span className="font-medium text-indigo-800">{property.pbb}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Utilitas */}
              <Card className="border-2 border-yellow-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
                  <CardTitle className="flex items-center gap-2 text-yellow-700">
                    <Zap className="h-5 w-5" />
                    Utilitas & Air
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm p-4">
                  {property.kapasitasListrik && (
                    <div className="flex justify-between p-2 bg-yellow-50 rounded-lg">
                      <span className="text-yellow-600">Listrik:</span>
                      <span className="font-medium text-yellow-800">{property.kapasitasListrik} VA</span>
                    </div>
                  )}
                  {property.tipeMeteran && (
                    <div className="flex justify-between p-2 bg-amber-50 rounded-lg">
                      <span className="text-amber-600">Meteran:</span>
                      <span className="font-medium text-amber-800">{property.tipeMeteran}</span>
                    </div>
                  )}
                  {property.sumberAirUtama && (
                    <div className="flex justify-between p-2 bg-orange-50 rounded-lg">
                      <span className="text-orange-600">Sumber Air:</span>
                      <span className="font-medium text-orange-800">{property.sumberAirUtama}</span>
                    </div>
                  )}
                  {property.tandonAir && (
                    <div className="flex justify-between p-2 bg-lime-50 rounded-lg">
                      <span className="text-lime-600">Tandon Air:</span>
                      <Badge className={property.tandonAir === 'Ada' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}>
                        {property.tandonAir}
                      </Badge>
                    </div>
                  )}
                  {property.kapasitasTandon && (
                    <div className="flex justify-between p-2 bg-green-50 rounded-lg">
                      <span className="text-green-600">Kapasitas:</span>
                      <span className="font-medium text-green-800">{property.kapasitasTandon} liter</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Lingkungan */}
              <Card className="border-2 border-cyan-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
                  <CardTitle className="flex items-center gap-2 text-cyan-700">
                    <Droplets className="h-5 w-5" />
                    Lingkungan & Fasilitas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm p-4">
                  {property.aksesJalan && (
                    <div className="flex justify-between p-2 bg-cyan-50 rounded-lg">
                      <span className="text-cyan-600">Akses Jalan:</span>
                      <span className="font-medium text-cyan-800">{property.aksesJalan}</span>
                    </div>
                  )}
                  {property.lebarJalan && (
                    <div className="flex justify-between p-2 bg-blue-50 rounded-lg">
                      <span className="text-blue-600">Lebar Jalan:</span>
                      <span className="font-medium text-blue-800">{property.lebarJalan} m</span>
                    </div>
                  )}
                  {property.bebasBanjir && (
                    <div className="flex justify-between p-2 bg-green-50 rounded-lg">
                      <span className="text-green-600">Bebas Banjir:</span>
                      <Badge className={property.bebasBanjir === 'Ya' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}>
                        {property.bebasBanjir}
                      </Badge>
                    </div>
                  )}
                  {property.keamananKompleks && (
                    <div className="flex justify-between p-2 bg-purple-50 rounded-lg">
                      <span className="text-purple-600">Keamanan:</span>
                      <span className="font-medium text-purple-800">{property.keamananKompleks}</span>
                    </div>
                  )}
                  {property.iplBulanan && (
                    <div className="flex justify-between p-2 bg-pink-50 rounded-lg">
                      <span className="text-pink-600">IPL/Bulan:</span>
                      <span className="font-medium text-pink-800">{property.iplBulanan}</span>
                    </div>
                  )}
                  {property.fasilitasTerdekat && (
                    <div className="space-y-1 p-2 bg-indigo-50 rounded-lg">
                      <span className="text-indigo-600">Fasilitas Terdekat:</span>
                      <p className="text-xs text-indigo-800">{property.fasilitasTerdekat}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t bg-gradient-to-r from-gray-50 to-blue-50 -mx-6 -mb-6 px-6 pb-6 rounded-b-lg">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Photo Carousel */}
      <PhotoCarousel
        photos={photos}
        initialIndex={selectedPhotoIndex}
        open={carouselOpen}
        onClose={() => setCarouselOpen(false)}
      />
    </>
  )
}