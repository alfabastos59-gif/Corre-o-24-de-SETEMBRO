import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Star, BookOpen, Camera, Plus, BookPlus, Sparkles } from 'lucide-react';
import { Book } from '../types';
import { CATEGORIES, getCategoryColor } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

interface BookCatalogProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenRegisterBook?: () => void;
  onOpenSuggestions?: () => void;
}

export const BookCatalog: React.FC<BookCatalogProps> = ({
  books,
  onSelectBook,
  searchQuery,
  setSearchQuery,
  onOpenRegisterBook,
  onOpenSuggestions,
}) => {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'title' | 'rating' | 'year'>('title');
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Filter books based on search, category, status and sorting
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        const matchesQuery =
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.synopsis.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === 'Todos' || book.category.toLowerCase() === selectedCategory.toLowerCase();

        const matchesStatus =
          selectedStatus === 'todos' || book.status === selectedStatus;

        return matchesQuery && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' });
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'year') return b.year - a.year;
        return 0;
      });
  }, [books, searchQuery, selectedCategory, selectedStatus, sortBy]);

  const getStatusBadge = (status: Book['status']) => {
    switch (status) {
      case 'disponivel':
        return (
          <span className="bg-[#23c65e] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Disponível
          </span>
        );
      case 'reservado':
        return (
          <span className="bg-[#7c3aed] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            Reservado
          </span>
        );
      case 'em_andamento':
        return (
          <span className="bg-[#f0bd0b] text-slate-950 text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            Em andamento
          </span>
        );
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Title, Subtitle & Prominent Yellow Highlight Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-400/15 text-amber-300 border border-amber-400/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Acervo Completo Oficial</span>
            </span>
          </div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Catálogo de Livros
          </h1>
          <p className={`text-sm sm:text-base mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Explore todos os títulos e novidades da Biblioteca Maria Quitéria
          </p>
        </div>


      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
        <div className="relative flex-1">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            id="catalog-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, autor ou palavra-chave..."
            className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none ${
              isDark
                ? 'bg-[#092032] text-white placeholder-slate-400 border-[#163650] focus:border-[#1dbb64] focus:ring-1 focus:ring-[#1dbb64]'
                : 'bg-white text-slate-900 placeholder-slate-400 border-slate-200 focus:border-[#23c65e] focus:ring-1 focus:ring-[#23c65e] shadow-sm'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded ${
                isDark ? 'text-slate-400 hover:text-white bg-[#133e4a]' : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              Limpar
            </button>
          )}
        </div>

        {/* Filter Trigger Button */}
        <div className="flex items-center gap-2">
          <button
            id="btn-catalog-filters"
            onClick={() => setShowFiltersModal(!showFiltersModal)}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
              showFiltersModal || selectedStatus !== 'todos' || sortBy !== 'rating'
                ? isDark
                  ? 'bg-[#133e4a] text-emerald-400 border-emerald-500/50'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm'
                : isDark
                ? 'bg-[#092032] text-slate-300 border-[#163650] hover:text-white hover:border-slate-500'
                : 'bg-white text-slate-700 border-slate-200 hover:text-slate-900 hover:border-slate-300 shadow-sm'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtros</span>
            {(selectedStatus !== 'todos' || sortBy !== 'rating') && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          {onOpenRegisterBook && (
            <button
              id="btn-catalog-cadastrar-livro-bar"
              onClick={onOpenRegisterBook}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-extrabold bg-amber-400 hover:bg-amber-300 text-slate-950 border border-yellow-300 shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95 shrink-0"
              title="Cadastrar novo livro com foto da capa"
            >
              <BookPlus className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">Cadastrar Livro</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Options Expandable */}
      {showFiltersModal && (
        <div
          className={`border rounded-2xl p-4 sm:p-5 mb-6 animate-in slide-in-from-top-2 duration-200 ${
            isDark ? 'bg-[#071828] border-[#163650]' : 'bg-white border-slate-200 shadow-md'
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={`text-xs font-semibold block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Status de Disponibilidade
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'disponivel', label: 'Disponíveis' },
                  { id: 'reservado', label: 'Reservados' },
                  { id: 'em_andamento', label: 'Em andamento' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStatus(s.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      selectedStatus === s.id
                        ? 'bg-[#23c65e] text-white font-semibold shadow-sm'
                        : isDark
                        ? 'bg-[#092032] text-slate-400 hover:text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`text-xs font-semibold block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Ordenar Por
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'title', label: 'Ordem Alfabética (A-Z)' },
                  { id: 'rating', label: 'Melhor Avaliados' },
                  { id: 'year', label: 'Ano de Publicação' },
                ].map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setSortBy(o.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      sortBy === o.id
                        ? 'bg-[#23c65e] text-white font-semibold shadow-sm'
                        : isDark
                        ? 'bg-[#092032] text-slate-400 hover:text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-end justify-start sm:justify-end">
              <button
                onClick={() => {
                  setSelectedStatus('todos');
                  setSortBy('title');
                  setSelectedCategory('Todos');
                  setSearchQuery('');
                }}
                className={`text-xs underline cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-rose-400' : 'text-slate-500 hover:text-rose-600'
                }`}
              >
                Resetar todos os filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter Pills (with vibrant custom colors) */}
      <div className="flex items-center gap-2.5 overflow-x-auto pt-3 pb-3 px-1 mb-5 no-scrollbar -mx-1">
        {CATEGORIES.map((category, index) => {
          const color = getCategoryColor(category, index);
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              id={`filter-cat-${category.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm ${
                color.bg
              } ${color.hover} text-white ${
                isSelected
                  ? `scale-105 shadow-md ring-2 ring-white ring-offset-2 ${
                      isDark ? 'ring-offset-[#071828]' : 'ring-offset-slate-100'
                    } brightness-110 z-10 opacity-100 font-extrabold`
                  : 'opacity-90 hover:opacity-100 hover:scale-[1.03]'
              }`}
            >
              {isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />
              )}
              <span>{category}</span>
            </button>
          );
        })}
      </div>

      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <div
          className={`border rounded-2xl p-12 text-center my-8 ${
            isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Nenhum livro encontrado
          </h3>
          <p className={`text-sm max-w-md mx-auto mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Não encontramos livros para o termo buscado ou filtro selecionado.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Todos');
              setSelectedStatus('todos');
            }}
            className="px-4 py-2 rounded-xl bg-[#23c65e] text-white text-xs font-semibold cursor-pointer shadow-sm"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              id={`catalog-book-${book.id}`}
              onClick={() => onSelectBook(book)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectBook(book);
                }
              }}
              title="Clique para ver os detalhes do livro"
              className={`group border rounded-2xl p-3 sm:p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 cursor-pointer select-none ${
                isDark
                  ? 'bg-[#180932] border-[#3e196e] hover:border-[#a855f7] hover:shadow-[0_12px_30px_rgba(0,0,0,0.5),0_0_18px_rgba(168,85,247,0.25)]'
                  : 'bg-white border-slate-200 hover:border-[#a855f7] hover:shadow-lg shadow-sm'
              }`}
            >
              <div>
                {/* Book Cover with Status Pill */}
                <div
                  className={`relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-3 border ${
                    isDark ? 'bg-[#0f0420] border-[#3e196e]/60' : 'bg-slate-100 border-slate-200'
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
                    {getStatusBadge(book.status)}
                  </div>
                </div>

                {/* Info */}
                <h3
                  className={`text-sm sm:text-base font-bold transition-colors line-clamp-1 ${
                    isDark
                      ? 'text-white group-hover:text-[#c084fc]'
                      : 'text-slate-900 group-hover:text-[#9333ea]'
                  }`}
                >
                  {book.title}
                </h3>
                <p className={`text-xs line-clamp-1 mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {book.author}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    {book.rating}
                  </span>
                  <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                    ({book.reviewsCount})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

