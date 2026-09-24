import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  HandMetal,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Eye,
  Check,
  Search,
  VolumeX,
  Clock,
  ArrowRight,
  Maximize2,
  Minimize2,
  Copy,
  ExternalLink,
} from 'lucide-react';

interface LibrasAccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

// Visual Communication Cards for the Library Front Desk (CAA)
interface CommunicationCard {
  id: string;
  category: 'emprestimo' | 'atendimento' | 'aluno' | 'espaco';
  title: string;
  librasDica: string;
  icon: string;
  fullMessage: string;
}

const COMMUNICATION_CARDS: CommunicationCard[] = [
  {
    id: 'card-1',
    category: 'emprestimo',
    title: 'Quero emprestar este livro',
    librasDica: 'Sinal de [LIVRO] + [PEGAR / QUERER]',
    icon: '📖',
    fullMessage: 'Olá! Gostaria de pegar este livro emprestado no meu cadastro de aluno, por favor.',
  },
  {
    id: 'card-2',
    category: 'emprestimo',
    title: 'Vim devolver um livro',
    librasDica: 'Sinal de [LIVRO] + [ENTREGAR / DEVOLVER]',
    icon: '📥',
    fullMessage: 'Olá! Vim fazer a devolução deste livro que li. Por favor, pode registrar a baixa?',
  },
  {
    id: 'card-3',
    category: 'emprestimo',
    title: 'Quero renovar o prazo',
    librasDica: 'Sinal de [TEMPO / PRAZO] + [CONTINUAR / MAIS]',
    icon: '⏳',
    fullMessage: 'Olá! Ainda estou lendo este livro. Gostaria de renovar o prazo de entrega por mais 7 dias.',
  },
  {
    id: 'card-4',
    category: 'emprestimo',
    title: 'Qual a data de devolução?',
    librasDica: 'Sinal de [DIA / DATA] + [DEVOLVER] + [PERGUNTA]',
    icon: '📅',
    fullMessage: 'Poderia conferir no sistema qual é a data limite para eu devolver meus livros emprestados?',
  },
  {
    id: 'card-5',
    category: 'atendimento',
    title: 'Preciso de ajuda para achar um livro',
    librasDica: 'Sinal de [PROCURAR] + [LIVRO] + [AJUDA]',
    icon: '🔍',
    fullMessage: 'Estou procurando um livro específico no acervo. Você poderia me orientar em qual estante ele fica?',
  },
  {
    id: 'card-6',
    category: 'atendimento',
    title: 'Onde ficam Literatura e Poesia?',
    librasDica: 'Sinal de [LIVRO] + [HISTÓRIA / POESIA] + [ONDE]',
    icon: '📚',
    fullMessage: 'Gostaria de saber onde estão organizados os livros de Literatura Brasileira e Poesias.',
  },
  {
    id: 'card-7',
    category: 'atendimento',
    title: 'Onde ficam Gibis e Quadrinhos?',
    librasDica: 'Sinal de [DESENHO] + [HISTÓRIA EM QUADRINHOS]',
    icon: '🎨',
    fullMessage: 'Onde fica a seção de Histórias em Quadrinhos, Mangás e Gibis da biblioteca?',
  },
  {
    id: 'card-8',
    category: 'atendimento',
    title: 'Quero sugerir a compra de um livro',
    librasDica: 'Sinal de [IDÉIA] + [LIVRO NOVO] + [COMPRAR]',
    icon: '💡',
    fullMessage: 'Gostaria de enviar uma sugestão de novo livro para o acervo da nossa biblioteca escolar.',
  },
  {
    id: 'card-9',
    category: 'aluno',
    title: 'Qual é o meu código de aluno?',
    librasDica: 'Sinal de [NÚMERO / CÓDIGO] + [ESTUDANTE]',
    icon: '🪪',
    fullMessage: 'Esqueci meu código de estudante (ALU-...). Você poderia consultar pelo meu nome completo?',
  },
  {
    id: 'card-10',
    category: 'aluno',
    title: 'Quero ver minha Carteirinha',
    librasDica: 'Sinal de [DOCUMENTO / CARTÃO] + [ESTUDANTE]',
    icon: '🎫',
    fullMessage: 'Gostaria de visualizar ou imprimir minha Carteirinha de Leitor com meu QR Code.',
  },
  {
    id: 'card-11',
    category: 'espaco',
    title: 'Onde posso ler em silêncio?',
    librasDica: 'Sinal de [SILÊNCIO] + [LUGAR / MESA] + [LER]',
    icon: '🤫',
    fullMessage: 'Qual é o melhor local ou mesa na biblioteca para estudo individual e leitura em silêncio?',
  },
  {
    id: 'card-12',
    category: 'espaco',
    title: 'Posso usar a mesa para estudo em grupo?',
    librasDica: 'Sinal de [GRUPO] + [ESTUDAR JUNTOS] + [PODE?]',
    icon: '👥',
    fullMessage: 'Minha turma gostaria de usar uma mesa para fazer um trabalho escolar em conjunto. Está liberado?',
  },
];

