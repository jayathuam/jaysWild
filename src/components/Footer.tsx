'use client'

import { useEffect, useState } from 'react'

interface FooterProps {
  title?: string
  description?: string
  instagramUrl?: string
  facebookUrl?: string
  email?: string
}

export function Footer({
  title = "Let's Connect",
  description = 'Follow my journey, get in touch for collaborations, or inquire about prints and safari photography tours.',
  instagramUrl = 'https://instagram.com/wildlifephotography',
  facebookUrl = 'https://facebook.com/wildlifephotography',
  email = 'contact@wildlifephoto.example',
}: FooterProps) {
  const [bgUrl, setBgUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    fetch('/data/images.json')
      .then((r) => r.json())
      .then((data) => setBgUrl(data.footer.background.url))
      .catch(console.error)
  }, [])

  return (
    <footer className="relative z-10 pt-15 pb-40 px-6 text-center bg-cover bg-center bg-no-repeat mt-20" style={{ backgroundImage: bgUrl ? `url(${bgUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: '50% 70%' }}>
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-forest-700 mb-10">
        {title}
      </h2>
      <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-10">
        {description}
      </p>
      <div className="flex gap-6 justify-center items-center">
        {/* Instagram */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-15 h-15 rounded-full bg-white border-2 border-forest-500 flex items-center justify-center transition-all duration-400 ease-in-out hover:-translate-y-2 hover:bg-forest-500 hover:text-white hover:shadow-[0_12px_24px_rgba(90,138,109,0.3)]"
          aria-label="Follow on Instagram"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>

        {/* Facebook */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-15 h-15 rounded-full bg-white border-2 border-forest-500 flex items-center justify-center transition-all duration-400 ease-in-out hover:-translate-y-2 hover:bg-forest-500 hover:text-white hover:shadow-[0_12px_24px_rgba(90,138,109,0.3)]"
          aria-label="Follow on Facebook"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
        </a>

        {/* Email */}
        <a
          href={`mailto:${email}`}
          className="w-15 h-15 rounded-full bg-white border-2 border-forest-500 flex items-center justify-center transition-all duration-400 ease-in-out hover:-translate-y-2 hover:bg-forest-500 hover:text-white hover:shadow-[0_12px_24px_rgba(90,138,109,0.3)]"
          aria-label="Send email"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </a>
      </div>
    </footer>
  )
}
