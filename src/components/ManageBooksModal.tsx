import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Pencil,
  Trash2,
  Plus,
  BookOpen,
  Check,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { Book } from '../types';
import { CATEGORIES } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

interface ManageBooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  onSaveBook: (updatedBook: Book) => void;
  onCreateBook: (newBook: Book) => void;
  onDeleteBook: (bookId: string) => void;
}

export const ManageBooksModal: React.FC<ManageBooksModalProps> = ({
  isOpen,
  onClose,
  books,
  onSaveBook,
  onCreateBook,
  onDeleteBook,
}) => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for Editing/Creating
  const [formData, setFormData] = useState<Partial<Book>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filter books by search term and sort alphabetically by title
  const filteredBooks = useMemo(() => {
    const list = !searchTerm.trim()
      ? [...books]
      : books.filter(
          (b) =>
            b.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
            b.author.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
            b.category.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
            (b.isbn && b.isbn.toLowerCase().includes(searchTerm.toLowerCase().trim()))
        );
    return list.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' }));
  }, [books, searchTerm]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Open Edit Mode
  const handleStartEdit = (book: Book) => {
    setEditingBook(book);
    setIsCreatingNew(false);
    setFormData({ ...book });
    setFormErrors({});
  };

  // Open Create Mode
  const handleStartCreate = () => {
    setIsCreatingNew(true);
    setEditingBook(null);
    setFormData({
      id: `livro-${Date.now()}`,
      title: '',
      author: '',
      category: 'Literatura Brasileira',
      year: new Date().getFullYear(),
      totalCopies: 1,
      availableCopies: 1,
      location: 'Estante 01 - Prateleira A',
      isbn: '',
      synopsis: '',
      pages: 150,
      publisher: 'Acervo Biblioteca',
      rating: 4.8,
      reviewsCount: 10,
      status: 'disponivel',
      cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
    });
    setFormErrors({});
  };

  // Validate and Save
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.title?.trim()) errors.title = 'O título do livro é obrigatório.';
    if (!formData.author?.trim()) errors.author = 'O autor é obrigatório.';
    if (!formData.category?.trim()) errors.category = 'Selecione uma categoria.';
    if (!formData.totalCopies || formData.totalCopies < 1) errors.totalCopies = 'Mínimo de 1 exemplar.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const totalCopies = Number(formData.totalCopies) || 1;
    const availableCopies = Math.min(
      totalCopies,
      Math.max(0, Number(formData.availableCopies ?? totalCopies))
    );

    const bookPayload: Book = {
      id: formData.id || `livro-${Date.now()}`,
      title: formData.title!.trim(),
      author: formData.author!.trim(),
      category: formData.category || 'Literatura Brasileira',
      year: Number(formData.year) || new Date().getFullYear(),
      totalCopies,
      availableCopies,
      location: formData.location?.trim() || 'Estante 01 - Prateleira A',
      isbn: formData.isbn?.trim() || 'N/A',
      synopsis: formData.synopsis?.trim() || `Livro ${formData.title} por ${formData.author}.`,
      pages: Number(formData.pages) || 160,
      publisher: formData.publisher?.trim() || 'Acervo Biblioteca',
      rating: Number(formData.rating) || 4.8,
      reviewsCount: Number(formData.reviewsCount) || 12,
      status: availableCopies > 0 ? 'disponivel' : 'reservado',
      cover:
        formData.cover?.trim() ||
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
      featured: formData.featured ?? false,
    };

    if (isCreatingNew) {
      onCreateBook(bookPayload);
      showToast(`Livro "${bookPayload.title}" cadastrado com sucesso!`);
    } else {
      onSaveBook(bookPayload);
      showToast(`Alterações em "${bookPayload.title}" salvas com sucesso!`);
    }

    setEditingBook(null);
    setIsCreatingNew(false);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!bookToDelete) return;
    onDeleteBook(bookToDelete.id);
    showToast(`Livro "${bookToDelete.title}" excluído do acervo.`);
    setBookToDelete(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className={`border rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150 relative ${
        isDark ? 'bg-[#071d2b] border-[#163650] text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. LIST VIEW */}
        {!editingBook && !isCreatingNew && (
          <>
            {/* Top Header */}
            <div className={`p-5 sm:p-6 pb-4 flex items-start justify-between border-b ${
              isDark ? 'border-[#163650]/60' : 'border-slate-100'
            }`}>
              <div>
                <h2 className={`text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <span>Gerenciar livros</span>
                </h2>
                <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Busque, altere ou exclua livros do acervo.
                </p>
              </div>

              {/* Close Button */}
              <button
                id="btn-close-manage-books"
                onClick={onClose}
                aria-label="Fechar janela"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer border shrink-0 ${
                  isDark
                    ? 'bg-[#0d2a3d] hover:bg-[#163b52] text-slate-300 hover:text-white border-[#1b435b]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-200'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="px-5 sm:px-6 my-4">
              <div className="relative">
                <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
                <input
                  id="input-manage-books-search"
                  type="text"
                  placeholder="Buscar por título, autor, categoria ou ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm focus:outline-none transition-all border ${
                    isDark
                      ? 'bg-[#031522] border-[#144754] focus:border-emerald-500 text-white placeholder-slate-400'
                      : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-400'
                  }`}
                  autoFocus
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs p-1 rounded-full ${
                      isDark ? 'text-slate-400 hover:text-white bg-[#0d2a3d]' : 'text-slate-500 hover:text-slate-900 bg-slate-200'
                    }`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Books List (Scrollable) */}
            <div className={`flex-1 overflow-y-auto px-5 sm:px-6 divide-y space-y-0.5 max-h-[52vh] ${
              isDark ? 'divide-[#102d42]' : 'divide-slate-100'
            }`}>
              {filteredBooks.length === 0 ? (
                <div className={`py-12 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">Nenhum livro encontrado para "{searchTerm}"</p>
                  <p className="text-xs mt-1">Verifique a ortografia ou cadastre um novo título.</p>
                </div>
              ) : (
                filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    className={`py-3 sm:py-3.5 flex items-center justify-between gap-3 group rounded-xl px-2 -mx-2 transition-colors ${
                      isDark ? 'hover:bg-[#092233]/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Left: Thumbnail & Meta */}
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className={`w-10 h-14 object-cover rounded-lg shrink-0 shadow-sm border ${
                          isDark ? 'bg-[#020e17] border-[#163650]' : 'bg-slate-100 border-slate-200'
                        }`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="min-w-0">
                        <h4 className={`text-xs sm:text-sm font-bold truncate group-hover:text-emerald-500 transition-colors ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {book.title}
                        </h4>
                        <div className={`text-[11px] truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          <span>{book.author}</span>
                          {book.year ? <span> · {book.year}</span> : null}
                          <span> · Acervo: {book.totalCopies}</span>
                          <span> · Disponíveis: {book.availableCopies}</span>
                        </div>
                        <div className="mt-1">
                          {book.availableCopies > 0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                              Disponível
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[10px] font-semibold">
                              Indisponível
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        id={`btn-edit-book-${book.id}`}
                        onClick={() => handleStartEdit(book)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer shadow-sm active:scale-95 ${
                          isDark
                            ? 'bg-[#0e2738] hover:bg-[#163950] text-slate-200 hover:text-white border-[#1b435b]'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200'
                        }`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Alterar</span>
                      </button>

                      <button
                        id={`btn-delete-book-${book.id}`}
                        onClick={() => setBookToDelete(book)}
                        className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Footer */}
            <div className={`p-4 sm:p-5 border-t flex items-center justify-between gap-4 ${
              isDark ? 'bg-[#051724] border-[#163650]' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Mostrando <strong className={isDark ? 'text-white' : 'text-slate-900'}>{filteredBooks.length}</strong> de{' '}
                <strong className={isDark ? 'text-white' : 'text-slate-900'}>{books.length}</strong> livros
              </span>
              <button
                id="btn-add-new-book"
                onClick={handleStartCreate}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Novo Livro</span>
              </button>
            </div>
          </>
        )}

        {/* 2. EDIT / CREATE FORM VIEW */}
        {(editingBook || isCreatingNew) && (
          <form onSubmit={handleSaveForm} className="flex flex-col flex-1 overflow-hidden">
            {/* Header */}
            <div className={`p-5 sm:p-6 pb-4 border-b flex items-center justify-between ${
              isDark ? 'border-[#163650] bg-[#001728]' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBook(null);
                    setIsCreatingNew(false);
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
                    isDark
                      ? 'bg-[#0d2a3d] hover:bg-[#163b52] text-slate-300 hover:text-white border-[#1b435b]'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900 border-slate-300'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isCreatingNew ? 'Cadastrar Novo Livro' : 'Alterar Dados do Livro'}
                  </h2>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isCreatingNew
                      ? 'Preencha as informações para adicionar ao acervo.'
                      : `Editando: ${editingBook?.title}`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
                  isDark
                    ? 'bg-[#0d2a3d] hover:bg-[#163b52] text-slate-300 hover:text-white border-[#1b435b]'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900 border-slate-300'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Fields Body (Scrollable) */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[60vh] custom-scrollbar text-xs sm:text-sm">
              {/* Título & Autor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block font-semibold mb-1 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Título da Obra <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Dom Casmurro"
                    className={`w-full px-3.5 py-2.5 rounded-xl focus:outline-none border transition-all ${
                      isDark
                        ? 'bg-[#031522] border-[#163650] focus:border-emerald-500 text-white placeholder-slate-400'
                        : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  {formErrors.title && (
                    <span className="text-rose-500 text-[11px] mt-1 block">{formErrors.title}</span>
                  )}
                </div>

                <div>
                  <label className={`block font-semibold mb-1 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Autor(a) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.author || ''}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Ex: Machado de Assis"
                    className={`w-full px-3.5 py-2.5 rounded-xl focus:outline-none border transition-all ${
                      isDark
                        ? 'bg-[#031522] border-[#163650] focus:border-emerald-500 text-white placeholder-slate-400'
                        : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  {formErrors.author && (
                    <span className="text-rose-500 text-[11px] mt-1 block">{formErrors.author}</span>
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
                    value={formData.category || 'Literatura Brasileira'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                    type="number"
                    value={formData.year || ''}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    placeholder="Ex: 2018"
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
                    type="text"
                    value={formData.isbn || ''}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    placeholder="Ex: 978-85-0000-00-0"
                    className={`w-full px-3.5 py-2.5 rounded-xl focus:outline-none border transition-all ${
                      isDark
                        ? 'bg-[#031522] border-[#163650] focus:border-emerald-500 text-white placeholder-slate-400'
                        : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>

              {/* Quantidade Total, Quantidade Disponível & Localização */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={`block font-semibold mb-1 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Total de Exemplares <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalCopies ?? 1}
                    onChange={(e) => {
                      const total = Number(e.target.value);
                      setFormData({
                        ...formData,
                        totalCopies: total,
                        availableCopies: Math.min(total, formData.availableCopies ?? total),
                      });
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
                    Exemplares Disponíveis
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={formData.totalCopies ?? 1}
                    value={formData.availableCopies ?? 1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availableCopies: Number(e.target.value),
                      })
                    }
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
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: Estante 02 - Prateleira B"
                    className={`w-full px-3.5 py-2.5 rounded-xl focus:outline-none border transition-all ${
                      isDark
                        ? 'bg-[#031522] border-[#163650] focus:border-emerald-500 text-white placeholder-slate-400'
                        : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>

              {/* Capa URL */}
              <div>
                <label className={`block font-semibold mb-1 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  URL da Imagem da Capa
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={formData.cover || ''}
                    onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                    placeholder="https://exemplo.com/capa.jpg"
                    className={`flex-1 px-3.5 py-2.5 rounded-xl focus:outline-none border transition-all text-xs font-mono ${
                      isDark
                        ? 'bg-[#031522] border-[#163650] focus:border-emerald-500 text-white placeholder-slate-400'
                        : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  {formData.cover && (
                    <img
                      src={formData.cover}
                      alt="Preview da Capa"
                      className={`w-9 h-12 object-cover rounded-lg shrink-0 border ${
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

              {/* Sinopse / Descrição */}
              <div>
                <label className={`block font-semibold mb-1 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Sinopse / Descrição da Obra
                </label>
                <textarea
                  rows={3}
                  value={formData.synopsis || ''}
                  onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                  placeholder="Escreva breve resumo sobre o enredo ou conteúdo do livro..."
                  className={`w-full px-3.5 py-2.5 rounded-xl focus:outline-none border transition-all resize-none ${
                    isDark
                      ? 'bg-[#031522] border-[#163650] focus:border-emerald-500 text-white placeholder-slate-400'
                      : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* Form Footer Actions */}
            <div className={`p-4 sm:p-5 border-t flex items-center justify-end gap-3 ${
              isDark ? 'bg-[#051724] border-[#163650]' : 'bg-slate-50 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => {
                  setEditingBook(null);
                  setIsCreatingNew(false);
                }}
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
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{isCreatingNew ? 'Cadastrar Livro' : 'Salvar Alterações'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {bookToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className={`border border-rose-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 ${
            isDark ? 'bg-[#092032] text-white' : 'bg-white text-slate-900'
          }`}>
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Excluir Livro do Acervo?</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Esta ação removerá o título da biblioteca.</p>
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
              isDark ? 'bg-[#031522] border-[#163650]' : 'bg-slate-50 border-slate-200'
            }`}>
              <img
                src={bookToDelete.cover}
                alt={bookToDelete.title}
                className={`w-10 h-14 object-cover rounded-lg shrink-0 border ${
                  isDark ? 'border-[#163650]' : 'border-slate-200'
                }`}
              />
              <div className="min-w-0">
                <h4 className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{bookToDelete.title}</h4>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{bookToDelete.author}</p>
                <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">{bookToDelete.category}</p>
              </div>
            </div>

            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Tem certeza que deseja remover este livro? Caso haja empréstimos associados no histórico, eles permanecerão registrados.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBookToDelete(null)}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-xs border transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#071d2b] hover:bg-[#163650] text-slate-300 border-[#163650]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

