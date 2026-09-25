import React, { useState, useEffect } from 'react';
import { X, Check, BookOpen, Image as ImageIcon } from 'lucide-react';
import { Book } from '../types';
import { CATEGORIES } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBook: (book: Book) => void;
  bookToEdit?: Book | null;
}

export const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  onClose,
  onSaveBook,
  bookToEdit,
}) => {
  const { isDark } = useTheme();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Literatura Brasileira');
  const [year, setYear] = useState<number | string>(new Date().getFullYear());
  const [isbn, setIsbn] = useState('');
  const [totalCopies, setTotalCopies] = useState<number>(1);
  const [availableCopies, setAvailableCopies] = useState<number>(1);
  const [location, setLocation] = useState('Estante 01 - Prateleira A');
  const [cover, setCover] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [pages, setPages] = useState<number | string>(150);
  const [publisher, setPublisher] = useState('Acervo Biblioteca');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title || '');
      setAuthor(bookToEdit.author || '');
      setCategory(bookToEdit.category || 'Literatura Brasileira');
      setYear(bookToEdit.year || new Date().getFullYear());
      setIsbn(bookToEdit.isbn || '');
      setTotalCopies(bookToEdit.totalCopies ?? 1);
      setAvailableCopies(bookToEdit.availableCopies ?? 1);
      setLocation(bookToEdit.location || 'Estante 01 - Prateleira A');
      setCover(
        bookToEdit.cover ||
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80'
      );
      setSynopsis(bookToEdit.synopsis || '');
      setPages(bookToEdit.pages || 150);
      setPublisher(bookToEdit.publisher || 'Acervo Biblioteca');
    } else {
      setTitle('');
      setAuthor('');
      setCategory('Literatura Brasileira');
      setYear(new Date().getFullYear());
      setIsbn('');
      setTotalCopies(1);
      setAvailableCopies(1);
      setLocation('Estante 01 - Prateleira A');
      setCover('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80');
      setSynopsis('');
      setPages(150);
      setPublisher('Acervo Biblioteca');
    }
    setErrors({});
  }, [bookToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'O título do livro é obrigatório.';
    if (!author.trim()) newErrors.author = 'O autor é obrigatório.';
    if (!category.trim()) newErrors.category = 'Selecione uma categoria.';
    if (Number(totalCopies) < 1) newErrors.totalCopies = 'Mínimo de 1 exemplar.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const total = Math.max(1, Number(totalCopies) || 1);
    const available = Math.min(total, Math.max(0, Number(availableCopies) ?? total));

    const bookPayload: Book = {
      id: bookToEdit?.id || `livro-${Date.now()}`,
      title: title.trim(),
      author: author.trim(),
      category: category || 'Literatura Brasileira',
      year: Number(year) || new Date().getFullYear(),
      totalCopies: total,
      availableCopies: available,
      location: location.trim() || 'Estante 01 - Prateleira A',
      isbn: isbn.trim() || 'N/A',
      synopsis: synopsis.trim() || `Livro ${title} por ${author}.`,
      pages: Number(pages) || 150,
      publisher: publisher.trim() || 'Acervo Biblioteca',
      rating: bookToEdit?.rating || 4.8,
      reviewsCount: bookToEdit?.reviewsCount || 10,
      status: available > 0 ? 'disponivel' : 'reservado',
      cover:
        cover.trim() ||
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
      featured: bookToEdit?.featured ?? false,
    };

    onSaveBook(bookPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`border rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150 ${
          isDark ? 'bg-[#071d2b] border-[#163650] text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`p-5 sm:p-6 pb-4 border-b flex items-center justify-between ${
            isDark ? 'border-[#163650] bg-[#001728]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {bookToEdit ? 'Alterar Dados do Livro' : 'Cadastrar Novo Livro'}
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {bookToEdit
                  ? `Editando: ${bookToEdit.title}`
                  : 'Preencha as informações para adicionar a obra ao acervo.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-book-modal"
            onClick={onClose}
            aria-label="Fechar janela"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
              isDark
                ? 'bg-[#0d2a3d] hover:bg-[#163b52] text-slate-300 hover:text-white border-[#1b435b]'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900 border-slate-300'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[62vh] custom-scrollbar text-xs sm:text-sm">
            {/* Título & Autor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block font-semibold mb-1 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Título da Obra <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-book-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Dom Casmurro"
                  className={`w-full px-3.5 py-2.5 rounded-xl focus:outline-none border transition-all ${
                    isDark
                      ? 'bg-[#031522] border-[#163650] focus:border-emerald-500 text-white placeholder-slate-400'
                      : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-400'
                  }`}
                  autoFocus
                />
                {errors.title && (
                  <span className="text-rose-500 text-[11px] mt-1 block">{errors.title}</span>
                )}
              </div>

              <div>
                <label className={`block font-semibold mb-1 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Autor(a) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-book-author"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Ex: Machado de Assis"
                  className={`w-full px-3.5 py-2.5 rounded-xl focus:outline-none border transition-all ${
                    isDark
                      ? 'bg-[#031522] border-[#163650] focus:border-emerald-500 text-white placeholder-slate-400'
                      : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-400'
                  }`}
                />
                {errors.author && (
                  <span className="text-rose-500 text-[11px] mt-1 block">{errors.author}</span>
                )}
              </div>
            </div>

            {/* Categoria, Ano & ISBN */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={`block font-semibold mb-1 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Categoria <span className="text-rose-500">*</span>
                </label>
                <select
                  id="select-book-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl focus:outline-none border transition-all ${
                    isDark
                      ? 'bg-[#031522] border-[#163650] focus:border-emerald-500 text-white'
                      : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-900'
                  }`}
                >
                  {CATEGORIES.filter((c) => c !== 'Todos').map((cat) => (
                    <option key={cat} value={cat} className={isDark ? 'bg-[#071d2b] text-white' : 'bg-white text-slate-900'}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block font-semibold mb-1 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Ano de Publicação
                </label>
                <input
                  id="input-book-year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Ex: 2021"
                  className={`w-full px-3.5 py-2.5 rounded-xl focus:outline-none border transition-all ${
                    isDark
                      ? 'bg-[#031522] border-[#163650] focus:border-emerald-500 text-white placeholder-slate-400'
                      : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Código ISBN
                </label>
                <input
                  id="input-book-isbn"
                  type="text"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  placeholder="Ex: 978-85-0000-00-0"
                  className={`w-full px-3.5 py-2.5 rounded-xl focus:outline-none border transition-all ${
                    isDark
                      ? 'bg-[#031522] border-[#163650] focus:border-emerald-500 text-white placeholder-slate-400'
                      : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* Total, Disponíveis & Localização */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={`block font-semibold mb-1 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Total de Exemplares <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-book-total-copies"
                  type="number"
                  min="1"
                  value={totalCopies}
                  onChange={(e) => {
                    const total = Math.max(1, Number(e.target.value) || 1);
                    setTotalCopies(total);
                    setAvailableCopies(Math.min(total, availableCopies));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl focus:outline-none border transition-all ${
                    isDark
                      ? 'bg-[#031522] border-[#163650] focus:border-emerald-500 text-white'
                      : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-900'
                  }`}
                />
                {errors.totalCopies && (
                  <span className="text-rose-500 text-[11px] mt-1 block">{errors.totalCopies}</span>
                )}
              </div>

              <div>
                <label className={`block font-semibold mb-1 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Exemplares Disponíveis
                </label>
                <input
                  id="input-book-available-copies"
                  type="number"
                  min="0"
                  max={totalCopies}
                  value={availableCopies}
                  onChange={(e) => {
                    const avail = Math.max(0, Math.min(Number(totalCopies), Number(e.target.value) || 0));
                    setAvailableCopies(avail);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl focus:outline-none border transition-all ${
                    isDark
                      ? 'bg-[#031522] border-[#163650] focus:border-emerald-500 text-white'
                      : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Localização na Estante
                </label>
                <input
                  id="input-book-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Estante 02 - Prateleira B"
                  className={`w-full px-3.5 py-2.5 rounded-xl focus:outline-none border transition-all ${
                    isDark
                      ? 'bg-[#031522] border-[#163650] focus:border-emerald-500 text-white placeholder-slate-400'
                      : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* Capa URL com preview */}
            <div>
              <label className={`block font-semibold mb-1 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                URL da Capa
              </label>
              <div className="flex gap-3 items-center">
                <input
                  id="input-book-cover"
                  type="text"
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                  placeholder="https://exemplo.com/capa.jpg"
                  className={`flex-1 px-3.5 py-2.5 rounded-xl focus:outline-none border transition-all text-xs font-mono ${
                    isDark
                      ? 'bg-[#031522] border-[#163650] focus:border-emerald-500 text-white placeholder-slate-400'
                      : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-400'
                  }`}
                />
                {cover && (
                  <img
                    src={cover}
                    alt="Preview da Capa"
                    className={`w-9 h-12 object-cover rounded-lg shrink-0 border shadow-xs ${
                      isDark ? 'bg-[#031522] border-[#163650]' : 'bg-slate-100 border-slate-200'
                    }`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80';
                    }}
                  />
                )}
              </div>
            </div>

            {/* Páginas & Editora */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block font-semibold mb-1 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Número de Páginas
                </label>
                <input
                  id="input-book-pages"
                  type="number"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  placeholder="Ex: 180"
                  className={`w-full px-3.5 py-2.5 rounded-xl focus:outline-none border transition-all ${
                    isDark
                      ? 'bg-[#031522] border-[#163650] focus:border-emerald-500 text-white placeholder-slate-400'
                      : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Editora
                </label>
                <input
                  id="input-book-publisher"
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  placeholder="Ex: Companhia das Letras"
                  className={`w-full px-3.5 py-2.5 rounded-xl focus:outline-none border transition-all ${
                    isDark
                      ? 'bg-[#031522] border-[#163650] focus:border-emerald-500 text-white placeholder-slate-400'
                      : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* Sinopse */}
            <div>
              <label className={`block font-semibold mb-1 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Sinopse / Descrição
              </label>
              <textarea
                id="input-book-synopsis"
                rows={3}
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                placeholder="Breve resumo sobre a obra..."
                className={`w-full px-3.5 py-2.5 rounded-xl focus:outline-none border transition-all resize-none ${
                  isDark
                    ? 'bg-[#031522] border-[#163650] focus:border-emerald-500 text-white placeholder-slate-400'
                    : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div
            className={`p-4 sm:p-5 border-t flex items-center justify-end gap-3 ${
              isDark ? 'bg-[#051724] border-[#163650]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <button
              type="button"
              id="btn-cancel-book-modal"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#092032] hover:bg-[#163650] text-slate-300 border-[#163650]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-submit-book-modal"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>{bookToEdit ? 'Salvar Alterações' : 'Cadastrar Livro'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
