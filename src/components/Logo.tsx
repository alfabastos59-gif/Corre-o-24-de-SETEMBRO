import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  subtitleClassName?: string;
  titleClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  subtitleClassName = '',
  titleClassName = '',
}) => {
  // Dimensions mapping
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-13 h-13',
    xl: 'w-16 h-16',
  };

  const titleSizes = {
    sm: 'text-sm font-bold',
    md: 'text-base sm:text-lg font-bold tracking-normal',
    lg: 'text-xl sm:text-2xl font-bold tracking-tight',
    xl: 'text-2xl sm:text-3xl font-extrabold tracking-tight',
  };

  const subtitleSizes = {
    sm: 'text-[10px]',
    md: 'text-[11px] sm:text-xs',
    lg: 'text-xs sm:text-sm',
    xl: 'text-sm sm:text-base',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* 4-Quadrant Puzzle Emblem */}
      <div
        className={`${iconSizes[size]} shrink-0 relative rounded-full overflow-hidden shadow-md ring-1 ring-white/20 transition-transform duration-200 group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full block"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <clipPath id="circle-clip">
            <circle cx="50" cy="50" r="50" />
          </clipPath>

          <g clipPath="url(#circle-clip)">
            {/* Top-Left Quadrant: Orange (#f97316 / #ff6d00) with puzzle interlock */}
            <path
              d="M 0 0 L 50 0 L 50 20 C 44 20 44 32 50 32 L 50 50 L 32 50 C 32 44 20 44 20 50 L 0 50 Z"
              fill="#F97316"
            />

            {/* Top-Right Quadrant: Teal (#14B8A6 / #00a884) with puzzle interlock */}
            <path
              d="M 50 0 L 100 0 L 100 50 L 80 50 C 80 56 68 56 68 50 L 50 50 L 50 32 C 44 32 44 20 50 20 Z"
              fill="#14B8A6"
            />

            {/* Bottom-Left Quadrant: Coral Red (#EF4444 / #e53935) with puzzle interlock */}
            <path
              d="M 0 50 L 20 50 C 20 44 32 44 32 50 L 50 50 L 50 68 C 44 68 44 80 50 80 L 50 100 L 0 100 Z"
              fill="#EF4444"
            />

            {/* Bottom-Right Quadrant: Royal Blue (#2563EB / #0284c7) with puzzle interlock */}
            <path
              d="M 50 50 L 68 50 C 68 56 80 56 80 50 L 100 50 L 100 100 L 50 100 L 50 80 C 44 80 44 68 50 68 Z"
              fill="#2563EB"
            />

            {/* Puzzle lines divider for crisp definition */}
            <path
              d="M 50 0 L 50 20 C 44 20 44 32 50 32 L 50 68 C 44 68 44 80 50 80 L 50 100"
              stroke="rgba(0,0,0,0.18)"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M 0 50 L 20 50 C 20 44 32 44 32 50 L 68 50 C 68 56 80 56 80 50 L 100 50"
              stroke="rgba(0,0,0,0.18)"
              strokeWidth="1.5"
              fill="none"
            />

            {/* Top-Left Icon: Paintbrush / Pen (Artes & Humanidades) */}
            <g transform="translate(18, 14) scale(0.65)" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.375-9.375z" fill="#FFFFFF" fillOpacity="0.2" />
              <path d="M14.5 5.5l3 3" />
              <path d="M3 21l3-1 2-2" />
              <circle cx="5" cy="19" r="1" fill="#FFFFFF" />
            </g>

            {/* Top-Right Icon: Chemistry Beaker / Flask (Ciências & Tecnologia) */}
            <g transform="translate(62, 13) scale(0.65)" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M10 2v7.5L4.5 20a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9.5V2" />
              <path d="M8 2h8" />
              <path d="M6.5 16h11" strokeDasharray="1 2" />
              <circle cx="10" cy="18" r="1" fill="#FFFFFF" />
              <circle cx="14" cy="17" r="0.75" fill="#FFFFFF" />
            </g>

            {/* Bottom-Left Icon: Molecule / Network of 3 Nodes (Conhecimento & Inovação) */}
            <g transform="translate(18, 58) scale(0.65)" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <circle cx="12" cy="5" r="3.5" fill="#FFFFFF" fillOpacity="0.9" />
              <circle cx="5" cy="17" r="3.5" fill="#FFFFFF" fillOpacity="0.9" />
              <circle cx="19" cy="17" r="3.5" fill="#FFFFFF" fillOpacity="0.9" />
              <line x1="12" y1="8.5" x2="6.5" y2="14" />
              <line x1="12" y1="8.5" x2="17.5" y2="14" />
              <line x1="8.5" y1="17" x2="15.5" y2="17" />
            </g>

            {/* Bottom-Right Icon: Soccer Ball / Sports / Global (Educação Integral & Esporte) */}
            <g transform="translate(62, 58) scale(0.65)" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <circle cx="12" cy="12" r="10" />
              <polygon points="12 7, 16 10, 14.5 15, 9.5 15, 8 10" fill="#FFFFFF" fillOpacity="0.4" />
              <line x1="12" y1="7" x2="12" y2="2" />
              <line x1="16" y1="10" x2="20.5" y2="7.5" />
              <line x1="14.5" y1="15" x2="18.5" y2="19" />
              <line x1="9.5" y1="15" x2="5.5" y2="19" />
              <line x1="8" y1="10" x2="3.5" y2="7.5" />
            </g>
          </g>
        </svg>
      </div>

      {/* Typography: Title + Subtitle */}
      <div className="flex flex-col justify-center">
        <span
          className={`${titleSizes[size]} text-white font-serif tracking-tight leading-tight drop-shadow-sm ${titleClassName}`}
          style={{ fontFamily: "'Playfair Display', 'Merriweather', Georgia, serif" }}
        >
          Biblioteca Maria Quitéria
        </span>
        {showSubtitle && (
          <span
            className={`${subtitleSizes[size]} text-slate-300/95 font-sans font-medium tracking-normal leading-tight mt-0.5 ${subtitleClassName}`}
          >
            Colégio Estadual do Campo Maria Quitéria - TI
          </span>
        )}
      </div>
    </div>
  );
};
