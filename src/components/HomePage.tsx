'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTimeOfDay } from '@/hooks/useTimeOfDay'

interface SiteImage {
  url: string
  alt: string
  filename: string
}

interface HomePageImages {
  dawn: SiteImage
  midday: SiteImage
  dusk: SiteImage
  night: SiteImage
}

export function HomePage() {
  const autoTimeOfDay = useTimeOfDay()
  const [showNavigation, setShowNavigation] = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  const [manualTimeOfDay, setManualTimeOfDay] = useState<string | null>(null)
  const [homePageImages, setHomePageImages] = useState<HomePageImages | null>(null)
  const timeOfDay = (manualTimeOfDay || autoTimeOfDay) as keyof HomePageImages

  useEffect(() => {
    fetch('/data/images.json')
      .then((r) => r.json())
      .then((data) => setHomePageImages(data.homePage))
      .catch(console.error)
  }, [])

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited')
    if (hasVisited) {
      setShowNavigation(true)
      setIsFirstVisit(false)
      return
    }

    const timer = setTimeout(() => {
      setShowNavigation(true)
      sessionStorage.setItem('hasVisited', 'true')
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const timeLabels = {
    dawn: 'Dawn 🌅',
    midday: 'Midday ☀️',
    dusk: 'Dusk 🌇',
    night: 'Night 🌙',
  }

  const taglineColors = {
    dawn: 'text-slate-800',
    midday: 'text-slate-800',
    dusk: 'text-slate-800',
    night: 'text-slate-800',
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Time indicator */}
      <div className="hidden lg:block absolute top-6 right-6 z-10 font-sans text-xs text-neutral-600 bg-white/80 px-4 py-2 rounded-full border border-neutral-600/20">
        Time: {timeLabels[timeOfDay]}
      </div>

      {/* Time-adaptive background with crossfade */}
      <div className="absolute inset-0 z-0">
        {homePageImages && (Object.entries(homePageImages) as [keyof HomePageImages, SiteImage][]).map(([time, img]) => (
          <img
            key={time}
            src={img.url}
            alt={img.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500] ease-in-out ${
              timeOfDay === time ? 'opacity-100' : 'opacity-0'
            } ${time === 'dusk' ? 'max-sm:scale-[1.4] max-sm:origin-bottom' : ''} ${time === 'night' ? 'max-sm:object-[60%_50%]' : ''} ${time === 'midday' ? 'max-sm:object-[65%_50%] max-sm:scale-[1.4] max-sm:origin-[center_70%]' : ''} ${time === 'dawn' ? 'max-sm:object-[32%_50%]' : ''}`}
          />
        ))}
      </div>

      {/* Glass effect container at top - title and tagline */}
      <div className="relative z-2 pt-12 px-6 flex justify-center">
        <div className="backdrop-blur-md bg-white/10 rounded-2xl px-6 py-6 border border-white/20 shadow-2xl max-w-150 w-full text-center">
          <h1 className="font-sans text-[clamp(24px,4.5vw,48px)] font-extrabold text-white mb-2 tracking-[0.02em] capitalize">
            Jayathu Amarasinghe
          </h1>
          <p className={`font-sans text-white text-sm sm:text-lg font-semibold tracking-[0.02em] drop-shadow-lg transition-colors duration-500 ${taglineColors[timeOfDay]}`}>
            Capturing the untamed beauty of nature
          </p>
        </div>
      </div>

      {/* Centered content - nav and social */}
      <div className="relative z-2 flex-1 flex items-end justify-center text-center px-6 pb-24">
        <div className="max-w-150 w-full">
        {/* Glass effect for nav bar */}
        <nav
          className={`backdrop-blur-md bg-white/10 rounded-2xl px-6 py-4 border border-white/20 shadow-2xl mb-6 transition-opacity duration-600 ${
            showNavigation && isFirstVisit
              ? 'animate-fade-in'
              : showNavigation
                ? 'opacity-100'
                : 'opacity-0'
          }`}
        >
          <div className="flex flex-row gap-8 justify-center flex-wrap">
            <Link
              href="/gallery/color/"
              className="relative inline-block font-sans text-lg font-normal no-underline transition-all duration-300 ease-nature text-white/90 nav-link-underline after:bg-linear-to-r after:from-red-500 after:via-green-500 after:to-blue-500 hover:bg-linear-to-r hover:from-red-500 hover:via-green-500 hover:to-blue-500 hover:bg-clip-text hover:text-transparent"
            >
              <span className="sm:hidden">Color</span><span className="hidden sm:inline">Color Gallery</span>
            </Link>
            <Link
              href="/gallery/bw/"
              className="relative inline-block font-sans text-lg font-normal no-underline transition-all duration-300 ease-nature text-white/90 nav-link-underline after:bg-black hover:text-black"
            >
              <span className="sm:hidden">B&amp;W</span><span className="hidden sm:inline">Black &amp; White Gallery</span>
            </Link>
            <Link
              href="/about/"
              className="relative inline-block font-sans text-lg font-normal no-underline transition-all duration-300 ease-nature text-white/90 nav-link-underline after:bg-forest-500 hover:text-forest-500"
            >
              About
            </Link>
          </div>
        </nav>

        <div
          className={`flex gap-6 justify-center items-center transition-opacity duration-600 ${
            showNavigation && isFirstVisit
              ? 'animate-fade-in'
              : showNavigation
                ? 'opacity-100'
                : 'opacity-0'
          }`}
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 flex items-center justify-center text-white/70 no-underline rounded-full bg-white/20 border border-white/30 transition-all duration-400 ease-nature text-xl hover:text-white hover:bg-forest-500 hover:border-forest-500 hover:scale-110"
            title="Instagram"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 flex items-center justify-center text-white/70 no-underline rounded-full bg-white/20 border border-white/30 transition-all duration-400 ease-nature text-xl hover:text-white hover:bg-forest-500 hover:border-forest-500 hover:scale-110"
            title="Facebook"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          <a
            href="mailto:contact@example.com"
            className="w-12 h-12 flex items-center justify-center text-white/70 no-underline rounded-full bg-white/20 border border-white/30 transition-all duration-400 ease-nature text-xl hover:text-white hover:bg-forest-500 hover:border-forest-500 hover:scale-110"
            title="Email"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </a>
        </div>
        </div>
      </div>

      {/* Demo controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        <button
          className={`font-sans text-xs px-4 py-2 border rounded cursor-pointer transition-all duration-300 ${
            timeOfDay === 'dawn'
              ? 'bg-forest-600 text-white border-forest-600'
              : 'bg-white/90 border-neutral-600 hover:bg-forest-500 hover:text-white hover:border-forest-500'
          }`}
          onClick={() => setManualTimeOfDay('dawn')}
        >
          Dawn <span className="hidden sm:inline">🌅</span>
        </button>
        <button
          className={`font-sans text-xs px-4 py-2 border rounded cursor-pointer transition-all duration-300 ${
            timeOfDay === 'midday'
              ? 'bg-forest-600 text-white border-forest-600'
              : 'bg-white/90 border-neutral-600 hover:bg-forest-500 hover:text-white hover:border-forest-500'
          }`}
          onClick={() => setManualTimeOfDay('midday')}
        >
          Midday <span className="hidden sm:inline">☀️</span>
        </button>
        <button
          className={`font-sans text-xs px-4 py-2 border rounded cursor-pointer transition-all duration-300 ${
            timeOfDay === 'dusk'
              ? 'bg-forest-600 text-white border-forest-600'
              : 'bg-white/90 border-neutral-600 hover:bg-forest-500 hover:text-white hover:border-forest-500'
          }`}
          onClick={() => setManualTimeOfDay('dusk')}
        >
          Dusk <span className="hidden sm:inline">🌇</span>
        </button>
        <button
          className={`font-sans text-xs px-4 py-2 border rounded cursor-pointer transition-all duration-300 ${
            timeOfDay === 'night'
              ? 'bg-forest-600 text-white border-forest-600'
              : 'bg-white/90 border-neutral-600 hover:bg-forest-500 hover:text-white hover:border-forest-500'
          }`}
          onClick={() => setManualTimeOfDay('night')}
        >
          Night <span className="hidden sm:inline">🌙</span>
        </button>
      </div>
    </div>
  )
}
