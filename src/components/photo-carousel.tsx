"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react"

interface PhotoCarouselProps {
  photos: string[]
  initialIndex?: number
  open: boolean
  onClose: () => void
}

export function PhotoCarousel({ photos, initialIndex = 0, open, onClose }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [zoomLevel, setZoomLevel] = useState(1)

  useEffect(() => {
    setCurrentIndex(initialIndex)
    setZoomLevel(1)
  }, [initialIndex, open])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
    setZoomLevel(1)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
    setZoomLevel(1)
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1))
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!open) return
    switch (e.key) {
      case 'ArrowLeft':
        goToPrevious()
        break
      case 'ArrowRight':
        goToNext()
        break
      case 'Escape':
        onClose()
        break
      case '+':
      case '=':
        handleZoomIn()
        break
      case '-':
      case '_':
        handleZoomOut()
        break
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  if (!photos || photos.length === 0) return null

  const currentPhoto = photos[currentIndex]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 overflow-hidden bg-black/95">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Zoom Controls */}
          <div className="absolute top-4 left-4 z-50 flex flex-col gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              className="text-white hover:bg-white/20 disabled:opacity/50"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="text-white hover:bg-white/20 disabled:opacity/50"
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            <div className="text-white text-xs text-center bg-black/50 px-2 py-1 rounded">
              {Math.round(zoomLevel * 100)}%
            </div>
          </div>

          {/* Navigation Buttons */}
          {photos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Photo Display */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div
              className="relative transition-transform duration-300 ease-in-out cursor-move"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center'
              }}
            >
              <img
                src={currentPhoto}
                alt={`Property photo ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                draggable={false}
              />
            </div>
          </div>

          {/* Photo Counter */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
              <div className="bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                {currentIndex + 1} / {photos.length}
              </div>
            </div>
          )}

          {/* Thumbnail Strip */}
          {photos.length > 1 && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50">
              <div className="flex gap-2 bg-black/50 p-2 rounded-lg">
                {photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index)
                      setZoomLevel(1)
                    }}
                    className={`relative w-16 h-16 rounded overflow-hidden transition-all ${
                      index === currentIndex 
                        ? 'ring-2 ring-blue-500 scale-110' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="absolute top-16 left-4 z-50 text-white text-xs bg-black/50 p-2 rounded max-w-xs">
            <div className="space-y-1">
              <div>← → : Navigate photos</div>
              <div>+ - : Zoom in/out</div>
              <div>ESC : Close</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}