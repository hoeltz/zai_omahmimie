"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Home, Eye, Edit, Trash2, Download } from "lucide-react"
import { toast } from "sonner"
import { PropertyViewModal } from "@/components/property-view-modal"
import { PropertyEditModal } from "@/components/property-edit-modal"

export interface Property {
  id: string
  jenisProperti: string
  statusListing: string
  hargaJualSewa: string
  alamatLengkap: string
  luasTanah: number | null
  luasBangunan: number | null
  jumlahLantai: number | null
  kamarTidur: number | null
  kamarMandi: number | null
  carportGarasi: string | null
  arahHadap: string | null
  kondisi: string | null
  furnishing: string | null
  jenisSertifikat: string | null
  imb: string | null
  pbb: string | null
  kapasitasListrik: number | null
  tipeMeteran: string | null
  sumberAirUtama: string | null
  tandonAir: string | null
  kapasitasTandon: number | null
  aksesJalan: string | null
  lebarJalan: number | null
  bebasBanjir: string | null
  keamananKompleks: string | null
  iplBulanan: string | null
  fasilitasTerdekat: string | null
  namaPemilik: string
  noKontakAktif: string
  kondisiProperti: string | null
  komisiAgen: string | null
  photos: string | null
  createdAt: string
  updatedAt: string
}

export function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      if (!response.ok) throw new Error('Gagal mengambil data')
      const data = await response.json()
      setProperties(data)
    } catch (error) {
      toast.error('Gagal memuat data properti')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.namaPemilik.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.alamatLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.jenisProperti.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === "all" || property.jenisProperti === filterType
    const matchesStatus = filterStatus === "all" || property.statusListing === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const handleView = (property: Property) => {
    setSelectedProperty(property)
    setViewModalOpen(true)
  }

  const handleEdit = (property: Property) => {
    setSelectedProperty(property)
    setEditModalOpen(true)
  }

  const handleDelete = async (property: Property) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus properti ${property.jenisProperti} milik ${property.namaPemilik}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/properties/${property.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Gagal menghapus properti')

      toast.success('Properti berhasil dihapus')
      fetchProperties() // Refresh data
    } catch (error) {
      toast.error('Gagal menghapus properti')
      console.error(error)
    }
  }

  const handleSave = () => {
    fetchProperties() // Refresh data
    toast.success('Data properti berhasil diperbarui!')
  }

  const exportToPDF = async () => {
    try {
      // Show loading toast
      toast.loading('Menghasilkan PDF...')
      
      const response = await fetch('/api/properties/export/pdf')
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Gagal export PDF')
      }
      
      const blob = await response.blob()
      
      // Check if blob is empty
      if (blob.size === 0) {
        throw new Error('PDF kosong, tidak ada data untuk diekspor')
      }
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `property-list-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('PDF berhasil diunduh!')
    } catch (error) {
      console.error('PDF Export Error:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal mengunduh PDF')
    }
  }

  const exportToExcel = async () => {
    try {
      // Show loading toast
      toast.loading('Menghasilkan Excel...')
      
      const response = await fetch('/api/properties/export/excel')
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Gagal export Excel')
      }
      
      const blob = await response.blob()
      
      // Check if blob is empty
      if (blob.size === 0) {
        throw new Error('Excel kosong, tidak ada data untuk diekspor')
      }
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `property-list-${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Excel berhasil diunduh!')
    } catch (error) {
      console.error('Excel Export Error:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal mengunduh Excel')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat data properti...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Daftar Properti
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Kelola dan pantau semua data properti yang telah terdaftar
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 border-2 border-blue-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Search className="h-5 w-5" />
              Pencarian & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Cari berdasarkan nama, alamat, atau jenis properti..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-blue-200 focus:border-blue-400 focus:ring-blue-200"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-200">
                  <SelectValue placeholder="Filter Jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  <SelectItem value="Rumah">Rumah</SelectItem>
                  <SelectItem value="Apartemen">Apartemen</SelectItem>
                  <SelectItem value="Tanah">Tanah</SelectItem>
                  <SelectItem value="Ruko">Ruko</SelectItem>
                  <SelectItem value="Gudang">Gudang</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-200">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Dijual">Dijual</SelectItem>
                  <SelectItem value="Disewa">Disewa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Export Buttons */}
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

        {/* Property Table */}
        <Card className="border-2 border-purple-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-purple-700">
                <Home className="h-5 w-5" />
                Data Properti ({filteredProperties.length})
              </span>
            </CardTitle>
            <CardDescription className="text-purple-600">
              Daftar lengkap properti yang telah terdaftar dalam sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <TableHead className="w-[50px] text-purple-700">No</TableHead>
                    <TableHead className="text-purple-700">Properti</TableHead>
                    <TableHead className="text-purple-700">Status</TableHead>
                    <TableHead className="hidden md:table-cell text-purple-700">Harga</TableHead>
                    <TableHead className="hidden lg:table-cell text-purple-700">Alamat</TableHead>
                    <TableHead className="hidden sm:table-cell text-purple-700">Spesifikasi</TableHead>
                    <TableHead className="text-purple-700">Pemilik</TableHead>
                    <TableHead className="hidden md:table-cell text-purple-700">Tanggal</TableHead>
                    <TableHead className="w-[100px] text-purple-700">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">
                        <div className="text-gray-500">
                          <Home className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>Tidak ada data properti yang ditemukan</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProperties.map((property, index) => {
                      const photos = property.photos ? JSON.parse(property.photos) : []
                      const mainPhoto = photos.length > 0 ? photos[0] : null
                      
                      return (
                        <TableRow key={property.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-colors">
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              {mainPhoto ? (
                                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 border-blue-200 shadow-md">
                                  <img
                                    src={mainPhoto}
                                    alt={property.jenisProperti}
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0 border-2 border-blue-200">
                                  <Home className="h-6 w-6 text-blue-500" />
                                </div>
                              )}
                              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                                {property.jenisProperti}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={property.statusListing === 'Dijual' ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'}>
                              {property.statusListing}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell font-medium text-green-600">
                            {property.hargaJualSewa}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell max-w-xs truncate">
                            <span className="text-purple-700">{property.alamatLengkap}</span>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div className="text-xs space-y-1">
                              {property.luasTanah && <div className="text-blue-600">LT: {property.luasTanah}m²</div>}
                              {property.luasBangunan && <div className="text-purple-600">LB: {property.luasBangunan}m²</div>}
                              {property.kamarTidur && <div className="text-pink-600">KT: {property.kamarTidur}</div>}
                              {property.kamarMandi && <div className="text-cyan-600">KM: {property.kamarMandi}</div>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium text-purple-700">{property.namaPemilik}</div>
                              <div className="text-gray-500 text-xs">{property.noKontakAktif}</div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className="text-xs text-gray-600">{new Date(property.createdAt).toLocaleDateString('id-ID')}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleView(property)}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleEdit(property)}
                                className="text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-all duration-200"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleDelete(property)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Modal */}
      <PropertyViewModal
        property={selectedProperty}
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false)
          setSelectedProperty(null)
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Edit Modal */}
      <PropertyEditModal
        property={selectedProperty}
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedProperty(null)
        }}
        onSave={handleSave}
      />
    </div>
  )
}