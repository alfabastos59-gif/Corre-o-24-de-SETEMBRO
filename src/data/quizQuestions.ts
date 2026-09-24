import { Book } from '../types';

export interface QuizQuestion {
  id: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, or 3
  explanation: string;
  points: number;
}

// Curated questions for iconic titles
export const CURATED_QUESTIONS: Record<string, QuizQuestion[]> = {
  'O Pequeno Príncipe': [
    {
      id: 'opp_1',
      bookTitle: 'O Pequeno Príncipe',
      bookAuthor: 'Antoine de Saint-Exupéry',
      bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&auto=format&fit=crop&q=80',
      question: 'Qual é o principal ensinamento que o Pequeno Príncipe aprende em sua jornada?',
      options: [
        'O valor da amizade e do cuidado com o outro',
        'A importância de ter muitos bens',
        'Como ser o melhor piloto do mundo',
        'Que os adultos nunca entendem nada',
      ],
      correctIndex: 0,
      explanation: 'O principezinho aprende que "o essencial é invisível aos olhos" e que nos tornamos eternamente responsáveis por aquilo que cativamos!',
      points: 100,
    },
    {
      id: 'opp_2',
      bookTitle: 'O Pequeno Príncipe',
      bookAuthor: 'Antoine de Saint-Exupéry',
      bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&auto=format&fit=crop&q=80',
      question: 'De qual asteroide o Pequeno Príncipe veio para visitar a Terra?',
      options: [
        'Asteroide B-612',
        'Planeta Marte',
        'Asteroide X-900',
        'Constelação de Órion',
      ],
      correctIndex: 0,
      explanation: 'O asteroide B-612 é pequenino, possui três vulcões e uma linda rosa que ele cuidava com redomas de vidro!',
      points: 100,
    },
    {
      id: 'opp_3',
      bookTitle: 'O Pequeno Príncipe',
      bookAuthor: 'Antoine de Saint-Exupéry',
      bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&auto=format&fit=crop&q=80',
      question: 'Qual personagem ensina ao Pequeno Príncipe o verdadeiro significado de "cativar"?',
      options: [
        'A Raposa',
        'O Astrônomo Turco',
        'A Serpente do deserto',
        'O Rei do primeiro asteroide',
      ],
      correctIndex: 0,
      explanation: 'A sábia Raposa explica: "Cativar significa criar laços. Tu te tornas eternamente responsável por aquilo que cativas."',
      points: 100,
    },
  ],
  'Crônicas Para Jovens': [
    {
      id: 'cpj_1',
      bookTitle: 'Crônicas Para Jovens',
      bookAuthor: 'Rubem Braga',
      bookCover: 'https://pdwgbhmktifznyguctaf.supabase.co/storage/v1/object/public/capas/f1e9a097-c0b7-42fa-92ae-e070926d99bf.jpg',
      question: 'Qual é a principal característica da escrita de Rubem Braga nestas crônicas?',
      options: [
        'Lirismo, sensibilidade e humor observando o cotidiano',
        'Ficção científica com viagens espaciais',
        'Tratados complexos de matemática aplicada',
        'Mistérios policiais sombrios em castelos medievais',
      ],
      correctIndex: 0,
      explanation: 'Rubem Braga é considerado um dos maiores cronistas do Brasil por transformar pequenos momentos do dia a dia em pura poesia!',
      points: 100,
    },
    {
      id: 'cpj_2',
      bookTitle: 'Crônicas Para Jovens',
      bookAuthor: 'Rubem Braga',
      bookCover: 'https://pdwgbhmktifznyguctaf.supabase.co/storage/v1/object/public/capas/f1e9a097-c0b7-42fa-92ae-e070926d99bf.jpg',
      question: 'O gênero crônica costuma se destacar por qual elemento?',
      options: [
        'Refletir sobre fatos simples e rotineiros com linguagem leve e acessível',
        'Ter sempre mais de mil páginas e linguagem arcaica',
        'Ser uma peça de teatro rimada para grandes orquestras',
        'Apresentar apenas gráficos estatísticos sem história',
      ],
      correctIndex: 0,
      explanation: 'A crônica nasceu no jornal e se conecta com o leitor retratando a vida real e as emoções cotidianas!',
      points: 100,
    },
  ],
  'Cobras em Compota': [
    {
      id: 'cec_1',
      bookTitle: 'Cobras em Compota',
      bookAuthor: 'Indigo',
      bookCover: 'https://pdwgbhmktifznyguctaf.supabase.co/storage/v1/object/public/capas/af831933-898e-4527-82be-bc2bbef81a11.jpg',
      question: 'O livro "Cobras em Compota" encanta os leitores principalmente através de qual recurso?',
      options: [
        'Histórias engraçadas sobre a imaginação e a convivência com animais',
        'Fórmulas científicas sobre venenos de répteis',
        'Regras rígidas de etiqueta do século XVIII',
        'Um manual de receitas culinárias tradicionais',
      ],
      correctIndex: 0,
      explanation: 'A autora Indigo constrói narrativas cheias de humor, imaginação e situações inusitadas do universo infantojuvenil!',
      points: 100,
    },
  ],
  'Dom Quixote': [
    {
      id: 'dq_1',
      bookTitle: 'Dom Quixote',
      bookAuthor: 'Miguel de Cervantes',
      bookCover: 'https://pdwgbhmktifznyguctaf.supabase.co/storage/v1/object/public/capas/efd116ba-f538-4e11-85b4-bc2c72b22584.jpg',
      question: 'Quem é o fiel escudeiro que acompanha o Cavaleiro da Triste Figura em suas andanças?',
      options: [
        'Sancho Pança',
        'Rocinante',
        'Dulcinea del Toboso',
        'Merlin o mago',
      ],
      correctIndex: 0,
      explanation: 'Sancho Pança monta seu fiel burrinho e traz o contraponto bem-humorado e prático aos delírios heroicos de Dom Quixote!',
      points: 100,
    },
    {
      id: 'dq_2',
      bookTitle: 'Dom Quixote',
      bookAuthor: 'Miguel de Cervantes',
      bookCover: 'https://pdwgbhmktifznyguctaf.supabase.co/storage/v1/object/public/capas/efd116ba-f538-4e11-85b4-bc2c72b22584.jpg',
      question: 'O que Dom Quixote confunde com gigantes em uma de suas passagens mais célebres?',
      options: [
        'Moinhos de vento',
        'Montanhas rochosas',
        'Navios piratas',
        'Árvores centenárias',
      ],
      correctIndex: 0,
      explanation: 'Ele avança de lança em punho contra os moinhos de vento acreditando serem gigantes perigosos!',
      points: 100,
    },
  ],
  'Dom Casmurro de Machado de Assis': [
    {
      id: 'dc_1',
      bookTitle: 'Dom Casmurro de Machado de Assis',
      bookAuthor: 'Machado de Assis',
      bookCover: 'https://pdwgbhmktifznyguctaf.supabase.co/storage/v1/object/public/capas/70bca574-8846-4cb4-a111-e40e2b4f62d4.jpg',
      question: 'Como o narrador Bentinho descreve o olhar marcante de Capitu?',
      options: [
        'Olhos de ressaca, como a vaga do mar',
        'Olhos de águia perspicaz',
        'Olhos de céu límpido e sem nuvens',
        'Olhos de chamas incandescentes',
      ],
      correctIndex: 0,
      explanation: 'José Dias e Bentinho eternizaram a expressão "olhos de ressaca", misteriosos e profundos como o mar!',
      points: 100,
    },
  ],
  'O HOBBIT': [
    {
      id: 'hob_1',
      bookTitle: 'O HOBBIT',
      bookAuthor: 'J.R.R. Tolkien',
      bookCover: 'https://pdwgbhmktifznyguctaf.supabase.co/storage/v1/object/public/capas/d1d05aa2-ca89-49ee-895a-c603a9f0e137.jpg',
      question: 'Qual é o nome do hobbit pacato que deixa o Condado para uma inesperada aventura?',
      options: [
        'Bilbo Bolseiro',
        'Frodo Bolseiro',
        'Samwise Gamgee',
        'Peregrin Tûk',
      ],
      correctIndex: 0,
      explanation: 'Bilbo é convocado pelo mago Gandalf e pelos anões de Thorin para cruzar a Terra-média até a Montanha Solitária!',
      points: 100,
    },
  ],
  'A teoria do ICEBERG': [
    {
      id: 'ice_1',
      bookTitle: 'A teoria do ICEBERG',
      bookAuthor: 'Christopher Bouix',
      bookCover: 'https://pdwgbhmktifznyguctaf.supabase.co/storage/v1/object/public/capas/4508fbb0-09f6-48d2-ba74-c1a21561e8f0.jpg',
      question: 'O conceito literário da Teoria do Iceberg significa essencialmente que:',
      options: [
        'Apenas uma fração da história é visível na superfície, enquanto o sentido profundo fica implícito',
        'Livros devem ser lidos apenas em ambientes de inverno rigoroso',
        'A narrativa deve se passar exclusivamente em navios ou no Polo Norte',
        'O final da história deve sempre ser revelado na primeira página',
      ],
      correctIndex: 0,
      explanation: 'Popularizada por mestres da narrativa, a técnica deixa subentendidas as maiores tensões e emoções das personagens!',
      points: 100,
    },
  ],
  'Desenganos da vida Humana e outros Poemas': [
    {
      id: 'dvh_1',
      bookTitle: 'Desenganos da vida Humana e outros Poemas',
      bookAuthor: 'Gregório de Matos',
      bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&auto=format&fit=crop&q=80',
      question: 'Qual célebre autor baiano do período Barroco é o autor de "Desenganos da vida Humana"?',
      options: [
        'Gregório de Matos ("Boca do Inferno")',
        'Gonçalves Dias',
        'Castro Alves',
        'Carlos Drummond de Andrade',
      ],
      correctIndex: 0,
      explanation: 'Gregório de Matos é o maior poeta barroco do Brasil colonial, famoso por sua verve lírica, filosófica e satírica!',
      points: 100,
    },
    {
      id: 'dvh_2',
      bookTitle: 'Desenganos da vida Humana e outros Poemas',
      bookAuthor: 'Gregório de Matos',
      bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&auto=format&fit=crop&q=80',
      question: 'O tema dos "desenganos" na poesia barroca de Gregório de Matos refere-se principalmente a quê?',
      options: [
        'À efemeridade da vida mundana, à passagem inexorável do tempo e às ilusões humanas',
        'A um manual de navegação do século XVII',
        'A receitas de banquetes coloniais em Salvador',
        'Aos cálculos matemáticos da época imperial',
      ],
      correctIndex: 0,
      explanation: 'No Barroco, o desengano representa a consciência de que as glórias terrenas passam rapidamente, convidando à reflexão espiritual.',
      points: 100,
    },
  ],
  'Poemas Escolhidos': [
    {
      id: 'pesc_1',
      bookTitle: 'Poemas Escolhidos',
      bookAuthor: 'Gregório de Matos',
      bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&auto=format&fit=crop&q=80',
      question: 'A sátira demolidora da sociedade da Bahia colonial valeu a Gregório de Matos qual alcunha histórica?',
      options: [
        'Boca do Inferno',
        'Poeta dos Escravos',
        'Cavaleiro da Esperança',
        'Bruxo do Cosme Velho',
      ],
      correctIndex: 0,
      explanation: 'O apelido "Boca do Inferno" expressa sua coragem e mordacidade ao satirizar os poderosos e os vícios da época colonial.',
      points: 100,
    },
  ],
  'Poesias reunidas': [
    {
      id: 'preun_1',
      bookTitle: 'Poesias reunidas',
      bookAuthor: 'Oswald de Andrade',
      bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&auto=format&fit=crop&q=80',
      question: 'Oswald de Andrade foi um dos líderes fundamentais de qual marco histórico da cultura e literatura brasileira?',
      options: [
        'Semana de Arte Moderna de 1922',
        'Inconfidência Mineira',
        'Revolução Farroupilha',
        'Guerra de Canudos',
      ],
      correctIndex: 0,
      explanation: 'Oswald foi um dos principais articuladores do Modernismo brasileiro e autor dos manifestos Pau-Brasil e Antropófago!',
      points: 100,
    },
  ],
  'História e Memória do Município de Coração de Maria': [
    {
      id: 'hmmcm_1',
      bookTitle: 'História e Memória do Município de Coração de Maria',
      bookAuthor: 'Secretaria Municipal de Educação',
      bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&auto=format&fit=crop&q=80',
      question: 'Qual é o papel fundamental de livros sobre a história e memória local do município em bibliotecas escolares?',
      options: [
        'Preservar a memória coletiva, fortalecer a identidade cultural e a cidadania dos estudantes',
        'Servir apenas para preencher espaço nas prateleiras',
        'Substituir o currículo de ciências e física',
        'Proibir o conhecimento de histórias de outros estados',
      ],
      correctIndex: 0,
      explanation: 'Obras de história e memória local conectam o estudante com as raízes, tradições e patrimônio cultural de sua cidade.',
      points: 100,
    },
  ],
  'As Melhores Histórias de Fernando Sabino': [
    {
      id: 'fsab_1',
      bookTitle: 'As Melhores Histórias de Fernando Sabino',
      bookAuthor: 'Fernando Sabino',
      bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&auto=format&fit=crop&q=80',
      question: 'Fernando Sabino destacou-se na literatura brasileira por seu estilo leve, bem-humorado e afiado em qual gênero?',
      options: [
        'Crônica e Conto',
        'Tratado de Astrofísica',
        'Dicionário Enciclopédico',
        'Poesia Épica Grega',
      ],
      correctIndex: 0,
      explanation: 'Fernando Sabino é um dos maiores cronistas do Brasil, autor de obras primorosas como "O Encontro Marcado" e "O Homem Nu"!',
      points: 100,
    },
  ],
  'A história do amor de Fernando e Isaura': [
    {
      id: 'hfi_1',
      bookTitle: 'A história do amor de Fernando e Isaura',
      bookAuthor: 'Ariano Suassuna',
      bookCover: 'https://pdwgbhmktifznyguctaf.supabase.co/storage/v1/object/public/capas/cd7e06c5-fca4-4d7d-a6f3-77d08a6d1b61.jpg',
      question: 'Quem é o consagrado dramaturgo e escritor paraibano autor de "A história do amor de Fernando e Isaura"?',
      options: [
        'Ariano Suassuna',
        'Jorge Amado',
        'Guimarães Rosa',
        'Graciliano Ramos',
      ],
      correctIndex: 0,
      explanation: 'Ariano Suassuna é o célebre autor do Movimento Armorial e de clássicos como "O Auto da Compadecida"!',
      points: 100,
    },
    {
      id: 'hfi_2',
      bookTitle: 'A história do amor de Fernando e Isaura',
      bookAuthor: 'Ariano Suassuna',
      bookCover: 'https://pdwgbhmktifznyguctaf.supabase.co/storage/v1/object/public/capas/cd7e06c5-fca4-4d7d-a6f3-77d08a6d1b61.jpg',
      question: 'A obra "Fernando e Isaura" é uma recriação sertaneja e nordestina inspirada em qual lenda clássica universal?',
      options: [
        'Tristão e Isolda',
        'Romeu e Julieta',
        'A Ilíada de Homero',
        'A Odisséia',
      ],
      correctIndex: 0,
      explanation: 'Suassuna transportou para a paisagem e a força do sertão a mítica e trágica história de Tristão e Isolda!',
      points: 100,
    },
  ],
  'NANOOK Ele Está Chegando': [
    {
      id: 'nan_1',
      bookTitle: 'NANOOK Ele Está Chegando',
      bookAuthor: 'Gustavo Bernardo',
      bookCover: 'https://pdwgbhmktifznyguctaf.supabase.co/storage/v1/object/public/capas/4313a1a6-7083-407a-a3e3-29555cf78cc2.jpg',
      question: 'Quem é o autor brasileiro que escreveu a envolvente narrativa juvenil "NANOOK Ele Está Chegando"?',
      options: [
        'Gustavo Bernardo',
        'Pedro Bandeira',
        'Ziraldo',
        'Ruth Rocha',
      ],
      correctIndex: 0,
      explanation: 'Gustavo Bernardo é professor, ensaísta e romancista com vasta e premiada produção literária infantojuvenil!',
      points: 100,
    },
    {
      id: 'nan_2',
      bookTitle: 'NANOOK Ele Está Chegando',
      bookAuthor: 'Gustavo Bernardo',
      bookCover: 'https://pdwgbhmktifznyguctaf.supabase.co/storage/v1/object/public/capas/4313a1a6-7083-407a-a3e3-29555cf78cc2.jpg',
      question: 'O nome "Nanook" carrega forte simbolismo associado a qual figura das culturas do Ártico (Inuítes)?',
      options: [
        'O Urso Polar, mestre e guardião das neves',
        'O Lobo solitário das florestas tropicais',
        'A Águia dourada do deserto',
        'O Golfinho das águas quentes',
      ],
      correctIndex: 0,
      explanation: 'Na tradição inuíte, Nanook é o espírito do urso polar, reverenciado por sua força e conexão com a natureza selvagem!',
      points: 100,
    },
  ],
  'Natureza em alerta': [
    {
      id: 'nea_1',
      bookTitle: 'Natureza em alerta',
      bookAuthor: 'Samuel Murgel Branco',
      bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&auto=format&fit=crop&q=80',
      question: 'O livro "Natureza em alerta" tem como objetivo central despertar a consciência sobre qual tema?',
      options: [
        'Preservação ambiental, equilíbrio ecológico e sustentabilidade',
        'Construção de foguetes para Marte',
        'História dos jogos de videogame',
        'Regras do futebol de salão',
      ],
      correctIndex: 0,
      explanation: 'A obra alerta para os impactos das ações humanas no meio ambiente e a urgência de proteger os ecossistemas!',
      points: 100,
    },
  ],
  'Urupês': [
    {
      id: 'uru_1',
      bookTitle: 'Urupês',
      bookAuthor: 'Monteiro Lobato',
      bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&auto=format&fit=crop&q=80',
      question: 'Qual personagem emblemático do interior paulista foi introduzido por Monteiro Lobato no livro "Urupês"?',
      options: [
        'Jeca Tatu',
        'Emília a boneca de pano',
        'Visconde de Sabugosa',
        'Pedrinho',
      ],
      correctIndex: 0,
      explanation: 'Jeca Tatu é o caipira imortalizado por Lobato que chamou a atenção nacional para as condições de saúde e abandono do homem do campo!',
      points: 100,
    },
  ],
  'O Mistério do 5 Estrelas': [
    {
      id: 'm5e_1',
      bookTitle: 'O Mistério do 5 Estrelas',
      bookAuthor: 'Marcos Rey',
      bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&auto=format&fit=crop&q=80',
      question: 'Na clássica trama juvenil da Série Vaga-Lume, em qual hotel paulistano ocorre o misterioso assassinato?',
      options: [
        'Hotel San Diego (um hotel 5 estrelas)',
        'Pousada do Sol',
        'Hotel Copacabana Palace',
        'Estalagem da Colina',
      ],
      correctIndex: 0,
      explanation: 'O jovem mensageiro Leo presencia um crime no luxuoso Hotel San Diego e tenta provar sua inocência com a ajuda dos amigos!',
      points: 100,
    },
  ],
  'O Cão dos Baskervilles': [
    {
      id: 'cdb_1',
      bookTitle: 'O Cão dos Baskervilles',
      bookAuthor: 'Arthur Conan Doyle',
      bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&auto=format&fit=crop&q=80',
      question: 'Quem é o genial detetive consultor de Baker Street que investiga a lenda da fera nas charnecas de Devonshire?',
      options: [
        'Sherlock Holmes',
        'Hercule Poirot',
        'Arsène Lupin',
        'Inspetor Maigret',
      ],
      correctIndex: 0,
      explanation: 'Sherlock Holmes e seu fiel amigo Dr. Watson desvendam o mistério da terrível maldição que assombra a família Baskerville!',
      points: 100,
    },
  ],
  'O Cortiço': [
    {
      id: 'ocort_1',
      bookTitle: 'O Cortiço',
      bookAuthor: 'Aluísio Azevedo',
      bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&auto=format&fit=crop&q=80',
      question: 'Na obra-prima "O Cortiço", quem é o imigrante português ambicioso que funda e expande a habitação coletiva?',
      options: [
        'João Romão',
        'Jerônimo',
        'Miranda',
        'Firmo',
      ],
      correctIndex: 0,
      explanation: 'João Romão é o comerciante obstinado por enriquecer que constrói a estalagem e o cortiço ao lado do sobrado de Miranda!',
      points: 100,
    },
  ],
};

