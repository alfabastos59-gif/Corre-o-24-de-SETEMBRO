import { OFFICIAL_STUDENT_AVATARS } from './studentAvatars';
import { ADMIN_AVATAR_OPTIONS } from './adminAvatars';
import { MEMOJI_AVATAR_OPTIONS } from './memojiAvatars';

export interface AvatarOption {
  id: string;
  name: string;
  category: 'memoji_3d' | 'ilustrados_25' | 'oficiais' | 'estudantes' | 'fantasia' | 'robos' | 'expressoes' | 'mascotes' | 'monstros' | 'vetores' | 'pixel' | '3d';
  url: string;
  bgColor?: string;
}

export const AVATAR_CATEGORIES = [
  { id: 'todos', label: 'Todos os Avatares' },
  { id: 'memoji_3d', label: '✨ 12 Memojis 3D' },
  { id: 'ilustrados_25', label: '🎨 25 Ilustrações Exclusivas' },
  { id: 'oficiais', label: '⭐ Avatares Escolares (16)' },
  { id: 'estudantes', label: 'Estudantes & Jovens' },
  { id: 'fantasia', label: 'Fantasia & Épico' },
  { id: 'robos', label: 'Robôs & Cyber' },
  { id: 'expressoes', label: 'Expressões & Emojis' },
  { id: 'mascotes', label: 'Mascotes & Animais' },
  { id: 'monstros', label: 'Monstrinhos & Aliens' },
  { id: 'vetores', label: 'Personagens Estilizados' },
  { id: 'pixel', label: 'Pixel Art Retrô' },
  { id: '3d', label: 'Estilo 3D & Moderno' },
] as const;

