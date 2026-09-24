import React from 'react';
import { BookOpen, ShieldCheck, Sparkles, Heart } from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '../context/ThemeContext';
import gatinhoQuiterioImg from '../assets/images/gatinho_quiterio_1788399673265.jpg';

interface AboutViewProps {
  onBackToCatalog?: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onBackToCatalog }) => {
  const { isDark } = useTheme();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 space-y-12">
      {/* Hero with Official Logo */}
      <div
        className={`border rounded-3xl p-6 sm:p-10 shadow-xl ${
          isDark
            ? 'bg-gradient-to-r from-[#092032] via-[#0b2840] to-[#092032] border-[#163650]'
            : 'bg-white border-slate-200 shadow-md'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-4 ${
                isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Identidade Institucional</span>
            </div>
            <Logo size="xl" className="mb-2" />
            <p className={`text-sm sm:text-base mt-3 font-normal leading-relaxed max-w-2xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Um espaço de excelência dedicado à leitura, incentivo à pesquisa, inovação científica, arte e formação cidadã de nossos estudantes e de toda a comunidade escolar.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`border rounded-2xl p-6 ${isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Nossa Missão</h3>
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Democratizar o acesso aos livros, estimular o pensamento crítico e promover o amor pela leitura desde os primeiros anos de formação.
          </p>
        </div>

        <div className={`border rounded-2xl p-6 flex flex-col items-center text-center justify-between transition-all hover:scale-[1.02] shadow-sm ${isDark ? 'bg-[#092032] border-[#163650] hover:border-purple-500/40' : 'bg-white border-slate-200 hover:border-purple-300'}`}>
          <div className="relative group mb-3">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-purple-400/70 shadow-lg shadow-purple-500/20 bg-purple-950/40 p-1 flex items-center justify-center">
              <img
                src={gatinhoQuiterioImg}
                alt="Gatinho Quitério - Mascote da Biblioteca"
                className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white shadow-md whitespace-nowrap">
              Mascote Oficial
            </span>
          </div>

          <div className="mt-1">
            <h3 className={`text-lg font-bold mb-1 flex items-center justify-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span>Gatinho Quitério</span>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Nosso dedicado bibliotecário felino trabalhando duro na organização do acervo e pronto para incentivar a leitura de todos os alunos!
            </p>
          </div>
        </div>

        <div className={`border rounded-2xl p-6 ${isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-500 mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Regras de Empréstimo</h3>
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Até <strong>2 livros por aluno</strong> com prazo de <strong>7 a 14 dias</strong> renováveis online ou presencialmente na biblioteca.
          </p>
        </div>
      </div>

      {/* Info CECMQ - TI Section */}
      <div className={`border rounded-3xl p-6 sm:p-8 space-y-6 ${isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className={`flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b ${isDark ? 'border-[#163650]/60' : 'border-slate-100'}`}>
          <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-emerald-500 shrink-0 shadow-inner ${isDark ? 'bg-[#001424] border-[#163650]' : 'bg-slate-50 border-slate-200'}`}>
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold mb-1 ${isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
              <span>Educa Mais Bahia</span>
            </div>
            <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Info CECMQ - TI
            </h3>
          </div>
        </div>

        <div className={`space-y-4 text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          <p>
            Tecnologia desenvolvida por quem vive a educação. No <strong>Educa Mais Bahia</strong>, nossos alunos transformam conhecimento em inovação, criando aplicativos que simplificam a rotina escolar, fortalecem a organização e promovem experiências mais humanas. Cada aplicativo desenvolvido representa aprendizado, criatividade e o compromisso de usar a tecnologia para gerar impacto positivo na educação.
          </p>

          <div className={`pt-3 border-t ${isDark ? 'border-[#163650]/40' : 'border-slate-100'}`}>
            <h4 className={`text-base sm:text-lg font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <BookOpen className="w-4 h-4 text-emerald-500" />
              Por que um software para a biblioteca?
            </h4>
            <p className="mb-3">
              A biblioteca é o coração de toda escola. É nela que estudantes descobrem novos mundos, professores encontram apoio para suas aulas e a comunidade constrói o hábito da leitura. Mas sem organização, esse tesouro pode se perder entre prateleiras esquecidas e livros extraviados.
            </p>
            <p className="mb-3">
              Um sistema digital transforma essa realidade. Com poucos cliques, é possível cadastrar livros, controlar empréstimos e devoluções, identificar quais títulos estão disponíveis e gerar relatórios precisos para a gestão escolar — economizando tempo e evitando perdas.
            </p>
            <p>
              Para o <strong>Colégio Estadual do Campo Maria Quitéria</strong>, isso significa valorizar o acervo, dar transparência ao trabalho da biblioteca e aproximar os alunos da leitura por meio de uma ferramenta moderna, acessível de qualquer dispositivo.
            </p>
          </div>
        </div>
      </div>

      {/* Banner: Feito Pelos Alunos do Educa + Bahia */}
      <div className={`relative overflow-hidden rounded-3xl border p-8 sm:p-12 text-center shadow-xl ${
        isDark
          ? 'bg-gradient-to-b from-[#092a34]/90 via-[#071f28]/95 to-[#04141c] border-[#163650]'
          : 'bg-gradient-to-b from-emerald-50 via-teal-50/50 to-white border-emerald-200'
      }`}>
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <h2
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}
            style={{ fontFamily: "'Playfair Display', 'Merriweather', Georgia, serif" }}
          >
            Feito Pelos Alunos do Educa + Bahia
          </h2>
          <p className={`text-sm sm:text-base font-normal leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Soluções tecnológicas pensadas para escolas do campo e da cidade.
          </p>
          {onBackToCatalog && (
            <button
              onClick={onBackToCatalog}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#23c65e] hover:bg-[#1fa950] text-white font-semibold text-sm transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>Voltar ao acervo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

