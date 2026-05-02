'use client'

import Image from 'next/image'
import { useState } from 'react'

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

interface GalleryItemProps {
  id: string
  url: string
  alt: string
  width: number
  height: number
  metadata: ImageMetadata
  onClick: () => void
  priority?: boolean
  blurDataURL?: string
}

export default function GalleryItem({
  url,
  alt,
  width,
  height,
  metadata,
  onClick,
  priority = false,
  blurDataURL,
}: GalleryItemProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div
      className="relative mb-8 sm:mb-10 md:mb-12 lg:mb-16 2xl:mb-20 break-inside-avoid cursor-pointer group overflow-hidden transition-transform duration-300 hover:scale-102"
      onClick={onClick}
    >
      {/* Skeleton fallback — only shown when no blur placeholder is available */}
      {!blurDataURL && !isLoaded && (
        <div
          className="w-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] animate-pulse"
          style={{ aspectRatio: `${width}/${height}` }}
        />
      )}

      {/* Image */}
      <Image
        src={url}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-auto block transition-opacity duration-300 ${
          blurDataURL || isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        loading={priority ? undefined : 'lazy'}
        priority={priority}
        onLoad={() => setIsLoaded(true)}
      />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-800/95 via-neutral-800/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <div className="text-white">

          {metadata.location && (
            <div className="font-sans text-xs opacity-90 mb-3 flex items-center gap-1.5">
              <span>📍</span>
              {metadata.location}
            </div>
          )}

          {/* EXIF Metadata Grid */}
          {(metadata.camera || metadata.lens || metadata.iso) && (
            <div className="grid grid-cols-3 gap-x-2 gap-y-1.5 font-mono text-[10px]">
              {metadata.camera && (
                <div className="flex flex-col gap-0.5">
                  <span className="opacity-70 uppercase tracking-wide text-[8px]">Camera</span>
                  <span className="font-medium text-[11px]">{metadata.camera}</span>
                </div>
              )}
              {metadata.lens && (
                <div className="flex flex-col gap-0.5">
                  <span className="opacity-70 uppercase tracking-wide text-[8px]">Lens</span>
                  <span className="font-medium text-[11px]">{metadata.lens}</span>
                </div>
              )}
              {metadata.iso && (
                <div className="flex flex-col gap-0.5">
                  <span className="opacity-70 uppercase tracking-wide text-[8px]">ISO</span>
                  <span className="font-medium text-[11px]">{metadata.iso}</span>
                </div>
              )}
              {metadata.aperture && (
                <div className="flex flex-col gap-0.5">
                  <span className="opacity-70 uppercase tracking-wide text-[8px]">Aperture</span>
                  <span className="font-medium text-[11px]">{metadata.aperture}</span>
                </div>
              )}
              {metadata.shutter && (
                <div className="flex flex-col gap-0.5">
                  <span className="opacity-70 uppercase tracking-wide text-[8px]">Shutter</span>
                  <span className="font-medium text-[11px]">{metadata.shutter}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
