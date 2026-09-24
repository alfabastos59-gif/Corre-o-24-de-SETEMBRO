import { AuthorItem } from '../types';
import { MANOEL_DE_BARROS_QUOTES } from '../components/FeaturedWriterCard';

export const DEFAULT_AUTHORS: AuthorItem[] = [
  {
    id: 'manoel-de-barros',
    name: 'Manoel de Barros',
    period: '1916 – 2014',
    role: 'Poeta Pantaneiro • Prêmio Jabuti',
    tag: 'Poesia Brasileira',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Manoel_Ramos_de_Barros.jpg',
    featuredQuote: 'Sentia mais prazer de brincar com as palavras do que de pensar com elas',
    quoteSource: 'Poeminha em língua de brincar',
    referenceUrl: 'https://www.companhiadasletras.com.br/BlogPost/6532/18-frases-de-manoel-de-barros-para-celebrar-sua-poesia?srsltid=AU7gw4UupGvCbGIrq1HeKDaFSmj_ntsDV3eWEO75ln8KliHmSh-qPnO7',
    additionalQuotes: MANOEL_DE_BARROS_QUOTES.map((q) => ({ text: q.text, source: q.source })),
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'machado-de-assis',
    name: 'Machado de Assis',
    period: '1839 – 1908',
    role: 'Fundador da Academia Brasileira de Letras',
    tag: 'Clássico Imortal',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Machado_de_Assis_real.jpg',
    featuredQuote: 'A melhor definição do amor não vale um beijo de moça namorada.',
    quoteSource: 'Memórias Póstumas de Brás Cubas',
    additionalQuotes: [
      { text: 'Esquecer é uma necessidade. A vida é uma lousa, em que o destino, para escrever um novo caso, precisa de apagar o já escrito.', source: 'Memórias Póstumas' },
      { text: 'A vida não é outra coisa senão um duelo entre o passado e o futuro.', source: 'Quincas Borba' },
      { text: 'Cada estação da vida é uma edição, que corrige a anterior, e que será corrigida também.', source: 'Esaú e Jacó' }
    ],
    active: true,
    createdAt: '2024-01-08T00:00:00.000Z'
  },
  {
    id: 'clarice-lispector',
    name: 'Clarice Lispector',
    period: '1920 – 1977',
    role: 'Romancista e Contista',
    tag: 'Vanguarda Literária',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Clarice_Lispector.jpg',
    featuredQuote: 'Renda-se, como eu me rendi. Mergulhe no que você não conhece. Não se preocupe em entender: viver ultrapassa qualquer entendimento.',
    quoteSource: 'A Paixão Segundo G.H.',
    additionalQuotes: [
      { text: 'Liberdade é pouco. O que eu desejo ainda não tem nome.', source: 'Água Viva' },
      { text: 'Até cortar os próprios defeitos pode ser perigoso: nunca se sabe qual é o defeito que sustenta nosso edifício.', source: 'A Hora da Estrela' },
      { text: 'Tudo no mundo começou com um sim. Uma molécula disse sim a outra molécula e nasceu a vida.', source: 'A Hora da Estrela' }
    ],
    active: true,
    createdAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 'conceicao-evaristo',
    name: 'Conceição Evaristo',
    period: '1946 – presente',
    role: 'Mestra da Escrevivência • Prêmio Jabuti',
    tag: 'Literatura Negra Contemporânea',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Concei%C3%A7%C3%A3o_Evaristo_em_2019.jpg',
    featuredQuote: 'A nossa escrevivência não é para adormecer os da casa grande, e sim para acordá-los dos seus sonos injustos.',
    quoteSource: 'Becos da Memória',
    additionalQuotes: [
      { text: 'Da minha mãe herdei a cor e a sabedoria da vida.', source: 'Ponciá Vicêncio' },
      { text: 'Eles combinaram de nos matar, mas nós combinamos de não morrer.', source: 'Olhos D’água' },
      { text: 'Escrever é uma forma de sangrar o peito e deixar o coração voar.', source: 'Insubmissas Lágrimas de Mulheres' }
    ],
    active: true,
    createdAt: '2024-01-22T00:00:00.000Z'
  },
  {
    id: 'guimaraes-rosa',
    name: 'Guimarães Rosa',
    period: '1908 – 1967',
    role: 'Escritor e Diplomata',
    tag: 'Mestre do Sertão',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Jo%C3%A3o_Guimar%C3%A3es_Rosa_%281967%29.jpg',
    featuredQuote: 'O correr da vida embrulha tudo. A vida esquenta e esfria, aperta e daí afrouxa. O que ela quer da gente é coragem.',
    quoteSource: 'Grande Sertão: Veredas',
    additionalQuotes: [
      { text: 'Mestre não é quem sempre ensina, mas quem de repente aprende.', source: 'Grande Sertão: Veredas' },
      { text: 'Viver é um descuido prosseguido.', source: 'Primeiras Estórias' },
      { text: 'O real não está na saída nem na chegada: ele se dispõe para a gente é no meio da travessia.', source: 'Grande Sertão: Veredas' }
    ],
    active: true,
    createdAt: '2024-01-29T00:00:00.000Z'
  },
  {
    id: 'carolina-maria-de-jesus',
    name: 'Carolina Maria de Jesus',
    period: '1914 – 1977',
    role: 'Escritora, Diarista e Compositora • Sacramento (MG)',
    tag: 'Voz da Cidadania & Realidade',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Carolina_Maria_de_Jesus_1960.jpg',
    featuredQuote: 'O livro é a melhor invenção do homem. O mundo seria horrível sem a leitura.',
    quoteSource: 'Quarto de Despejo: Diário de uma Favelada',
    referenceUrl: 'https://www.casaum.org/20-escritores-e-escritoras-negras-para-ler-hoje-e-sempre/',
    additionalQuotes: [
      { text: 'Quem inventou a fome são os que comem.', source: 'Quarto de Despejo' },
      { text: 'Escrever é o meu refúgio e o meu consolo.', source: 'Diário de Bitita' },
      { text: 'Quando eu não tinha nada o que comer, em vez de xingar eu ia escrever.', source: 'Quarto de Despejo' }
    ],
    active: true,
    createdAt: '2024-02-05T00:00:00.000Z'
  },
  {
    id: 'carlos-de-assumpcao',
    name: 'Carlos de Assumpção',
    period: '1923 – presente',
    role: 'Poeta, Jurista e Mestre da Literatura Negra • Tietê (SP)',
    tag: 'Poesia de Resistência & Memória',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Carlos_de_Assump%C3%A7%C3%A3o.jpg',
    featuredQuote: 'Mesmo que me fechem todas as portas, eu entrarei pela janela das palavras.',
    quoteSource: 'Protesto',
    referenceUrl: 'https://www.casaum.org/20-escritores-e-escritoras-negras-para-ler-hoje-e-sempre/',
    additionalQuotes: [
      { text: 'Eu sou o sangue de todas as raças, sou o clamor que ecoa na garganta da noite.', source: 'Quilombo' },
      { text: 'A palavra é a arma mais potente contra o silêncio imposto.', source: 'Protestos - Poemas' }
    ],
    active: true,
    createdAt: '2024-03-01T00:00:00.000Z'
  },
  {
    id: 'cidinha-da-silva',
    name: 'Cidinha da Silva',
    period: '1967 – presente',
    role: 'Cronista, Contista e Dramaturga • Finalista Prêmio Jabuti',
    tag: 'Crônica, Ancestralidade & Cotidiano',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Programa_Autores_e_Livros_%28R%C3%A1dio_Senado%29_%28cropped%29.jpg',
    featuredQuote: 'A literatura feita por mulheres negras é um oceano de saberes ancestrais e possibilidades.',
    quoteSource: 'Cada tridente em seu lugar',
    referenceUrl: 'https://www.casaum.org/20-escritores-e-escritoras-negras-para-ler-hoje-e-sempre/',
    additionalQuotes: [
      { text: 'Você me deixe, viu? Eu vou bater meu tambor!', source: 'Você Me Deixe, Viu?' },
      { text: 'A ancestralidade não é passado estático; é semente viva que brota no hoje.', source: 'Os nove pentes d’África' }
    ],
    active: true,
    createdAt: '2024-03-02T00:00:00.000Z'
  },
  {
    id: 'cruz-e-sousa',
    name: 'Cruz e Sousa',
    period: '1861 – 1898',
    role: 'O Cisne Negro • Pai do Simbolismo Brasileiro • Florianópolis (SC)',
    tag: 'Simbolismo & Poesia Clássica',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Cruz_e_Sousa.jpg',
    featuredQuote: 'Livre! Ser livre da matéria escrava, arrancar os grilhões que nos prendem à terra!',
    quoteSource: 'Broquéis',
    referenceUrl: 'https://www.casaum.org/20-escritores-e-escritoras-negras-para-ler-hoje-e-sempre/',
    additionalQuotes: [
      { text: 'Ó Formas alvas, brancas, Formas claras de luares, de neves, de neblinas...', source: 'Antífona' },
      { text: 'Das almas tudo que é mistério palpita nas asas da poesia mais pura.', source: 'Evocações' }
    ],
    active: true,
    createdAt: '2024-03-03T00:00:00.000Z'
  },
  {
    id: 'cristiane-sobral',
    name: 'Cristiane Sobral',
    period: '1974 – presente',
    role: 'Dramaturga, Poeta e 1ª Atriz Negra graduada em Interpretação pela UnB',
    tag: 'Teatro & Poesia Negra',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=640&q=80',
    featuredQuote: 'Não vou mais lavar os pratos. Nem vou limpar a poeira dos móveis. Criei asas e palavras.',
    quoteSource: 'Não Vou Mais Lavar os Pratos',
    referenceUrl: 'https://www.casaum.org/20-escritores-e-escritoras-negras-para-ler-hoje-e-sempre/',
    additionalQuotes: [
      { text: 'Só por hoje vou deixar o meu cabelo em paz.', source: 'Só por hoje vou deixar o meu Cabelo em Paz' },
      { text: 'A nossa voz precisa ocupar os palcos, as páginas e o infinito da criação.', source: 'Espelhos, Miradouros, Dialéticas' }
    ],
    active: true,
    createdAt: '2024-03-04T00:00:00.000Z'
  },
  {
    id: 'cuti',
    name: 'Cuti (Luiz Silva)',
    period: '1951 – presente',
    role: 'Doutor em Letras pela Unicamp e Cofundador dos Cadernos Negros',
    tag: 'Quilombhoje & Resistência Poética',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=640&q=80',
    featuredQuote: 'A poesia negra é o espelho onde o nosso povo se reconhece belo, forte e insubmisso.',
    quoteSource: 'Literatura Negro-Brasileira',
    referenceUrl: 'https://www.casaum.org/20-escritores-e-escritoras-negras-para-ler-hoje-e-sempre/',
    additionalQuotes: [
      { text: 'No batuque das palavras forjamos a nossa liberdade e o nosso amanhã.', source: 'Batuque de Tocaia' },
      { text: 'Cadernos Negros não são apenas páginas, são trincheiras do espírito e da arte.', source: 'Poemas de Carapinha' }
    ],
    active: true,
    createdAt: '2024-03-05T00:00:00.000Z'
  },
  {
    id: 'esmeralda-ribeiro',
    name: 'Esmeralda Ribeiro',
    period: '1958 – presente',
    role: 'Jornalista, Escritora e Coordenadora Editorial dos Cadernos Negros',
    tag: 'Memória & Resgate Afro-Brasileiro',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Esmeralda_Ribeiro.png',
    featuredQuote: 'Quero falar de nós porque o tempo sempre nos deixou atrás das cortinas. Agora, o tempo é outro.',
    quoteSource: 'Cadernos Negros',
    referenceUrl: 'https://www.casaum.org/20-escritores-e-escritoras-negras-para-ler-hoje-e-sempre/',
    additionalQuotes: [
      { text: 'A literatura das mulheres negras resgata raízes profundas e projeta novos caminhos.', source: 'Malungos e Milongas' },
      { text: 'Orukomi: meu nome é a história que escolho narrar ao mundo.', source: 'Orukomi – Meu Nome' }
    ],
    active: true,
    createdAt: '2024-03-06T00:00:00.000Z'
  },
  {
    id: 'fabio-kabral',
    name: 'Fábio Kabral',
    period: '1980 – presente',
    role: 'Escritor de Fantasia Mitológica e Pioneiro do Afrofuturismo no Brasil',
    tag: 'Afrofuturismo & Mitologia Iorubá',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=640&q=80',
    featuredQuote: 'O afrofuturismo resgata nossa mitologia ancestral para construir um futuro onde sejamos protagonistas.',
    quoteSource: 'O Caçador Cibernético da Rua 13',
    referenceUrl: 'https://www.casaum.org/20-escritores-e-escritoras-negras-para-ler-hoje-e-sempre/',
    additionalQuotes: [
      { text: 'A magia dos orixás vibra na tecnologia do amanhã, desafiando o impossível.', source: 'A Cientista Guerreira do Facão Furioso' },
      { text: 'Imaginar futuros negros é o primeiro passo para conquistá-los no presente.', source: 'Ritos de Passagem' }
    ],
    active: true,
    createdAt: '2024-03-07T00:00:00.000Z'
  },
  {
    id: 'jarid-arraes',
    name: 'Jarid Arraes',
    period: '1991 – presente',
    role: 'Cordelista, Contista e Poeta • Vencedora do Prêmio APCA de Literatura',
    tag: 'Cordel Nordestino & Prosa Feminista',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/PREMIO_APCA_DE_LITERATURA_2019_CATEGORIA_CONTOS_-_CR%C3%94NICAS_%22Redemoinho_em_dia_quente_-_Jarid_Arraes%22.png/640px-PREMIO_APCA_DE_LITERATURA_2019_CATEGORIA_CONTOS_-_CR%C3%94NICAS_%22Redemoinho_em_dia_quente_-_Jarid_Arraes%22.png',
    featuredQuote: 'A literatura de cordel é a voz viva do sertão: uma arte de encantar e libertar consciências.',
    quoteSource: 'Redemoinho em Dia Quente',
    referenceUrl: 'https://www.casaum.org/20-escritores-e-escritoras-negras-para-ler-hoje-e-sempre/',
    additionalQuotes: [
      { text: 'Heroínas negras do Brasil têm suas histórias cravadas na madeira viva do cordel.', source: 'As Lendas de Dandara' },
      { text: 'Nas esquinas do Cariri, cada verso carrega a poeira e o sol da coragem.', source: 'Um Buraco com Meu Nome' }
    ],
    active: true,
    createdAt: '2024-03-08T00:00:00.000Z'
  },
  {
    id: 'kiusam-de-oliveira',
    name: 'Kiusam de Oliveira',
    period: '1965 – presente',
    role: 'Doutora em Educação pela USP, Iyalorixá e Autora Infantojuvenil Premiada',
    tag: 'Educação Antirracista & Infância',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Kiusam_Oliveira.jpg',
    featuredQuote: 'O black power é a coroa que a ancestralidade colocou sobre as nossas cabeças.',
    quoteSource: 'O Mundo no Black Power de Tayó',
    referenceUrl: 'https://www.casaum.org/20-escritores-e-escritoras-negras-para-ler-hoje-e-sempre/',
    additionalQuotes: [
      { text: 'Meninas e meninos negros merecem crescer sabendo que descendem de rainhas e reis.', source: 'Omo-Oba: Histórias de Princesas' },
      { text: 'Educar para a diversidade étnico-racial é semear amor próprio, justiça e dignidade.', source: 'Yabas, Mulheres Negras, Deusas' }
    ],
    active: true,
    createdAt: '2024-03-09T00:00:00.000Z'
  },
  {
    id: 'joel-rufino-dos-santos',
    name: 'Joel Rufino dos Santos',
    period: '1941 – 2015',
    role: 'Historiador, Professor da UFRJ e Escritor • Bicampeão do Prêmio Jabuti',
    tag: 'História, Resistência & Cidadania',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=640&q=80',
    featuredQuote: 'A história do Brasil não pode ser contada sem as mãos e os sonhos daqueles que ergueram este país.',
    quoteSource: 'História Nova do Brasil',
    referenceUrl: 'https://www.casaum.org/20-escritores-e-escritoras-negras-para-ler-hoje-e-sempre/',
    additionalQuotes: [
      { text: 'Zumbi dos Palmares não pertence ao museu do passado; é bússola para o nosso tempo.', source: 'Zumbi' },
      { text: 'A literatura infantojuvenil é a forma mais generosa de semear esperança para o amanhã.', source: 'Quando eu Voltei, eu Tive uma Surpresa' }
    ],
    active: true,
    createdAt: '2024-03-10T00:00:00.000Z'
  },
  {
    id: 'lu-ain-zaila',
    name: 'Lu Ain-Zaila',
    period: '1980 – presente',
    role: 'Pedagoga pela UERJ e Escritora de Afrofuturismo e Ficção Científica',
    tag: 'Ficção Científica Afrofuturista',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Lu_Ain-Zaila.png',
    featuredQuote: 'O futuro precisa ser sonhado em tons escuros, com tecnologia, ciência e sabedoria ancestral.',
    quoteSource: 'Sankofia: breves histórias afrofuturistas',
    referenceUrl: 'https://www.casaum.org/20-escritores-e-escritoras-negras-para-ler-hoje-e-sempre/',
    additionalQuotes: [
      { text: 'O princípio do Sankofa nos ensina que voltar às raízes é o caminho mais seguro para voar alto.', source: 'Duologia Brasil 2048' },
      { text: 'Ìségún significa vencer o apagamento histórico através da imaginação ilimitada.', source: 'Ìségún' }
    ],
    active: true,
    createdAt: '2024-03-11T00:00:00.000Z'
  },
  {
    id: 'julio-emilio-braz',
    name: 'Júlio Emílio Braz',
    period: '1959 – presente',
    role: 'Autor Infantojuvenil e Roteirista • Prêmio Jabuti & Austrian Children’s Book Prize',
    tag: 'Literatura Juvenil & Consciência Social',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=640&q=80',
    featuredQuote: 'Ler abre portas que ninguém mais pode fechar dentro da sua mente.',
    quoteSource: 'Pivete',
    referenceUrl: 'https://www.casaum.org/20-escritores-e-escritoras-negras-para-ler-hoje-e-sempre/',
    additionalQuotes: [
      { text: 'A vida dos jovens das periferias merece ser contada com verdade, respeito e poesia.', source: 'Pivete' },
      { text: 'Luís Gama mostrou que a palavra e o saber são os maiores instrumentos de libertação.', source: 'Luís Gama, de escravo a libertador' }
    ],
    active: true,
    createdAt: '2024-03-12T00:00:00.000Z'
  },
  {
    id: 'maria-firmina-dos-reis',
    name: 'Maria Firmina dos Reis',
    period: '1822 – 1917',
    role: 'Pioneira do Romance no Brasil e Mestra Régia • Primeira Romancista Negra',
    tag: 'Patrona do Abolicionismo Literário',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Maria_firmina_%28detailed%29.jpg',
    featuredQuote: 'Metei a mão na consciência, ó homens da terra! Não vedes que os negros também são filhos do mesmo Deus?',
    quoteSource: 'Úrsula (1859)',
    referenceUrl: 'https://www.casaum.org/20-escritores-e-escritoras-negras-para-ler-hoje-e-sempre/',
    additionalQuotes: [
      { text: 'Mesquinho e humilde livro é este que vos apresento. Sei que pouco vale, mas brotou sincero do coração.', source: 'Úrsula' },
      { text: 'A liberdade é um dom divino que nenhuma tirania humana tem o poder moral de arrancar.', source: 'Cantos à Beira-Mar' }
    ],
    active: true,
    createdAt: '2024-03-13T00:00:00.000Z'
  },
  {
    id: 'michel-yakini',
    name: 'Michel Yakini',
    period: '1980 – presente',
    role: 'Escritor, Arte-Educador e Coidealizador do Sarau Elo da Corrente',
    tag: 'Literatura Periférica & Saraus',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=640&q=80',
    featuredQuote: 'Nas quebradas do mundo, o verso acorda o povo e a poesia se torna banquete para a alma.',
    quoteSource: 'Acorde um Verso',
    referenceUrl: 'https://www.casaum.org/20-escritores-e-escritoras-negras-para-ler-hoje-e-sempre/',
    additionalQuotes: [
      { text: 'O sarau é a praça pública onde a palavra se faz festa, denúncia e abraço.', source: 'Crônicas de um Peladeiro' },
      { text: 'Escrever nas bordas da cidade é reinventar o centro com a nossa própria verdade.', source: 'Desencontros' }
    ],
    active: true,
    createdAt: '2024-03-14T00:00:00.000Z'
  },
  {
    id: 'mel-duarte',
    name: 'Mel Duarte',
    period: '1988 – presente',
    role: 'Poeta, Slammer, Comunicadora • Campeã Internacional do Rio Poetry Slam',
    tag: 'Spoken Word & Poesia Marginal',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Mel_Duarte_arquivo_pessoal.jpg',
    featuredQuote: 'Não me calo, não me curvo, não aceito o papel que tentaram me reservar. Eu sou a minha própria voz.',
    quoteSource: 'Negra, Nua e Crua',
    referenceUrl: 'https://www.casaum.org/20-escritores-e-escritoras-negras-para-ler-hoje-e-sempre/',
    additionalQuotes: [
      { text: 'Querem nos calar, mas esqueceram que os nossos poemas nasceram para ecoar em alto e bom som.', source: 'Querem nos Calar' },
      { text: 'A poesia nos vagões acorda a cidade adormecida pelo cansaço do dia a dia.', source: 'Fragmentos Dispersos' }
    ],
    active: true,
    createdAt: '2024-03-15T00:00:00.000Z'
  },
  {
    id: 'nei-lopes',
    name: 'Nei Lopes',
    period: '1942 – presente',
    role: 'Compositor, Historiador, Jurista e Poeta • Prêmio Jabuti & Ordem do Mérito Cultural',
    tag: 'Enciclopédia Negra & Samba',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Nei_Lopes.jpg',
    featuredQuote: 'O samba é a crônica cantada da alma negra, um tratado de filosofia, resistência e festa.',
    quoteSource: 'Casos Crioulos',
    referenceUrl: 'https://www.casaum.org/20-escritores-e-escritoras-negras-para-ler-hoje-e-sempre/',
    additionalQuotes: [
      { text: 'A literatura me deu a liberdade plena de pensamento que nenhuma outra fronteira conseguiu barrar.', source: 'Incursões sobre a Pele' },
      { text: 'Mergulhar na história africana é compreender a raiz de toda a riqueza cultural do povo brasileiro.', source: 'A Lua Triste Descamba' }
    ],
    active: true,
    createdAt: '2024-03-16T00:00:00.000Z'
  },
  {
    id: 'ruth-guimaraes',
    name: 'Ruth Guimarães',
    period: '1920 – 2014',
    role: 'Romancista, Folclorista e Tradutora • Membro da Academia Paulista de Letras',
    tag: 'Folclore Brasileiro & Prosa Caipira',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=640&q=80',
    featuredQuote: 'A vida simples do campo guarda segredos profundos que só a literatura sabe decifrar com ternura.',
    quoteSource: 'Água Funda',
    referenceUrl: 'https://www.casaum.org/20-escritores-e-escritoras-negras-para-ler-hoje-e-sempre/',
    additionalQuotes: [
      { text: 'O folclore não é cinza de museu, mas chama viva que alimenta o imaginário popular.', source: 'Contos de Cidadezinha' },
      { text: 'A palavra dita com sabedoria e pureza atravessa montanhas e séculos.', source: 'Crônicas Valeparaibanas' }
    ],
    active: true,
    createdAt: '2024-03-17T00:00:00.000Z'
  },
  {
    id: 'oswaldo-camargo',
    name: 'Oswaldo de Camargo',
    period: '1936 – presente',
    role: 'Poeta, Jornalista e Historiador da Imprensa Negra no Brasil',
    tag: 'Imprensa Negra & Poesia Contemporânea',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=640&q=80',
    featuredQuote: 'Em cada verso negro há o eco de séculos de esperança, beleza e luta pela dignidade humana.',
    quoteSource: '15 Poemas Negros',
    referenceUrl: 'https://www.casaum.org/20-escritores-e-escritoras-negras-para-ler-hoje-e-sempre/',
    additionalQuotes: [
      { text: 'A imprensa negra registrou a ferro e fogo o direito sagrado à nossa plena cidadania.', source: 'O Carro do Êxito' },
      { text: 'O estranho não é o homem negro; estranho é o mundo que não contempla a sua humanidade.', source: 'O Estranho' }
    ],
    active: true,
    createdAt: '2024-03-18T00:00:00.000Z'
  },
  {
    id: 'plinio-camillo',
    name: 'Plínio Camillo',
    period: '1960 – presente',
    role: 'Escritor, Ator, Dramaturgo e Educador Social • Premiado pelo ProAC',
    tag: 'Teatro & Narrativa Jovem Contemporânea',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=640&q=80',
    featuredQuote: 'Escrever é dar voz a quem o mundo tenta silenciar, unindo o palco da vida à ternura das palavras.',
    quoteSource: 'Coração Peludo',
    referenceUrl: 'https://www.casaum.org/20-escritores-e-escritoras-negras-para-ler-hoje-e-sempre/',
    additionalQuotes: [
      { text: 'A literatura para jovens precisa falar direto ao peito, sem rodeios e com afeto.', source: 'O Namorado do Papai Ronca' },
      { text: 'Outras vozes precisam ecoar nas escolas para que todos se sintam representados.', source: 'Outras Vozes' }
    ],
    active: true,
    createdAt: '2024-03-19T00:00:00.000Z'
  },
  {
    id: 'ariano-suassuna',
    name: 'Ariano Suassuna',
    period: '1927 – 2014',
    role: 'Dramaturgo e Romancista',
    tag: 'Cultura Popular Armorial',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Ariano_Suassuna_%281980%29.jpg',
    featuredQuote: 'O otimista é um tolo. O pessimista, um chato. Bom mesmo é ser um realista esperançoso.',
    quoteSource: 'Auto da Compadecida',
    additionalQuotes: [
      { text: 'Arte para mim não é produto de mercado. É expressão da alma e do povo.', source: 'Movimento Armorial' },
      { text: 'Não troco o meu oxente pelo ok de ninguém.', source: 'Aulas-Espetáculo' }
    ],
    active: true,
    createdAt: '2024-02-12T00:00:00.000Z'
  },
  {
    id: 'cora-coralina',
    name: 'Cora Coralina',
    period: '1889 – 1985',
    role: 'Poetisa e Contista',
    tag: 'Sabedoria da Terra',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/pt/d/db/Cora_Coralina.jpg',
    featuredQuote: 'Não sei se a vida é curta ou longa para nós, mas sei que nada do que vivemos tem sentido se não tocamos o coração das pessoas.',
    quoteSource: 'Poemas dos Becos de Goiás',
    additionalQuotes: [
      { text: 'Feliz aquele que transfere o que sabe e aprende o que ensina.', source: 'Vintém de Cobre' },
      { text: 'Recria tua vida, sempre, sempre. Remove pedras e planta roseiras e faz doces. Recomeça.', source: 'Estórias da Casa Velha da Ponte' }
    ],
    active: true,
    createdAt: '2024-02-19T00:00:00.000Z'
  }
];

