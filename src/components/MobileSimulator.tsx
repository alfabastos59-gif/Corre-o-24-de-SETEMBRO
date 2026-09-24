import React, { useState } from 'react';
import {
  Home,
  BookOpen,
  BookmarkCheck,
  User,
  Search,
  ChevronRight,
  Clock,
  Heart,
  Lightbulb,
  Settings,
  LogOut,
  Smartphone,
  Camera
} from 'lucide-react';
import { Book, Loan, MobileTab } from '../types';
import { Logo } from './Logo';
import { useTheme } from '../context/ThemeContext';
import { getCategoryColor } from '../data/mockData';

interface MobileSimulatorProps {
  books: Book[];
  loans: Loan[];
  onSelectBook: (book: Book) => void;
  onOpenRegisterBook?: () => void;
}

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({
  books,
  loans,
  onSelectBook,
  onOpenRegisterBook,
}) => {
  const { isDark } = useTheme();
  const [mobileTab, setMobileTab] = useState<MobileTab>('inicio');
  const [loanSubTab, setLoanSubTab] = useState<'ativos' | 'historico'>('ativos');
  const [mobileSearch, setMobileSearch] = useState('');
  const [mobileCategory, setMobileCategory] = useState('Todos');

  const featured = books.filter((b) => b.featured);
  const activeLoans = loans.filter((l) => l.status !== 'devolvido');

  const filteredBooks = books
    .filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(mobileSearch.toLowerCase()) ||
        b.author.toLowerCase().includes(mobileSearch.toLowerCase());
      const matchesCategory =
        mobileCategory === 'Todos' || b.category === mobileCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* Introduction Header */}
      <div className="text-center mb-8 max-w-xl">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-2 ${
          isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          <Smartphone className="w-3.5 h-3.5" />
          <span>Experiência no Smartphone</span>
        </div>
        <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Simulador Mobile Interativo
        </h2>
        <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Navegue pelas 4 telas mobile: Início, Catálogo, Empréstimos e Perfil.
        </p>

        {/* Quick Screen Selectors */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {(['inicio', 'catalogo', 'emprestimos', 'perfil'] as MobileTab[]).map((tab) => (
            <button
              key={tab}
              id={`btn-mobile-screen-${tab}`}
              onClick={() => setMobileTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                mobileTab === tab
                  ? 'bg-[#23c65e] text-white shadow-sm'
                  : isDark
                  ? 'bg-[#092032] text-slate-400 border border-[#163650] hover:text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab === 'inicio' ? 'Início' : tab === 'catalogo' ? 'Catálogo' : tab === 'emprestimos' ? 'Empréstimos' : 'Perfil'}
            </button>
          ))}
        </div>
      </div>

      {/* Smartphone Device Frame matching Panel 6 */}
      <div className={`relative w-full max-w-[340px] sm:max-w-[360px] h-[680px] rounded-[44px] shadow-2xl overflow-hidden flex flex-col justify-between select-none border-[8px] ${
        isDark ? 'bg-[#00101d] border-[#163650]' : 'bg-[#00101d] border-slate-800'
      }`}>
        {/* Notch / Speaker */}
        <div className="absolute top-0 inset-x-0 h-6 flex items-center justify-center z-30">
          <div className="w-32 h-4 bg-[#163650] rounded-b-xl flex items-center justify-center">
            <div className="w-10 h-1.5 bg-[#00101d] rounded-full" />
          </div>
        </div>

        {/* Status Bar */}
        <div className="pt-2 px-6 flex justify-between items-center text-[10px] text-slate-400 font-semibold z-20">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Smartphone Screen Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 text-white text-xs scrollbar-none">
          {/* SCREEN 1: INÍCIO */}
          {mobileTab === 'inicio' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Header with Official Logo */}
              <div className="flex items-center justify-between pt-1 border-b border-[#163650]/40 pb-2">
                <Logo size="sm" showSubtitle={false} />
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                  alt="Aluno"
                  className="w-7 h-7 rounded-full border border-emerald-500/40 object-cover"
                />
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-white">
                  Olá, Aluno! 👋
                </h3>
                <p className="text-[10px] text-slate-400">
                  Que bom ter você na Biblioteca Maria Quitéria!
                </p>
              </div>

              {/* Mobile Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar livros, autores..."
                  value={mobileSearch}
                  onChange={(e) => setMobileSearch(e.target.value)}
                  className="w-full bg-[#092032] text-xs text-white placeholder-slate-400 pl-8 pr-3 py-2 rounded-xl border border-[#163650] focus:outline-none"
                />
              </div>

              {/* Livros em destaque */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">
                    Livros em destaque
                  </span>
                  <button
                    onClick={() => setMobileTab('catalogo')}
                    className="text-[10px] text-emerald-400 font-semibold cursor-pointer hover:underline"
                  >
                    Ver todos
                  </button>
                </div>

                <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
                  {featured.slice(0, 4).map((b) => (
                    <div
                      key={b.id}
                      onClick={() => onSelectBook(b)}
                      className="w-24 shrink-0 bg-[#092032] p-1.5 rounded-xl border border-[#163650] cursor-pointer hover:border-emerald-500/50 transition-colors"
                    >
                      <div className="aspect-[3/4] w-full rounded-lg overflow-hidden mb-1.5 bg-slate-900">
                        <img
                          src={b.cover}
                          alt={b.title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop&q=80';
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-white block truncate leading-tight">
                        {b.title}
                      </span>
                      <span className="text-[8px] text-slate-400 block truncate">
                        {b.author}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seus empréstimos */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">
                    Seus empréstimos
                  </span>
                  <button
                    onClick={() => setMobileTab('emprestimos')}
                    className="text-[10px] text-emerald-400 font-semibold cursor-pointer hover:underline"
                  >
                    Ver todos
                  </button>
                </div>

                {activeLoans.length > 0 ? (
                  <div className="bg-[#092032] p-2.5 rounded-xl border border-[#163650] flex items-center gap-3">
                    <img
                      src={activeLoans[0].bookCover}
                      alt={activeLoans[0].bookTitle}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop&q=80';
                      }}
                      className="w-10 h-14 rounded-lg object-cover border border-[#163650]"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-white block leading-tight">
                        {activeLoans[0].bookTitle}
                      </span>
                      <span className="text-[10px] text-slate-400 block mb-1">
                        {activeLoans[0].bookAuthor}
                      </span>
                      <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-semibold">
                        <Clock className="w-2.5 h-2.5" />
                        <span>Devolução: {activeLoans[0].returnDate}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#092032] p-3 rounded-xl border border-[#163650] text-center text-xs text-slate-400">
                    Nenhum empréstimo ativo no momento.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SCREEN 2: CATÁLOGO */}
          {mobileTab === 'catalogo' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="pt-1 flex items-center justify-between">
                <h3 className="text-base font-extrabold text-white">
                  Catálogo de Livros
                </h3>
                {onOpenRegisterBook && (
                  <button
                    onClick={onOpenRegisterBook}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm cursor-pointer active:scale-95"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Cadastrar</span>
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar livros, autores..."
                  value={mobileSearch}
                  onChange={(e) => setMobileSearch(e.target.value)}
                  className="w-full bg-[#092032] text-xs text-white placeholder-slate-400 pl-8 pr-3 py-2 rounded-xl border border-[#163650] focus:outline-none"
                />
              </div>

              {/* Categories Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[10px]">
                {['Todos', 'Literatura', 'Aventura', 'Ficção'].map((c, idx) => {
                  const color = getCategoryColor(c, idx);
                  const isSelected = mobileCategory === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setMobileCategory(c)}
                      className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap cursor-pointer transition-all duration-150 ${
                        color.bg
                      } ${color.hover} text-white ${
                        isSelected
                          ? 'scale-105 shadow-md ring-1.5 ring-white opacity-100'
                          : 'opacity-85 hover:opacity-100'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>

              {/* Vertical list of books */}
              <div className="space-y-2">
                {filteredBooks.slice(0, 5).map((b) => (
                  <div
                    key={b.id}
                    onClick={() => onSelectBook(b)}
                    className="bg-[#092032] p-2 rounded-xl border border-[#163650] flex items-center gap-3 cursor-pointer hover:border-emerald-500/50"
                  >
                    <img
                      src={b.cover}
                      alt={b.title}
                      className="w-11 h-14 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-white block truncate">
                        {b.title}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {b.author}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-semibold">
                          Disponível
                        </span>
                        <span className="text-[9px] text-amber-400 flex items-center gap-0.5 font-bold">
                          ★ {b.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN 3: EMPRÉSTIMOS */}
          {mobileTab === 'emprestimos' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="pt-1">
                <h3 className="text-base font-extrabold text-white">
                  Meus Empréstimos
                </h3>
              </div>

              {/* Tabs */}
              <div className="flex bg-[#092032] p-1 rounded-xl border border-[#163650]">
                <button
                  onClick={() => setLoanSubTab('ativos')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    loanSubTab === 'ativos' ? 'bg-[#23c65e] text-white' : 'text-slate-400'
                  }`}
                >
                  Ativos (2)
                </button>
                <button
                  onClick={() => setLoanSubTab('historico')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    loanSubTab === 'historico' ? 'bg-[#23c65e] text-white' : 'text-slate-400'
                  }`}
                >
                  Histórico
                </button>
              </div>

              {/* Loans List */}
              <div className="space-y-2.5">
                {loanSubTab === 'ativos' ? (
                  <>
                    <div className="bg-[#092032] p-3 rounded-xl border border-[#163650] flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=150&auto=format&fit=crop&q=80"
                        alt="O Pequeno Príncipe"
                        className="w-12 h-16 rounded-lg object-cover shrink-0"
                      />
                      <div>
                        <span className="text-xs font-bold text-white block">
                          O Pequeno Príncipe
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Devolver até 09/06/2024
                        </span>
                        <span className="inline-block mt-1.5 bg-emerald-500/20 text-emerald-400 text-[9px] px-2 py-0.5 rounded-md font-semibold">
                          Em andamento
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#092032] p-3 rounded-xl border border-[#163650] flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&auto=format&fit=crop&q=80"
                        alt="Dom Casmurro"
                        className="w-12 h-16 rounded-lg object-cover shrink-0"
                      />
                      <div>
                        <span className="text-xs font-bold text-white block">
                          Dom Casmurro
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Devolver até 08/06/2024
                        </span>
                        <span className="inline-block mt-1.5 bg-amber-500/20 text-amber-400 text-[9px] px-2 py-0.5 rounded-md font-semibold">
                          Em andamento
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-[#092032] p-3 rounded-xl border border-[#163650] flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=150&auto=format&fit=crop&q=80"
                      alt="A Menina que Roubava Livros"
                      className="w-12 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">
                        A Menina que Roubava Livros
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Devolvido em 03/06/2024
                      </span>
                      <span className="inline-block mt-1.5 bg-blue-500/20 text-blue-400 text-[9px] px-2 py-0.5 rounded-md font-semibold">
                        Devolvido
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SCREEN 4: PERFIL */}
          {mobileTab === 'perfil' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {/* Profile Card */}
              <div className="bg-[#092032] p-3 rounded-2xl border border-[#163650] flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                  alt="João da Silva"
                  className="w-12 h-12 rounded-xl object-cover border border-emerald-500/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">João da Silva</h4>
                  <span className="text-[10px] text-slate-400 block">
                    joao.silva@escola.com
                  </span>
                  <span className="text-[9px] text-emerald-400 font-semibold">
                    3º Ano B - Ensino Médio
                  </span>
                </div>
              </div>

              {/* Menu items matching Panel 6 */}
              <div className="bg-[#092032] rounded-2xl border border-[#163650] divide-y divide-[#163650]/60 overflow-hidden text-xs">
                {[
                  { label: 'Meus Dados', icon: User },
                  { label: 'Histórico de Empréstimos', icon: BookmarkCheck },
                  { label: 'Livros Favoritos', icon: Heart },
                  { label: 'Sugestões', icon: Lightbulb },
                  { label: 'Configurações', icon: Settings },
                  { label: 'Sair', icon: LogOut, danger: true },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className={`p-2.5 flex items-center justify-between cursor-pointer hover:bg-[#031320] transition-colors ${
                        item.danger ? 'text-rose-400' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-3.5 h-3.5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Bar matching Panel 6 */}
        <div className="bg-[#031320] border-t border-[#163650] py-2 px-4 flex justify-around items-center z-20">
          {[
            { id: 'inicio', label: 'Início', icon: Home },
            { id: 'catalogo', label: 'Catálogo', icon: BookOpen },
            { id: 'emprestimos', label: 'Empréstimos', icon: BookmarkCheck },
            { id: 'perfil', label: 'Perfil', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = mobileTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setMobileTab(tab.id as MobileTab)}
                className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                  isActive ? 'text-[#23c65e]' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[9px] font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