// Procedural generator to guarantee customized quiz questions for ANY book in the library
export const getQuestionsForBook = (book: Book): QuizQuestion[] => {
  // Check exact curated match
  const curated = CURATED_QUESTIONS[book.title];
  if (curated && curated.length > 0) {
    return curated;
  }

  // Check case-insensitive / partial match
  const lowerTitle = book.title.toLowerCase();
  for (const [key, list] of Object.entries(CURATED_QUESTIONS)) {
    if (lowerTitle.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerTitle)) {
      return list;
    }
  }

  // Procedural questions generated from the book's verified metadata
  const cleanTitle = book.title;
  const author = book.author || 'Autor da obra';
  const category = book.category || 'Literatura';
  const cover = book.cover || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&auto=format&fit=crop&q=80';

  const q1: QuizQuestion = {
    id: `dyn_${book.id}_1`,
    bookTitle: cleanTitle,
    bookAuthor: author,
    bookCover: cover,
    question: `Quem é o autor(a) responsável pela obra "${cleanTitle}" presente no acervo da nossa biblioteca?`,
    options: [
      author,
      'Machado de Assis',
      'Monteiro Lobato',
      'Clarice Lispector',
    ],
    correctIndex: 0,
    explanation: `Excelente! A obra "${cleanTitle}" foi escrita por ${author} e integra a categoria ${category}.`,
    points: 100,
  };

  const q2: QuizQuestion = {
    id: `dyn_${book.id}_2`,
    bookTitle: cleanTitle,
    bookAuthor: author,
    bookCover: cover,
    question: `A obra "${cleanTitle}" é catalogada na biblioteca Maria Quitéria sob qual categoria literária?`,
    options: [
      category,
      category === 'Infantil' ? 'Romance Científico' : 'Infantil',
      category === 'História' ? 'Astronomia Espacial' : 'Física Quântica',
      category === 'Poesia' ? 'Manual Automotivo' : 'Culinária Francesa',
    ],
    correctIndex: 0,
    explanation: `Correto! "${cleanTitle}" pertence à categoria de ${category}, enriquecendo o repertório de nossos leitores!`,
    points: 100,
  };

  let q3: QuizQuestion | null = null;
  if (book.synopsis && book.synopsis.length > 20) {
    const snippet = book.synopsis.slice(0, 100) + '...';
    q3 = {
      id: `dyn_${book.id}_3`,
      bookTitle: cleanTitle,
      bookAuthor: author,
      bookCover: cover,
      question: `De acordo com a sinopse de "${cleanTitle}", qual é o tema central abordado no livro?`,
      options: [
        snippet,
        'Um manual passo a passo de montagem de computadores',
        'A vida subaquática em fossas abissais do oceano Pacífico',
        'Receitas medievais de panificação artesanal',
      ],
      correctIndex: 0,
      explanation: `Muito bem! Você prestou atenção à história e ao contexto da obra "${cleanTitle}"!`,
      points: 100,
    };
  }

  return q3 ? [q1, q2, q3] : [q1, q2];
};
