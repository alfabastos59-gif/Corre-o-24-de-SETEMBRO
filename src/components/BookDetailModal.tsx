import React, { useState } from 'react';
import { X, Star, Heart, BookmarkCheck, MapPin, BookOpen, Check, Layers } from 'lucide-react';
import { Book } from '../types';
import { useTheme } from '../context/ThemeContext';
import { getCategoryColor } from '../data/mockData';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
  onRequestLoan: (book: Book) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (bookId: string) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  onClose,
  onRequestLoan,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  if (!book) return null;

  const handleCopyLocation = () => {
    navigator.clipboard?.writeText(book.location);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container: Compacto e equilibrado na tela */}
      <div
        className={`relative z-10 w-full max-w-lg sm:max-w-xl border rounded-2xl p-4 sm:p-5 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 ${
          isDark
            ? 'bg-[#15072e] border-[#3e196e] text-white shadow-[0_20px_50px_rgba(0,0,0,0.7)]'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Botão Fechar discreto no canto */}
        <button
          id="btn-close-book-modal"
          onClick={onClose}
          aria-label="Fechar detalhes do livro"
          className={`absolute top-3.5 right-3.5 p-1.5 rounded-full border transition-colors cursor-pointer z-20 ${
            isDark
              ? 'bg-[#1f0a42] text-slate-300 hover:text-white border-[#3e196e]'
              : 'bg-slate-100 text-slate-500 hover:text-slate-900 border-slate-200'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto pr-1 space-y-3.5">
          {/* Top Header: Capa compacta + Título, Autor e Status */}
          <div className="flex gap-3.5 sm:gap-4 items-start">
            {/* Capa com proporção 3:4 compacta */}
            <div
              className={`relative aspect-[3/4] w-24 sm:w-28 shrink-0 rounded-xl overflow-hidden border shadow-md ${
                isDark ? 'bg-[#0e0321] border-[#3e196e]' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <img
                src={book.cover}
                alt={book.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop&q=80';
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-1.5 left-1.5">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
                    book.status === 'disponivel'
                      ? 'bg-emerald-500 text-white'
                      : book.status === 'reservado'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {book.status === 'disponivel'
                    ? 'Disponível'
                    : book.status === 'reservado'
                    ? 'Reservado'
                    : 'Em andamento'}
                </span>
              </div>
            </div>

            {/* Metadados Principais */}
            <div className="flex-1 min-w-0 pr-6">
              <span
                className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-1 text-white ${
                  getCategoryColor(book.category).bg
                }`}
              >
                {book.category}
              </span>
              <h2
                className={`text-base sm:text-lg font-extrabold leading-snug line-clamp-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {book.title}
              </h2>
              <p className={`text-xs sm:text-sm font-medium mb-1.5 ${isDark ? 'text-purple-300' : 'text-slate-600'}`}>
                {book.author}
              </p>

              {/* Avaliação e Exemplares */}
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <div className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="ml-1 font-bold">{book.rating}</span>
                </div>
                <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  ({book.reviewsCount} avaliações)
                </span>
                <span className={`text-[11px] flex items-center gap-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  <Layers className="w-3 h-3" />
                  {book.availableCopies} de {book.totalCopies} disp.
                </span>
              </div>
            </div>
          </div>

          {/* Grid de Ficha Técnica Compacta */}
          <div
            className={`grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-xl border text-xs ${
              isDark ? 'bg-[#0f0422] border-[#2f1155]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Ano</span>
              <span className="font-semibold text-white">{book.year}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Páginas</span>
              <span className="font-semibold text-white">{book.pages}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Editora</span>
              <span className="font-semibold truncate block text-white" title={book.publisher}>
                {book.publisher}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Local</span>
              <button
                onClick={handleCopyLocation}
                title="Clique para copiar a localização"
                className="font-semibold text-purple-300 hover:text-purple-200 flex items-center gap-1 truncate text-left cursor-pointer"
              >
                <MapPin className="w-3 h-3 shrink-0 text-purple-400" />
                <span className="truncate">{book.location}</span>
                {copied && <Check className="w-3 h-3 text-emerald-400 shrink-0" />}
              </button>
            </div>
          </div>

          {/* Sinopse / Sobre o Livro */}
          <div className="space-y-1">
            <h4
              className={`text-xs font-bold flex items-center gap-1.5 ${
                isDark ? 'text-purple-200' : 'text-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Sobre o livro</span>
            </h4>
            <div
              className={`p-2.5 rounded-xl text-xs leading-relaxed max-h-24 sm:max-h-28 overflow-y-auto border ${
                isDark
                  ? 'bg-[#0f0422]/60 border-[#2f1155]/80 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <p>{book.synopsis}</p>
            </div>
          </div>

          {/* Botões de Ação Compactos */}
          <div className="flex items-center gap-2 pt-1">
            <button
              id="btn-solicitar-emprestimo-modal"
              onClick={() => onRequestLoan(book)}
              disabled={book.availableCopies === 0}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                book.availableCopies > 0
                  ? 'bg-purple-600 hover:bg-purple-500 text-white'
                  : isDark
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>
                {book.availableCopies > 0 ? 'Solicitar Empréstimo' : 'Indisponível no Momento'}
              </span>
            </button>

            <button
              id="btn-favoritos-modal"
              onClick={() => onToggleFavorite?.(book.id)}
              aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                  : isDark
                  ? 'bg-[#1f0a42] text-slate-300 border-[#3e196e] hover:text-white'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
