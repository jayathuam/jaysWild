'use client'

import { useState, useEffect } from 'react'
import MasonryGrid from '@/components/gallery/MasonryGrid'
import GalleryItem from '@/components/gallery/GalleryItem'
import Lightbox from '@/components/gallery/Lightbox'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

interface ImageMetadata {
  camera: string | null
  iso: string | null
  aperture: string | null
  shutter: string | null
  lens: string | null
  focalLength: string | null
  location: string | null
  dateTaken: string | null
}

interface ImageData {
  id: string
  filename: string
  category: string
  url: string
  width: number
  height: number
  alt: string
  blurDataURL?: string
  metadata: ImageMetadata
  createdAt: string
}

interface ImagesResponse {
  images: ImageData[]
  generatedAt: string
  totalImages: number
  categories: {
    color: number
    bw: number
  }
}

export default function BWGalleryPage() {
  const [images, setImages] = useState<ImageData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    async function loadImages() {
      try {
        const response = await fetch('/data/images.json')
        const data: ImagesResponse = await response.json()
        const bwImages = data.images.filter((img) => img.category === 'bw')
        setImages(bwImages)
      } catch (error) {
        console.error('Error loading images:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadImages()
  }, [])

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const navigateLightbox = (direction: number) => {
    setCurrentImageIndex((prev) => {
      let newIndex = prev + direction
      if (newIndex < 0) newIndex = images.length - 1
      if (newIndex >= images.length) newIndex = 0
      return newIndex
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header currentPage="bw" />

      {/* Gallery */}
      <main className="w-full px-6 lg:px-12 xl:px-16 2xl:px-24 py-12 lg:py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-800 mb-2">
            Black & White Gallery
          </h1>
          <p className="text-black">Timeless moments captured in monochrome</p>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-neutral-500">Loading images...</div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 text-neutral-500">
            No images found in the black & white gallery yet.
          </div>
        ) : (
          <MasonryGrid>
            {images.map((image, index) => (
              <GalleryItem
                key={image.id}
                id={image.id}
                url={image.url}
                alt={image.alt}
                width={image.width}
                height={image.height}
                metadata={image.metadata}
                onClick={() => openLightbox(index)}
                priority={index < 4}
                blurDataURL={image.blurDataURL}
              />
            ))}
          </MasonryGrid>
        )}

        {images.length > 0 && (
          <div className="text-center mt-12 text-neutral-500 text-sm">
            {images.length} {images.length === 1 ? 'image' : 'images'} in gallery
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Lightbox */}
      <Lightbox
        images={images}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
      />
    </div>
  )
}
