import Link from 'next/link'

const FIREFLIES = [
  { left: '8%',  bottom: '32%', duration: 4.2, delay: 0   },
  { left: '18%', bottom: '26%', duration: 5.1, delay: 1.2 },
  { left: '30%', bottom: '38%', duration: 3.8, delay: 0.5 },
  { left: '42%', bottom: '28%', duration: 4.7, delay: 2.3 },
  { left: '55%', bottom: '42%', duration: 5.3, delay: 0.8 },
  { left: '67%', bottom: '30%', duration: 4.0, delay: 3.1 },
  { left: '78%', bottom: '35%', duration: 4.5, delay: 1.7 },
  { left: '88%', bottom: '24%', duration: 3.6, delay: 2.8 },
  { left: '22%', bottom: '48%', duration: 5.8, delay: 0.3 },
  { left: '61%', bottom: '50%', duration: 4.9, delay: 1.5 },
  { left: '93%', bottom: '38%', duration: 3.9, delay: 3.6 },
  { left: '47%', bottom: '20%', duration: 5.5, delay: 0.9 },
]

export default function NotFound() {
  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(180deg, #0c1a12 0%, #152a1e 35%, #1b3a2d 65%, #1f4636 100%)',
      }}
    >
      {/* Fireflies */}
      {FIREFLIES.map((ff, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ff.left,
            bottom: ff.bottom,
            width: '4px',
            height: '4px',
            background: '#c8f0a0',
            boxShadow: '0 0 8px 3px rgba(160, 220, 90, 0.45)',
            animation: `float-firefly-404 ${ff.duration}s ease-in ${ff.delay}s infinite`,
          }}
        />
      ))}

      {/* Main content */}
      <div
        className="relative z-10 text-center px-6 pb-36"
        style={{ animation: 'fade-in-up 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both' }}
      >
        <p className="font-sans text-xs tracking-[0.35em] uppercase mb-6" style={{ color: '#5a8a6d' }}>
          404 · Page Not Found
        </p>

        <h1
          className="font-serif font-bold leading-none mb-4 select-none"
          style={{
            fontSize: 'clamp(7rem, 22vw, 13rem)',
            color: '#b9dccb',
            textShadow: '0 0 120px rgba(90,138,109,0.25)',
          }}
        >
          404
        </h1>

        <h2
          className="font-serif italic mb-5"
          style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#a3c4af' }}
        >
          Lost in the Wild
        </h2>

        <p className="font-sans text-base leading-relaxed max-w-sm mx-auto mb-10" style={{ color: '#5a8a6d' }}>
          The page you&apos;re looking for has wandered off into the wilderness.
        </p>

        {/* Glass button container — same pattern as homepage nav */}
        <nav className="backdrop-blur-md bg-white/10 rounded-2xl px-8 py-5 border border-white/20 shadow-2xl inline-flex gap-6 flex-wrap justify-center">
          <Link
            href="/"
            className="font-sans text-xs px-6 py-2.5 rounded-xl tracking-[0.2em] uppercase transition-all duration-300 backdrop-blur-sm bg-white/10 border border-white/20 text-forest-100 hover:bg-forest-500 hover:border-forest-500 hover:text-white"
          >
            Return Home
          </Link>
          <Link
            href="/gallery/color"
            className="font-sans text-xs px-6 py-2.5 rounded-xl tracking-[0.2em] uppercase transition-all duration-300 border border-white/10 text-forest-300 hover:bg-white/10 hover:border-white/20 hover:text-forest-100"
          >
            View Gallery
          </Link>
        </nav>
      </div>

      {/* Grass silhouette — front layer */}
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{ animation: 'grass-sway 5s ease-in-out infinite', transformOrigin: 'bottom center' }}
      >
        <svg viewBox="0 0 1440 130" preserveAspectRatio="none" overflow="hidden" style={{ display: 'block', width: '100%' }}>
          <path
            d="M-50,130 C-30,130 -10,118 10,126 C30,134 50,116 70,124 C90,132 110,114 130,122
               C150,130 170,112 190,120 C210,128 230,112 250,120 C270,128 290,114 310,122
               C330,130 352,116 374,124 C396,132 420,118 448,126 C476,134 508,122 544,128
               C580,134 624,124 680,128 L900,130 L1490,130 Z"
            fill="#1f4636"
          />
          <path
            d="M-50,130 C-30,130 -10,124 10,128 C30,132 50,124 72,128 C94,132 118,124 144,128
               C170,132 198,125 228,128 C258,131 292,126 330,129 C368,132 412,127 464,130
               L700,130 L1490,130 Z"
            fill="#255843"
          />
        </svg>
      </div>
    </div>
  )
}
