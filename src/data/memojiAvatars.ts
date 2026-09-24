/**
 * 12 Avatares Oficiais Estilo Memoji 3D da Biblioteca Maria Quitéria
 * Baseados na coleção enviada pelo usuário (grade 4x3 de Memojis 3D).
 * Renderizados em SVG vetorial de alta definição com gradientes e sombras 3D.
 */

export interface MemojiAvatar {
  id: string;
  name: string;
  description: string;
  genderHint: 'feminino' | 'masculino' | 'neutro';
  bgHex: string;
  url: string;
}

const encodeSvg = (svg: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
};

export const MEMOJI_AVATAR_OPTIONS: MemojiAvatar[] = [
  // 1. Menina Coques Duplos (Space Buns) & Brincos de Gota Dourados
  {
    id: 'memoji-01',
    name: 'Jovem Coques Duplos & Brincos Dourados',
    description: 'Cabelo castanho com coques espaciais, brincos dourados e sorriso alegre',
    genderHint: 'feminino',
    bgHex: '#fff1f2',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
        <defs>
          <radialGradient id="m1-skin" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#fde8d0"/>
            <stop offset="60%" stop-color="#f8cfad"/>
            <stop offset="100%" stop-color="#e8ad82"/>
          </radialGradient>
          <radialGradient id="m1-hair" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#6d3b24"/>
            <stop offset="60%" stop-color="#4a2211"/>
            <stop offset="100%" stop-color="#2c1409"/>
          </radialGradient>
          <radialGradient id="m1-gold" cx="35%" cy="30%" r="60%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="50%" stop-color="#eab308"/>
            <stop offset="100%" stop-color="#a16207"/>
          </radialGradient>
        </defs>
        <!-- Background circle -->
        <circle cx="70" cy="70" r="66" fill="#fff7ed"/>
        <g transform="rotate(-6 70 70)">
          <!-- Space Buns -->
          <circle cx="36" cy="36" r="16" fill="url(#m1-hair)"/>
          <circle cx="104" cy="40" r="16" fill="url(#m1-hair)"/>
          <!-- Drop Earrings -->
          <ellipse cx="23" cy="80" rx="3.5" ry="6" fill="url(#m1-gold)"/>
          <ellipse cx="114" cy="84" rx="3.5" ry="6" fill="url(#m1-gold)"/>
          <!-- Ears -->
          <ellipse cx="32" cy="72" rx="6" ry="10" fill="#f8cfad"/>
          <ellipse cx="108" cy="74" rx="6" ry="10" fill="#f8cfad"/>
          <!-- Head / Hair Back -->
          <ellipse cx="70" cy="70" rx="38" ry="42" fill="url(#m1-skin)"/>
          <path d="M34 56 C32 28, 108 28, 106 56 C100 48, 86 44, 70 45 C54 44, 40 48, 34 56 Z" fill="url(#m1-hair)"/>
          <!-- Eyebrows -->
          <path d="M44 58 Q54 52 62 57" stroke="#38180c" stroke-width="3.5" stroke-linecap="round" fill="none"/>
          <path d="M78 57 Q86 52 96 58" stroke="#38180c" stroke-width="3.5" stroke-linecap="round" fill="none"/>
          <!-- Eyes -->
          <ellipse cx="53" cy="67" rx="5.5" ry="6.5" fill="#261208"/>
          <ellipse cx="87" cy="67" rx="5.5" ry="6.5" fill="#261208"/>
          <circle cx="51" cy="65" r="2" fill="#ffffff"/>
          <circle cx="85" cy="65" r="2" fill="#ffffff"/>
          <!-- Nose -->
          <path d="M68 72 Q70 76 72 72" stroke="#d97706" stroke-width="2" stroke-linecap="round" fill="none"/>
          <!-- Cute Smile -->
          <path d="M52 83 Q70 102 88 83" fill="#be123c"/>
          <path d="M56 84 Q70 94 84 84 Z" fill="#ffffff"/>
          <!-- Blushes -->
          <circle cx="43" cy="78" r="6" fill="#f43f5e" opacity="0.25"/>
          <circle cx="97" cy="78" r="6" fill="#f43f5e" opacity="0.25"/>
        </g>
      </svg>
    `),
  },

  // 2. Senhor com Chapéu Fedora Azul & Bigode Branco
  {
    id: 'memoji-02',
    name: 'Senhor com Chapéu Azul & Bigode',
    description: 'Chapéu fedora azul cerúleo, óculos, cabelos grisalhos e bigode branco',
    genderHint: 'masculino',
    bgHex: '#eff6ff',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
        <defs>
          <radialGradient id="m2-skin" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#fee2e2"/>
            <stop offset="60%" stop-color="#fecaca"/>
            <stop offset="100%" stop-color="#f87171"/>
          </radialGradient>
          <linearGradient id="m2-hat" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="50%" stop-color="#0284c7"/>
            <stop offset="100%" stop-color="#0369a1"/>
          </linearGradient>
        </defs>
        <circle cx="70" cy="70" r="66" fill="#f0f9ff"/>
        <!-- Grey hair sides -->
        <circle cx="34" cy="76" r="12" fill="#e2e8f0"/>
        <circle cx="106" cy="76" r="12" fill="#e2e8f0"/>
        <!-- Face -->
        <ellipse cx="70" cy="78" rx="36" ry="38" fill="url(#m2-skin)"/>
        <!-- Fedora Hat Brim -->
        <ellipse cx="70" cy="52" rx="48" ry="14" fill="url(#m2-hat)"/>
        <!-- Fedora Crown -->
        <path d="M40 50 C40 24, 100 24, 100 50 Z" fill="url(#m2-hat)"/>
        <!-- Hat Ribbon -->
        <path d="M40 48 Q70 54 100 48" stroke="#0c4a6e" stroke-width="4" fill="none"/>
        <!-- Glasses -->
        <rect x="42" y="68" width="22" height="15" rx="5" fill="none" stroke="#64748b" stroke-width="2.5"/>
        <rect x="76" y="68" width="22" height="15" rx="5" fill="none" stroke="#64748b" stroke-width="2.5"/>
        <line x1="64" y1="74" x2="76" y2="74" stroke="#64748b" stroke-width="2.5"/>
        <!-- Eyes -->
        <circle cx="53" cy="75" r="3.5" fill="#1e293b"/>
        <circle cx="87" cy="75" r="3.5" fill="#1e293b"/>
        <!-- White Mustache -->
        <path d="M50 90 Q70 82 90 90 Q70 98 50 90 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
        <!-- Big Smile -->
        <path d="M56 94 Q70 108 84 94 Z" fill="#991b1b"/>
        <path d="M59 95 Q70 101 81 95 Z" fill="#ffffff"/>
      </svg>
    `),
  },

  // 3. Mulher Negra de Hijab Roxo & Óculos Gatinho Brancos
  {
    id: 'memoji-03',
    name: 'Mulher de Hijab Lilás & Óculos Gatinho',
    description: 'Hijab roxo estilizado, óculos brancos modelo gatinho e pele negra iluminada',
    genderHint: 'feminino',
    bgHex: '#faf5ff',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
        <defs>
          <radialGradient id="m3-skin" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#9a5b3a"/>
            <stop offset="60%" stop-color="#733d22"/>
            <stop offset="100%" stop-color="#4d2411"/>
          </radialGradient>
          <linearGradient id="m3-hijab" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#a855f7"/>
            <stop offset="50%" stop-color="#7e22ce"/>
            <stop offset="100%" stop-color="#581c87"/>
          </linearGradient>
        </defs>
        <circle cx="70" cy="70" r="66" fill="#fdf4ff"/>
        <!-- Hijab Back and Shoulders -->
        <path d="M30 65 C25 115, 115 115, 110 65 C108 24, 32 24, 30 65 Z" fill="url(#m3-hijab)"/>
        <!-- Hijab Knot / Drapery -->
        <path d="M55 105 L70 120 L85 105 Z" fill="#581c87"/>
        <!-- Face Opening in Hijab -->
        <ellipse cx="70" cy="68" rx="27" ry="34" fill="url(#m3-skin)"/>
        <!-- Cat-Eye White Glasses -->
        <path d="M38 60 Q52 56 64 63 Q52 74 38 68 Z" fill="none" stroke="#ffffff" stroke-width="3"/>
        <path d="M102 60 Q88 56 76 63 Q88 74 102 68 Z" fill="none" stroke="#ffffff" stroke-width="3"/>
        <line x1="64" y1="63" x2="76" y2="63" stroke="#ffffff" stroke-width="3"/>
        <!-- Eyes -->
        <ellipse cx="51" cy="65" rx="4.5" ry="5.5" fill="#180e07"/>
        <ellipse cx="89" cy="65" rx="4.5" ry="5.5" fill="#180e07"/>
        <circle cx="50" cy="63" r="1.5" fill="#fff"/>
        <circle cx="88" cy="63" r="1.5" fill="#fff"/>
        <!-- Lips -->
        <path d="M56 86 Q70 96 84 86 Q70 91 56 86 Z" fill="#be185d"/>
      </svg>
    `),
  },

  // 4. Homem Negro com Dreadlocks & Óculos Redondos Âmbar
  {
    id: 'memoji-04',
    name: 'Homem Dreadlocks & Óculos Redondos',
    description: 'Dreadlocks estilizados, barba cheia e óculos redondos vintage',
    genderHint: 'masculino',
    bgHex: '#fef3c7',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
        <defs>
          <radialGradient id="m4-skin" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#8a5333"/>
            <stop offset="60%" stop-color="#61341c"/>
            <stop offset="100%" stop-color="#3d1e0d"/>
          </radialGradient>
        </defs>
        <circle cx="70" cy="70" r="66" fill="#fffbeb"/>
        <!-- Dreadlocks Layers -->
        <g fill="#1c1917">
          <rect x="22" y="38" width="12" height="42" rx="6"/>
          <rect x="18" y="52" width="12" height="46" rx="6"/>
          <rect x="28" y="26" width="14" height="40" rx="7"/>
          <rect x="106" y="38" width="12" height="42" rx="6"/>
          <rect x="110" y="52" width="12" height="46" rx="6"/>
          <rect x="98" y="26" width="14" height="40" rx="7"/>
          <circle cx="70" cy="36" r="32"/>
        </g>
        <!-- Face -->
        <ellipse cx="70" cy="74" rx="34" ry="38" fill="url(#m4-skin)"/>
        <!-- Beard & Mustache -->
        <path d="M42 78 Q70 120 98 78 Q90 102 70 106 Q50 102 42 78 Z" fill="#1c1917"/>
        <path d="M52 82 Q70 78 88 82 Q70 88 52 82 Z" fill="#1c1917"/>
        <!-- Round Glasses Orange/Red -->
        <circle cx="52" cy="68" r="12" fill="none" stroke="#ea580c" stroke-width="3"/>
        <circle cx="88" cy="68" r="12" fill="none" stroke="#ea580c" stroke-width="3"/>
        <line x1="64" y1="68" x2="76" y2="68" stroke="#ea580c" stroke-width="3"/>
        <!-- Eyes looking up/side -->
        <circle cx="50" cy="66" r="3.5" fill="#ffffff"/>
        <circle cx="86" cy="66" r="3.5" fill="#ffffff"/>
        <circle cx="51" cy="65" r="2.5" fill="#1c1917"/>
        <circle cx="87" cy="65" r="2.5" fill="#1c1917"/>
        <!-- Smile -->
        <path d="M58 90 Q70 98 82 90" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      </svg>
    `),
  },

  // 5. Mulher Loira com Óculos Escuros Rosa Gatinho
  {
    id: 'memoji-05',
    name: 'Mulher Loira & Óculos Rosa Gatinho',
    description: 'Cabelos loiros volumosos e ondulados, óculos cat-eye rosa choque e brincos',
    genderHint: 'feminino',
    bgHex: '#fdf2f8',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
        <defs>
          <radialGradient id="m5-hair" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="50%" stop-color="#fde047"/>
            <stop offset="100%" stop-color="#ca8a04"/>
          </radialGradient>
        </defs>
        <circle cx="70" cy="70" r="66" fill="#fff1f2"/>
        <!-- Blonde Hair Waves Back -->
        <path d="M25 60 C15 110, 45 125, 45 115 C25 90, 40 40, 70 30 C100 40, 115 90, 95 115 C95 125, 125 110, 115 60 C110 30, 30 30, 25 60 Z" fill="url(#m5-hair)"/>
        <!-- Face -->
        <ellipse cx="70" cy="72" rx="32" ry="36" fill="#fee2e2"/>
        <!-- Pearl Earrings -->
        <circle cx="34" cy="80" r="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
        <circle cx="106" cy="80" r="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
        <!-- Pink Cat-Eye Sunglasses -->
        <path d="M36 62 Q52 56 64 65 Q52 78 36 72 Z" fill="#ec4899" stroke="#db2777" stroke-width="2"/>
        <path d="M104 62 Q88 56 76 65 Q88 78 104 72 Z" fill="#ec4899" stroke="#db2777" stroke-width="2"/>
        <line x1="64" y1="65" x2="76" y2="65" stroke="#db2777" stroke-width="3"/>
        <!-- Lens reflection -->
        <ellipse cx="50" cy="67" rx="7" ry="4" fill="#f472b6" opacity="0.6"/>
        <ellipse cx="90" cy="67" rx="7" ry="4" fill="#f472b6" opacity="0.6"/>
        <!-- Pink Lips -->
        <path d="M60 88 Q70 96 80 88 Q70 92 60 88 Z" fill="#e11d48"/>
      </svg>
    `),
  },

  // 6. Menino de Franja Tigela & Sardas (Freckles)
  {
    id: 'memoji-06',
    name: 'Menino com Franja & Sardinhas',
    description: 'Cabelo castanho liso, sardinhas fofas nas bochechas e sorriso infantil',
    genderHint: 'masculino',
    bgHex: '#f0fdf4',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="66" fill="#f0fdf4"/>
        <!-- Ears -->
        <circle cx="36" cy="72" r="8" fill="#fed7aa"/>
        <circle cx="104" cy="72" r="8" fill="#fed7aa"/>
        <!-- Face -->
        <ellipse cx="70" cy="72" rx="34" ry="36" fill="#ffedd5"/>
        <!-- Brown Bowl Haircut -->
        <path d="M34 60 C32 26, 108 26, 106 60 C98 52, 85 54, 70 54 C55 54, 42 52, 34 60 Z" fill="#5c2d16"/>
        <!-- Freckles -->
        <g fill="#b45309" opacity="0.6">
          <circle cx="50" cy="76" r="1.2"/>
          <circle cx="53" cy="79" r="1.2"/>
          <circle cx="57" cy="77" r="1.2"/>
          <circle cx="83" cy="77" r="1.2"/>
          <circle cx="87" cy="79" r="1.2"/>
          <circle cx="90" cy="76" r="1.2"/>
        </g>
        <!-- Eyes -->
        <ellipse cx="52" cy="68" rx="4.5" ry="5.5" fill="#38180c"/>
        <ellipse cx="88" cy="68" rx="4.5" ry="5.5" fill="#38180c"/>
        <circle cx="51" cy="66" r="1.5" fill="#fff"/>
        <circle cx="87" cy="66" r="1.5" fill="#fff"/>
        <!-- Smile -->
        <path d="M58 86 Q70 96 82 86" stroke="#991b1b" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      </svg>
    `),
  },

  // 7. Rapaz com Topete Ruivo & Óculos Aviador Verde Neon
  {
    id: 'memoji-07',
    name: 'Rapaz Topete Ruivo & Óculos Aviador',
    description: 'Cabelo castanho-acobreado penteado, óculos aviador verde neon e sorriso aberto',
    genderHint: 'masculino',
    bgHex: '#f0fdfa',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="66" fill="#f0fdfa"/>
        <g transform="rotate(5 70 70)">
          <!-- Face -->
          <ellipse cx="70" cy="74" rx="33" ry="38" fill="#fed7aa"/>
          <!-- Pompadour Red Hair -->
          <path d="M38 58 C32 18, 98 12, 102 46 C94 48, 86 52, 70 52 C54 52, 44 48, 38 58 Z" fill="#9a3412"/>
          <!-- Green Aviator Glasses -->
          <rect x="38" y="62" width="28" height="22" rx="7" fill="none" stroke="#22c55e" stroke-width="3"/>
          <rect x="74" y="62" width="28" height="22" rx="7" fill="none" stroke="#22c55e" stroke-width="3"/>
          <line x1="66" y1="66" x2="74" y2="66" stroke="#22c55e" stroke-width="3"/>
          <!-- Eyes behind tinted lenses -->
          <circle cx="52" cy="73" r="3.5" fill="#1e293b"/>
          <circle cx="88" cy="73" r="3.5" fill="#1e293b"/>
          <!-- Open Teeth Smile -->
          <path d="M54 94 Q70 108 86 94 Z" fill="#991b1b"/>
          <path d="M57 95 Q70 102 83 95 Z" fill="#ffffff"/>
        </g>
      </svg>
    `),
  },

  // 8. Menina de Chapéu Fedora Branco & Cabelo Chanel Preto
  {
    id: 'memoji-08',
    name: 'Menina de Chapéu Branco & Chanel',
    description: 'Chapéu fedora claro com fita preta, cabelo chanel e olhar sereno',
    genderHint: 'feminino',
    bgHex: '#f8fafc',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="66" fill="#f8fafc"/>
        <!-- Black Bob Hair Behind -->
        <path d="M32 60 C30 102, 110 102, 108 60 Z" fill="#0f172a"/>
        <!-- Face -->
        <ellipse cx="70" cy="74" rx="32" ry="34" fill="#fde68a"/>
        <!-- White Fedora Hat Brim -->
        <ellipse cx="70" cy="56" rx="46" ry="14" fill="#e2e8f0"/>
        <!-- Hat Crown -->
        <path d="M42 54 C42 30, 98 30, 98 54 Z" fill="#f1f5f9"/>
        <path d="M42 52 Q70 56 98 52" stroke="#0f172a" stroke-width="4" fill="none"/>
        <!-- Straight Bangs -->
        <path d="M46 62 Q70 65 94 62 L94 56 L46 56 Z" fill="#0f172a"/>
        <!-- Eyes -->
        <ellipse cx="54" cy="72" rx="4" ry="5" fill="#0f172a"/>
        <ellipse cx="86" cy="72" rx="4" ry="5" fill="#0f172a"/>
        <!-- Gentle Smile -->
        <path d="M60 88 Q70 95 80 88" stroke="#991b1b" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `),
  },

  // 9. Rapaz de Gorro Vermelho, Óculos & Piscadela (Wink)
  {
    id: 'memoji-09',
    name: 'Rapaz de Gorro Vermelho & Piscadela',
    description: 'Gorro vermelho de inverno, armação grossa e expressão de piscadela',
    genderHint: 'masculino',
    bgHex: '#fff7ed',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="66" fill="#fff7ed"/>
        <g transform="rotate(-4 70 70)">
          <!-- Face -->
          <ellipse cx="70" cy="76" rx="32" ry="36" fill="#fed7aa"/>
          <!-- Red Beanie -->
          <path d="M38 58 C38 24, 102 24, 102 58 Z" fill="#dc2626"/>
          <!-- Beanie Fold -->
          <rect x="34" y="52" width="72" height="14" rx="4" fill="#ef4444"/>
          <!-- Thick Brown Square Glasses -->
          <rect x="38" y="70" width="26" height="20" rx="6" fill="none" stroke="#78350f" stroke-width="3.5"/>
          <rect x="76" y="70" width="26" height="20" rx="6" fill="none" stroke="#78350f" stroke-width="3.5"/>
          <line x1="64" y1="78" x2="76" y2="78" stroke="#78350f" stroke-width="3.5"/>
          <!-- Left Eye: Open / Right Eye: Winking -->
          <circle cx="51" cy="80" r="3.5" fill="#1c1917"/>
          <path d="M82 80 Q89 85 96 80" stroke="#1c1917" stroke-width="3" stroke-linecap="round" fill="none"/>
          <!-- Smile -->
          <path d="M58 98 Q70 108 82 98" fill="#991b1b"/>
          <path d="M60 99 Q70 104 80 99 Z" fill="#ffffff"/>
        </g>
      </svg>
    `),
  },

  // 10. Mulher de Cabelo Rosa em Coque Alto & Óculos Rosados
  {
    id: 'memoji-10',
    name: 'Mulher Cabelo Rosa & Coque Alto',
    description: 'Cabelo rosa chiclete preso em coque alto com mechas e óculos elegantes',
    genderHint: 'feminino',
    bgHex: '#fdf2f8',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="66" fill="#fdf2f8"/>
        <!-- High Pink Bun -->
        <circle cx="70" cy="30" r="18" fill="#f472b6"/>
        <circle cx="70" cy="26" r="14" fill="#ec4899"/>
        <!-- Face -->
        <ellipse cx="70" cy="76" rx="34" ry="38" fill="#fce7f3"/>
        <!-- Pink Hair Sides -->
        <path d="M36 60 C34 36, 106 36, 104 60 C98 52, 85 50, 70 50 C55 50, 42 52, 36 60 Z" fill="#f472b6"/>
        <!-- Drop Earrings -->
        <circle cx="32" cy="88" r="2.5" fill="#cbd5e1"/>
        <circle cx="108" cy="88" r="2.5" fill="#cbd5e1"/>
        <!-- Pink/White Glasses -->
        <path d="M38 68 Q52 64 64 71 Q52 82 38 76 Z" fill="none" stroke="#f43f5e" stroke-width="3"/>
        <path d="M102 68 Q88 64 76 71 Q88 82 102 76 Z" fill="none" stroke="#f43f5e" stroke-width="3"/>
        <line x1="64" y1="71" x2="76" y2="71" stroke="#f43f5e" stroke-width="3"/>
        <!-- Eyes -->
        <ellipse cx="51" cy="73" rx="4" ry="5" fill="#831843"/>
        <ellipse cx="89" cy="73" rx="4" ry="5" fill="#831843"/>
        <!-- Smile with Teeth -->
        <path d="M54 94 Q70 106 86 94 Z" fill="#be123c"/>
        <path d="M57 95 Q70 101 83 95 Z" fill="#ffffff"/>
      </svg>
    `),
  },

  // 11. Mulher Negra com Cachos Volumosos & Óculos Redondos
  {
    id: 'memoji-11',
    name: 'Mulher Negra Cachos Afro & Óculos Dourados',
    description: 'Cachos volumosos pretos, óculos redondos estilo retrô e sorriso radiante',
    genderHint: 'feminino',
    bgHex: '#fefce8',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
        <defs>
          <radialGradient id="m11-skin" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#9a5b3a"/>
            <stop offset="60%" stop-color="#733d22"/>
            <stop offset="100%" stop-color="#4a2211"/>
          </radialGradient>
        </defs>
        <circle cx="70" cy="70" r="66" fill="#fefce8"/>
        <!-- Voluminous Afro Curls Behind -->
        <g fill="#18181b">
          <circle cx="34" cy="48" r="14"/>
          <circle cx="106" cy="48" r="14"/>
          <circle cx="28" cy="68" r="15"/>
          <circle cx="112" cy="68" r="15"/>
          <circle cx="32" cy="90" r="15"/>
          <circle cx="108" cy="90" r="15"/>
          <circle cx="70" cy="36" r="28"/>
        </g>
        <!-- Face -->
        <ellipse cx="70" cy="76" rx="30" ry="34" fill="url(#m11-skin)"/>
        <!-- Round Gold Sunglasses -->
        <circle cx="54" cy="72" r="12" fill="#451a03" stroke="#eab308" stroke-width="2.5"/>
        <circle cx="86" cy="72" r="12" fill="#451a03" stroke="#eab308" stroke-width="2.5"/>
        <line x1="66" y1="72" x2="74" y2="72" stroke="#eab308" stroke-width="2.5"/>
        <!-- Highlight on sunglasses -->
        <ellipse cx="52" cy="70" rx="6" ry="3" fill="#ca8a04" opacity="0.6"/>
        <ellipse cx="84" cy="70" rx="6" ry="3" fill="#ca8a04" opacity="0.6"/>
        <!-- Pink Lips Smile -->
        <path d="M58 92 Q70 102 82 92" stroke="#f43f5e" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M62 93 Q70 98 78 93" fill="#ffffff"/>
      </svg>
    `),
  },

  // 12. Homem Sikh com Turbante Amarelo Mostarda & Barba
  {
    id: 'memoji-12',
    name: 'Homem Sikh Turbante Dourado & Barba',
    description: 'Turbante tradicional amarelo mostarda/dourado, barba preta desenhada e olhar caloroso',
    genderHint: 'masculino',
    bgHex: '#fefce8',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
        <defs>
          <linearGradient id="m12-turban" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#facc15"/>
            <stop offset="50%" stop-color="#eab308"/>
            <stop offset="100%" stop-color="#ca8a04"/>
          </linearGradient>
          <radialGradient id="m12-skin" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#a16207"/>
            <stop offset="50%" stop-color="#78350f"/>
            <stop offset="100%" stop-color="#451a03"/>
          </radialGradient>
        </defs>
        <circle cx="70" cy="70" r="66" fill="#fefce8"/>
        <!-- Face -->
        <ellipse cx="70" cy="78" rx="34" ry="38" fill="url(#m12-skin)"/>
        <!-- Golden-Yellow Turban (Dastar) -->
        <path d="M30 64 C28 20, 112 20, 110 64 C100 50, 86 44, 70 48 C54 44, 40 50, 30 64 Z" fill="url(#m12-turban)"/>
        <!-- Center peak of turban -->
        <path d="M52 46 Q70 20 88 46" fill="url(#m12-turban)"/>
        <path d="M52 46 Q70 34 88 46" stroke="#a16207" stroke-width="2" fill="none"/>
        <!-- Full Beard and Mustache -->
        <path d="M42 78 Q70 126 98 78 Q90 106 70 110 Q50 106 42 78 Z" fill="#1c1917"/>
        <path d="M52 82 Q70 76 88 82 Q70 88 52 82 Z" fill="#1c1917"/>
        <!-- Eyes -->
        <ellipse cx="52" cy="72" rx="4.5" ry="5.5" fill="#1c1917"/>
        <ellipse cx="88" cy="72" rx="4.5" ry="5.5" fill="#1c1917"/>
        <circle cx="51" cy="70" r="1.5" fill="#ffffff"/>
        <circle cx="87" cy="70" r="1.5" fill="#ffffff"/>
        <!-- Kind Smile -->
        <path d="M60 92 Q70 98 80 92" stroke="#ffffff" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `),
  },
];
