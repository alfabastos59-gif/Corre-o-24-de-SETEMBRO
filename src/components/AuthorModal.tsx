import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Feather,
  BookOpen,
  Quote,
  AlertCircle,
  Check,
  Plus,
  Trash2,
  Star,
  ChevronDown,
  ChevronUp,
  Eye,
  Link as LinkIcon
} from 'lucide-react';
import { AuthorItem } from '../types';
import { useTheme } from '../context/ThemeContext';

interface QuoteEntry {
  id: string;
  text: string;
  source: string;
}

interface AuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (author: AuthorItem) => void;
  authorToEdit?: AuthorItem | null;
}

// Exemplos de fotos de domínio público / referências de grandes escritores
const SUGGESTED_AVATARS = [
  {
    name: 'Manoel de Barros',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Manoel_Ramos_de_Barros.jpg'
  },
  {
    name: 'Machado de Assis',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Machado_de_Assis_real.jpg'
  },
  {
    name: 'Clarice Lispector',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Clarice_Lispector.jpg'
  },
  {
    name: 'Conceição Evaristo',
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Concei%C3%A7%C3%A3o_Evaristo_em_2019.jpg'
  },
  {
    name: 'Guimarães Rosa',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Jo%C3%A3o_Guimar%C3%A3es_Rosa_%281967%29.jpg'
  },
  {
    name: 'Carolina Maria de Jesus',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Carolina_Maria_de_Jesus_1960.jpg'
  },
  {
    name: 'Ariano Suassuna',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Ariano_Suassuna_%281980%29.jpg'
  },
  {
    name: 'Cora Coralina',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Cora_Coralina.jpg'
  }
];