const STORAGE_KEY = 'cecmq_featured_authors';
const PINNED_STORAGE_KEY = 'cecmq_pinned_author_id';
const CUSTOM_EVENT_NAME = 'cecmq_authors_updated';

export function getStoredAuthors(): AuthorItem[] {
  if (typeof window === 'undefined') return DEFAULT_AUTHORS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_AUTHORS));
      return DEFAULT_AUTHORS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Mescla novos autores do DEFAULT_AUTHORS que ainda não estejam na lista gravada
      const existingIds = new Set(parsed.map((a: AuthorItem) => a.id));
      const missingAuthors = DEFAULT_AUTHORS.filter((a) => !existingIds.has(a.id));

      let updated = parsed.map((a: AuthorItem) => {
        // Atualiza autores específicos se necessário
        if (a.id === 'manoel-de-barros' && a.featuredQuote === 'O meu quintal é maior do que o mundo.') {
          return {
            ...a,
            featuredQuote: 'Sentia mais prazer de brincar com as palavras do que de pensar com elas',
            quoteSource: 'Poeminha em língua de brincar'
          };
        }
        // Se Carolina Maria de Jesus estiver sem link de referência, enriquece com a referência
        if (a.id === 'carolina-maria-de-jesus' && !a.referenceUrl) {
          const defaultCarolina = DEFAULT_AUTHORS.find((x) => x.id === 'carolina-maria-de-jesus');
          return {
            ...a,
            referenceUrl: defaultCarolina?.referenceUrl,
            role: defaultCarolina?.role || a.role,
            tag: defaultCarolina?.tag || a.tag
          };
        }
        if (a.id === 'cora-coralina' && (!a.photoUrl || a.photoUrl.includes('commons/3/30'))) {
          return {
            ...a,
            photoUrl: 'https://upload.wikimedia.org/wikipedia/pt/d/db/Cora_Coralina.jpg'
          };
        }
        // Migração de fotos do Wikimedia para links diretos funcionais (sem thumb que dá erro 400)
        const def = DEFAULT_AUTHORS.find((x) => x.id === a.id);
        if (def && a.photoUrl && a.photoUrl.includes('/thumb/') && a.photoUrl.includes('wikimedia.org')) {
          return {
            ...a,
            photoUrl: def.photoUrl
          };
        }
        return a;
      });

      if (missingAuthors.length > 0) {
        updated = [...updated, ...missingAuthors];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    }
    return DEFAULT_AUTHORS;
  } catch (e) {
    console.error('Erro ao ler autores do localStorage:', e);
    return DEFAULT_AUTHORS;
  }
}

