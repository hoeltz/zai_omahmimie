"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Image as ImageIcon, Camera } from "lucide-react"
import { toast } from "sonner"

interface PhotoUploadProps {
  photos: string[]
  onPhotosChange: (photos: string[]) => void
  maxPhotos?: number
}

export function PhotoUpload({ photos, onPhotosChange, maxPhotos = 12 }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (photos.length + acceptedFiles.length > maxPhotos) {
      toast.error(`Maksimal ${maxPhotos} foto yang diizinkan`)
      return
    }

    setUploading(true)
    
    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error('Hanya file gambar yang diizinkan')
        }

        // Validate file size (max 5MB per file)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Ukuran file maksimal 5MB')
        }

        // Upload to server
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Gagal mengunggah foto')
        }

        const result = await response.json()
        return result.url
      })

      const newPhotos = await Promise.all(uploadPromises)
      onPhotosChange([...photos, ...newPhotos])
      toast.success(`${newPhotos.length} foto berhasil diunggah`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal mengunggah foto')
    } finally {
      setUploading(false)
    }
  }, [photos, onPhotosChange, maxPhotos])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: maxPhotos - photos.length,
    disabled: uploading || photos.length >= maxPhotos
  })

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    onPhotosChange(newPhotos)
    toast.success('Foto dihapus')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Foto Properti</h3>
          <p className="text-sm text-gray-600">
            Upload foto format JPEG/PNG dengan rasio 16:9 (maksimal {maxPhotos} foto)
          </p>
        </div>
        <Badge variant="secondary">
          {photos.length}/{maxPhotos}
        </Badge>
      </div>

      {/* Upload Area */}
      {photos.length < maxPhotos && (
        <Card>
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-300 hover:border-gray-400'
                }
                ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center space-y-4">
                {uploading ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                ) : (
                  <>
                    {isDragActive ? (
                      <Upload className="h-12 w-12 text-primary" />
                    ) : (
                      <Camera className="h-12 w-12 text-gray-400" />
                    )}
                  </>
                )}
                
                <div>
                  <p className="text-lg font-medium">
                    {uploading 
                      ? 'Mengunggah...' 
                      : isDragActive 
                        ? 'Lepaskan foto di sini' 
                        : 'Drag & drop foto atau klik untuk memilih'
                    }
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Format: JPEG, PNG | Maksimal 5MB per file | Rasio 16:9
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-0">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <img
                    src={photo}
                    alt={`Foto properti ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Badge variant="secondary" className="text-xs">
                        Foto {index + 1}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <ImageIcon className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Tips Foto Properti:</p>
              <ul className="space-y-1 text-xs">
                <li>• Gunakan foto dengan rasio 16:9 untuk hasil terbaik</li>
                <li>• Pastikan pencahayaan cukup dan jelas</li>
                <li>• Foto dari berbagai sudut ruangan</li>
                <li>• Sertakan foto fasilitas dan lingkungan sekitar</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}