import React, { useState } from 'react';
import { Quote, Feather, ChevronLeft, ChevronRight, ExternalLink, Sparkles, BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface WriterQuote {
  id: number;
  text: string;
  source?: string;
}

export const MANOEL_DE_BARROS_QUOTES: WriterQuote[] = [
  {
    id: 1,
    text: "O meu quintal é maior do que o mundo.",
    source: "O Guardador de Águas"
  },
  {
    id: 2,
    text: "O olho vê, a memória revê, e a imaginação transvê. É preciso transver o mundo.",
    source: "Livro sobre Nada"
  },
  {
    id: 3,
    text: "A maior riqueza do homem é sua incompletude. Nesse ponto sou riquíssimo.",
    source: "Memórias Inventadas"
  },
  {
    id: 4,
    text: "Tudo que eu não invento é falso.",
    source: "Memórias Inventadas"
  },
  {
    id: 5,
    text: "Quem anda no trilho é trem de ferro. Sou água que corre entre pedras: liberdade caça jeito.",
    source: "Cantigas por um Passarinho à Toa"
  },
  {
    id: 6,
    text: "A poesia está nas coisas miúdas.",
    source: "Poemas Rupestres"
  },
  {
    id: 7,
    text: "O que as árvores têm de mais bonito é que elas não se importam em ser árvores.",
    source: "Livro sobre Nada"
  },
  {
    id: 8,
    text: "Tem mais presença de Deus em uma folha de grama do que numa catedral.",
    source: "Ensaios Fotográficos"
  },
  {
    id: 9,
    text: "O mundo não foi feito em alfabeto. Senão que primeiro em água e luz. Depois árvore.",
    source: "Poesia Completa"
  },
  {
    id: 10,
    text: "Para ter um bom começo, é preciso esquecer o bom senso.",
    source: "Exercícios de Ser Criança"
  },
  {
    id: 11,
    text: "Perdi o meu rumo e isso me deu liberdade.",
    source: "Gramática Expositiva do Chão"
  },
  {
    id: 12,
    text: "Carregar água na peneira é o trabalho da poesia.",
    source: "O Fazedor de Amanhecer"
  },
  {
    id: 13,
    text: "As coisas que não têm nome são mais importantes.",
    source: "Matéria de Poesia"
  },
  {
    id: 14,
    text: "Inventar uma nascente para o pássaro.",
    source: "Menino do Mato"
  },
  {
    id: 15,
    text: "Sou livre para o silêncio das formas e das cores.",
    source: "Arranjos para Assobio"
  },
  {
    id: 16,
    text: "A voz de um passarinho me recita.",
    source: "Poemas Rupestres"
  },
  {
    id: 17,
    text: "Aprendi com as andorinhas a ver o tempo.",
    source: "O Guardador de Águas"
  },
  {
    id: 18,
    text: "O homem que arrasta a sua sombra pela rua é o mesmo que leva seu sol amarrado nas costas.",
    source: "Tratado Geral das Grandezas do Ínfimo"
  }
];

export const FeaturedWriterCard: React.FC = () => {
  const { isDark, isPurple, isEmerald, isKinetic } = useTheme();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const currentQuote = MANOEL_DE_BARROS_QUOTES[currentQuoteIndex];

  const handleNext = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % MANOEL_DE_BARROS_QUOTES.length);
  };

  const handlePrev = () => {
    setCurrentQuoteIndex((prev) =>
      prev === 0 ? MANOEL_DE_BARROS_QUOTES.length - 1 : prev - 1
    );
  };

  return (
    <div
      id="featured-writer-card"
      className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-7 border backdrop-blur-md transition-all duration-300 shadow-2xl ${
        isEmerald
          ? 'bg-[#041c2c]/90 border-[#0a3f5c] text-white shadow-[0_12px_40px_rgba(0,230,118,0.18)]'
          : isPurple
          ? 'bg-[#220d43]/90 border-[#3b176b] text-white shadow-[0_12px_40px_rgba(168,85,247,0.22)]'
          : isKinetic
          ? 'bg-[#181a1d] border-[#29303a] text-white shadow-xl'
          : isDark
          ? 'bg-[#081e30]/95 border-[#153a5b] text-white shadow-xl'
          : 'bg-white/95 border-amber-200/80 text-slate-900 shadow-xl'
      }`}
    >
      {/* Decorative Aura / Glow behind author */}
      <div
        className={`absolute -top-10 -right-10 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-30 ${
          isEmerald
            ? 'bg-emerald-400'
            : isPurple
            ? 'bg-purple-500'
            : 'bg-amber-400'
        }`}
      />

      {/* Top Header Badge */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm ${
              isEmerald
                ? 'bg-emerald-500/15 text-[#00e676] border-emerald-500/30'
                : isPurple
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                : 'bg-amber-400/20 text-amber-500 border-amber-400/40'
            }`}
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Escritor em Destaque</span>
          </span>
        </div>

        <a
          href="https://www.companhiadasletras.com.br/BlogPost/6532/18-frases-de-manoel-de-barros-para-celebrar-sua-poesia?srsltid=AU7gw4UupGvCbGIrq1HeKDaFSmj_ntsDV3eWEO75ln8KliHmSh-qPnO7"
          target="_blank"
          rel="noopener noreferrer"
          title="Ver as 18 frases na Companhia das Letras"
          className={`inline-flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${
            isEmerald
              ? 'text-emerald-400 hover:text-emerald-300'
              : isPurple
              ? 'text-purple-300 hover:text-purple-200'
              : 'text-amber-500 hover:text-amber-600'
          }`}
        >
          <span>18 Frases</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Author Profile Information */}
      <div className="flex items-center gap-4 mb-5 relative z-10">
        {/* Author Photo */}
        <div className="relative shrink-0">
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden p-0.5 border-2 shadow-lg transition-transform duration-300 hover:scale-105 ${
              isEmerald
                ? 'border-emerald-400/80 shadow-emerald-950/40'
                : isPurple
                ? 'border-purple-400/80 shadow-purple-950/40'
                : 'border-amber-400 shadow-amber-950/20'
            }`}
          >
            {!imageError ? (
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/29/Manoel_Ramos_de_Barros.jpg"
                alt="Manoel de Barros"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div
                className={`w-full h-full flex flex-col items-center justify-center font-bold text-lg ${
                  isDark ? 'bg-slate-800 text-amber-300' : 'bg-amber-100 text-amber-800'
                }`}
              >
                MB
              </div>
            )}
          </div>
          <div
            className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border shadow-sm ${
              isEmerald
                ? 'bg-[#00e676] text-slate-950 border-slate-900'
                : isPurple
                ? 'bg-purple-400 text-slate-950 border-slate-900'
                : 'bg-amber-400 text-slate-950 border-white'
            }`}
            title="Grande Mestre da Poesia Brasileira"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Author Name and Details */}
        <div className="min-w-0">
          <h3
            className={`text-lg sm:text-xl font-black tracking-tight truncate ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Manoel de Barros
          </h3>
          <p
            className={`text-xs sm:text-sm font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Poeta Pantaneiro • 1916 – 2014
          </p>
          <span
            className={`inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
              isDark ? 'bg-white/10 text-amber-300' : 'bg-amber-100 text-amber-900'
            }`}
          >
            Prêmio Jabuti de Literatura
          </span>
        </div>
      </div>

      {/* Quote Container */}
      <div
        className={`relative rounded-2xl p-4 sm:p-5 border transition-all duration-300 mb-4 z-10 ${
          isDark
            ? 'bg-black/35 border-white/10'
            : 'bg-amber-50/70 border-amber-200/70'
        }`}
      >
        <Quote
          className={`w-7 h-7 sm:w-8 sm:h-8 mb-2 opacity-50 ${
            isEmerald
              ? 'text-[#00e676]'
              : isPurple
              ? 'text-purple-400'
              : 'text-amber-500'
          }`}
        />

        <p
          className={`text-sm sm:text-base font-serif italic leading-relaxed min-h-[4rem] flex items-center ${
            isDark ? 'text-slate-100 font-medium' : 'text-slate-800 font-semibold'
          }`}
        >
          “{currentQuote.text}”
        </p>

        {currentQuote.source && (
          <div className="mt-2.5 flex items-center justify-between text-[11px]">
            <span
              className={`flex items-center gap-1 font-semibold ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              <BookOpen className="w-3 h-3 text-amber-400" />
              <span>{currentQuote.source}</span>
            </span>
            <span className={`font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Manoel de Barros
            </span>
          </div>
        )}
      </div>

      {/* Quote Carousel Navigation Footer */}
      <div className="flex items-center justify-between pt-1 relative z-10">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-xs font-bold ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Frase <span className="text-amber-400 font-extrabold">{currentQuoteIndex + 1}</span> de {MANOEL_DE_BARROS_QUOTES.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-prev-writer-quote"
            type="button"
            onClick={handlePrev}
            aria-label="Frase anterior"
            className={`p-2 rounded-xl border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
              isDark
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            id="btn-next-writer-quote"
            type="button"
            onClick={handleNext}
            aria-label="Próxima frase"
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm ${
              isEmerald
                ? 'bg-[#00e676] hover:bg-[#1fa950] text-slate-950 font-bold'
                : isPurple
                ? 'bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold'
            }`}
          >
            <span>Próxima frase</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