export const AuthorModal: React.FC<AuthorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  authorToEdit
}) => {
  const { isDark, isEmerald, isPurple } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [period, setPeriod] = useState('');
  const [role, setRole] = useState('');
  const [tag, setTag] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [active, setActive] = useState(true);

  // Lista dinâmica de frases semanais
  const [quotes, setQuotes] = useState<QuoteEntry[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);

  useEffect(() => {
    if (authorToEdit) {
      setName(authorToEdit.name || '');
      setPeriod(authorToEdit.period || '');
      setRole(authorToEdit.role || '');
      setTag(authorToEdit.tag || '');
      setPhotoUrl(authorToEdit.photoUrl || '');
      setReferenceUrl(authorToEdit.referenceUrl || '');
      setActive(authorToEdit.active !== false);

      // Carrega frases existentes: a principal + as adicionais
      const initialQuotes: QuoteEntry[] = [];
      if (authorToEdit.featuredQuote) {
        initialQuotes.push({
          id: 'q-1',
          text: authorToEdit.featuredQuote,
          source: authorToEdit.quoteSource || ''
        });
      }
      if (authorToEdit.additionalQuotes && authorToEdit.additionalQuotes.length > 0) {
        authorToEdit.additionalQuotes.forEach((aq, idx) => {
          if (aq.text && aq.text !== authorToEdit.featuredQuote) {
            initialQuotes.push({
              id: `q-${idx + 2}`,
              text: aq.text,
              source: aq.source || ''
            });
          }
        });
      }
      // Se não havia nenhuma frase, adiciona 1 vazia
      if (initialQuotes.length === 0) {
        initialQuotes.push({ id: 'q-1', text: '', source: '' });
      }
      setQuotes(initialQuotes);
    } else {
      setName('');
      setPeriod('');
      setRole('');
      setTag('Literatura Brasileira');
      setPhotoUrl('');
      setReferenceUrl('');
      setActive(true);
      setQuotes([
        { id: 'q-1', text: '', source: '' }
      ]);
    }
    setErrors({});
    setImagePreviewError(false);
  }, [authorToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, photo: 'A imagem deve ter no máximo 3MB' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        setImagePreviewError(false);
        setErrors((prev) => {
          const next = { ...prev };
          delete next.photo;
          return next;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddQuote = () => {
    setQuotes((prev) => [
      ...prev,
      { id: `quote-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, text: '', source: '' }
    ]);
  };

  const handleRemoveQuote = (index: number) => {
    if (quotes.length <= 1) {
      // Limpa os campos da única frase em vez de remover
      setQuotes([{ id: quotes[0].id, text: '', source: '' }]);
      return;
    }
    setQuotes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuoteChange = (index: number, field: 'text' | 'source', value: string) => {
    setQuotes((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleMakeQuotePrimary = (index: number) => {
    if (index === 0) return;
    setQuotes((prev) => {
      const item = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [item, ...rest];
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Nome do escritor é obrigatório';
    if (!period.trim()) newErrors.period = 'Período ou anos do escritor é obrigatório';
    if (!photoUrl.trim()) newErrors.photo = 'A foto do escritor é obrigatória para aparecer no HeroBanner';

    const validQuotes = quotes.filter((q) => q.text.trim().length > 0);
    if (validQuotes.length === 0) {
      newErrors.quotes = 'Cadastre pelo menos 1 frase semanal para o escritor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const validQuotes = quotes.filter((q) => q.text.trim().length > 0);
    const primaryQuote = validQuotes[0];
    const otherQuotes = validQuotes.slice(1).map((q) => ({
      text: q.text.trim(),
      source: q.source.trim() || undefined
    }));

    const newAuthor: AuthorItem = {
      id: authorToEdit?.id || `author-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: name.trim(),
      period: period.trim(),
      role: role.trim() || 'Escritor(a) em Destaque',
      tag: tag.trim() || 'Literatura',
      photoUrl: photoUrl.trim(),
      featuredQuote: primaryQuote.text.trim(),
      quoteSource: primaryQuote.source.trim() || '',
      referenceUrl: referenceUrl.trim() || undefined,
      additionalQuotes: otherQuotes,
      active,
      createdAt: authorToEdit?.createdAt || new Date().toISOString()
    };

    onSave(newAuthor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div
        className={`relative w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden my-6 transition-all ${
          isEmerald
            ? 'bg-[#061f30] border-[#0c4061] text-white'
            : isPurple
            ? 'bg-[#1f0b3b] border-[#3e196e] text-white'
            : isDark
            ? 'bg-[#092032] border-[#163650] text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? 'border-white/10 bg-black/25' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${
                isEmerald
                  ? 'bg-[#00e676]/20 text-[#00e676] border border-emerald-500/30'
                  : isPurple
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
              }`}
            >
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black">
                {authorToEdit ? 'Editar Escritor em Destaque' : 'Cadastrar Escritor em Destaque'}
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Configure nome, foto e frases semanais para o HeroBanner da página inicial
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLivePreview(!showLivePreview)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                showLivePreview
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : isDark
                  ? 'border-white/10 hover:bg-white/10 text-slate-300'
                  : 'border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showLivePreview ? 'Fechar Prévia' : 'Prévia'}</span>
            </button>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/10 hover:bg-white/10 text-slate-400 hover:text-white'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-900'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Preview Dropdown if opened */}
        {showLivePreview && (
          <div
            className={`p-5 border-b flex flex-col items-center justify-center ${
              isDark ? 'bg-black/50 border-white/10' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Prévia do Poster no HeroBanner (Foto com a Frase Embaixo):
            </span>
            <div
              className="w-full max-w-xs rounded-3xl overflow-hidden shadow-2xl border border-[#2d2116] bg-[#0d0906]"
              style={{ backgroundColor: '#0d0906' }}
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#18110b]">
                {photoUrl && !imagePreviewError ? (
                  <img src={photoUrl} alt="" className="w-full h-full object-cover object-center" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs">
                    <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                    <span>Sem foto</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0d0906] to-transparent pointer-events-none" />
                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-black/60 text-[#d5ba82] border border-[#d5ba82]/30">
                    Autor da Semana
                  </span>
                </div>
              </div>
              <div className="p-4 text-center flex flex-col items-center justify-center space-y-2 bg-[#0d0906]">
                <blockquote className="text-[#ecd39f] font-serif text-sm font-bold leading-snug">
                  <span className="text-[#c79b4b] mr-1 text-base leading-none">❝</span>
                  {quotes[0]?.text || 'A frase cadastrada aparecerá aqui.'}
                  <span className="text-[#c79b4b] ml-1 text-base leading-none">❞</span>
                </blockquote>
                <div className="pt-0.5">
                  <h4 className="text-[#d8be8d] font-serif text-xs font-semibold">
                    {name || 'Nome do Escritor'},
                  </h4>
                  {quotes[0]?.source && (
                    <p className="text-[#a48858] font-serif italic text-[11px]">
                      em {quotes[0].source}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Seção 1: Foto do Autor (Upload ou URL) */}
          <div className="space-y-3">
            <label className="block text-xs font-black uppercase tracking-wider text-emerald-400">
              1. Foto do Escritor <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border bg-black/15">
              {/* Foto Preview */}
              <div className="relative shrink-0">
                <div
                  className={`w-24 h-24 rounded-2xl overflow-hidden border-2 flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${
                    isEmerald
                      ? 'border-emerald-400 bg-emerald-950/40'
                      : isPurple
                      ? 'border-purple-400 bg-purple-950/40'
                      : 'border-amber-400 bg-amber-950/20'
                  }`}
                >
                  {photoUrl && !imagePreviewError ? (
                    <img
                      src={photoUrl}
                      alt="Prévia do Autor"
                      referrerPolicy="no-referrer"
                      onError={() => setImagePreviewError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-2 text-center text-xs text-slate-400">
                      <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                      <span>Sem foto</span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shadow">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Controles de URL e Upload */}
              <div className="flex-1 w-full space-y-3">
                <div>
                  <div className="relative">
                    <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      placeholder="Insira a URL direta da imagem (ex: https://.../foto.jpg)"
                      value={photoUrl.startsWith('data:') ? '' : photoUrl}
                      onChange={(e) => {
                        setPhotoUrl(e.target.value);
                        setImagePreviewError(false);
                      }}
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm border transition-all ${
                        isDark
                          ? 'bg-black/30 border-white/15 text-white placeholder-slate-500 focus:border-emerald-400'
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                  {photoUrl.startsWith('data:') && (
                    <p className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Imagem carregada do computador (Base64)
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      isDark
                        ? 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload do Computador (PNG/JPG)</span>
                  </button>

                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="text-xs text-red-400 hover:underline cursor-pointer ml-auto"
                    >
                      Remover foto
                    </button>
                  )}
                </div>

                {/* Sugestões rápidas de fotos de autores */}
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">
                    Sugestões de fotos de grandes autores (clique para aplicar):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_AVATARS.map((sug) => (
                      <button
                        key={sug.name}
                        type="button"
                        onClick={() => {
                          setPhotoUrl(sug.url);
                          setImagePreviewError(false);
                          if (!name) setName(sug.name);
                        }}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                          photoUrl === sug.url
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                            : isDark
                            ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                            : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                        }`}
                      >
                        {sug.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {errors.photo && (
              <p className="text-xs text-red-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.photo}</span>
              </p>
            )}
          </div>

          {/* Seção 2: Dados Biográficos do Escritor */}
          <div className="space-y-3">
            <label className="block text-xs font-black uppercase tracking-wider text-emerald-400">
              2. Dados do Escritor
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                  Nome do Escritor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Manoel de Barros"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${
                    isDark
                      ? 'bg-black/30 border-white/15 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                  Período / Anos de Vida <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: 1916 – 2014"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${
                    isDark
                      ? 'bg-black/30 border-white/15 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                {errors.period && <p className="text-xs text-red-400 mt-1">{errors.period}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                  Título / Reconhecimento
                </label>
                <input
                  type="text"
                  placeholder="Ex: Poeta Pantaneiro • Prêmio Jabuti"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${
                    isDark
                      ? 'bg-black/30 border-white/15 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                  Tag / Categoria Literária
                </label>
                <input
                  type="text"
                  placeholder="Ex: Poesia Pantaneira, Modernismo, Clássico"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${
                    isDark
                      ? 'bg-black/30 border-white/15 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                Link de Referência / Artigo Oficial (Opcional)
              </label>
              <input
                type="url"
                placeholder="Ex: https://www.companhiadasletras.com.br/BlogPost/..."
                value={referenceUrl}
                onChange={(e) => setReferenceUrl(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${
                  isDark
                    ? 'bg-black/30 border-white/15 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Seção 3: Frases Semanais do Escritor (HeroBanner) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-emerald-400">
                  3. Frases Semanais para o HeroBanner <span className="text-red-500">*</span>
                </label>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Cadastre as frases que serão exibidas na semana deste escritor. O leitor poderá alternar entre elas no card.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddQuote}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isEmerald
                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 border-amber-500/40'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Frase Semanal</span>
              </button>
            </div>

            {errors.quotes && (
              <p className="text-xs text-red-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.quotes}</span>
              </p>
            )}

            <div className="space-y-4">
              {quotes.map((quoteItem, index) => {
                const isPrimary = index === 0;

                return (
                  <div
                    key={quoteItem.id}
                    className={`rounded-2xl border p-4 transition-all relative ${
                      isPrimary
                        ? isEmerald
                          ? 'bg-[#041c2c]/80 border-emerald-500/40 ring-1 ring-emerald-500/30'
                          : 'bg-amber-500/10 border-amber-500/40'
                        : isDark
                        ? 'bg-black/20 border-white/10'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                            isPrimary
                              ? 'bg-emerald-400 text-slate-950 font-black'
                              : 'bg-white/10 text-slate-400'
                          }`}
                        >
                          <Quote className="w-3 h-3" />
                          <span>Frase {index + 1} {isPrimary ? '(Principal no Início)' : ''}</span>
                        </span>

                        {!isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleMakeQuotePrimary(index)}
                            className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Star className="w-3 h-3" />
                            <span>Definir como Frase Principal</span>
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveQuote(index)}
                        title="Remover esta frase"
                        className="text-slate-400 hover:text-red-400 p-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        placeholder="Digite a frase inspiradora do escritor..."
                        value={quoteItem.text}
                        onChange={(e) => handleQuoteChange(index, 'text', e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-sm border font-serif italic ${
                          isDark
                            ? 'bg-black/30 border-white/15 text-white placeholder-slate-500'
                            : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                        }`}
                      />

                      <div className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="Obra / Livro / Origem da frase (ex: O Guardador de Águas)"
                          value={quoteItem.source}
                          onChange={(e) => handleQuoteChange(index, 'source', e.target.value)}
                          className={`w-full px-3 py-1.5 rounded-xl text-xs border ${
                            isDark
                              ? 'bg-black/25 border-white/10 text-white placeholder-slate-500'
                              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ativo na rotação semanal */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="author-active-checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 cursor-pointer"
            />
            <label htmlFor="author-active-checkbox" className="text-xs sm:text-sm font-semibold cursor-pointer">
              Ativar este escritor no ciclo de rotação semanal automática (muda toda segunda-feira)
            </label>
          </div>

          {/* Footer Actions */}
          <div
            className={`flex items-center justify-end gap-3 pt-4 border-t ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/15 hover:bg-white/10 text-slate-300'
                  : 'border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md cursor-pointer ${
                isEmerald
                  ? 'bg-[#00e676] hover:bg-[#1fa950] text-slate-950 font-black'
                  : isPurple
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{authorToEdit ? 'Salvar Alterações' : 'Cadastrar Escritor'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