export function saveStoredAuthors(authors: AuthorItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authors));
    window.dispatchEvent(new Event(CUSTOM_EVENT_NAME));
  } catch (e) {
    console.error('Erro ao salvar autores no localStorage:', e);
  }
}

export function getPinnedAuthorId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(PINNED_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setPinnedAuthorId(id: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (id) {
      localStorage.setItem(PINNED_STORAGE_KEY, id);
    } else {
      localStorage.removeItem(PINNED_STORAGE_KEY);
    }
    window.dispatchEvent(new Event(CUSTOM_EVENT_NAME));
  } catch (e) {
    console.error('Erro ao salvar autor fixado:', e);
  }
}

/**
 * Logística Semanal:
 * Verifica a data atual e calcula automaticamente o autor da semana.
 * A cada Segunda-feira às 00:00 a semana muda determinísticamente,
 * selecionando o próximo autor da lista de escritores.
 */
export function calculateWeeklyAuthorData(
  authorsList?: AuthorItem[],
  customDate?: Date
): {
  author: AuthorItem;
  authorIndex: number;
  totalActiveAuthors: number;
  mondayDate: Date;
  sundayDate: Date;
  isMondayToday: boolean;
  isPinned: boolean;
  weekLabel: string;
} {
  const allAuthors = authorsList && authorsList.length > 0 ? authorsList : getStoredAuthors();
  const activeAuthors = allAuthors.filter((a) => a.active !== false);
  const fallbackAuthors = activeAuthors.length > 0 ? activeAuthors : DEFAULT_AUTHORS;

  const pinnedId = getPinnedAuthorId();
  if (pinnedId) {
    const pinned = fallbackAuthors.find((a) => a.id === pinnedId);
    if (pinned) {
      const now = customDate ? new Date(customDate) : new Date();
      const day = now.getDay();
      const diffToMonday = (day + 6) % 7;
      const monday = new Date(now);
      monday.setDate(now.getDate() - diffToMonday);
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      const weekLabel = `${monday.getDate()} a ${sunday.getDate()} de ${monthNames[monday.getMonth()]}`;

      return {
        author: pinned,
        authorIndex: fallbackAuthors.indexOf(pinned),
        totalActiveAuthors: fallbackAuthors.length,
        mondayDate: monday,
        sundayDate: sunday,
        isMondayToday: day === 1,
        isPinned: true,
        weekLabel: `${weekLabel} (Destaque Fixado)`
      };
    }
  }

  // Data atual verificada
  const d = customDate ? new Date(customDate) : new Date();

  // No JavaScript Date: Domingo = 0, Segunda = 1, Terça = 2, ..., Sábado = 6
  const dayOfWeek = d.getDay();
  // Dias transcorridos desde a segunda-feira da semana atual:
  // Se for Domingo (0), a última segunda foi há 6 dias: (0 + 6) % 7 = 6
  // Se for Segunda (1), a segunda é hoje: (1 + 6) % 7 = 0
  // Se for Terça (2), a segunda foi ontem: (2 + 6) % 7 = 1
  const diffToMonday = (dayOfWeek + 6) % 7;

  const monday = new Date(d);
  monday.setDate(d.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  // Segunda-feira de referência fixa para cálculo ininterrupto
  const epochMonday = new Date(2024, 0, 1, 0, 0, 0, 0); // 01/01/2024 foi uma Segunda-feira
  const diffMilliseconds = monday.getTime() - epochMonday.getTime();
  const weeksSinceEpoch = Math.max(0, Math.floor(diffMilliseconds / (7 * 24 * 60 * 60 * 1000)));

  // Índice do autor muda toda segunda-feira automaticamente
  const authorIndex = weeksSinceEpoch % fallbackAuthors.length;
  const author = fallbackAuthors[authorIndex];

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekLabel = `${monday.getDate()} a ${sunday.getDate()} de ${monthNames[monday.getMonth()]}`;
  const isMondayToday = dayOfWeek === 1;

  return {
    author,
    authorIndex,
    totalActiveAuthors: fallbackAuthors.length,
    mondayDate: monday,
    sundayDate: sunday,
    isMondayToday,
    isPinned: false,
    weekLabel
  };
}

export function subscribeToAuthorsUpdate(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener(CUSTOM_EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(CUSTOM_EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}