// Libras Fingerspelling (Datilologia) mapping with visual SVG descriptions
interface DatilologiaLetter {
  char: string;
  description: string;
  hint: string;
}

const DATILOLOGIA_ALPHABET: DatilologiaLetter[] = [
  { char: 'A', description: 'Mão fechada com o polegar encostado na lateral do indicador voltado para cima.', hint: 'Polegar para cima na lateral' },
  { char: 'B', description: 'Quatro dedos estendidos para cima e juntos; o polegar dobrado sobre a palma.', hint: 'Quatro dedos estendidos' },
  { char: 'C', description: 'Mão curvada em formato da letra C com a palma voltada para a frente.', hint: 'Formato da letra C' },
  { char: 'D', description: 'Dedo indicador esticado para cima; os outros dedos formam um círculo com o polegar.', hint: 'Indicador para cima' },
  { char: 'E', description: 'Dedos dobrados com as pontas tocando o polegar na base.', hint: 'Dedos recolhidos' },
  { char: 'F', description: 'Indicador dobrado com o polegar por FORA apoiado sobre ele.', hint: 'Polegar por fora (F)' },
  { char: 'G', description: 'Indicador para cima e polegar paralelo apontando para o lado.', hint: 'Formato angular' },
  { char: 'H', description: 'Dedos indicador e médio esticados para frente com giro de pulso.', hint: 'Dois dedos com rotação' },
  { char: 'I', description: 'Mão fechada com apenas o dedo mindinho esticado para cima.', hint: 'Dedo mindinho' },
  { char: 'J', description: 'Dedo mindinho desenhando a letra J no ar.', hint: 'Mindinho desenha J' },
  { char: 'K', description: 'Indicador e médio para cima com polegar no meio, movimento para cima.', hint: 'Dedos em V com polegar' },
  { char: 'L', description: 'Indicador para cima e polegar para o lado formando a letra L.', hint: 'Formato clássico em L' },
  { char: 'M', description: 'Três dedos voltados para baixo com o polegar escondido.', hint: 'Três dedos para baixo' },
  { char: 'N', description: 'Dois dedos voltados para baixo.', hint: 'Dois dedos para baixo' },
  { char: 'O', description: 'Todos os dedos unidos formando um círculo perfeito.', hint: 'Círculo fechado' },
  { char: 'P', description: 'Configuração em K voltada para baixo.', hint: 'Em K para baixo' },
  { char: 'Q', description: 'Indicador e polegar apontados para baixo.', hint: 'Em G para baixo' },
  { char: 'R', description: 'Dedos indicador e médio cruzados.', hint: 'Dedos cruzados' },
  { char: 'S', description: 'Mão fechada em punho com o polegar cruzado sobre os dedos.', hint: 'Punho fechado' },
  { char: 'T', description: 'Indicador dobrado com o polegar por DENTRO.', hint: 'Polegar por dentro (T)' },
  { char: 'U', description: 'Indicador e médio esticados e juntos para cima.', hint: 'Dois dedos juntos' },
  { char: 'V', description: 'Indicador e médio esticados e separados em V.', hint: 'Sinal da vitória / V' },
  { char: 'W', description: 'Indicador, médio e anelar esticados em W.', hint: 'Três dedos abertos' },
  { char: 'X', description: 'Indicador em forma de gancho puxando para trás.', hint: 'Gancho puxando' },
  { char: 'Y', description: 'Polegar e mindinho esticados (shaka), movendo para cima.', hint: 'Polegar e mindinho' },
  { char: 'Z', description: 'Dedo indicador desenhando a letra Z no ar.', hint: 'Indicador traça o Z' },
];

