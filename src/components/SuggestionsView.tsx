import React, { useState } from 'react';
import { Plus, CheckCircle2, Clock, Check, ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Suggestion } from '../types';
import { useTheme } from '../context/ThemeContext';
import { validateBookSuggestion } from '../utils/profanityFilter';

interface SuggestionsViewProps {
  suggestions: Suggestion[];
  onAddSuggestion: (suggestion: Omit<Suggestion, 'id' | 'date' | 'status'>) => void;
}

export const SuggestionsView: React.FC<SuggestionsViewProps> = ({
  suggestions,
  onAddSuggestion,
}) => {
  const { isDark } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Literatura');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [flaggedFields, setFlaggedFields] = useState<string[]>([]);

  const handleOpenModal = () => {
    setValidationError(null);
    setFlaggedFields([]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setValidationError(null);
    setFlaggedFields([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setFlaggedFields([]);

    if (!bookTitle.trim() || !author.trim() || !studentName.trim()) {
      setValidationError('Por favor, preencha os campos obrigatórios.');
      return;
    }

    // Validação rigorosa de moderação contra palavras obscenas, palavrões e ofensas
    const validation = validateBookSuggestion({
      studentName,
      bookTitle,
      author,
      reason,
    });

    if (!validation.isValid) {
      setValidationError(validation.errorMessage || 'Linguagem inapropriada detectada.');
      setFlaggedFields(validation.flaggedFields);
      return;
    }

    onAddSuggestion({
      studentName: studentName.trim(),
      bookTitle: bookTitle.trim(),
      author: author.trim(),
      category,
      reason: reason.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowModal(false);
      setBookTitle('');
      setAuthor('');
      setStudentName('');
      setReason('');
      setValidationError(null);
      setFlaggedFields([]);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Sugestões de Livros
            </h1>
            <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${
              isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Ambiente Moderado</span>
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Indique novos títulos e autores para o acervo da Biblioteca Maria Quitéria
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 bg-[#23c65e] hover:bg-[#1fa950] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Sugerir Livro</span>
        </button>
      </div>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {suggestions.map((item) => (
          <div
            key={item.id}
            className={`border rounded-2xl p-5 flex flex-col justify-between transition-all ${
              isDark
                ? 'bg-[#092032] border-[#163650] hover:border-emerald-500/40'
                : 'bg-white border-slate-200 hover:border-emerald-300 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    isDark
                      ? 'bg-[#133e4a] text-emerald-400 border-emerald-500/30'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {item.category}
                </span>
                {item.status === 'aprovado' ? (
                  <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Aprovado
                  </span>
                ) : (
                  <span className="bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Em análise
                  </span>
                )}
              </div>

              <h3 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.bookTitle}</h3>
              <p className={`text-xs font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>por {item.author}</p>

              <div
                className="p-3.5 rounded-xl border text-xs sm:text-sm mb-4 leading-relaxed bg-[#001424] text-slate-200 border-[#163650] shadow-sm font-normal"
              >
                "{item.reason || 'Livro recomendado para o acervo.'}"
              </div>
            </div>

            <div className={`flex items-center justify-between text-[11px] pt-3 border-t ${isDark ? 'text-slate-400 border-[#163650]/60' : 'text-slate-500 border-slate-100'}`}>
              <span>Sugerido por <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{item.studentName}</strong></span>
              <span>{item.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Suggestion Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={handleCloseModal} />
          <div
            className={`relative z-10 w-full max-w-lg border rounded-3xl p-6 sm:p-8 shadow-2xl ${
              isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200'
            }`}
          >
            {submitted ? (
              <div className="py-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Sugestão Enviada!</h3>
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Obrigado por ajudar a enriquecer nossa biblioteca.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Sugerir Novo Livro</h3>
                  <span className={`text-[10px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-full border ${
                    isDark ? 'bg-[#001424] text-slate-300 border-[#163650]' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Filtro Ativo
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Preencha as informações do livro que você gostaria de ver na biblioteca.
                </p>

                {/* Mensagem de Erro de Validação / Termo Inapropriado */}
                {validationError && (
                  <div className={`p-3.5 rounded-2xl border flex items-start gap-2.5 text-xs animate-in fade-in duration-150 ${
                    isDark
                      ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                      : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}>
                    <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <strong className="block font-bold mb-0.5">Aviso de Moderação Escolar</strong>
                      <span>{validationError}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className={`text-xs font-semibold block mb-1 ${
                    flaggedFields.includes('studentName')
                      ? 'text-rose-500 font-bold'
                      : isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Seu Nome: {flaggedFields.includes('studentName') && <span className="text-rose-500">(Termo inadequado detectado)</span>}
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => {
                      setStudentName(e.target.value);
                      if (flaggedFields.includes('studentName')) {
                        setFlaggedFields(prev => prev.filter(f => f !== 'studentName'));
                        setValidationError(null);
                      }
                    }}
                    placeholder="Ex: João da Silva"
                    className={`w-full text-sm px-3 py-2.5 rounded-xl border focus:outline-none transition-all ${
                      flaggedFields.includes('studentName')
                        ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-500/10'
                        : isDark
                        ? 'bg-[#031320] text-white border-[#163650] focus:border-emerald-500'
                        : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-[#23c65e]'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`text-xs font-semibold block mb-1 ${
                      flaggedFields.includes('bookTitle')
                        ? 'text-rose-500 font-bold'
                        : isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Título do Livro: {flaggedFields.includes('bookTitle') && <span className="text-rose-500">(Inadequado)</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={bookTitle}
                      onChange={(e) => {
                        setBookTitle(e.target.value);
                        if (flaggedFields.includes('bookTitle')) {
                          setFlaggedFields(prev => prev.filter(f => f !== 'bookTitle'));
                          setValidationError(null);
                        }
                      }}
                      placeholder="Ex: Torto Arado"
                      className={`w-full text-sm px-3 py-2.5 rounded-xl border focus:outline-none transition-all ${
                        flaggedFields.includes('bookTitle')
                          ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-500/10'
                          : isDark
                          ? 'bg-[#031320] text-white border-[#163650] focus:border-emerald-500'
                          : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-[#23c65e]'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-semibold block mb-1 ${
                      flaggedFields.includes('author')
                        ? 'text-rose-500 font-bold'
                        : isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Autor: {flaggedFields.includes('author') && <span className="text-rose-500">(Inadequado)</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={author}
                      onChange={(e) => {
                        setAuthor(e.target.value);
                        if (flaggedFields.includes('author')) {
                          setFlaggedFields(prev => prev.filter(f => f !== 'author'));
                          setValidationError(null);
                        }
                      }}
                      placeholder="Ex: Itamar Vieira"
                      className={`w-full text-sm px-3 py-2.5 rounded-xl border focus:outline-none transition-all ${
                        flaggedFields.includes('author')
                          ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-500/10'
                          : isDark
                          ? 'bg-[#031320] text-white border-[#163650] focus:border-emerald-500'
                          : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-[#23c65e]'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`text-xs font-semibold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Categoria:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full text-sm px-3 py-2.5 rounded-xl border focus:outline-none transition-all ${
                      isDark
                        ? 'bg-[#031320] text-white border-[#163650] focus:border-emerald-500'
                        : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-[#23c65e]'
                    }`}
                  >
                    <option value="Literatura">Literatura</option>
                    <option value="Romance">Romance</option>
                    <option value="Ficção Científica">Ficção Científica</option>
                    <option value="Aventura">Aventura</option>
                    <option value="História">História</option>
                    <option value="Infantil">Infantil</option>
                  </select>
                </div>

                <div>
                  <label className={`text-xs font-semibold block mb-1 ${
                    flaggedFields.includes('reason')
                      ? 'text-rose-500 font-bold'
                      : isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Por que devemos adquirir este livro? {flaggedFields.includes('reason') && <span className="text-rose-500">(Termo inadequado detectado)</span>}
                  </label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      if (flaggedFields.includes('reason')) {
                        setFlaggedFields(prev => prev.filter(f => f !== 'reason'));
                        setValidationError(null);
                      }
                    }}
                    placeholder="Conte o motivo ou a relevância pedagógica..."
                    className={`w-full text-sm px-3 py-2 rounded-xl border focus:outline-none transition-all ${
                      flaggedFields.includes('reason')
                        ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-500/10'
                        : isDark
                        ? 'bg-[#031320] text-white border-[#163650] focus:border-emerald-500'
                        : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-[#23c65e]'
                    }`}
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                      isDark
                        ? 'bg-[#031320] text-slate-300 border-[#163650] hover:text-white'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#23c65e] hover:bg-[#1fa950] text-white text-xs font-bold shadow-sm cursor-pointer"
                  >
                    Enviar Sugestão
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


