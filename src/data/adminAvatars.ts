export interface AdminAvatarOption {
  id: string;
  name: string;
  roleHint: string;
  category: 'educadores' | 'bibliotecarios' | 'atendimento' | 'criativos';
  url: string;
  bgHex: string;
}

// Utility to encode SVG into valid Data URI
const encodeSvg = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;

// 25 Custom Vector Avatars matching the uploaded reference sheet (5x5 grid)
export const ADMIN_AVATAR_OPTIONS: AdminAvatarOption[] = [
  // --- LINHA 1 ---
  // 1. Mulher com Óculos & Batom Vermelho (Fundo Marrom Escuro)
  {
    id: 'avatar-1',
    name: 'Bibliotecária Chefe (Óculos e Batom Vermelho)',
    roleHint: 'Gestão de Acervo e Coordenação',
    category: 'bibliotecarios',
    bgHex: '#543d34',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#543d34"/>
        <path d="M25 118 Q60 85 95 118 Z" fill="#1e1e24"/>
        <path d="M48 94 L60 118 L72 94 Z" fill="#ffffff"/>
        <path d="M50 68 L50 86 Q60 92 70 86 L70 68 Z" fill="#fcd5b5"/>
        <ellipse cx="60" cy="58" rx="24" ry="26" fill="#fcd5b5"/>
        <ellipse cx="38" cy="58" rx="4" ry="7" fill="#fcd5b5"/>
        <ellipse cx="82" cy="58" rx="4" ry="7" fill="#fcd5b5"/>
        <!-- Hair Back & Top -->
        <path d="M35 56 Q30 24 60 22 Q90 24 85 56 Q88 78 78 84 Q72 65 60 65 Q48 65 42 84 Q32 78 35 56 Z" fill="#2d1d18"/>
        <!-- Eyes & Brows -->
        <path d="M42 42 Q49 39 55 42" stroke="#1f140f" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M65 42 Q71 39 78 42" stroke="#1f140f" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <circle cx="49" cy="48" r="3.5" fill="#1f140f"/>
        <circle cx="71" cy="48" r="3.5" fill="#1f140f"/>
        <circle cx="50" cy="47" r="1.2" fill="#fff"/>
        <circle cx="72" cy="47" r="1.2" fill="#fff"/>
        <!-- Glasses -->
        <rect x="38" y="40" width="20" height="15" rx="3" fill="none" stroke="#111827" stroke-width="3"/>
        <rect x="62" y="40" width="20" height="15" rx="3" fill="none" stroke="#111827" stroke-width="3"/>
        <path d="M58 46 L62 46" stroke="#111827" stroke-width="3"/>
        <!-- Smile with Red Lips -->
        <path d="M48 67 Q60 80 72 67 Q60 74 48 67 Z" fill="#e11d48"/>
        <path d="M51 68 Q60 73 69 68" stroke="#ffffff" stroke-width="2" fill="none"/>
        <!-- Blush -->
        <circle cx="42" cy="60" r="4" fill="#f43f5e" opacity="0.3"/>
        <circle cx="78" cy="60" r="4" fill="#f43f5e" opacity="0.3"/>
      </svg>
    `),
  },

  // 2. Rapaz Loiro com Colete Verde (Fundo Verde Claro)
  {
    id: 'avatar-2',
    name: 'Assistente Jovem (Colete Verde e Topete Loiro)',
    roleHint: 'Atendimento e Empréstimos Rápidos',
    category: 'atendimento',
    bgHex: '#77ab80',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#77ab80"/>
        <path d="M25 118 Q60 88 95 118 Z" fill="#84cc16"/>
        <path d="M42 98 L60 118 L78 98 Z" fill="#e0e7ff"/>
        <path d="M52 70 L52 88 Q60 94 68 88 L68 70 Z" fill="#fce2cb"/>
        <ellipse cx="60" cy="58" rx="23" ry="25" fill="#fce2cb"/>
        <ellipse cx="38" cy="58" rx="3.5" ry="6" fill="#fce2cb"/>
        <ellipse cx="82" cy="58" rx="3.5" ry="6" fill="#fce2cb"/>
        <!-- Blond Hair Quiff -->
        <path d="M38 52 Q35 24 60 20 Q85 18 84 45 Q78 40 68 40 Q55 35 48 48 Z" fill="#f6d87e"/>
        <path d="M68 20 Q78 12 84 25 Q78 30 72 24 Z" fill="#fde68a"/>
        <!-- Eyes & Smile -->
        <circle cx="48" cy="49" r="3.5" fill="#1e3a8a"/>
        <circle cx="72" cy="49" r="3.5" fill="#1e3a8a"/>
        <circle cx="49" cy="48" r="1.2" fill="#fff"/>
        <circle cx="73" cy="48" r="1.2" fill="#fff"/>
        <path d="M43 43 Q48 40 53 43" stroke="#b45309" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M67 43 Q72 40 77 43" stroke="#b45309" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M49 66 Q60 78 71 66 Q60 72 49 66 Z" fill="#fff" stroke="#991b1b" stroke-width="1.5"/>
      </svg>
    `),
  },

  // 3. Mulher Loira Cacheada com Top Rosa (Fundo Roxo)
  {
    id: 'avatar-3',
    name: 'Coordenadora Pedagógica (Cachos Loiros e Blusa Rosa)',
    roleHint: 'Supervisão de Projetos e Eventos',
    category: 'educadores',
    bgHex: '#685994',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#685994"/>
        <!-- Hair Back Curls -->
        <circle cx="36" cy="45" r="14" fill="#fde047"/>
        <circle cx="84" cy="45" r="14" fill="#fde047"/>
        <circle cx="38" cy="62" r="12" fill="#fde047"/>
        <circle cx="82" cy="62" r="12" fill="#fde047"/>
        <circle cx="60" cy="28" r="16" fill="#fde047"/>
        <circle cx="46" cy="30" r="13" fill="#fde047"/>
        <circle cx="74" cy="30" r="13" fill="#fde047"/>
        <!-- Body -->
        <path d="M26 118 Q60 88 94 118 Z" fill="#ec4899"/>
        <path d="M50 70 L50 88 Q60 94 70 88 L70 70 Z" fill="#fddbc0"/>
        <ellipse cx="60" cy="58" rx="23" ry="25" fill="#fddbc0"/>
        <!-- Face Features -->
        <circle cx="48" cy="49" r="3.5" fill="#0284c7"/>
        <circle cx="72" cy="49" r="3.5" fill="#0284c7"/>
        <circle cx="49" cy="48" r="1.2" fill="#fff"/>
        <circle cx="73" cy="48" r="1.2" fill="#fff"/>
        <path d="M43 43 Q48 39 53 43" stroke="#b45309" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M67 43 Q72 39 77 43" stroke="#b45309" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- Big Smile -->
        <path d="M48 66 Q60 80 72 66 Q60 74 48 66 Z" fill="#fff" stroke="#be123c" stroke-width="2"/>
        <circle cx="42" cy="60" r="4" fill="#f43f5e" opacity="0.3"/>
        <circle cx="78" cy="60" r="4" fill="#f43f5e" opacity="0.3"/>
        <!-- Pearl Earrings -->
        <circle cx="36" cy="58" r="3" fill="#ffffff"/>
        <circle cx="84" cy="58" r="3" fill="#ffffff"/>
      </svg>
    `),
  },

  // 4. Homem com Chapéu Fedora & Casaco Vermelho (Fundo Bege Cinza)
  {
    id: 'avatar-4',
    name: 'Curador Cultural (Chapéu Fedora e Casaco Vermelho)',
    roleHint: 'Atividades Culturais e Mediação',
    category: 'criativos',
    bgHex: '#c7bcae',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#c7bcae"/>
        <path d="M26 118 Q60 86 94 118 Z" fill="#dc2626"/>
        <path d="M48 94 L60 118 L72 94 Z" fill="#ffffff"/>
        <path d="M52 70 L52 88 Q60 94 68 88 L68 70 Z" fill="#fbcfa8"/>
        <ellipse cx="60" cy="60" rx="23" ry="25" fill="#fbcfa8"/>
        <!-- Hair -->
        <path d="M35 60 Q34 76 42 80 Q40 68 44 60 Z" fill="#451a03"/>
        <path d="M85 60 Q86 76 78 80 Q80 68 76 60 Z" fill="#451a03"/>
        <!-- Fedora Hat -->
        <ellipse cx="60" cy="40" rx="36" ry="10" fill="#64748b"/>
        <path d="M36 40 Q40 18 60 16 Q80 18 84 40 Z" fill="#475569"/>
        <path d="M37 38 Q60 41 83 38" stroke="#1e293b" stroke-width="4" fill="none"/>
        <!-- Face Features -->
        <circle cx="49" cy="53" r="3.5" fill="#18181b"/>
        <circle cx="71" cy="53" r="3.5" fill="#18181b"/>
        <path d="M44 48 Q49 46 54 48" stroke="#292524" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M66 48 Q71 46 76 48" stroke="#292524" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M50 68 Q60 78 70 68" stroke="#7f1d1d" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M51 68 Q60 76 69 68 Z" fill="#ffffff"/>
      </svg>
    `),
  },

  // 5. Professor Sênior Negro com Barba Branca & Suspensórios (Fundo Verde Escuro)
  {
    id: 'avatar-5',
    name: 'Professor Sênior Emérito (Barba Branca e Suspensórios)',
    roleHint: 'Consultoria Literária e Preservação',
    category: 'educadores',
    bgHex: '#3b7849',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#3b7849"/>
        <path d="M26 118 Q60 88 94 118 Z" fill="#e2e8f0"/>
        <!-- Suspenders -->
        <rect x="36" y="90" width="8" height="28" fill="#15803d"/>
        <rect x="76" y="90" width="8" height="28" fill="#15803d"/>
        <!-- Neck & Head -->
        <path d="M52 70 L52 88 Q60 94 68 88 L68 70 Z" fill="#8c5332"/>
        <ellipse cx="60" cy="56" rx="23" ry="25" fill="#8c5332"/>
        <!-- White Afro Hair -->
        <path d="M34 50 Q30 20 60 18 Q90 20 86 50 Q92 68 84 74 Q84 45 60 42 Q36 45 36 74 Q28 68 34 50 Z" fill="#e2e8f0"/>
        <!-- Glasses -->
        <rect x="39" y="44" width="18" height="13" rx="3" fill="none" stroke="#09090b" stroke-width="2.5"/>
        <rect x="63" y="44" width="18" height="13" rx="3" fill="none" stroke="#09090b" stroke-width="2.5"/>
        <path d="M57 49 L63 49" stroke="#09090b" stroke-width="2.5"/>
        <circle cx="48" cy="50" r="2.5" fill="#09090b"/>
        <circle cx="72" cy="50" r="2.5" fill="#09090b"/>
        <!-- White Mustache and Beard -->
        <path d="M42 66 Q60 62 78 66 Q82 85 60 88 Q38 85 42 66 Z" fill="#f1f5f9"/>
        <path d="M49 68 Q60 76 71 68" stroke="#64748b" stroke-width="1.5" fill="none"/>
      </svg>
    `),
  },

  // --- LINHA 2 ---
  // 6. Rapaz Ruivo com Topete Espetado (Fundo Azul Claro)
  {
    id: 'avatar-6',
    name: 'Monitor de Apoio (Ruivo com Regata)',
    roleHint: 'Organização de Estantes e Auxílio Geral',
    category: 'atendimento',
    bgHex: '#7faecc',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#7faecc"/>
        <path d="M28 118 Q60 88 92 118 Z" fill="#f8fafc"/>
        <path d="M52 70 L52 88 Q60 94 68 88 L68 70 Z" fill="#fce0cf"/>
        <ellipse cx="60" cy="58" rx="23" ry="25" fill="#fce0cf"/>
        <!-- Orange Spiky Hair -->
        <path d="M38 52 Q32 20 60 18 Q88 20 82 52 Q76 42 68 44 Q60 32 52 44 Q44 42 38 52 Z" fill="#ea580c"/>
        <path d="M46 22 L52 14 L58 22 L64 12 L70 22" stroke="#ea580c" stroke-width="4" stroke-linecap="round" fill="none"/>
        <!-- Face & Smile -->
        <circle cx="48" cy="50" r="3" fill="#15803d"/>
        <circle cx="72" cy="50" r="3" fill="#15803d"/>
        <circle cx="49" cy="49" r="1" fill="#fff"/>
        <circle cx="73" cy="49" r="1" fill="#fff"/>
        <!-- Freckles -->
        <circle cx="42" cy="58" r="1" fill="#c2410c"/>
        <circle cx="45" cy="60" r="1" fill="#c2410c"/>
        <circle cx="75" cy="60" r="1" fill="#c2410c"/>
        <circle cx="78" cy="58" r="1" fill="#c2410c"/>
        <path d="M49 68 Q60 78 71 68 Z" fill="#fff" stroke="#991b1b" stroke-width="1.5"/>
      </svg>
    `),
  },

  // 7. Mulher Elegante com Cabelo Curto & Argolas (Fundo Dourado / Mostarda)
  {
    id: 'avatar-7',
    name: 'Supervisora de Biblioteca (Chanel Curto e Argolas)',
    roleHint: 'Supervisão Geral de Atendimento',
    category: 'bibliotecarios',
    bgHex: '#bfa05d',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#bfa05d"/>
        <path d="M26 118 Q60 86 94 118 Z" fill="#1e293b"/>
        <path d="M48 94 L60 118 L72 94 Z" fill="#ffffff"/>
        <path d="M52 70 L52 88 Q60 94 68 88 L68 70 Z" fill="#fcd5b5"/>
        <ellipse cx="60" cy="58" rx="23" ry="25" fill="#fcd5b5"/>
        <!-- Sleek Black Bob Hair -->
        <path d="M34 50 Q30 20 60 18 Q90 20 86 50 Q92 78 80 80 Q76 56 60 56 Q44 56 40 80 Q28 78 34 50 Z" fill="#18181b"/>
        <!-- Hoop Earrings -->
        <circle cx="34" cy="62" r="5" fill="none" stroke="#e2e8f0" stroke-width="2"/>
        <circle cx="86" cy="62" r="5" fill="none" stroke="#e2e8f0" stroke-width="2"/>
        <!-- Eyes & Gentle Smile -->
        <circle cx="48" cy="50" r="3.5" fill="#18181b"/>
        <circle cx="72" cy="50" r="3.5" fill="#18181b"/>
        <path d="M43 43 Q48 40 53 43" stroke="#18181b" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M67 43 Q72 40 77 43" stroke="#18181b" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M50 68 Q60 76 70 68" stroke="#991b1b" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `),
  },

  // 8. PROF. ELIEL BASTOS - SUPER ADMINISTRADOR (Fundo Lilás Claro / Óculos Modernos)
  {
    id: 'avatar-8',
    name: 'Prof. Eliel Bastos (Super Administrador)',
    roleHint: 'Super Administrador e Gestor Geral da Biblioteca',
    category: 'educadores',
    bgHex: '#9986af',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#9986af"/>
        <!-- Body & Collar -->
        <path d="M26 118 Q60 84 94 118 Z" fill="#334155"/>
        <path d="M48 94 L60 118 L72 94 Z" fill="#e2e8f0"/>
        <!-- Neck & Head -->
        <path d="M52 68 L52 88 Q60 94 68 88 L68 68 Z" fill="#78350f"/>
        <ellipse cx="60" cy="56" rx="23" ry="25" fill="#78350f"/>
        <ellipse cx="37" cy="56" rx="3.5" ry="6" fill="#78350f"/>
        <ellipse cx="83" cy="56" rx="3.5" ry="6" fill="#78350f"/>
        <!-- Short Clean Dark Hair -->
        <path d="M37 48 Q35 24 60 22 Q85 24 83 48 Q78 36 60 36 Q42 36 37 48 Z" fill="#18181b"/>
        <!-- Modern Crystal / White Glasses -->
        <rect x="38" y="42" width="19" height="14" rx="3" fill="none" stroke="#f8fafc" stroke-width="2.8"/>
        <rect x="63" y="42" width="19" height="14" rx="3" fill="none" stroke="#f8fafc" stroke-width="2.8"/>
        <path d="M57 48 L63 48" stroke="#f8fafc" stroke-width="2.8"/>
        <!-- Warm Radiant Eyes -->
        <circle cx="48" cy="49" r="3" fill="#ffffff"/>
        <circle cx="72" cy="49" r="3" fill="#ffffff"/>
        <circle cx="48" cy="49" r="2" fill="#0f172a"/>
        <circle cx="72" cy="49" r="2" fill="#0f172a"/>
        <!-- Confident Broad Smile with Teeth -->
        <path d="M46 66 Q60 82 74 66 Q60 73 46 66 Z" fill="#ffffff" stroke="#451a03" stroke-width="1.5"/>
        <path d="M46 66 Q60 72 74 66" stroke="#e2e8f0" stroke-width="1"/>
      </svg>
    `),
  },

  // 9. Mulher Ruiva com Boina Francesa & Cachecol (Fundo Laranja)
  {
    id: 'avatar-9',
    name: 'Mediadora Literária (Boina Parisiense e Cachecol)',
    roleHint: 'Contação de Histórias e Clubes de Leitura',
    category: 'criativos',
    bgHex: '#e17235',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#e17235"/>
        <path d="M26 118 Q60 86 94 118 Z" fill="#475569"/>
        <!-- Scarf -->
        <ellipse cx="60" cy="92" rx="20" ry="8" fill="#cbd5e1"/>
        <path d="M52 70 L52 88 Q60 94 68 88 L68 70 Z" fill="#fcd5b5"/>
        <ellipse cx="60" cy="58" rx="23" ry="25" fill="#fcd5b5"/>
        <!-- Orange Hair -->
        <path d="M34 50 Q32 75 42 78 Q38 58 42 50 Z" fill="#c2410c"/>
        <path d="M86 50 Q88 75 78 78 Q82 58 78 50 Z" fill="#c2410c"/>
        <!-- Black Beret -->
        <ellipse cx="62" cy="34" rx="28" ry="14" fill="#0f172a" transform="rotate(-8 62 34)"/>
        <circle cx="62" cy="20" r="2.5" fill="#0f172a"/>
        <!-- Face & Smile -->
        <circle cx="48" cy="50" r="3.5" fill="#15803d"/>
        <circle cx="72" cy="50" r="3.5" fill="#15803d"/>
        <path d="M48 66 Q60 78 72 66 Z" fill="#fff" stroke="#991b1b" stroke-width="1.5"/>
        <circle cx="42" cy="60" r="4" fill="#f43f5e" opacity="0.3"/>
        <circle cx="78" cy="60" r="4" fill="#f43f5e" opacity="0.3"/>
      </svg>
    `),
  },

  // 10. Diretor Grisalho com Bigode & Gravata (Fundo Lilás)
  {
    id: 'avatar-10',
    name: 'Diretor Escolar (Grisalho com Gravata e Bigode)',
    roleHint: 'Direção e Representação Institucional',
    category: 'educadores',
    bgHex: '#9378ad',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#9378ad"/>
        <path d="M26 118 Q60 86 94 118 Z" fill="#cbd5e1"/>
        <path d="M57 94 L63 94 L65 118 L55 118 Z" fill="#0f172a"/>
        <path d="M52 70 L52 88 Q60 94 68 88 L68 70 Z" fill="#fce3cf"/>
        <ellipse cx="60" cy="58" rx="23" ry="25" fill="#fce3cf"/>
        <!-- Silver / White Hair -->
        <path d="M37 48 Q35 20 60 18 Q85 20 83 48 Q78 35 60 35 Q42 35 37 48 Z" fill="#e2e8f0"/>
        <!-- Face, Mustache & Smile -->
        <circle cx="48" cy="50" r="3.5" fill="#1e293b"/>
        <circle cx="72" cy="50" r="3.5" fill="#1e293b"/>
        <!-- White Mustache -->
        <path d="M45 64 Q60 60 75 64 Q70 72 60 68 Q50 72 45 64 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
        <path d="M48 68 Q60 78 72 68" stroke="#991b1b" stroke-width="2" fill="none"/>
      </svg>
    `),
  },

  // --- LINHA 3 ---
  // 11. Menina com Bandana Vermelha & Macacão Jeans (Fundo Oliva)
  {
    id: 'avatar-11',
    name: 'Assistente Criativa (Bandana Vermelha e Macacão)',
    roleHint: 'Oficinas e Dinâmicas para Alunos',
    category: 'criativos',
    bgHex: '#baaa39',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#baaa39"/>
        <path d="M26 118 Q60 88 94 118 Z" fill="#db2777"/>
        <!-- Overalls Straps -->
        <rect x="36" y="92" width="7" height="26" fill="#2563eb"/>
        <rect x="77" y="92" width="7" height="26" fill="#2563eb"/>
        <path d="M52 70 L52 88 Q60 94 68 88 L68 70 Z" fill="#fcd5b5"/>
        <ellipse cx="60" cy="58" rx="23" ry="25" fill="#fcd5b5"/>
        <!-- Dark Brown Hair -->
        <path d="M34 50 Q30 75 40 82 Q36 60 40 50 Z" fill="#3b2219"/>
        <path d="M86 50 Q90 75 80 82 Q84 60 80 50 Z" fill="#3b2219"/>
        <!-- Red Bandana -->
        <path d="M35 44 Q60 30 85 44 L87 34 Q60 22 33 34 Z" fill="#dc2626"/>
        <circle cx="40" cy="35" r="4" fill="#ef4444"/>
        <!-- Eyes & Smile -->
        <circle cx="48" cy="50" r="3.5" fill="#15803d"/>
        <circle cx="72" cy="50" r="3.5" fill="#15803d"/>
        <circle cx="42" cy="58" r="1" fill="#ea580c"/>
        <circle cx="45" cy="60" r="1" fill="#ea580c"/>
        <circle cx="75" cy="60" r="1" fill="#ea580c"/>
        <circle cx="78" cy="58" r="1" fill="#ea580c"/>
        <path d="M48 66 Q60 78 72 66 Z" fill="#fff" stroke="#991b1b" stroke-width="1.5"/>
      </svg>
    `),
  },

  // 12. Jovem com Undercut Castanho & Jaqueta Preta (Fundo Vermelho)
  {
    id: 'avatar-12',
    name: 'Técnico de TI e Sistemas (Undercut e Gola Alta)',
    roleHint: 'Suporte Técnico e Administração Digital',
    category: 'atendimento',
    bgHex: '#cc3737',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#cc3737"/>
        <path d="M26 118 Q60 86 94 118 Z" fill="#18181b"/>
        <path d="M48 94 L60 118 L72 94 Z" fill="#475569"/>
        <path d="M52 70 L52 88 Q60 94 68 88 L68 70 Z" fill="#fcd7b6"/>
        <ellipse cx="60" cy="58" rx="23" ry="25" fill="#fcd7b6"/>
        <!-- Brown Undercut -->
        <path d="M37 46 Q35 22 60 20 Q85 22 83 46 Q75 36 60 36 Q45 36 37 46 Z" fill="#5c2e14"/>
        <path d="M36 50 Q36 38 42 38" stroke="#3b1d0c" stroke-width="3" fill="none"/>
        <path d="M84 50 Q84 38 78 38" stroke="#3b1d0c" stroke-width="3" fill="none"/>
        <!-- Face Features -->
        <circle cx="48" cy="50" r="3.5" fill="#18181b"/>
        <circle cx="72" cy="50" r="3.5" fill="#18181b"/>
        <path d="M49 68 Q60 76 71 68" stroke="#7f1d1d" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `),
  },

  // 13. Mulher Asiática com Franja Reta & Blusa Verde (Fundo Taupe)
  {
    id: 'avatar-13',
    name: 'Especialista em Catalogação (Franja e Blusa Verde)',
    roleHint: 'Catalogação ISBN e Gestão de Metadados',
    category: 'bibliotecarios',
    bgHex: '#9e9184',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#9e9184"/>
        <path d="M26 118 Q60 88 94 118 Z" fill="#22c55e"/>
        <path d="M52 70 L52 88 Q60 94 68 88 L68 70 Z" fill="#fce8d5"/>
        <ellipse cx="60" cy="58" rx="23" ry="25" fill="#fce8d5"/>
        <!-- Black Straight Hair with Bangs -->
        <path d="M34 50 Q30 75 38 82 Q34 56 38 48 Z" fill="#171717"/>
        <path d="M86 50 Q90 75 82 82 Q86 56 82 48 Z" fill="#171717"/>
        <path d="M35 48 Q35 22 60 20 Q85 22 85 48 Q75 42 60 42 Q45 42 35 48 Z" fill="#171717"/>
        <!-- Face Features -->
        <ellipse cx="48" cy="50" rx="3.5" ry="2" fill="#171717"/>
        <ellipse cx="72" cy="50" rx="3.5" ry="2" fill="#171717"/>
        <path d="M48 66 Q60 78 72 66 Z" fill="#fff" stroke="#991b1b" stroke-width="1.5"/>
        <circle cx="42" cy="60" r="4" fill="#f43f5e" opacity="0.3"/>
        <circle cx="78" cy="60" r="4" fill="#f43f5e" opacity="0.3"/>
      </svg>
    `),
  },

  // 14. Bibliotecário Pesquisador de Óculos (Fundo Ardósia / Teal)
  {
    id: 'avatar-14',
    name: 'Bibliotecário Pesquisador (Óculos e Cardigan)',
    roleHint: 'Auxílio em Pesquisas Acadêmicas e TCC',
    category: 'bibliotecarios',
    bgHex: '#517482',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#517482"/>
        <path d="M26 118 Q60 86 94 118 Z" fill="#94a3b8"/>
        <path d="M48 94 L60 118 L72 94 Z" fill="#ffffff"/>
        <path d="M52 70 L52 88 Q60 94 68 88 L68 70 Z" fill="#fcd5b5"/>
        <ellipse cx="60" cy="58" rx="23" ry="25" fill="#fcd5b5"/>
        <!-- Black Hair -->
        <path d="M37 46 Q35 22 60 20 Q85 22 83 46 Q75 36 60 36 Q45 36 37 46 Z" fill="#18181b"/>
        <!-- Glasses -->
        <rect x="38" y="44" width="19" height="13" rx="3" fill="none" stroke="#09090b" stroke-width="2.8"/>
        <rect x="63" y="44" width="19" height="13" rx="3" fill="none" stroke="#09090b" stroke-width="2.8"/>
        <path d="M57 49 L63 49" stroke="#09090b" stroke-width="2.8"/>
        <circle cx="48" cy="50" r="3" fill="#09090b"/>
        <circle cx="72" cy="50" r="3" fill="#09090b"/>
        <!-- Gentle Smile -->
        <path d="M49 68 Q60 76 71 68" stroke="#7f1d1d" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `),
  },

  // 15. Designer Criativa com Cabelo Bicolor & Óculos Vermelhos (Fundo Lavanda)
  {
    id: 'avatar-15',
    name: 'Designer e Animadora Cultural (Cabelo Colorido e Óculos Vermelhos)',
    roleHint: 'Identidade Visual, Murais e Exposições',
    category: 'criativos',
    bgHex: '#8b7c8f',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#8b7c8f"/>
        <path d="M26 118 Q60 88 94 118 Z" fill="#18181b"/>
        <path d="M52 70 L52 88 Q60 94 68 88 L68 70 Z" fill="#fcd5b5"/>
        <ellipse cx="60" cy="58" rx="23" ry="25" fill="#fcd5b5"/>
        <!-- Bicolor Hair (Cyan & Magenta) -->
        <path d="M34 50 Q30 75 38 82 Q34 56 38 48 Z" fill="#f472b6"/>
        <path d="M86 50 Q90 75 82 82 Q86 56 82 48 Z" fill="#f472b6"/>
        <path d="M35 48 Q35 22 60 20 Q85 22 85 48 Q75 36 60 36 Q45 36 35 48 Z" fill="#38bdf8"/>
        <!-- Large Hoop Earrings -->
        <circle cx="34" cy="62" r="6" fill="none" stroke="#ffffff" stroke-width="2.5"/>
        <circle cx="86" cy="62" r="6" fill="none" stroke="#ffffff" stroke-width="2.5"/>
        <!-- Red Glasses -->
        <rect x="38" y="44" width="19" height="13" rx="3" fill="none" stroke="#ef4444" stroke-width="2.8"/>
        <rect x="63" y="44" width="19" height="13" rx="3" fill="none" stroke="#ef4444" stroke-width="2.8"/>
        <path d="M57 49 L63 49" stroke="#ef4444" stroke-width="2.8"/>
        <circle cx="48" cy="50" r="3" fill="#18181b"/>
        <circle cx="72" cy="50" r="3" fill="#18181b"/>
        <path d="M48 66 Q60 78 72 66 Z" fill="#fff" stroke="#991b1b" stroke-width="1.5"/>
      </svg>
    `),
  },

  // --- LINHA 4 ---
  // 16. Supervisor com Black Power & Bigode (Fundo Cinza)
  {
    id: 'avatar-16',
    name: 'Supervisor de Atendimento (Afro Volumoso e Bigode)',
    roleHint: 'Recepção e Gestão de Fila de Empréstimo',
    category: 'atendimento',
    bgHex: '#7f848c',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#7f848c"/>
        <path d="M26 118 Q60 88 94 118 Z" fill="#4f46e5"/>
        <path d="M48 94 L60 118 L72 94 Z" fill="#eab308"/>
        <path d="M52 70 L52 88 Q60 94 68 88 L68 70 Z" fill="#92400e"/>
        <ellipse cx="60" cy="58" rx="23" ry="25" fill="#92400e"/>
        <!-- Afro Hair -->
        <circle cx="42" cy="40" r="14" fill="#18181b"/>
        <circle cx="78" cy="40" r="14" fill="#18181b"/>
        <circle cx="60" cy="30" r="16" fill="#18181b"/>
        <circle cx="34" cy="52" r="12" fill="#18181b"/>
        <circle cx="86" cy="52" r="12" fill="#18181b"/>
        <!-- Mustache & Face -->
        <circle cx="48" cy="50" r="3.5" fill="#18181b"/>
        <circle cx="72" cy="50" r="3.5" fill="#18181b"/>
        <path d="M45 64 Q60 60 75 64 Q70 70 60 67 Q50 70 45 64 Z" fill="#18181b"/>
        <path d="M49 68 Q60 78 71 68" stroke="#ffffff" stroke-width="2" fill="none"/>
      </svg>
    `),
  },

  // 17. Secretária com Coque Clássico & Lenço Rosa (Fundo Azul Céu)
  {
    id: 'avatar-17',
    name: 'Secretária de Gestão (Coque Clássico e Lenço Rosa)',
    roleHint: 'Documentação, Certificados e Atas',
    category: 'educadores',
    bgHex: '#739ec9',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#739ec9"/>
        <circle cx="60" cy="24" r="12" fill="#18181b"/>
        <circle cx="60" cy="24" r="4" fill="#ec4899"/>
        <path d="M26 118 Q60 86 94 118 Z" fill="#334155"/>
        <path d="M48 94 L60 118 L72 94 Z" fill="#f472b6"/>
        <path d="M52 70 L52 88 Q60 94 68 88 L68 70 Z" fill="#fcd5b5"/>
        <ellipse cx="60" cy="58" rx="23" ry="25" fill="#fcd5b5"/>
        <path d="M35 48 Q35 24 60 22 Q85 24 85 48 Q75 38 60 38 Q45 38 35 48 Z" fill="#18181b"/>
        <!-- Face Features -->
        <circle cx="48" cy="50" r="3.5" fill="#18181b"/>
        <circle cx="72" cy="50" r="3.5" fill="#18181b"/>
        <path d="M48 66 Q60 78 72 66 Z" fill="#fff" stroke="#991b1b" stroke-width="1.5"/>
        <circle cx="42" cy="60" r="4" fill="#f43f5e" opacity="0.3"/>
        <circle cx="78" cy="60" r="4" fill="#f43f5e" opacity="0.3"/>
      </svg>
    `),
  },

  // 18. Homem Sorridente com Jaqueta Jeans (Fundo Vinho / Ameixa)
  {
    id: 'avatar-18',
    name: 'Assistente de Acervo (Jaqueta Jeans e Gola de Lã)',
    roleHint: 'Organização Física e Reposição de Livros',
    category: 'atendimento',
    bgHex: '#84425e',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#84425e"/>
        <path d="M26 118 Q60 86 94 118 Z" fill="#64748b"/>
        <!-- Fur Collar -->
        <ellipse cx="60" cy="94" rx="22" ry="8" fill="#f8fafc"/>
        <path d="M52 70 L52 88 Q60 94 68 88 L68 70 Z" fill="#fce3cf"/>
        <ellipse cx="60" cy="58" rx="23" ry="25" fill="#fce3cf"/>
        <!-- Dark Hair -->
        <path d="M37 46 Q35 22 60 20 Q85 22 83 46 Q75 36 60 36 Q45 36 37 46 Z" fill="#3b1d0c"/>
        <!-- Broad Smile -->
        <circle cx="48" cy="50" r="3.5" fill="#18181b"/>
        <circle cx="72" cy="50" r="3.5" fill="#18181b"/>
        <path d="M46 66 Q60 80 74 66 Z" fill="#fff" stroke="#991b1b" stroke-width="1.5"/>
      </svg>
    `),
  },

  // 19. Mulher Negra com Coque Alto & Óculos Rosa (Fundo Mostarda)
  {
    id: 'avatar-19',
    name: 'Orientadora Educacional (Coque Alto e Óculos Rosa)',
    roleHint: 'Acompanhamento do Desempenho e Leitura',
    category: 'educadores',
    bgHex: '#bfa043',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#bfa043"/>
        <!-- High Bun -->
        <circle cx="60" cy="20" r="14" fill="#18181b"/>
        <path d="M26 118 Q60 88 94 118 Z" fill="#ef4444"/>
        <path d="M52 70 L52 88 Q60 94 68 88 L68 70 Z" fill="#78350f"/>
        <ellipse cx="60" cy="58" rx="23" ry="25" fill="#78350f"/>
        <path d="M35 48 Q35 24 60 22 Q85 24 85 48 Q75 38 60 38 Q45 38 35 48 Z" fill="#18181b"/>
        <!-- Pink Glasses -->
        <rect x="38" y="44" width="19" height="13" rx="3" fill="none" stroke="#ec4899" stroke-width="2.8"/>
        <rect x="63" y="44" width="19" height="13" rx="3" fill="none" stroke="#ec4899" stroke-width="2.8"/>
        <path d="M57 49 L63 49" stroke="#ec4899" stroke-width="2.8"/>
        <circle cx="48" cy="50" r="3" fill="#ffffff"/>
        <circle cx="72" cy="50" r="3" fill="#ffffff"/>
        <circle cx="48" cy="50" r="1.8" fill="#0f172a"/>
        <circle cx="72" cy="50" r="1.8" fill="#0f172a"/>
        <path d="M48 66 Q60 78 72 66 Z" fill="#fff" stroke="#451a03" stroke-width="1.5"/>
      </svg>
    `),
  },

  // 20. Jovem com Topete & Gravata Borboleta (Fundo Verde Musgo)
  {
    id: 'avatar-20',
    name: 'Auxiliar de Eventos e Cerimonial (Gravata Borboleta)',
    roleHint: 'Lançamentos de Livros e Feiras Literárias',
    category: 'criativos',
    bgHex: '#5a9672',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#5a9672"/>
        <path d="M26 118 Q60 86 94 118 Z" fill="#0f172a"/>
        <!-- Bowtie -->
        <polygon points="52,94 68,94 60,98" fill="#020617"/>
        <polygon points="52,102 68,102 60,98" fill="#020617"/>
        <circle cx="60" cy="98" r="2.5" fill="#334155"/>
        <path d="M52 70 L52 88 Q60 94 68 88 L68 70 Z" fill="#fce3cf"/>
        <ellipse cx="60" cy="58" rx="23" ry="25" fill="#fce3cf"/>
        <!-- Textured Top Hair -->
        <path d="M37 46 Q35 20 60 18 Q85 20 83 46 Q75 34 60 34 Q45 34 37 46 Z" fill="#713f12"/>
        <path d="M48 20 L54 12 L60 20 L66 12 L72 20" stroke="#713f12" stroke-width="3" stroke-linecap="round" fill="none"/>
        <circle cx="48" cy="50" r="3.5" fill="#18181b"/>
        <circle cx="72" cy="50" r="3.5" fill="#18181b"/>
        <path d="M48 66 Q60 78 72 66 Z" fill="#fff" stroke="#991b1b" stroke-width="1.5"/>
      </svg>
    `),
  },

  // --- LINHA 5 ---
  // 21. Mulher com Óculos & Blusa Vermelha (Fundo Azul Escuro)
  {
    id: 'avatar-21',
    name: 'Professora de Literatura (Óculos e Blusa Vermelha)',
    roleHint: 'Curadoria de Obras Clássicas e Nacionais',
    category: 'educadores',
    bgHex: '#4d5175',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#4d5175"/>
        <path d="M26 118 Q60 88 94 118 Z" fill="#dc2626"/>
        <path d="M52 70 L52 88 Q60 94 68 88 L68 70 Z" fill="#fcd5b5"/>
        <ellipse cx="60" cy="58" rx="23" ry="25" fill="#fcd5b5"/>
        <!-- Dark Wavy Hair -->
        <path d="M34 50 Q28 75 38 82 Q32 58 38 48 Z" fill="#18181b"/>
        <path d="M86 50 Q92 75 82 82 Q88 58 82 48 Z" fill="#18181b"/>
        <path d="M35 48 Q35 22 60 20 Q85 22 85 48 Q75 38 60 38 Q45 38 35 48 Z" fill="#18181b"/>
        <!-- Glasses -->
        <rect x="38" y="44" width="19" height="13" rx="3" fill="none" stroke="#09090b" stroke-width="2.8"/>
        <rect x="63" y="44" width="19" height="13" rx="3" fill="none" stroke="#09090b" stroke-width="2.8"/>
        <path d="M57 49 L63 49" stroke="#09090b" stroke-width="2.8"/>
        <circle cx="48" cy="50" r="3" fill="#18181b"/>
        <circle cx="72" cy="50" r="3" fill="#18181b"/>
        <path d="M48 66 Q60 78 72 66 Z" fill="#fff" stroke="#991b1b" stroke-width="1.5"/>
        <circle cx="42" cy="60" r="4" fill="#f43f5e" opacity="0.3"/>
        <circle cx="78" cy="60" r="4" fill="#f43f5e" opacity="0.3"/>
      </svg>
    `),
  },

  // 22. Jovem com Gorro Beanie Vermelho (Fundo Verde Escuro)
  {
    id: 'avatar-22',
    name: 'Monitor de Multimídia e Jogos (Gorro Beanie)',
    roleHint: 'Acervo Digital, Jogos e Espaço Maker',
    category: 'criativos',
    bgHex: '#406345',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#406345"/>
        <path d="M26 118 Q60 88 94 118 Z" fill="#365314"/>
        <path d="M48 94 L60 118 L72 94 Z" fill="#1f2937"/>
        <path d="M52 70 L52 88 Q60 94 68 88 L68 70 Z" fill="#fcd5b5"/>
        <ellipse cx="60" cy="58" rx="23" ry="25" fill="#fcd5b5"/>
        <!-- Red Beanie Hat -->
        <ellipse cx="60" cy="38" rx="26" ry="16" fill="#dc2626"/>
        <path d="M34 38 Q60 18 86 38" stroke="#b91c1c" stroke-width="6" fill="none"/>
        <circle cx="48" cy="52" r="3.5" fill="#18181b"/>
        <circle cx="72" cy="52" r="3.5" fill="#18181b"/>
        <path d="M49 68 Q60 76 71 68" stroke="#7f1d1d" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `),
  },

  // 23. Mulher de Cabelo Ruivo Cacheado & Gravata (Fundo Areia)
  {
    id: 'avatar-23',
    name: 'Coordenadora de Projetos (Ruiva com Colete e Gravata)',
    roleHint: 'Feiras de Livros e Parcerias Externas',
    category: 'educadores',
    bgHex: '#998675',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#998675"/>
        <circle cx="36" cy="45" r="14" fill="#ea580c"/>
        <circle cx="84" cy="45" r="14" fill="#ea580c"/>
        <circle cx="38" cy="62" r="12" fill="#ea580c"/>
        <circle cx="82" cy="62" r="12" fill="#ea580c"/>
        <path d="M26 118 Q60 86 94 118 Z" fill="#1e293b"/>
        <path d="M48 94 L60 118 L72 94 Z" fill="#ffffff"/>
        <!-- Red Necktie -->
        <polygon points="57,94 63,94 65,118 55,118" fill="#dc2626"/>
        <path d="M52 70 L52 88 Q60 94 68 88 L68 70 Z" fill="#fddbc0"/>
        <ellipse cx="60" cy="58" rx="23" ry="25" fill="#fddbc0"/>
        <circle cx="48" cy="50" r="3.5" fill="#0284c7"/>
        <circle cx="72" cy="50" r="3.5" fill="#0284c7"/>
        <path d="M49 68 Q60 76 71 68" stroke="#991b1b" stroke-width="2" stroke-linecap="round" fill="none"/>
        <circle cx="42" cy="60" r="4" fill="#f43f5e" opacity="0.3"/>
        <circle cx="78" cy="60" r="4" fill="#f43f5e" opacity="0.3"/>
      </svg>
    `),
  },

  // 24. Rapaz com Paletó Azul & Cabelo Estilizado (Fundo Cinza Suave)
  {
    id: 'avatar-24',
    name: 'Analista de Comunicação (Paletó Azul e Camiseta)',
    roleHint: 'Mural de Avisos, Redes Sociais e Boletins',
    category: 'atendimento',
    bgHex: '#8b92aa',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#8b92aa"/>
        <path d="M26 118 Q60 86 94 118 Z" fill="#2563eb"/>
        <path d="M48 94 L60 118 L72 94 Z" fill="#ffffff"/>
        <path d="M52 70 L52 88 Q60 94 68 88 L68 70 Z" fill="#fce3cf"/>
        <ellipse cx="60" cy="58" rx="23" ry="25" fill="#fce3cf"/>
        <!-- Styled Pompadour -->
        <path d="M37 46 Q35 18 60 16 Q85 18 83 46 Q75 34 60 34 Q45 34 37 46 Z" fill="#451a03"/>
        <circle cx="48" cy="50" r="3.5" fill="#18181b"/>
        <circle cx="72" cy="50" r="3.5" fill="#18181b"/>
        <path d="M46 66 Q60 80 74 66 Z" fill="#fff" stroke="#991b1b" stroke-width="1.5"/>
      </svg>
    `),
  },

  // 25. Mulher com Vestido Verde & Colar de Pérolas (Fundo Laranja Terracota)
  {
    id: 'avatar-25',
    name: 'Vice-Diretora (Vestido Verde e Colar de Pérolas)',
    roleHint: 'Coordenação Executiva e Atendimento aos Pais',
    category: 'educadores',
    bgHex: '#cf6f34',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="#cf6f34"/>
        <path d="M26 118 Q60 88 94 118 Z" fill="#16a34a"/>
        <!-- Pearl Necklace -->
        <path d="M46 94 Q60 104 74 94" stroke="#ffffff" stroke-width="4" stroke-dasharray="2,3" fill="none"/>
        <path d="M52 70 L52 88 Q60 94 68 88 L68 70 Z" fill="#fcd5b5"/>
        <ellipse cx="60" cy="58" rx="23" ry="25" fill="#fcd5b5"/>
        <!-- Classic Brown Bob -->
        <path d="M34 50 Q30 20 60 18 Q90 20 86 50 Q92 78 80 80 Q76 56 60 56 Q44 56 40 80 Q28 78 34 50 Z" fill="#451a03"/>
        <!-- Pearl Drop Earrings -->
        <circle cx="34" cy="62" r="3.5" fill="#ffffff"/>
        <circle cx="86" cy="62" r="3.5" fill="#ffffff"/>
        <circle cx="48" cy="50" r="3.5" fill="#18181b"/>
        <circle cx="72" cy="50" r="3.5" fill="#18181b"/>
        <path d="M48 66 Q60 78 72 66 Z" fill="#fff" stroke="#991b1b" stroke-width="1.5"/>
        <circle cx="42" cy="60" r="4" fill="#f43f5e" opacity="0.3"/>
        <circle cx="78" cy="60" r="4" fill="#f43f5e" opacity="0.3"/>
      </svg>
    `),
  },
];