// Essential Library Libras Glossary
interface LibraryLibrasSign {
  term: string;
  icon: string;
  category: string;
  signDescription: string;
  videoTip: string;
}

const LIBRARY_SIGNS: LibraryLibrasSign[] = [
  {
    term: 'Livro',
    icon: '📖',
    category: 'Acervo',
    signDescription: 'Palmas das mãos juntas à frente do peito, abrindo-se pelas laterais como as páginas de um livro.',
    videoTip: 'Sinal icônico muito natural e de fácil identificação.',
  },
  {
    term: 'Biblioteca',
    icon: '🏛️',
    category: 'Espaço',
    signDescription: 'Configuração da mão em "B", fazendo um movimento circular horizontal suave, ou sinal de [LIVRO] + [CASA / GUARDAR].',
    videoTip: 'Representa a casa guardiã de todos os livros.',
  },
  {
    term: 'Ler / Leitura',
    icon: '👓',
    category: 'Ação',
    signDescription: 'Mão em "V" (dois dedos) apontando para a palma da outra mão aberta, descendo como olhos que leem linhas.',
    videoTip: 'Os dedos em V simulam o olhar percorrendo o texto.',
  },
  {
    term: 'Estudar',
    icon: '✍️',
    category: 'Ação',
    signDescription: 'Palma da mão batendo levemente sobre a outra mão aberta várias vezes de forma contínua e dedicada.',
    videoTip: 'Transmite o empenho do aprendizado escolar.',
  },
  {
    term: 'Silêncio',
    icon: '🤫',
    category: 'Regra',
    signDescription: 'Dedo indicador estendido na frente dos lábios fechados, com expressão facial serena.',
    videoTip: 'Regra de ouro para a concentração de todos.',
  },
  {
    term: 'História / Narrativa',
    icon: '📜',
    category: 'Gênero',
    signDescription: 'Mãos abertas com dedos em movimento ondulado saindo da cabeça para a frente.',
    videoTip: 'Simula as ideias e narrativas que viajam pelo tempo.',
  },
  {
    term: 'Obrigado(a)',
    icon: '🤝',
    category: 'Cortesia',
    signDescription: 'Mão aberta toca suavemente a testa e depois se estende para a frente em direção à pessoa.',
    videoTip: 'Gesto universal de respeito e gratidão em Libras.',
  },
  {
    term: 'Por Favor / Licença',
    icon: '🙏',
    category: 'Cortesia',
    signDescription: 'Palmas das mãos unidas esfregando-se suavemente ou mão aberta partindo do peito para frente.',
    videoTip: 'Usado sempre ao iniciar o atendimento no balcão.',
  },
];

