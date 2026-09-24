import React, { useState, useEffect, useMemo } from 'react';
import {
  Feather,
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  Sparkles,
  Quote,
  BookOpen,
  Pin,
  RotateCcw,
  CheckCircle2,
  Eye,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
  Copy,
  Check,
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';
import { AuthorItem } from '../types';
import { useTheme } from '../context/ThemeContext';
import { AuthorModal } from './AuthorModal';
import {
  getStoredAuthors,
  saveStoredAuthors,
  getPinnedAuthorId,
  setPinnedAuthorId,
  calculateWeeklyAuthorData,
  subscribeToAuthorsUpdate,
  DEFAULT_AUTHORS
} from '../data/authorsData';
import { FeaturedAuthor } from './FeaturedAuthor';

type FilterTab = 'todos' | 'ativos' | 'destaque' | 'inativos';
type ViewMode = 'grid' | 'table';

export const AdminAuthorsView: React.FC = () => {
  const { isDark, isEmerald, isPurple } = useTheme();

  const [authors, setAuthors] = useState<AuthorItem[]>(() => getStoredAuthors());
  const [pinnedId, setPinnedId] = useState<string | null>(() => getPinnedAuthorId());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('todos');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authorToEdit, setAuthorToEdit] = useState<AuthorItem | null>(null);
  const [authorToDelete, setAuthorToDelete] = useState<AuthorItem | null>(null);
  const [expandedQuotesId, setExpandedQuotesId] = useState<string | null>(null);

  const [notification, setNotification] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const unsub = subscribeToAuthorsUpdate(() => {
      setAuthors(getStoredAuthors());
      setPinnedId(getPinnedAuthorId());
    });
    return unsub;
  }, []);

  const showNotificationMsg = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const weeklyInfo = useMemo(() => {
    return calculateWeeklyAuthorData(authors);
  }, [authors, pinnedId]);

  // Contagem de métricas
  const totalAuthors = authors.length;
  const activeAuthorsCount = authors.filter((a) => a.active !== false).length;
  const totalWeeklyQuotes = useMemo(() => {
    return authors.reduce((acc, a) => {
      const additionalCount = a.additionalQuotes ? a.additionalQuotes.length : 0;
      return acc + 1 + additionalCount;
    }, 0);
  }, [authors]);

  const filteredAuthors = useMemo(() => {
    return authors.filter((author) => {
      // Filtro por tab
      if (activeFilter === 'ativos' && author.active === false) return false;
      if (activeFilter === 'inativos' && author.active !== false) return false;
      if (activeFilter === 'destaque' && author.id !== weeklyInfo.author?.id) return false;

      // Filtro por busca
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();

      const nameMatch = author.name.toLowerCase().includes(q);
      const tagMatch = author.tag.toLowerCase().includes(q);
      const roleMatch = author.role && author.role.toLowerCase().includes(q);
      const periodMatch = author.period && author.period.toLowerCase().includes(q);
      const quoteMatch = author.featuredQuote.toLowerCase().includes(q);
      const sourceMatch = author.quoteSource && author.quoteSource.toLowerCase().includes(q);
      const additionalMatch = author.additionalQuotes?.some(
        (aq) => aq.text.toLowerCase().includes(q) || (aq.source && aq.source.toLowerCase().includes(q))
      );

      return nameMatch || tagMatch || roleMatch || periodMatch || quoteMatch || sourceMatch || additionalMatch;
    });
  }, [authors, searchQuery, activeFilter, weeklyInfo.author?.id]);

  const handleSaveAuthor = (author: AuthorItem) => {
    const exists = authors.some((a) => a.id === author.id);
    let updated: AuthorItem[];
    if (exists) {
      updated = authors.map((a) => (a.id === author.id ? author : a));
      showNotificationMsg(`Escritor "${author.name}" atualizado com sucesso!`);
    } else {
      updated = [author, ...authors];
      showNotificationMsg(`Escritor "${author.name}" cadastrado com sucesso!`);
    }
    saveStoredAuthors(updated);
  };

  const handleDeleteAuthor = (id: string) => {
    const toRemove = authors.find((a) => a.id === id);
    const updated = authors.filter((a) => a.id !== id);
    saveStoredAuthors(updated);
    if (pinnedId === id) {
      setPinnedAuthorId(null);
    }
    setAuthorToDelete(null);
    showNotificationMsg(`Escritor "${toRemove?.name}" excluído do sistema.`);
  };

  const handleTogglePin = (id: string) => {
    if (pinnedId === id) {
      setPinnedAuthorId(null);
      showNotificationMsg('Rotação semanal automática ativada (muda toda segunda-feira)!');
    } else {
      setPinnedAuthorId(id);
      const chosen = authors.find((a) => a.id === id);
      showNotificationMsg(`"${chosen?.name}" foi fixado como destaque imediato no HeroBanner!`);
    }
  };

  const handleToggleActive = (id: string) => {
    const updated = authors.map((a) => {
      if (a.id === id) {
        const nextState = a.active === false ? true : false;
        showNotificationMsg(
          nextState
            ? `"${a.name}" foi reativado na rotação semanal.`
            : `"${a.name}" foi pausado da rotação semanal.`
        );
        return { ...a, active: nextState };
      }
      return a;
    });
    saveStoredAuthors(updated);
  };

  const handleDuplicateAuthor = (item: AuthorItem) => {
    const clone: AuthorItem = {
      ...item,
      id: `author-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: `${item.name} (Cópia)`,
      createdAt: new Date().toISOString()
    };
    const updated = [clone, ...authors];
    saveStoredAuthors(updated);
    showNotificationMsg(`Cópia de "${item.name}" criada com sucesso!`);
  };

  const handleRestoreDefaults = () => {
    if (
      window.confirm(
        'Deseja restaurar a lista original de escritores brasileiros (Manoel de Barros, Machado de Assis, Clarice Lispector, etc.)?'
      )
    ) {
      saveStoredAuthors(DEFAULT_AUTHORS);
      setPinnedAuthorId(null);
      showNotificationMsg('Acervo de autores restaurado para o padrão original.');
    }
  };

  return (
    <div id="admin-authors-crud" className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-[#00e676] text-slate-950 font-black text-sm shadow-2xl animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Banner & CRUD Logistics */}
      <div
        className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
          isEmerald
            ? 'bg-[#062438] border-[#0c4061]'
            : isPurple
            ? 'bg-[#220d43] border-[#3e196e]'
            : isDark
            ? 'bg-[#092032] border-[#163650]'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                  isEmerald
                    ? 'bg-emerald-500/15 text-[#00e676] border-emerald-500/30'
                    : isPurple
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    : 'bg-amber-400/20 text-amber-500 border-amber-400/40'
                }`}
              >
                <Feather className="w-3.5 h-3.5" />
                <span>Escritores</span>
              </span>

              {weeklyInfo.isPinned ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Pin className="w-3.5 h-3.5" />
                  <span>Destaque Manual Fixado</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-[#00e676] border border-emerald-500/30">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Rotação Automática Toda 2ª Feira</span>
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black">
              Gerenciamento de Escritores e Frases Semanais
            </h2>

            <p className={`text-xs sm:text-sm max-w-2xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Cadastre nome, foto e frases semanais de escritores. O sistema verifica a data atual e
              exibe automaticamente o escritor da semana no <strong>HeroBanner</strong> da página inicial,
              trocando todo início de segunda-feira.
            </p>
          </div>

          {/* Card Resumo do Autor em Exibição */}
          <div
            className={`p-4 rounded-2xl border shrink-0 min-w-[300px] shadow-md ${
              isDark ? 'bg-black/35 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Em Exibição no HeroBanner:</span>
              <span className="flex items-center gap-1 text-emerald-400 font-extrabold text-[10px]">
                <Sparkles className="w-3 h-3" />
                <span>Ativo no Início</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={weeklyInfo.author?.photoUrl}
                  alt={weeklyInfo.author?.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-400"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-extrabold truncate">{weeklyInfo.author?.name}</h4>
                <p className="text-xs text-slate-400 truncate">{weeklyInfo.author?.tag}</p>
                <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                  Ciclo: {weeklyInfo.weekLabel}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Métricas Numéricas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="p-3 rounded-2xl bg-black/15 border border-white/5">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Total de Escritores</span>
            <span className="text-xl sm:text-2xl font-black text-white">{totalAuthors}</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/15 border border-white/5">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Ativos na Rotação</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400">{activeAuthorsCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/15 border border-white/5">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Frases Cadastradas</span>
            <span className="text-xl sm:text-2xl font-black text-amber-400">{totalWeeklyQuotes}</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/15 border border-white/5">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Dia de Troca</span>
            <span className="text-base sm:text-lg font-bold text-purple-300">Segunda-feira 00h</span>
          </div>
        </div>
      </div>

      {/* Barra de Ações do CRUD, Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Botão Principal de Cadastro */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-cadastrar-novo-escritor"
            type="button"
            onClick={() => {
              setAuthorToEdit(null);
              setIsModalOpen(true);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all shadow-lg cursor-pointer hover:scale-105 active:scale-95 ${
              isEmerald
                ? 'bg-[#00e676] hover:bg-[#1fa950] text-slate-950 shadow-emerald-950/30'
                : isPurple
                ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-purple-950/30'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Escritor</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-colors cursor-pointer ${
              showPreview
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                : isDark
                ? 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{showPreview ? 'Ocultar Prévia HeroBanner' : 'Prévia no HeroBanner'}</span>
          </button>

          <button
            type="button"
            onClick={handleRestoreDefaults}
            title="Restaurar a coleção inicial de escritores"
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold border transition-colors cursor-pointer ${
              isDark
                ? 'border-white/10 hover:bg-white/10 text-slate-400 hover:text-white'
                : 'border-slate-200 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Restaurar Padrões</span>
          </button>
        </div>

        {/* Alternância de Visualização e Busca */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Alternar Grade / Tabela */}
          <div className="flex items-center rounded-xl p-1 border bg-black/20">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Visualização em Grade de Cards"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              title="Visualização em Lista/Tabela Detalhada"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Campo de Busca */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por escritor, frase, obra..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3.5 py-2 rounded-xl text-xs sm:text-sm border transition-all ${
                isDark
                  ? 'bg-black/30 border-white/15 text-white placeholder-slate-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Tabs de Filtro */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        {(
          [
            { id: 'todos', label: 'Todos os Escritores', count: totalAuthors },
            { id: 'ativos', label: 'Ativos na Rotação', count: activeAuthorsCount },
            { id: 'destaque', label: 'Destaque Desta Semana', count: 1 },
            { id: 'inativos', label: 'Pausados', count: totalAuthors - activeAuthorsCount }
          ] as const
        ).map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? isEmerald
                    ? 'bg-emerald-500/20 text-[#00e676] border border-emerald-500/40'
                    : isPurple
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-amber-400/20 text-amber-500 border border-amber-400/40'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Prévia Interativa do HeroBanner quando solicitada */}
      {showPreview && (
        <div className="p-6 rounded-3xl border bg-black/25 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
          <div className="flex items-center justify-between w-full max-w-lg mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>Visualização Oficial no HeroBanner</span>
            </span>
            <button
              onClick={() => setShowPreview(false)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Fechar prévia
            </button>
          </div>
          <FeaturedAuthor />
        </div>
      )}

      {/* Conteúdo: Modo Grade de Cards */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAuthors.map((item) => {
            const isCurrentlyActive = weeklyInfo.author?.id === item.id;
            const isPinnedItem = pinnedId === item.id;
            const additionalQuotesCount = item.additionalQuotes ? item.additionalQuotes.length : 0;
            const totalQuotesThisAuthor = 1 + additionalQuotesCount;
            const isExpanded = expandedQuotesId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-3xl border p-5 relative flex flex-col justify-between transition-all duration-300 shadow-md ${
                  isCurrentlyActive
                    ? 'ring-2 ring-emerald-400 border-emerald-500/60 shadow-emerald-950/25'
                    : item.active === false
                    ? 'opacity-65 border-dashed'
                    : isDark
                    ? 'bg-[#092032] border-[#163650] text-white hover:border-slate-600'
                    : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Cabeçalho do Card: Foto com moldura, Nome e Status */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md">
                        {item.photoUrl ? (
                          <img
                            src={item.photoUrl}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800 text-xs font-bold text-slate-400">
                            Sem Foto
                          </div>
                        )}
                      </div>
                      {isCurrentlyActive && (
                        <div
                          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#00e676] text-slate-950 flex items-center justify-center shadow"
                          title="Autor em exibição esta semana no HeroBanner"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-extrabold text-base truncate">{item.name}</h3>
                        {item.referenceUrl && (
                          <a
                            href={item.referenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Ver artigo / matéria de referência"
                            className="text-amber-400 hover:text-amber-300 transition-colors p-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-medium truncate">
                        {item.period} • {item.role}
                      </p>

                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-400 border border-amber-400/30">
                          {item.tag}
                        </span>

                        {isCurrentlyActive && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-500/20 text-[#00e676] border border-emerald-500/30">
                            Semana Atual
                          </span>
                        )}

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            totalQuotesThisAuthor > 1
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-white/10 text-slate-400'
                          }`}
                        >
                          {totalQuotesThisAuthor} {totalQuotesThisAuthor === 1 ? 'frase' : 'frases'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Frase Principal Cadastrada */}
                  <div
                    className={`p-3.5 rounded-2xl border mb-3 ${
                      isDark ? 'bg-black/30 border-white/10' : 'bg-amber-50/60 border-amber-200/60'
                    }`}
                  >
                    <Quote className="w-4 h-4 text-amber-400/80 mb-1" />
                    <p className="text-xs font-serif italic line-clamp-3 leading-relaxed">
                      “{item.featuredQuote}”
                    </p>
                    {item.quoteSource && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                        <BookOpen className="w-2.5 h-2.5 text-amber-400" />
                        <span className="truncate">{item.quoteSource}</span>
                      </div>
                    )}
                  </div>

                  {/* Seção Expansível para visualização de todas as frases */}
                  {additionalQuotesCount > 0 && (
                    <div className="mb-3">
                      <button
                        type="button"
                        onClick={() => setExpandedQuotesId(isExpanded ? null : item.id)}
                        className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span>Ocultar outras {additionalQuotesCount} frases semanais</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            <span>Ver todas as {totalQuotesThisAuthor} frases semanais</span>
                          </>
                        )}
                      </button>

                      {isExpanded && (
                        <div className="mt-2.5 space-y-2 p-3 rounded-2xl bg-black/20 border border-white/10 text-xs">
                          {item.additionalQuotes?.map((aq, i) => (
                            <div key={i} className="border-b border-white/5 pb-1.5 last:border-b-0 last:pb-0">
                              <p className="font-serif italic text-slate-300">“{aq.text}”</p>
                              {aq.source && (
                                <p className="text-[10px] text-slate-500 mt-0.5">— {aq.source}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Rodapé com Ações do CRUD */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    {/* Botão de Fixar / Desafixar */}
                    <button
                      type="button"
                      onClick={() => handleTogglePin(item.id)}
                      title={isPinnedItem ? 'Desafixar (voltar à rotação semanal)' : 'Fixar este escritor agora no Início'}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isPinnedItem
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : isDark
                          ? 'bg-white/10 hover:bg-white/20 text-slate-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Pin className="w-3 h-3" />
                      <span>{isPinnedItem ? 'Fixado' : 'Fixar'}</span>
                    </button>

                    {/* Botão de Ativar / Desativar */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(item.id)}
                      title={item.active !== false ? 'Pausar este escritor da rotação' : 'Ativar escritor na rotação'}
                      className={`px-2 py-1.5 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                        item.active !== false
                          ? 'text-emerald-400 hover:bg-emerald-500/10'
                          : 'text-slate-400 hover:bg-white/10 line-through'
                      }`}
                    >
                      {item.active !== false ? 'Ativo' : 'Pausado'}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Duplicar */}
                    <button
                      type="button"
                      onClick={() => handleDuplicateAuthor(item)}
                      title="Duplicar cadastro de escritor"
                      className="p-1.5 rounded-lg border border-transparent hover:border-white/20 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Editar */}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthorToEdit(item);
                        setIsModalOpen(true);
                      }}
                      title="Editar dados, foto e frases do escritor"
                      className="p-1.5 rounded-lg border border-transparent hover:border-emerald-500/30 hover:bg-emerald-500/15 text-emerald-400 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Excluir */}
                    <button
                      type="button"
                      onClick={() => setAuthorToDelete(item)}
                      title="Excluir escritor do sistema"
                      className="p-1.5 rounded-lg border border-transparent hover:border-red-500/30 hover:bg-red-500/15 text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Conteúdo: Modo Tabela Detalhada */}
      {viewMode === 'table' && (
        <div
          className={`rounded-3xl border overflow-hidden shadow-lg ${
            isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className={`border-b ${isDark ? 'border-white/10 bg-black/25 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                  <th className="py-3 px-4 font-black">Escritor</th>
                  <th className="py-3 px-4 font-black">Categoria / Período</th>
                  <th className="py-3 px-4 font-black">Frases Semanais</th>
                  <th className="py-3 px-4 font-black">Status Rotação</th>
                  <th className="py-3 px-4 font-black text-right">Ações CRUD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAuthors.map((item) => {
                  const isCurrentlyActive = weeklyInfo.author?.id === item.id;
                  const isPinnedItem = pinnedId === item.id;
                  const totalQuotes = 1 + (item.additionalQuotes ? item.additionalQuotes.length : 0);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-white/5 transition-colors ${
                        isCurrentlyActive ? 'bg-emerald-500/10' : ''
                      }`}
                    >
                      {/* Foto e Nome */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.photoUrl}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover border border-amber-400 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-bold block truncate">{item.name}</span>
                            <span className="text-[11px] text-slate-400 block truncate">{item.role}</span>
                          </div>
                        </div>
                      </td>

                      {/* Categoria / Período */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 mb-1">
                          {item.tag}
                        </span>
                        <span className="text-[11px] text-slate-400 block">{item.period}</span>
                      </td>

                      {/* Frases */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-serif italic text-xs truncate">“{item.featuredQuote}”</p>
                        <span className="text-[10px] text-slate-400 block mt-0.5 font-semibold">
                          Total: {totalQuotes} {totalQuotes === 1 ? 'frase' : 'frases cadastradas'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isCurrentlyActive && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Semana Atual
                            </span>
                          )}
                          {isPinnedItem && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              Fixado
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.active !== false
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            {item.active !== false ? 'Ativo' : 'Pausado'}
                          </span>
                        </div>
                      </td>

                      {/* Ações */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleTogglePin(item.id)}
                            title={isPinnedItem ? 'Desafixar' : 'Fixar agora'}
                            className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-slate-300"
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setAuthorToEdit(item);
                              setIsModalOpen(true);
                            }}
                            title="Editar"
                            className="p-1.5 rounded-lg border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setAuthorToDelete(item)}
                            title="Excluir"
                            className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredAuthors.length === 0 && (
        <div className="p-12 text-center rounded-3xl border border-dashed border-white/20 text-slate-400">
          <Feather className="w-12 h-12 mx-auto mb-3 opacity-40 text-emerald-400" />
          <h4 className="text-base font-bold mb-1">Nenhum escritor encontrado</h4>
          <p className="text-xs mb-4">Tente buscar por outro termo ou cadastre um novo escritor.</p>
          <button
            type="button"
            onClick={() => {
              setAuthorToEdit(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00e676] text-slate-950 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Escritor Agora</span>
          </button>
        </div>
      )}

      {/* Modal de Criação / Edição */}
      <AuthorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setAuthorToEdit(null);
        }}
        onSave={handleSaveAuthor}
        authorToEdit={authorToEdit}
      />

      {/* Modal de Confirmação de Exclusão */}
      {authorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div
            className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl space-y-4 ${
              isDark ? 'bg-[#092032] border-[#163650] text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold">Excluir Escritor</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Tem certeza que deseja remover o escritor <strong>{authorToDelete.name}</strong> e suas frases do sistema? Ele não aparecerá mais no HeroBanner.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setAuthorToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-white/20 hover:bg-white/10 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleDeleteAuthor(authorToDelete.id)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer"
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