export const AVATAR_BANK: AvatarOption[] = [
  // ==========================================
  // 0. BANCO DE 12 AVATARES MEMOJI 3D (NOVA COLEÇÃO)
  // ==========================================
  ...MEMOJI_AVATAR_OPTIONS.map((av) => ({
    id: av.id,
    name: av.name,
    category: 'memoji_3d' as const,
    url: av.url,
    bgColor: av.bgHex,
  })),

  // ==========================================
  // 1. BANCO DE 25 AVATARES ILUSTRADOS (GRADE 5x5 EXCLUSIVA)
  // ==========================================
  ...ADMIN_AVATAR_OPTIONS.map((av, index) => ({
    id: `ilustrado-25-${index + 1}`,
    name: av.name,
    category: 'ilustrados_25' as const,
    url: av.url,
    bgColor: av.bgHex,
  })),

  // ==========================================
  // 2. AVATARES ESCOLARES OFICIAIS (16 PERSONAGENS DA ESCOLA)
  // ==========================================
  ...OFFICIAL_STUDENT_AVATARS.map((av) => ({
    id: av.id,
    name: av.name,
    category: 'oficiais' as const,
    url: av.url,
    bgColor: av.bgColor,
  })),

  // ==========================================
  // 1. ESTUDANTES & JOVENS
  // ==========================================
  {
    id: 'est-01',
    name: 'Garoto Cabelo Verde',
    category: 'estudantes',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=GarotoVerde&backgroundColor=0284c7',
    bgColor: '#0284c7',
  },
  {
    id: 'est-02',
    name: 'Menina Sorriso Cabelo Castanho',
    category: 'estudantes',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=CabeloCastanho&backgroundColor=9333ea',
    bgColor: '#9333ea',
  },
  {
    id: 'est-03',
    name: 'Garoto Dreadlocks Verdes',
    category: 'estudantes',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DreadVerde&backgroundColor=0d9488',
    bgColor: '#0d9488',
  },
  {
    id: 'est-04',
    name: 'Estudante Óculos & Topete',
    category: 'estudantes',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=OculosTopete&backgroundColor=ea580c',
    bgColor: '#ea580c',
  },
  {
    id: 'est-05',
    name: 'Menina Rabo de Cavalo Loiro',
    category: 'estudantes',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=RaboCavaloLoiro&backgroundColor=16a34a',
    bgColor: '#16a34a',
  },
  {
    id: 'est-06',
    name: 'Jovem Anime Óculos Escuros',
    category: 'estudantes',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=AnimeOculos&backgroundColor=1e1b4b',
    bgColor: '#1e1b4b',
  },
  {
    id: 'est-07',
    name: 'Garoto Moicano Loiro Sorridente',
    category: 'estudantes',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=MoicanoSorriso&backgroundColor=ec4899',
    bgColor: '#ec4899',
  },
  {
    id: 'est-08',
    name: 'Menina Máscara de Dormir',
    category: 'estudantes',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=MascaraDormir&backgroundColor=d97706',
    bgColor: '#d97706',
  },
  {
    id: 'est-09',
    name: 'Garoto Cabelo Azul Feliz',
    category: 'estudantes',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=CabeloAzul&backgroundColor=7c3aed',
    bgColor: '#7c3aed',
  },
  {
    id: 'est-10',
    name: 'Estudante de Moletom & Boné',
    category: 'estudantes',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=MoletomBone&backgroundColor=0284c7',
    bgColor: '#0284c7',
  },
  {
    id: 'est-11',
    name: 'Criança Fantasia de Panda',
    category: 'estudantes',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=FantasiaPanda&backgroundColor=16a34a',
    bgColor: '#16a34a',
  },
  {
    id: 'est-12',
    name: 'Jovem Afro & Óculos Redondos',
    category: 'estudantes',
    url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=AfroOculos&backgroundColor=7c3aed',
    bgColor: '#7c3aed',
  },
  {
    id: 'est-13',
    name: 'Garoto Skatista Boné Amarelo',
    category: 'estudantes',
    url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=SkatistaBone&backgroundColor=f472b6',
    bgColor: '#f472b6',
  },
  {
    id: 'est-14',
    name: 'Menina Penteado Coque Duplo',
    category: 'estudantes',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=OrelhinhasBuns&backgroundColor=0284c7',
    bgColor: '#0284c7',
  },
  {
    id: 'est-15',
    name: 'Garota Óculos de Sol Estrela',
    category: 'estudantes',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=OculosEstrela&backgroundColor=a855f7',
    bgColor: '#a855f7',
  },
  {
    id: 'est-16',
    name: 'Menina Cabelo Lilás',
    category: 'estudantes',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=LilasElfo&backgroundColor=facc15',
    bgColor: '#facc15',
  },
  {
    id: 'est-17',
    name: 'Estudante com Fones de Ouvido',
    category: 'estudantes',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=HeadphonesGirl&backgroundColor=06b6d4',
    bgColor: '#06b6d4',
  },
  {
    id: 'est-18',
    name: 'Jovem Leitor com Livro',
    category: 'estudantes',
    url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=BookLover&backgroundColor=10b981',
    bgColor: '#10b981',
  },
  {
    id: 'est-19',
    name: 'Garota Cabelo Cacheado Ruivo',
    category: 'estudantes',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=RedCurly&backgroundColor=f97316',
    bgColor: '#f97316',
  },
  {
    id: 'est-20',
    name: 'Garoto Gamer Touca Azul',
    category: 'estudantes',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=BeanieGamer&backgroundColor=6366f1',
    bgColor: '#6366f1',
  },

  // ==========================================
  // 2. FANTASIA & ÉPICO
  // ==========================================
  {
    id: 'fan-01',
    name: 'Astronauta com Viseira Espelhada',
    category: 'fantasia',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AstroCosmic&backgroundColor=0284c7',
    bgColor: '#0284c7',
  },
  {
    id: 'fan-02',
    name: 'Mago Ancião Chapéu Verde',
    category: 'fantasia',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=MagoChapeuVerde&backgroundColor=eab308',
    bgColor: '#eab308',
  },
  {
    id: 'fan-03',
    name: 'Mago Gandalf Chapéu Cônico',
    category: 'fantasia',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=GandalfGrey&backgroundColor=78350f',
    bgColor: '#78350f',
  },
  {
    id: 'fan-04',
    name: 'Feiticeira Manto Estelar',
    category: 'fantasia',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=MantoEstelar&backgroundColor=3b82f6',
    bgColor: '#3b82f6',
  },
  {
    id: 'fan-05',
    name: 'Capitão Pirata com Tapa-Olho',
    category: 'fantasia',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=CapitaoPirata&backgroundColor=1d4ed8',
    bgColor: '#1d4ed8',
  },
  {
    id: 'fan-06',
    name: 'Pirata Bandana & Brinco',
    category: 'fantasia',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=PirataBandana&backgroundColor=8b5cf6',
    bgColor: '#8b5cf6',
  },
  {
    id: 'fan-07',
    name: 'Gnomo de Jardim Chapéu de Estrela',
    category: 'fantasia',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=GnomoJardim&backgroundColor=15803d',
    bgColor: '#15803d',
  },
  {
    id: 'fan-08',
    name: 'Princesa Guerreira',
    category: 'fantasia',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=PrincesaGuerreira&backgroundColor=f59e0b',
    bgColor: '#f59e0b',
  },
  {
    id: 'fan-09',
    name: 'Espírito do Fogo',
    category: 'fantasia',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=EspiritoFogo&backgroundColor=7c2d12',
    bgColor: '#7c2d12',
  },
  {
    id: 'fan-10',
    name: 'Cavaleiro Medieval Prata',
    category: 'fantasia',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CavaleiroPrata&backgroundColor=1e293b',
    bgColor: '#1e293b',
  },
  {
    id: 'fan-11',
    name: 'Cavaleiro Negro com Chifres',
    category: 'fantasia',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CavaleiroNegro&backgroundColor=be185d',
    bgColor: '#be185d',
  },
  {
    id: 'fan-12',
    name: 'Gênio Azul Mágico',
    category: 'fantasia',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=GenioMagico&backgroundColor=4c1d95',
    bgColor: '#4c1d95',
  },
  {
    id: 'fan-13',
    name: 'Conde Drácula Vampiro',
    category: 'fantasia',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=CondeDracula&backgroundColor=db2777',
    bgColor: '#db2777',
  },
  {
    id: 'fan-14',
    name: 'Múmia Faraônica',
    category: 'fantasia',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=MumiaFarao&backgroundColor=d97706',
    bgColor: '#d97706',
  },
  {
    id: 'fan-15',
    name: 'Elfo da Floresta Verde',
    category: 'fantasia',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ForestElf&backgroundColor=059669',
    bgColor: '#059669',
  },
  {
    id: 'fan-16',
    name: 'Ninja Samurai Noturno',
    category: 'fantasia',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ShadowNinja&backgroundColor=0f172a',
    bgColor: '#0f172a',
  },

  // ==========================================
  // 3. ROBÔS & CYBER
  // ==========================================
  {
    id: 'rob-01',
    name: 'Robô Retrô Rosa com Antena',
    category: 'robos',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=RetroRosa&backgroundColor=16a34a',
    bgColor: '#16a34a',
  },
  {
    id: 'rob-02',
    name: 'Robô Retrô Dourado com Antena',
    category: 'robos',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=RetroDourado&backgroundColor=1e40af',
    bgColor: '#1e40af',
  },
  {
    id: 'rob-03',
    name: 'Androide Cibernético Prata',
    category: 'robos',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AndroidePrata&backgroundColor=2563eb',
    bgColor: '#2563eb',
  },
  {
    id: 'rob-04',
    name: 'Robô Ciclope com Viseira Digital',
    category: 'robos',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=RoboCiclope&backgroundColor=f59e0b',
    bgColor: '#f59e0b',
  },
  {
    id: 'rob-05',
    name: 'Robô Ursinho Espacial Branco',
    category: 'robos',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=UrsoEspacial&backgroundColor=0284c7',
    bgColor: '#0284c7',
  },
  {
    id: 'rob-06',
    name: 'Robô Gato Cat-Droid',
    category: 'robos',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CatDroid&backgroundColor=f472b6',
    bgColor: '#f472b6',
  },
  {
    id: 'rob-07',
    name: 'Mecha Cyber Titan',
    category: 'robos',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberTitan&backgroundColor=0f172a',
    bgColor: '#0f172a',
  },
  {
    id: 'rob-08',
    name: 'Robô Assistente Neon',
    category: 'robos',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AssistenteNeon&backgroundColor=06b6d4',
    bgColor: '#06b6d4',
  },
  {
    id: 'rob-09',
    name: 'Domo Droid IA',
    category: 'robos',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=DomoAI&backgroundColor=8b5cf6',
    bgColor: '#8b5cf6',
  },
  {
    id: 'rob-10',
    name: 'Robô Gamer RGB',
    category: 'robos',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=RGBGamerBot&backgroundColor=ec4899',
    bgColor: '#ec4899',
  },

  // ==========================================
  // 4. EXPRESSÕES & EMOJIS
  // ==========================================
  {
    id: 'exp-01',
    name: 'Olhos de Coração Amoroso',
    category: 'expressoes',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=CoracaoTeal&backgroundColor=0d9488',
    bgColor: '#0d9488',
  },
  {
    id: 'exp-02',
    name: 'Óculos de Estrela Laranja',
    category: 'expressoes',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=EstrelasLaranja&backgroundColor=ea580c',
    bgColor: '#ea580c',
  },
  {
    id: 'exp-03',
    name: 'Blob Azul Sorriso Tímido',
    category: 'expressoes',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=BlobAzul&backgroundColor=f43f5e',
    bgColor: '#f43f5e',
  },
  {
    id: 'exp-04',
    name: 'Desenho a Mão Rosto Sorridente',
    category: 'expressoes',
    url: 'https://api.dicebear.com/7.x/croodles/svg?seed=RascunhoFeliz&backgroundColor=f97316',
    bgColor: '#f97316',
  },
  {
    id: 'exp-05',
    name: 'Blob Azul com Boné Rosa',
    category: 'expressoes',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=BlobBoneRosa&backgroundColor=ec4899',
    bgColor: '#ec4899',
  },
  {
    id: 'exp-06',
    name: 'Carinha Pisca Esperta',
    category: 'expressoes',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Piscadinha&backgroundColor=8b5cf6',
    bgColor: '#8b5cf6',
  },
  {
    id: 'exp-07',
    name: 'Carinha Gargalhada',
    category: 'expressoes',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Gargalhada&backgroundColor=10b981',
    bgColor: '#10b981',
  },
  {
    id: 'exp-08',
    name: 'Carinha Surpresa',
    category: 'expressoes',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Surpreso&backgroundColor=38bdf8',
    bgColor: '#38bdf8',
  },
  {
    id: 'exp-09',
    name: 'Carinha Óculos Nerd',
    category: 'expressoes',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=NerdGlasses&backgroundColor=a855f7',
    bgColor: '#a855f7',
  },
  {
    id: 'exp-10',
    name: 'Carinha Cool Óculos de Sol',
    category: 'expressoes',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=CoolSunglasses&backgroundColor=eab308',
    bgColor: '#eab308',
  },

  // ==========================================
  // 5. MASCOTES & ANIMAIS
  // ==========================================
  {
    id: 'mas-01',
    name: 'Gatinho com Chapéu de Festa',
    category: 'mascotes',
    url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=GatinhoFesta&backgroundColor=16a34a',
    bgColor: '#16a34a',
  },
  {
    id: 'mas-02',
    name: 'Gatinho Lilás com Gravata Borboleta',
    category: 'mascotes',
    url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=GatoGravata&backgroundColor=7c3aed',
    bgColor: '#7c3aed',
  },
  {
    id: 'mas-03',
    name: 'Pintinho Amarelo Fofinho',
    category: 'mascotes',
    url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=PintinhoAmarelo&backgroundColor=22c55e',
    bgColor: '#22c55e',
  },
  {
    id: 'mas-04',
    name: 'Preguiça Feliz Sorrindo',
    category: 'mascotes',
    url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=PreguicaFeliz&backgroundColor=0f766e',
    bgColor: '#0f766e',
  },
  {
    id: 'mas-05',
    name: 'Filhote de Tigre',
    category: 'mascotes',
    url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Tigrinho&backgroundColor=0284c7',
    bgColor: '#0284c7',
  },
  {
    id: 'mas-06',
    name: 'Filhote de Leão Real',
    category: 'mascotes',
    url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Leaozinho&backgroundColor=2563eb',
    bgColor: '#2563eb',
  },
  {
    id: 'mas-07',
    name: 'Ursinho Pardo Carismático',
    category: 'mascotes',
    url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=UrsinhoPardo&backgroundColor=eab308',
    bgColor: '#eab308',
  },
  {
    id: 'mas-08',
    name: 'Ratinho Rosa de Orelhas Grandes',
    category: 'mascotes',
    url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=RatinhoRosa&backgroundColor=3b82f6',
    bgColor: '#3b82f6',
  },
  {
    id: 'mas-09',
    name: 'Pombo / Gaivota Amigável',
    category: 'mascotes',
    url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=PomboAmigo&backgroundColor=2563eb',
    bgColor: '#2563eb',
  },
  {
    id: 'mas-10',
    name: 'Coelhinha Rosa Esportista',
    category: 'mascotes',
    url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=CoelhaEsportista&backgroundColor=1d4ed8',
    bgColor: '#1d4ed8',
  },
  {
    id: 'mas-11',
    name: 'Sapinho com Camisa e Colete',
    category: 'mascotes',
    url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=SapinhoColete&backgroundColor=93c5fd',
    bgColor: '#93c5fd',
  },
  {
    id: 'mas-12',
    name: 'Raposinha Dorminhoca',
    category: 'mascotes',
    url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=RaposaDorminhoca&backgroundColor=86efac',
    bgColor: '#86efac',
  },
  {
    id: 'mas-13',
    name: 'Cachorrinho Shiba Inu Feliz',
    category: 'mascotes',
    url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=ShibaHappy&backgroundColor=f59e0b',
    bgColor: '#f59e0b',
  },
  {
    id: 'mas-14',
    name: 'Corujinha Sabida dos Livros',
    category: 'mascotes',
    url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=OwlReader&backgroundColor=6366f1',
    bgColor: '#6366f1',
  },

  // ==========================================
  // 6. MONSTRINHOS & ALIENS
  // ==========================================
  {
    id: 'mon-01',
    name: 'Monstro Peludo Roxo / Yeti',
    category: 'monstros',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=MonstroPeludoRoxo&backgroundColor=eab308',
    bgColor: '#eab308',
  },
  {
    id: 'mon-02',
    name: 'Alien Verde Cabeçudo com Antenas',
    category: 'monstros',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AlienCabecudo&backgroundColor=0284c7',
    bgColor: '#0284c7',
  },
  {
    id: 'mon-03',
    name: 'Alien Grin 3 Olhos Sorrindo',
    category: 'monstros',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AlienTresOlhos&backgroundColor=be185d',
    bgColor: '#be185d',
  },
  {
    id: 'mon-04',
    name: 'Monstro Morcego Roxo com Presas',
    category: 'monstros',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=MorcegoRoxo&backgroundColor=3b0764',
    bgColor: '#3b0764',
  },
  {
    id: 'mon-05',
    name: 'Zombie Monstrinho Verde',
    category: 'monstros',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=ZombieMonstrinho&backgroundColor=ca8a04',
    bgColor: '#ca8a04',
  },
  {
    id: 'mon-06',
    name: 'Criatura Rosa Bebendo Canudo',
    category: 'monstros',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CriaturaRosa&backgroundColor=facc15',
    bgColor: '#facc15',
  },
  {
    id: 'mon-07',
    name: 'Alien Espacial de Chapéu Laranja',
    category: 'monstros',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AlienChapeuLaranja&backgroundColor=1d4ed8',
    bgColor: '#1d4ed8',
  },
  {
    id: 'mon-08',
    name: 'Monstrinho Ciclope Saltitante',
    category: 'monstros',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=OneEyedMonster&backgroundColor=10b981',
    bgColor: '#10b981',
  },

  // ==========================================
  // 7. PERSONAGENS ESTILIZADOS
  // ==========================================
  {
    id: 'vet-01',
    name: 'Cavalheiro Afro Terno & Gravata',
    category: 'vetores',
    url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=AfroTerno&backgroundColor=fed7aa',
    bgColor: '#fed7aa',
  },
  {
    id: 'vet-02',
    name: 'Mascote Guerreira Máscara de Raposa',
    category: 'vetores',
    url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=MascaraRaposa&backgroundColor=16a34a',
    bgColor: '#16a34a',
  },
  {
    id: 'vet-03',
    name: 'Estudiosa Steampunk Óculos Aviador',
    category: 'vetores',
    url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=SteampunkOculos&backgroundColor=0f766e',
    bgColor: '#0f766e',
  },
  {
    id: 'vet-04',
    name: 'Personagem Broto de Planta na Cabeça',
    category: 'vetores',
    url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=BrotoCabeca&backgroundColor=f472b6',
    bgColor: '#f472b6',
  },
  {
    id: 'vet-05',
    name: 'Professor Vintage Chapéu Coco',
    category: 'vetores',
    url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=ProfessorVintage&backgroundColor=fdba74',
    bgColor: '#fdba74',
  },
  {
    id: 'vet-06',
    name: 'Pato Sofisticado de Camisa Social',
    category: 'vetores',
    url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=PatoElegante&backgroundColor=60a5fa',
    bgColor: '#60a5fa',
  },

  // ==========================================
  // 8. PIXEL ART RETRÔ
  // ==========================================
  {
    id: 'pix-01',
    name: 'Pixel Knight 8-Bit',
    category: 'pixel',
    url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=PixelKnight&backgroundColor=0284c7',
    bgColor: '#0284c7',
  },
  {
    id: 'pix-02',
    name: 'Pixel Mage Capuz Azul',
    category: 'pixel',
    url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=PixelMage&backgroundColor=9333ea',
    bgColor: '#9333ea',
  },
  {
    id: 'pix-03',
    name: 'Pixel Princess Coroa Dourada',
    category: 'pixel',
    url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=PixelPrincess&backgroundColor=ec4899',
    bgColor: '#ec4899',
  },
  {
    id: 'pix-04',
    name: 'Pixel Skater Boné Vermelho',
    category: 'pixel',
    url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=PixelSkater&backgroundColor=16a34a',
    bgColor: '#16a34a',
  },
  {
    id: 'pix-05',
    name: 'Pixel Dragon Filhote Verde',
    category: 'pixel',
    url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=PixelDragon&backgroundColor=d97706',
    bgColor: '#d97706',
  },

  // ==========================================
  // 9. ESTILO 3D & MODERNO
  // ==========================================
  {
    id: 'mod-01',
    name: 'Notion Minimalista Estudante',
    category: '3d',
    url: 'https://api.dicebear.com/7.x/notionists/svg?seed=NotionStudent&backgroundColor=e0e7ff',
    bgColor: '#e0e7ff',
  },
  {
    id: 'mod-02',
    name: 'Notion Leitora Focada',
    category: '3d',
    url: 'https://api.dicebear.com/7.x/notionists/svg?seed=NotionReader&backgroundColor=fef3c7',
    bgColor: '#fef3c7',
  },
  {
    id: 'mod-03',
    name: 'Notion Cientista com Lupa',
    category: '3d',
    url: 'https://api.dicebear.com/7.x/notionists/svg?seed=NotionScientist&backgroundColor=ccfbf1',
    bgColor: '#ccfbf1',
  },
  {
    id: 'mod-04',
    name: 'Notion Artista Criativo',
    category: '3d',
    url: 'https://api.dicebear.com/7.x/notionists/svg?seed=NotionArtist&backgroundColor=fce7f3',
    bgColor: '#fce7f3',
  },
];

export const getRandomAvatar = (): string => {
  const randomIndex = Math.floor(Math.random() * AVATAR_BANK.length);
  return AVATAR_BANK[randomIndex].url;
};