export const LibrasAccessibilityModal: React.FC<LibrasAccessibilityModalProps> = ({
  isOpen,
  onClose,
  isDark = true,
}) => {
  const [activeTab, setActiveTab] = useState<'vlibras' | 'balcao' | 'datilologia' | 'dicionario'>('balcao');
  const [selectedCard, setSelectedCard] = useState<CommunicationCard | null>(COMMUNICATION_CARDS[0]);
  const [isFullscreenCard, setIsFullscreenCard] = useState(false);
  const [spellingText, setSpellingText] = useState('MARIA QUITERIA');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<DatilologiaLetter | null>(DATILOLOGIA_ALPHABET[0]);
  const [visualAlertsEnabled, setVisualAlertsEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bmq_visual_alerts') === 'true';
    }
    return true;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bmq_visual_alerts', visualAlertsEnabled ? 'true' : 'false');
    }
  }, [visualAlertsEnabled]);

  if (!isOpen) return null;

  const handleOpenVLibrasDirectly = () => {
    // Attempt to trigger the native VLibras access button in the DOM
    const vlibrasBtn = document.querySelector('[vw-access-button]') as HTMLElement;
    if (vlibrasBtn) {
      vlibrasBtn.click();
    } else {
      // Trigger fallback event
      window.dispatchEvent(new CustomEvent('open_vlibras_widget'));
    }
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Clean letters for spelling simulator
  const lettersToSpell = spellingText
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split('')
    .filter((char) => /[A-Z]/.test(char) || char === ' ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 animate-in fade-in">
      <div
        className={`w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden animate-in zoom-in-95 ${
          isDark ? 'bg-[#001424] border-[#163650] text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* MODAL HEADER */}
        <div className={`p-4 sm:p-6 border-b flex items-center justify-between gap-3 ${
          isDark ? 'bg-[#00101c]/90 border-[#163650]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <HandMetal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                  Acessibilidade & Libras
                </h2>
                <span className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  Inclusão Total
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Tradutor VLibras, prancha de atendimento visual (CAA) e datilologia escolar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenVLibrasDirectly}
              title="Abrir o avatar 3D do VLibras na tela"
              className="px-3 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 text-blue-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>🤟</span>
              <span className="hidden sm:inline">Abrir VLibras 3D</span>
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 border-b overflow-x-auto text-xs font-bold no-scrollbar ${
          isDark ? 'bg-[#051827] border-[#163650]' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setActiveTab('balcao')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'balcao'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Balcão Visual (CAA)</span>
          </button>

          <button
            onClick={() => setActiveTab('datilologia')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'datilologia'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <HandMetal className="w-4 h-4" />
            <span>Alfabeto em Libras (A-Z)</span>
          </button>

          <button
            onClick={() => setActiveTab('dicionario')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'dicionario'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Sinais da Biblioteca</span>
          </button>

          <button
            onClick={() => setActiveTab('vlibras')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'vlibras'
                ? 'bg-blue-500 text-white font-black shadow-md'
                : isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Como Usar o VLibras 3D</span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: BALCÃO VISUAL (CAA - COMUNICAÇÃO RÁPIDA) */}
          {activeTab === 'balcao' && (
            <div className="space-y-6">
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isDark ? 'bg-[#092032] border-[#163650]' : 'bg-emerald-50/70 border-emerald-200'
              }`}>
                <div className="space-y-1">
                  <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <span>👋 Cartões de Comunicação Rápida para o Balcão</span>
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Toque em qualquer cartão abaixo para visualizá-lo em destaque e apresentá-lo ao bibliotecário no balcão de atendimento.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={visualAlertsEnabled}
                      onChange={(e) => setVisualAlertsEnabled(e.target.checked)}
                      className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      Feedback 100% Visual Ativo
                    </span>
                  </label>
                </div>
              </div>

              {/* ACTIVE CARD PREVIEW */}
              {selectedCard && (
                <div
                  className={`rounded-3xl border p-5 sm:p-6 transition-all shadow-xl relative overflow-hidden ${
                    isFullscreenCard ? 'ring-4 ring-emerald-400' : ''
                  } ${
                    isDark
                      ? 'bg-gradient-to-br from-[#092b42] to-[#041624] border-emerald-500/40 shadow-emerald-950/40'
                      : 'bg-gradient-to-br from-white to-emerald-50 border-emerald-300 shadow-emerald-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl sm:text-4xl p-2.5 rounded-2xl bg-white/10 shadow-sm">
                        {selectedCard.icon}
                      </span>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                          {selectedCard.category.toUpperCase()}
                        </span>
                        <h4 className={`text-lg sm:text-xl font-extrabold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {selectedCard.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyMessage(selectedCard.fullMessage)}
                        title="Copiar texto da mensagem"
                        className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          copiedNotification
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                            : isDark
                            ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                            : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                        }`}
                      >
                        {copiedNotification ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span className="hidden sm:inline">{copiedNotification ? 'Copiado!' : 'Copiar'}</span>
                      </button>

                      <button
                        onClick={() => setIsFullscreenCard(!isFullscreenCard)}
                        title="Expandir tamanho do cartão"
                        className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isDark ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white' : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {isFullscreenCard ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* High Contrast Message Display for the Librarian */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border mb-3 ${
                      isDark ? 'bg-[#00101c]/80 border-[#163650]' : 'bg-white border-slate-200 shadow-inner'
                    }`}
                  >
                    <p className={`font-semibold leading-relaxed ${
                      isFullscreenCard ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
                    } ${isDark ? 'text-emerald-300' : 'text-emerald-950'}`}>
                      "{selectedCard.fullMessage}"
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="flex items-center gap-2 text-amber-400 font-medium">
                      <span>🤟 Dica em Libras:</span>
                      <strong className="underline underline-offset-2">{selectedCard.librasDica}</strong>
                    </span>

                    <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Mostre esta tela diretamente no balcão de empréstimos
                    </span>
                  </div>
                </div>
              )}

              {/* GRID OF CARDS */}
              <div className="space-y-3">
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Toque para selecionar a mensagem:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {COMMUNICATION_CARDS.map((card) => {
                    const isSelected = selectedCard?.id === card.id;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => setSelectedCard(card)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-500/15 shadow-md ring-2 ring-emerald-400/40'
                            : isDark
                            ? 'bg-[#092032] border-[#163650] hover:border-emerald-500/40 hover:bg-[#0c283f]'
                            : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50 shadow-sm'
                        }`}
                      >
                        <span className="text-2xl shrink-0 p-1.5 rounded-xl bg-slate-800/20">{card.icon}</span>
                        <div className="min-w-0">
                          <span className={`text-xs font-bold block leading-snug truncate ${
                            isSelected ? 'text-emerald-400 font-extrabold' : isDark ? 'text-white' : 'text-slate-900'
                          }`}>
                            {card.title}
                          </span>
                          <span className={`text-[11px] block truncate mt-0.5 ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {card.librasDica}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALFABETO EM LIBRAS (DATILOLOGIA) */}
          {activeTab === 'datilologia' && (
            <div className="space-y-6">
              {/* SPELLING SIMULATOR */}
              <div className={`p-5 rounded-3xl border space-y-4 ${
                isDark ? 'bg-[#092032] border-[#163650]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <HandMetal className="w-4 h-4 text-emerald-400" />
                      <span>Simulador de Datilologia (Soletrador de Livros e Nomes)</span>
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Digite qualquer título de livro ou nome de estudante para ver a soletração letra a letra em Libras:
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={spellingText}
                    onChange={(e) => setSpellingText(e.target.value)}
                    placeholder="Ex: DOM CASMURRO ou seu nome..."
                    maxLength={35}
                    className={`flex-1 px-4 py-2.5 rounded-2xl border text-sm font-bold outline-none transition-all ${
                      isDark
                        ? 'bg-[#001424] border-[#163650] text-white focus:border-emerald-400'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500 shadow-sm'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setSpellingText('MARIA QUITERIA')}
                    className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                  >
                    Resetar
                  </button>
                </div>

                {/* VISUAL LETTERS SPELL DISPLAY */}
                <div className={`p-4 rounded-2xl border min-h-[90px] flex items-center gap-2 overflow-x-auto ${
                  isDark ? 'bg-[#00101c] border-[#163650]' : 'bg-white border-slate-200'
                }`}>
                  {lettersToSpell.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">Digite algo acima para soletrar...</span>
                  ) : (
                    lettersToSpell.map((letter, idx) => {
                      if (letter === ' ') {
                        return (
                          <div key={idx} className="w-6 text-center text-slate-500 font-bold shrink-0">
                            •
                          </div>
                        );
                      }
                      const info = DATILOLOGIA_ALPHABET.find((l) => l.char === letter);
                      return (
                        <div
                          key={idx}
                          onClick={() => info && setSelectedLetter(info)}
                          className="flex flex-col items-center justify-center min-w-[48px] h-16 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/25 transition-all cursor-pointer shrink-0 shadow-sm group"
                        >
                          <span className="text-xs font-mono font-black text-emerald-400 group-hover:scale-110 transition-transform">
                            {letter}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[42px] px-1">
                            {info ? info.hint.split(' ')[0] : 'Libras'}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* SELECTED LETTER DETAIL */}
              {selectedLetter && (
                <div className={`p-4 rounded-2xl border flex items-center gap-4 ${
                  isDark ? 'bg-gradient-to-r from-[#092b42] to-[#092032] border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-md shrink-0">
                    {selectedLetter.char}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Letra {selectedLetter.char} em Libras: {selectedLetter.hint}
                    </h4>
                    <p className={`text-xs mt-0.5 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {selectedLetter.description}
                    </p>
                  </div>
                </div>
              )}

              {/* FULL ALPHABET 26 LETTERS GRID */}
              <div className="space-y-3">
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Alfabeto Manual Completo de A a Z (Toque para ver a descrição):
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                  {DATILOLOGIA_ALPHABET.map((item) => {
                    const isSel = selectedLetter?.char === item.char;
                    return (
                      <button
                        key={item.char}
                        type="button"
                        onClick={() => setSelectedLetter(item)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSel
                            ? 'border-emerald-400 bg-emerald-500/20 shadow-md ring-2 ring-emerald-400/40 scale-105'
                            : isDark
                            ? 'bg-[#092032] border-[#163650] hover:border-emerald-500/40 hover:bg-[#0e2c45]'
                            : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50 shadow-sm'
                        }`}
                      >
                        <span className="text-xl font-black text-emerald-400 mb-1 font-mono">
                          {item.char}
                        </span>
                        <span className={`text-[10px] font-semibold line-clamp-1 ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          {item.hint}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DICIONÁRIO DE SINAIS DA BIBLIOTECA */}
          {activeTab === 'dicionario' && (
            <div className="space-y-6">
              <div className={`p-4 rounded-2xl border ${
                isDark ? 'bg-[#092032] border-[#163650]' : 'bg-emerald-50/70 border-emerald-200'
              }`}>
                <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Vocabulário Essencial da Biblioteca em Libras</span>
                </h3>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Estes são os sinais fundamentais utilizados no ambiente escolar e em bibliotecas. Conhecê-los aproxima estudantes, professores e funcionários em uma cultura verdadeiramente inclusiva.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {LIBRARY_SIGNS.map((sign, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-3xl border transition-all ${
                      isDark
                        ? 'bg-[#092032] border-[#163650] hover:border-emerald-500/40'
                        : 'bg-white border-slate-200 hover:border-emerald-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 mb-3">
                      <span className="text-3xl p-2 rounded-2xl bg-white/10 shrink-0 shadow-sm">
                        {sign.icon}
                      </span>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          {sign.category}
                        </span>
                        <h4 className={`text-base font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          Sinal de "{sign.term}"
                        </h4>
                      </div>
                    </div>

                    <p className={`text-xs leading-relaxed mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      <strong>Como fazer o sinal:</strong> {sign.signDescription}
                    </p>

                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-300 flex items-center gap-2 font-medium">
                      <span>💡</span>
                      <span>{sign.videoTip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COMO USAR O VLIBRAS 3D */}
          {activeTab === 'vlibras' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-3xl border space-y-4 ${
                isDark ? 'bg-gradient-to-br from-[#092640] to-[#001424] border-blue-500/40' : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-white text-3xl font-black shadow-lg shrink-0">
                    🤟
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        VLibras: Avatar 3D de Tradução para Libras
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        Oficial Gov.br
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      O VLibras é o conjunto de ferramentas de código aberto do Governo Federal e da Universidade Federal da Paraíba (UFPB) que traduz conteúdos digitais em português para a Língua Brasileira de Sinais (Libras).
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleOpenVLibrasDirectly}
                    className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/25 transition-all"
                  >
                    <span>🤟 Abrir Avatar 3D do VLibras Agora</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      alert('Dica: Na lateral direita da página, clique no ícone com duas mãos azuis para ativar o avatar Ícaro do VLibras!');
                    }}
                    className={`px-4 py-3 rounded-2xl border text-xs font-semibold cursor-pointer ${
                      isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-white'
                    }`}
                  >
                    Onde fica o botão na tela?
                  </button>
                </div>
              </div>

              {/* STEP BY STEP GUIDE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200'
                }`}>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center">
                    1
                  </div>
                  <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Ative o Avatar
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Clique no botão flutuante azul do VLibras na lateral direita ou no botão no topo da tela. O avatar 3D (Ícaro) aparecerá.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200'
                }`}>
                  <div className="w-8 h-8 rounded-xl bg-blue-500 text-white font-black text-sm flex items-center justify-center">
                    2
                  </div>
                  <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Selecione o Texto
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Passe o mouse ou selecione qualquer título de livro, sinopse, regras de empréstimo ou pergunta do jogo Missão Quitério.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200'
                }`}>
                  <div className="w-8 h-8 rounded-xl bg-purple-500 text-white font-black text-sm flex items-center justify-center">
                    3
                  </div>
                  <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Veja a Tradução
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    O avatar sinaliza o texto instantaneamente em Libras com animações naturais, controle de velocidade e repetição.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className={`p-4 sm:p-5 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
          isDark ? 'bg-[#00101c] border-[#163650] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          <div className="flex items-center gap-2">
            <span>🛡️</span>
            <span>Em conformidade com a <strong>Lei Brasileira de Inclusão (LBI nº 13.146/2015)</strong> e Decreto nº 5.626.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md transition-all ml-auto"
          >
            Fechar Painel
          </button>
        </div>
      </div>
    </div>
  );
};
