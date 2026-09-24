import React from 'react';
import { motion } from 'motion/react';

export type MascotMood = 'talking' | 'celebrating' | 'thinking' | 'encouraging' | 'sad';

interface QuiterioMascotProps {
  mood?: MascotMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSpeechBubble?: boolean;
  speechText?: string;
  isMeowing?: boolean;
  onPetCat?: () => void;
}

export const QuiterioMascot: React.FC<QuiterioMascotProps> = ({
  mood = 'talking',
  size = 'lg',
  className = '',
  showSpeechBubble = false,
  speechText = 'Vamos testar seu conhecimento sobre o livro que você leu? 🐾',
  isMeowing = false,
  onPetCat,
}) => {
  const sizeDimensions = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32 sm:w-36 sm:h-36',
    lg: 'w-44 h-44 sm:w-56 sm:h-56 md:w-60 md:h-60',
    xl: 'w-56 h-56 sm:w-72 sm:h-72',
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble */}
      {showSpeechBubble && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative mb-2 z-20 max-w-[250px] sm:max-w-[280px]"
        >
          <div className="relative bg-white text-slate-800 border-2 border-amber-300 border-b-4 border-amber-500 px-4 py-2.5 rounded-2xl shadow-[0_4px_0_#d97706] font-bold text-xs sm:text-sm text-center leading-snug">
            {speechText}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-amber-500 drop-shadow-sm" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-7 border-x-transparent border-t-7 border-t-white" />
          </div>
        </motion.div>
      )}

      {/* Mascot Animated Character */}
      <motion.div
        onClick={onPetCat}
        title={onPetCat ? 'Clique no Quitério para ouvir um Miau! 🐾' : undefined}
        animate={
          mood === 'celebrating' || isMeowing
            ? { y: [0, -14, 0, -8, 0], rotate: [0, -3, 3, -1.5, 0] }
            : mood === 'thinking'
            ? { rotate: [-2, 2, -2], y: [0, -4, 0] }
            : mood === 'sad'
            ? { y: [0, 4, 0], rotate: [-1, 1, -1] }
            : { y: [0, -6, 0] }
        }
        transition={{
          repeat: Infinity,
          duration: mood === 'celebrating' || isMeowing ? 1.4 : 3.0,
          ease: 'easeInOut',
        }}
        className={`relative ${sizeDimensions[size]} ${onPetCat ? 'cursor-pointer' : ''}`}
      >
        {/* Floating Comic "Miau!!" Balloon when celebrating / meowing */}
        {(mood === 'celebrating' || isMeowing) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.4, y: 12, rotate: -12 }}
            animate={{
              opacity: [0.95, 1, 0.95],
              scale: [1, 1.15, 1],
              y: [0, -8, 0],
              rotate: [-6, 6, -6],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: 'easeInOut',
            }}
            className="absolute -top-3 -right-2 sm:-right-6 z-30 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-amber-950 font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-full shadow-xl border-2 border-amber-500 flex items-center gap-1.5"
          >
            <span className="text-base leading-none">😻</span>
            <span className="tracking-tight uppercase">Miau!!</span>
            <span className="text-xs">🐾</span>
          </motion.div>
        )}

        <svg
          viewBox="0 0 280 280"
          className="w-full h-full drop-shadow-2xl overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Ambient Back Glow */}
            <radialGradient id="catAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>

            {/* Cat Fur Gradient (Ginger / Warm Orange Tabby from video) */}
            <linearGradient id="catOrangeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="45%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>

            {/* Darker Fur Shadow */}
            <linearGradient id="catDarkFur" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>

            {/* Brown Leather Book Hardcover Gradient (Exact from video) */}
            <linearGradient id="brownBookCover" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9a3412" />
              <stop offset="40%" stopColor="#854d0e" />
              <stop offset="100%" stopColor="#713f12" />
            </linearGradient>

            {/* Book Spine Deep Shadow */}
            <linearGradient id="bookSpineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="50%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>

            {/* Gold Accents Gradient */}
            <linearGradient id="goldAccents" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* Eyeglasses Metallic Reflection */}
            <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Ambient Warm Back Glow */}
          <circle cx="140" cy="140" r="115" fill="url(#catAura)" />

          {/* Floating Warm Magic Reading Particle (as seen in the top right of the video) */}
          <motion.circle
            cx="225"
            cy="45"
            r="10"
            fill="#ea580c"
            opacity="0.85"
            animate={{
              y: [0, -8, 0],
              scale: [1, 1.15, 1],
              opacity: [0.75, 0.95, 0.75],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.4,
              ease: 'easeInOut',
            }}
          />

          {/* ========================================================================= */}
          {/* CAT TAIL - Fluffy orange striped tail curving down and swaying (from video) */}
          {/* ========================================================================= */}
          <motion.g
            animate={{
              rotate: [-6, 10, -6],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.8,
              ease: 'easeInOut',
            }}
            style={{ originX: '140px', originY: '200px' }}
          >
            {/* Base Tail Path */}
            <path
              d="M 134 205 C 130 236 148 260 170 256 C 188 252 186 230 172 222 C 158 214 150 206 146 195 Z"
              fill="url(#catOrangeGrad)"
              stroke="#7c2d12"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Tail Tabby Stripes */}
            <path d="M 144 218 Q 155 224 162 216" stroke="#9a3412" strokeWidth="3" strokeLinecap="round" />
            <path d="M 152 232 Q 166 238 174 228" stroke="#9a3412" strokeWidth="3" strokeLinecap="round" />
            <path d="M 160 248 Q 174 252 180 242" stroke="#9a3412" strokeWidth="3" strokeLinecap="round" />
            {/* White Tail Tip */}
            <path
              d="M 170 256 C 182 254 186 242 184 236 C 180 232 174 235 170 242 Z"
              fill="#fffbeb"
            />
          </motion.g>

          {/* ========================================================================= */}
          {/* LEFT HIND LEG & PAW WITH TOE BEANS (Extended playfully out to the left, as in video) */}
          {/* ========================================================================= */}
          <motion.g
            animate={{
              rotate: [-3, 3, -3],
              y: [0, -2, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: 'easeInOut',
            }}
            style={{ originX: '110px', originY: '185px' }}
          >
            {/* Leg Thigh */}
            <path
              d="M 112 170 C 85 172 65 190 76 210 C 84 222 102 214 116 198 Z"
              fill="url(#catOrangeGrad)"
              stroke="#7c2d12"
              strokeWidth="3"
            />
            {/* Left Hind Foot (White mit with pink paw pads) */}
            <ellipse
              cx="72"
              cy="204"
              rx="13"
              ry="11"
              fill="#fffbeb"
              stroke="#7c2d12"
              strokeWidth="3"
            />
            {/* Big Center Paw Pad */}
            <ellipse cx="73" cy="207" rx="5" ry="4" fill="#fda4af" />
            {/* 3 Little Toe Beans */}
            <circle cx="64" cy="199" r="2.2" fill="#fda4af" />
            <circle cx="71" cy="196" r="2.2" fill="#fda4af" />
            <circle cx="79" cy="198" r="2.2" fill="#fda4af" />
          </motion.g>

          {/* ========================================================================= */}
          {/* RIGHT HIND FOOT (Peeking out on the bottom right) */}
          {/* ========================================================================= */}
          <g>
            <ellipse
              cx="198"
              cy="204"
              rx="12"
              ry="10"
              fill="#fffbeb"
              stroke="#7c2d12"
              strokeWidth="3"
            />
            <ellipse cx="197" cy="206" rx="4.5" ry="3.5" fill="#fda4af" />
            <circle cx="191" cy="198" r="2" fill="#fda4af" />
            <circle cx="198" cy="196" r="2" fill="#fda4af" />
            <circle cx="204" cy="198" r="2" fill="#fda4af" />
          </g>

          {/* ========================================================================= */}
          {/* CAT BODY */}
          {/* ========================================================================= */}
          <path
            d="M 98 126 C 82 165 90 210 140 212 C 190 210 198 165 182 126 C 174 112 106 112 98 126 Z"
            fill="url(#catOrangeGrad)"
            stroke="#7c2d12"
            strokeWidth="3.5"
          />

          {/* White / Cream Fluffy Belly & Chest */}
          <path
            d="M 112 126 C 112 118 168 118 168 126 C 170 160 162 196 140 198 C 118 196 110 160 112 126 Z"
            fill="#fffbeb"
          />

          {/* ========================================================================= */}
          {/* CAT EARS (Natural pointed ears, NO graduation cap, exact from video!) */}
          {/* ========================================================================= */}
          {/* Left Ear */}
          <motion.g
            animate={{ rotate: [-2, 3, -2] }}
            transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
            style={{ originX: '95px', originY: '60px' }}
          >
            <path
              d="M 82 66 L 62 18 C 76 16 104 32 112 56 Z"
              fill="url(#catOrangeGrad)"
              stroke="#7c2d12"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Inner Ear Soft Peach */}
            <path
              d="M 82 58 L 69 28 C 76 26 96 38 103 52 Z"
              fill="#fed7aa"
            />
            <path
              d="M 83 54 L 74 34 C 78 32 92 42 98 50 Z"
              fill="#fda4af"
              opacity="0.6"
            />
          </motion.g>

          {/* Right Ear */}
          <motion.g
            animate={{ rotate: [2, -3, 2] }}
            transition={{ repeat: Infinity, duration: 3.2, delay: 0.2, ease: 'easeInOut' }}
            style={{ originX: '185px', originY: '60px' }}
          >
            <path
              d="M 198 66 L 218 18 C 204 16 176 32 168 56 Z"
              fill="url(#catOrangeGrad)"
              stroke="#7c2d12"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Inner Ear Soft Peach */}
            <path
              d="M 198 58 L 211 28 C 204 26 184 38 177 52 Z"
              fill="#fed7aa"
            />
            <path
              d="M 197 54 L 206 34 C 202 32 188 42 182 50 Z"
              fill="#fda4af"
              opacity="0.6"
            />
          </motion.g>

          {/* ========================================================================= */}
          {/* CHUBBY GINGER CAT HEAD */}
          {/* ========================================================================= */}
          <ellipse
            cx="140"
            cy="84"
            rx="56"
            ry="48"
            fill="url(#catOrangeGrad)"
            stroke="#7c2d12"
            strokeWidth="3.5"
          />

          {/* Tabby Forehead Stripes (Distinctive ginger cat markings from video) */}
          <path d="M 140 44 L 140 58" stroke="#7c2d12" strokeWidth="4" strokeLinecap="round" />
          <path d="M 128 47 L 132 60" stroke="#7c2d12" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 152 47 L 148 60" stroke="#7c2d12" strokeWidth="3.5" strokeLinecap="round" />
          {/* Side temple stripes */}
          <path d="M 94 68 Q 106 72 110 76" stroke="#9a3412" strokeWidth="3" strokeLinecap="round" />
          <path d="M 186 68 Q 174 72 170 76" stroke="#9a3412" strokeWidth="3" strokeLinecap="round" />

          {/* Cute Rosy Cheeks */}
          <ellipse cx="102" cy="98" rx="11" ry="7" fill="#fb7185" opacity="0.6" />
          <ellipse cx="178" cy="98" rx="11" ry="7" fill="#fb7185" opacity="0.6" />

          {/* White Snout / Muzzle */}
          <ellipse cx="140" cy="98" rx="24" ry="16" fill="#fffbeb" stroke="#7c2d12" strokeWidth="1.5" />

          {/* Pink Nose */}
          <path
            d="M 135 91 Q 140 89 145 91 C 145 96 140 100 140 100 C 140 100 135 96 135 91 Z"
            fill="#f43f5e"
          />

          {/* Whiskers (Crisp delicate cat whiskers) */}
          <line x1="82" y1="96" x2="114" y2="98" stroke="#7c2d12" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="80" y1="104" x2="114" y2="102" stroke="#7c2d12" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="198" y1="96" x2="166" y2="98" stroke="#7c2d12" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="200" y1="104" x2="166" y2="102" stroke="#7c2d12" strokeWidth="2.2" strokeLinecap="round" />

          {/* Smiling / Expressive Mouth */}
          {mood === 'celebrating' || isMeowing ? (
            <g>
              <path
                d="M 131 98 Q 140 114 149 98 Q 140 102 131 98 Z"
                fill="#be123c"
                stroke="#7c2d12"
                strokeWidth="2"
              />
              <ellipse cx="140" cy="107" rx="4.5" ry="3" fill="#fb7185" />
            </g>
          ) : mood === 'sad' ? (
            <path
              d="M 133 103 Q 140 98 147 103"
              stroke="#7c2d12"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M 133 98 Q 140 104 140 101 Q 140 104 147 98"
              stroke="#7c2d12"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* ========================================================================= */}
          {/* BIG SHINING EYES (Expressive, warm eyes behind glasses) */}
          {/* ========================================================================= */}
          {mood === 'celebrating' ? (
            /* Joyful Closed Crescent Eyes (^_^) */
            <g>
              <path
                d="M 104 80 Q 115 68 126 80"
                stroke="#451a03"
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 154 80 Q 165 68 176 80"
                stroke="#451a03"
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          ) : mood === 'sad' ? (
            /* Sad Droopy Eyes */
            <g>
              <circle cx="115" cy="81" r="11" fill="#ffffff" stroke="#7c2d12" strokeWidth="1.5" />
              <circle cx="115" cy="83" r="8" fill="#78350f" />
              <circle cx="115" cy="84" r="5" fill="#1c1917" />
              <circle cx="113" cy="80" r="3" fill="#ffffff" />

              <circle cx="165" cy="81" r="11" fill="#ffffff" stroke="#7c2d12" strokeWidth="1.5" />
              <circle cx="165" cy="83" r="8" fill="#78350f" />
              <circle cx="165" cy="84" r="5" fill="#1c1917" />
              <circle cx="163" cy="80" r="3" fill="#ffffff" />
            </g>
          ) : (
            /* Open Shining Anime Eyes Blinking naturally */
            <motion.g
              animate={{
                scaleY: [1, 1, 0.1, 1, 1, 1, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 4.2,
                times: [0, 0.88, 0.92, 0.96, 0.98, 1, 1],
              }}
              style={{ originX: '140px', originY: '80px' }}
            >
              {/* Left Eye */}
              <circle cx="115" cy="80" r="13" fill="#ffffff" stroke="#7c2d12" strokeWidth="2" />
              <circle cx="115" cy="81" r="9.5" fill="#78350f" />
              <circle cx="115" cy="81.5" r="6.5" fill="#1c1917" />
              <circle cx="111" cy="77" r="3.5" fill="#ffffff" />
              <circle cx="118" cy="84" r="1.8" fill="#ffffff" />

              {/* Right Eye */}
              <circle cx="165" cy="80" r="13" fill="#ffffff" stroke="#7c2d12" strokeWidth="2" />
              <circle cx="165" cy="81" r="9.5" fill="#78350f" />
              <circle cx="165" cy="81.5" r="6.5" fill="#1c1917" />
              <circle cx="161" cy="77" r="3.5" fill="#ffffff" />
              <circle cx="168" cy="84" r="1.8" fill="#ffffff" />
            </motion.g>
          )}

          {/* ========================================================================= */}
          {/* ROUND SPECTACLES / GLASSES (From the video) */}
          {/* ========================================================================= */}
          <g>
            {/* Left Glass Rim */}
            <circle
              cx="115"
              cy="80"
              r="18.5"
              fill="url(#glassReflection)"
              stroke="#2e1065"
              strokeWidth="3.8"
            />
            {/* White Glint */}
            <path
              d="M 104 70 Q 115 65 125 70"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Right Glass Rim */}
            <circle
              cx="165"
              cy="80"
              r="18.5"
              fill="url(#glassReflection)"
              stroke="#2e1065"
              strokeWidth="3.8"
            />
            {/* White Glint */}
            <path
              d="M 154 70 Q 165 65 175 70"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Glasses Center Bridge */}
            <path
              d="M 133.5 78 Q 140 73 146.5 78"
              fill="none"
              stroke="#2e1065"
              strokeWidth="3.8"
              strokeLinecap="round"
            />
          </g>

          {/* ========================================================================= */}
          {/* OPEN BROWN LEATHER BOOK HELD IN FRONT PAWS (Exact from the video!)        */}
          {/* ========================================================================= */}
          <motion.g
            animate={{
              y: [0, -3, 0],
              rotate: [-1, 1, -1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.8,
              ease: 'easeInOut',
            }}
            style={{ originX: '140px', originY: '160px' }}
          >
            {/* Soft Shadow under book */}
            <ellipse cx="140" cy="188" rx="55" ry="8" fill="#000000" opacity="0.3" />

            {/* Brown Hardcover Base (Open Book Shape with spine) */}
            <path
              d="M 78 132 Q 140 118 140 178 Q 140 118 202 132 L 198 184 Q 140 170 140 190 Q 140 170 82 184 Z"
              fill="url(#brownBookCover)"
              stroke="#451a03"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* Left Cover Debossed Border Line (as in video) */}
            <path
              d="M 85 137 Q 134 126 135 174 L 88 179 Z"
              fill="none"
              stroke="#713f12"
              strokeWidth="1.8"
              opacity="0.6"
            />

            {/* Right Cover Debossed Border Line (as in video) */}
            <path
              d="M 195 137 Q 146 126 145 174 L 192 179 Z"
              fill="none"
              stroke="#713f12"
              strokeWidth="1.8"
              opacity="0.6"
            />

            {/* Book Spine Center */}
            <rect x="137" y="126" width="6" height="62" rx="2" fill="url(#bookSpineGrad)" />
            <line x1="136" y1="138" x2="144" y2="138" stroke="#f59e0b" strokeWidth="2" />
            <line x1="136" y1="148" x2="144" y2="148" stroke="#f59e0b" strokeWidth="2" />
            <line x1="136" y1="158" x2="144" y2="158" stroke="#f59e0b" strokeWidth="2" />
            <line x1="136" y1="168" x2="144" y2="168" stroke="#f59e0b" strokeWidth="2" />

            {/* Left Open Page (Cream paper) */}
            <path
              d="M 83 135 Q 137 122 137 174 Q 110 170 86 179 Z"
              fill="#fffdf5"
              stroke="#e2e8f0"
              strokeWidth="1.5"
            />
            {/* Left Page Text Lines */}
            <line x1="94" y1="145" x2="130" y2="142" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="94" y1="152" x2="131" y2="149" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="94" y1="159" x2="128" y2="156" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="94" y1="166" x2="122" y2="163" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />

            {/* Right Open Page (Cream paper) */}
            <path
              d="M 197 135 Q 143 122 143 174 Q 170 170 194 179 Z"
              fill="#fffdf5"
              stroke="#e2e8f0"
              strokeWidth="1.5"
            />
            {/* Right Page Text Lines */}
            <line x1="150" y1="142" x2="186" y2="145" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="149" y1="149" x2="186" y2="152" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="152" y1="156" x2="186" y2="159" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="158" y1="163" x2="186" y2="166" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />

            {/* Gold Bookmark Ribbon hanging down */}
            <path
              d="M 140 182 C 137 194 143 203 136 214 L 142 212 L 145 215 C 144 204 141 195 140 182 Z"
              fill="url(#goldAccents)"
            />

            {/* Left Front Paw Holding Book (White mitt with pink pads) */}
            <ellipse
              cx="86"
              cy="160"
              rx="10"
              ry="8.5"
              fill="#fffbeb"
              stroke="#7c2d12"
              strokeWidth="2.5"
            />
            <circle cx="82" cy="160" r="1.8" fill="#fda4af" />
            <circle cx="86" cy="157" r="1.8" fill="#fda4af" />
            <circle cx="90" cy="160" r="1.8" fill="#fda4af" />

            {/* Right Front Paw Holding Book (White mitt with pink pads) */}
            <ellipse
              cx="194"
              cy="160"
              rx="10"
              ry="8.5"
              fill="#fffbeb"
              stroke="#7c2d12"
              strokeWidth="2.5"
            />
            <circle cx="190" cy="160" r="1.8" fill="#fda4af" />
            <circle cx="194" cy="157" r="1.8" fill="#fda4af" />
            <circle cx="198" cy="160" r="1.8" fill="#fda4af" />
          </motion.g>

          {/* Celebration Stars when celebrating */}
          {mood === 'celebrating' && (
            <g>
              <motion.circle
                cx="55"
                cy="60"
                r="5"
                fill="#fbbf24"
                animate={{ scale: [0, 1.4, 0] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              />
              <motion.circle
                cx="225"
                cy="70"
                r="4.5"
                fill="#fbbf24"
                animate={{ scale: [0, 1.4, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }}
              />
              <motion.circle
                cx="140"
                cy="20"
                r="5.5"
                fill="#f59e0b"
                animate={{ scale: [0, 1.5, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: 0.6 }}
              />
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
};
