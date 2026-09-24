import React from 'react';
import { Search, BookOpen, ChevronRight, Star, Film } from 'lucide-react';
import { Book, Loan, Student } from '../types';
import { useTheme } from '../context/ThemeContext';
import { HomeRankingWidget } from './HomeRankingWidget';
import { FeaturedAuthor } from './FeaturedAuthor';

interface HeroBannerProps {
  books: Book[];
  loans?: Loan[];
  students?: Student[];
  onSelectBook: (book: Book) => void;
  onViewCatalog: () => void;
  onViewRanking?: () => void;
  onViewMissaoQuiterio?: () => void;
  onOpenOpeningVideo?: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  books,
  loans = [],
  students = [],
  onSelectBook,
  onViewCatalog,
  onViewRanking,
  onViewMissaoQuiterio,
  onOpenOpeningVideo,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
}) => {
  const { isDark, isKinetic, isPurple, isEmerald } = useTheme();
  const featuredBooks = books.filter((b) => b.featured).slice(0, 5);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Visual Section */}
      <div
        className={`relative pt-8 pb-14 lg:pt-12 lg:pb-16 border-b transition-colors duration-200 ${
          isEmerald
            ? 'bg-[#021726] border-[#072d42]'
            : isPurple
            ? 'bg-[#13072b] border-[#3e196e]'
            : isKinetic
            ? 'bg-[#0c1014] border-[#2a313a]'
            : isDark
            ? 'bg-[#001424] border-[#163650]/60'
            : 'bg-gradient-to-b from-slate-100 via-white to-slate-50 border-slate-200'
        }`}
      >
        {/* Ambient background with clean lighting/gradients (sem animação) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <div
            className={`absolute inset-0 ${
              isEmerald
                ? 'bg-gradient-to-t from-[#021726] via-[#021726]/90 to-[#021726]/60'
                : isPurple
                ? 'bg-gradient-to-t from-[#13072b] via-[#13072b]/90 to-[#13072b]/60'
                : isKinetic
                ? 'bg-gradient-to-t from-[#0c1014] via-[#0c1014]/90 to-[#0c1014]/60'
                : isDark
                ? 'bg-gradient-to-t from-[#001424] via-[#001424]/90 to-[#001424]/60'
                : 'bg-gradient-to-t from-slate-100 via-white/90 to-white/60'
            }`}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row: Left Content (Title, Subtitle, Search) + Right Magic Illustration */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
            {/* Left Column (7 cols): Text & Search */}
            <div className="lg:col-span-7">
              {/* Quick Opening Trigger */}
              {onOpenOpeningVideo && (
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  <button
                    id="hero-watch-opening-video-btn"
                    type="button"
                    onClick={onOpenOpeningVideo}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold transition-all duration-200 cursor-pointer bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 shadow-sm hover:scale-105 active:scale-95 group"
                  >
                    <Film className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                    <span>▶ Assistir Vídeo de Abertura</span>
                  </button>
                </div>
              )}

              {/* Title & Subtitle */}
              <h1
                className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-3 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Nossa Biblioteca, <br />
                <span
                  className={
                    isEmerald
                      ? 'text-[#00e676] drop-shadow-[0_0_25px_rgba(0,230,118,0.45)]'
                      : isPurple
                      ? 'bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]'
                      : isKinetic
                      ? 'text-[#0088cc] drop-shadow-[0_0_25px_rgba(0,136,204,0.4)]'
                      : isDark
                      ? 'text-[#1dbb64] drop-shadow-[0_0_25px_rgba(29,187,100,0.35)]'
                      : 'text-[#23c65e]'
                  }
                >
                  Nossa História.
                </span>
              </h1>
              <p
                className={`text-base sm:text-lg font-normal max-w-2xl mb-8 leading-relaxed ${
                  isEmerald
                    ? 'text-slate-300'
                    : isPurple
                    ? 'text-purple-200/90'
                    : isDark
                    ? 'text-slate-300'
                    : 'text-slate-600'
                }`}
              >
                Encontre livros, autores e histórias que inspiram e transformam.
              </p>

              {/* Search Bar matching the exact requested UI */}
              <form onSubmit={onSearchSubmit} className="relative max-w-2xl">
                <div className="relative flex items-center">
                  <input
                    id="hero-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar livros, autores, categorias..."
                    className={`w-full pl-5 pr-14 py-4 rounded-2xl border text-sm sm:text-base transition-all focus:outline-none ${
                      isEmerald
                        ? 'bg-[#021827]/90 text-white placeholder-slate-400 border-[#0b4d5e] focus:border-[#00e676] focus:ring-2 focus:ring-[#00e676]/30 shadow-xl'
                        : isPurple
                        ? 'bg-[#16082d] text-white placeholder-purple-300/60 border-[#3d196f] focus:border-[#a855f7] focus:ring-2 focus:ring-[#a855f7]/30 shadow-xl'
                        : isKinetic
                        ? 'bg-[#1a1c1e] text-white placeholder-slate-400 border-[#2a313a] focus:border-[#0088cc] focus:ring-2 focus:ring-[#0088cc]/30 shadow-lg'
                        : isDark
                        ? 'bg-[#092032]/95 text-white placeholder-slate-400 border-[#1e3a5f] focus:border-[#1dbb64] focus:ring-2 focus:ring-[#1dbb64]/30 shadow-lg'
                        : 'bg-white text-slate-900 placeholder-slate-400 border-slate-200 focus:border-[#23c65e] focus:ring-2 focus:ring-[#23c65e]/20 shadow-md'
                    }`}
                  />
                  <button
                    id="hero-search-submit"
                    type="submit"
                    title="Buscar"
                    className={`absolute right-2 top-2 bottom-2 px-4 rounded-xl flex items-center justify-center transition-colors shadow-sm cursor-pointer ${
                      isEmerald
                        ? 'bg-[#00e676] hover:bg-[#00c864] text-slate-950 shadow-[0_0_15px_rgba(0,230,118,0.4)]'
                        : isPurple
                        ? 'bg-[#a855f7] hover:bg-[#9333ea] text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                        : isKinetic
                        ? 'bg-[#0088cc] hover:bg-[#0077b5] text-white shadow-[0_0_10px_rgba(0,136,204,0.35)]'
                        : isDark
                        ? 'bg-[#1dbb64] hover:bg-[#16a354] text-white shadow-[0_0_10px_rgba(29,187,100,0.3)]'
                        : 'bg-[#23c65e] hover:bg-[#1fa950] text-white'
                    }`}
                  >
                    <Search className={`w-5 h-5 ${isEmerald ? 'text-slate-950' : ''}`} />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column (5 cols): Escritor em Destaque Semanal (FeaturedAuthor) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative w-full">
              <FeaturedAuthor />
            </div>
          </div>

          {/* Livros em destaque Section */}
          <div className="pt-2 sm:pt-4">
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                <span>Livros em destaque</span>
              </h2>
              <button
                id="btn-ver-todos-destaques"
                onClick={onViewCatalog}
                className={`text-xs sm:text-sm font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  isEmerald
                    ? 'text-[#00e676] hover:text-emerald-300'
                    : isPurple
                    ? 'text-[#c084fc] hover:text-white'
                    : isDark
                    ? 'text-[#1dbb64] hover:text-emerald-300'
                    : 'text-emerald-600 hover:text-emerald-700'
                }`}
              >
                <span>Ver todos</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Book Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-5">
              {featuredBooks.map((book) => (
                <div
                  key={book.id}
                  id={`featured-book-${book.id}`}
                  onClick={() => onSelectBook(book)}
                  className={`group border rounded-2xl p-3 flex flex-col cursor-pointer transition-all duration-200 hover:-translate-y-1.5 ${
                    isEmerald
                      ? 'bg-[#062438] border-[#0c4061] hover:border-[#00e676] hover:shadow-[0_12px_25px_rgba(0,0,0,0.5),0_0_15px_rgba(0,230,118,0.25)]'
                      : isPurple
                      ? 'bg-[#250f4f] border-[#3e196e] hover:border-[#a855f7] hover:shadow-[0_12px_25px_rgba(0,0,0,0.5),0_0_15px_rgba(168,85,247,0.3)]'
                      : isDark
                      ? 'bg-[#092032] border-[#163650] hover:border-[#1dbb64] hover:shadow-[0_12px_25px_rgba(0,0,0,0.5),0_0_15px_rgba(29,187,100,0.2)]'
                      : 'bg-white border-slate-200 hover:border-[#23c65e] hover:shadow-lg shadow-sm'
                  }`}
                >
                  {/* Book Cover */}
                  <div
                    className={`relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-3 border ${
                      isEmerald
                        ? 'bg-[#021827] border-[#0c4061]/60'
                        : isPurple
                        ? 'bg-[#15072b] border-[#3e196e]/60'
                        : isDark
                        ? 'bg-[#031320] border-[#1e3a5f]/50'
                        : 'bg-slate-100 border-slate-200'
                    }`}
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm shadow-sm ${
                        isEmerald ? 'bg-[#00e676] text-slate-950 font-bold' : isPurple ? 'bg-[#9333ea] text-white' : 'bg-[#23c65e] text-white'
                      }`}>
                        Disponível
                      </span>
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        className={`text-sm font-bold transition-colors line-clamp-1 ${
                          isEmerald
                            ? 'text-white group-hover:text-[#00e676]'
                            : isPurple
                            ? 'text-white group-hover:text-[#c084fc]'
                            : isDark
                            ? 'text-white group-hover:text-[#1dbb64]'
                            : 'text-slate-900 group-hover:text-[#23c65e]'
                        }`}
                      >
                        {book.title}
                      </h3>
                      <p className={`text-xs line-clamp-1 mb-2 ${isEmerald ? 'text-slate-400' : isPurple ? 'text-purple-200/70' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {book.author}
                      </p>
                    </div>

                    <div
                      className={`flex items-center justify-between pt-2 border-t ${
                        isEmerald ? 'border-[#0c4061]/60' : isPurple ? 'border-[#3e196e]/60' : isDark ? 'border-[#163650]/60' : 'border-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{book.rating}</span>
                      </div>
                      <span
                        className={`text-[11px] font-medium group-hover:underline ${
                          isPurple ? 'text-[#c084fc]' : isDark ? 'text-emerald-400' : 'text-emerald-600'
                        }`}
                      >
                        Ver detalhes
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ranking & Destaque Section */}
          <HomeRankingWidget
            books={books}
            loans={loans}
            students={students}
            onSelectBook={onSelectBook}
            onViewFullRanking={onViewRanking || onViewCatalog}
          />
        </div>
      </div>
    </div>
  );
};


