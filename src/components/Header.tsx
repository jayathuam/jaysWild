interface HeaderProps {
  currentPage?: 'home' | 'color' | 'bw' | 'about'
}

export function Header({ currentPage }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/50 sm:bg-white/10 border-b border-white/10 sm:border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a
          href="/"
          className="font-serif text-xl md:text-2xl font-semibold text-white sm:text-neutral-800 hover:text-forest-200 sm:hover:text-forest-600 transition-colors"
        >
          <svg className="sm:hidden w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="hidden sm:inline">Jayathu Amarasinghe</span>
        </a>
        <nav className="flex gap-4 md:gap-8 items-center text-sm md:text-base">
          <a
            href="/gallery/color"
            className={`transition-colors relative group ${
              currentPage === 'color'
                ? 'text-white sm:text-forest-600 font-medium'
                : 'text-white/80 sm:text-neutral-700 hover:text-white sm:hover:text-forest-500'
            }`}
          >
            <span className="sm:hidden">Color</span><span className="hidden sm:inline">Color Gallery</span>
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-forest-500 transition-all duration-300 ${
                currentPage === 'color' ? 'w-full' : 'w-0 group-hover:w-full'
              }`}
            ></span>
          </a>
          <a
            href="/gallery/bw"
            className={`transition-colors relative group ${
              currentPage === 'bw'
                ? 'text-white sm:text-forest-600 font-medium'
                : 'text-white/80 sm:text-neutral-700 hover:text-white sm:hover:text-forest-500'
            }`}
          >
            <span className="sm:hidden">B&amp;W</span><span className="hidden sm:inline">Black &amp; White Gallery</span>
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-forest-500 transition-all duration-300 ${
                currentPage === 'bw' ? 'w-full' : 'w-0 group-hover:w-full'
              }`}
            ></span>
          </a>
          <a
            href="/about"
            className={`transition-colors relative group ${
              currentPage === 'about'
                ? 'text-white sm:text-forest-600 font-medium'
                : 'text-white/80 sm:text-neutral-700 hover:text-white sm:hover:text-forest-500'
            }`}
          >
            About
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-forest-500 transition-all duration-300 ${
                currentPage === 'about' ? 'w-full' : 'w-0 group-hover:w-full'
              }`}
            ></span>
          </a>
        </nav>
      </div>
    </header>
  )
}
