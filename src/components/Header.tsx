import React from 'react';
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Smartphone,
  User,
  Shield,
  LogOut,
  BookMarked,
  Trophy,
  Sparkles,
  Cat,
  BookPlus,
  Camera,
  BookOpen,
  Info,
  Lightbulb,
  Film
} from 'lucide-react';
import { ActiveTab, UserSession, Book, Loan, Student, Suggestion, AdminUser, AuditLog } from '../types';
import { Logo } from './Logo';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenDesignSystem: () => void;
  onOpenNewLoan?: () => void;
  onOpenNewSuggestion?: () => void;
  onOpenRegisterBook?: () => void;
  onOpenAccessibility?: () => void;
  onOpenOpeningVideo?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  session: UserSession;
  onOpenLogin: (mode?: 'student' | 'admin', featureName?: string) => void;
  onLogout: () => void;
  cloudSyncStatus?: 'connecting' | 'synced' | 'syncing' | 'offline';
  lastSyncTime?: Date | null;
  books?: Book[];
  loans?: Loan[];
  students?: Student[];
  suggestions?: Suggestion[];
  adminUsers?: AdminUser[];
  auditLogs?: AuditLog[];
  onManualSyncTrigger?: () => Promise<void>;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenDesignSystem,
  onOpenRegisterBook,
  onOpenAccessibility,
  onOpenOpeningVideo,
  session,
  onOpenLogin,
  onLogout,
  cloudSyncStatus = 'synced',
  lastSyncTime = null,
  books = [],
  loans = [],
  students = [],
  suggestions = [],
  adminUsers = [],
  auditLogs = [],
  onManualSyncTrigger,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { toggleTheme, setTheme, isDark, isKinetic, isClassicDark, isOcean, isPurple, isEmerald, isLight } = useTheme();

  const isStudent = session.role === 'student';
  const isAdmin = session.role === 'admin';

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md transition-colors duration-200 border-b ${
        isEmerald
          ? 'bg-[#021726]/95 border-[#072d42] text-slate-100'
          : isPurple
          ? 'bg-[#13072b]/95 border-[#3e196e] text-purple-100'
          : isKinetic
          ? 'bg-[#0c1014]/95 border-[#2a313a] text-slate-100'
          : isDark
          ? 'bg-[#001424]/95 border-[#163650] text-slate-100'
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div
            id="brand-logo"
            onClick={() => setActiveTab('inicio')}
            className="cursor-pointer group select-none flex items-center gap-3"
          >
            <Logo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden md:flex items-center gap-1 p-1.5 rounded-full border transition-colors ${
              isEmerald
                ? 'bg-[#031c2e]/90 border-[#093a57] shadow-[0_0_20px_rgba(2,23,38,0.7)]'
                : isPurple
                ? 'bg-[#1a0933]/90 border-[#32145e] shadow-[0_0_20px_rgba(26,9,51,0.6)]'
                : isKinetic
                ? 'bg-[#1a1c1e] border-[#2a313a]'
                : isDark
                ? 'bg-[#092032]/80 border-[#163650]'
                : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              id="nav-inicio"
              onClick={() => setActiveTab('inicio')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === 'inicio'
                  ? isEmerald
                    ? 'bg-[#00e676] text-[#022c1b] font-extrabold shadow-[0_0_18px_rgba(0,230,118,0.5)]'
                    : isPurple
                    ? 'bg-gradient-to-r from-[#9333ea] to-[#a855f7] text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                    : isKinetic
                    ? 'bg-[#0088cc] text-white font-bold shadow-[0_0_12px_rgba(0,136,204,0.4)]'
                    : isDark
                    ? 'bg-[#1dbb64] text-slate-950 font-bold shadow-[0_0_12px_rgba(29,187,100,0.4)]'
                    : 'bg-[#23c65e] text-white font-bold shadow-sm'
                  : isEmerald
                  ? 'text-slate-300 hover:text-white hover:bg-[#0c3654]'
                  : isPurple
                  ? 'text-[#d8b4fe] hover:text-white hover:bg-[#32145e]/80'
                  : isKinetic
                  ? 'text-slate-300 hover:text-white hover:bg-[#2a313a]'
                  : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-[#133e4a]/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
            >
              Início
            </button>
            <button
              id="nav-catalogo"
              onClick={() => setActiveTab('catalogo')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'catalogo'
                  ? isEmerald
                    ? 'bg-[#00e676] text-[#022c1b] font-extrabold shadow-[0_0_18px_rgba(0,230,118,0.5)]'
                    : isPurple
                    ? 'bg-gradient-to-r from-[#9333ea] to-[#a855f7] text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                    : isKinetic
                    ? 'bg-[#0088cc] text-white font-bold shadow-[0_0_12px_rgba(0,136,204,0.4)]'
                    : isDark
                    ? 'bg-[#1dbb64] text-slate-950 font-bold shadow-[0_0_12px_rgba(29,187,100,0.4)]'
                    : 'bg-[#23c65e] text-white font-bold shadow-sm'
                  : isEmerald
                  ? 'text-slate-300 hover:text-white hover:bg-[#0c3654]'
                  : isPurple
                  ? 'text-[#d8b4fe] hover:text-white hover:bg-[#32145e]/80'
                  : isKinetic
                  ? 'text-slate-300 hover:text-white hover:bg-[#2a313a]'
                  : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-[#133e4a]/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${isEmerald ? 'text-[#00e676]' : ''}`} />
              <span>Catálogo</span>
            </button>
            <button
              id="nav-ranking"
              onClick={() => setActiveTab('ranking')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ranking'
                  ? isEmerald
                    ? 'bg-[#00e676] text-[#022c1b] font-extrabold shadow-[0_0_18px_rgba(0,230,118,0.5)]'
                    : isPurple
                    ? 'bg-gradient-to-r from-[#9333ea] to-[#a855f7] text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                    : isKinetic
                    ? 'bg-[#0088cc] text-white font-bold shadow-[0_0_12px_rgba(0,136,204,0.4)]'
                    : isDark
                    ? 'bg-[#1dbb64] text-slate-950 font-bold shadow-[0_0_12px_rgba(29,187,100,0.4)]'
                    : 'bg-[#23c65e] text-white font-bold shadow-sm'
                  : isEmerald
                  ? 'text-slate-300 hover:text-white hover:bg-[#0c3654]'
                  : isPurple
                  ? 'text-[#d8b4fe] hover:text-white hover:bg-[#32145e]/80'
                  : isKinetic
                  ? 'text-slate-300 hover:text-white hover:bg-[#2a313a]'
                  : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-[#133e4a]/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Ranking</span>
            </button>

            {/* MISSÃO QUITÉRIO (Quiz Game Mascot Tab) */}
            <button
              id="nav-missao-quiterio"
              onClick={() => setActiveTab('missao_quiterio')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'missao_quiterio'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105'
                  : isEmerald
                  ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-400/10'
                  : isPurple
                  ? 'text-amber-300 hover:text-amber-200 hover:bg-amber-400/15'
                  : isKinetic
                  ? 'text-amber-400 hover:text-amber-300 hover:bg-[#2a313a]'
                  : isDark
                  ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-400/10'
                  : 'text-amber-700 hover:text-amber-800 hover:bg-amber-100/80 font-semibold'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Missão Quitério</span>
            </button>

            {/* If logged in as student, show "Meu Histórico" */}
            {isStudent && (
              <button
                id="nav-meu-historico"
                onClick={() => setActiveTab('meu_historico')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'meu_historico'
                    ? isEmerald
                      ? 'bg-[#00e676] text-[#022c1b] font-bold shadow-[0_0_15px_rgba(0,230,118,0.4)]'
                      : isPurple
                      ? 'bg-[#a855f7] text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                      : isKinetic
                      ? 'bg-[#00a651] text-white font-bold shadow-[0_0_12px_rgba(0,166,81,0.4)]'
                      : isDark
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(29,187,100,0.4)]'
                      : 'bg-[#23c65e] text-white font-bold shadow-sm'
                    : isEmerald
                    ? 'text-emerald-400 hover:text-emerald-300 hover:bg-[#0c3654]'
                    : isPurple
                    ? 'text-purple-300 hover:text-purple-100 hover:bg-purple-900/40'
                    : isKinetic
                    ? 'text-[#00a651] hover:text-[#00a651]/80 hover:bg-[#2a313a]'
                    : isDark
                    ? 'text-emerald-400 hover:text-emerald-300 hover:bg-[#133e4a]/60'
                    : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span>Meu Histórico</span>
              </button>
            )}

            <button
              id="nav-sugestoes"
              onClick={() => setActiveTab('sugestoes')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'sugestoes'
                  ? isEmerald
                    ? 'bg-[#00e676] text-[#022c1b] font-extrabold shadow-[0_0_18px_rgba(0,230,118,0.5)]'
                    : isPurple
                    ? 'bg-gradient-to-r from-[#9333ea] to-[#a855f7] text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                    : isKinetic
                    ? 'bg-[#0088cc] text-white font-bold shadow-[0_0_12px_rgba(0,136,204,0.4)]'
                    : isDark
                    ? 'bg-[#1dbb64] text-slate-950 font-bold shadow-[0_0_12px_rgba(29,187,100,0.4)]'
                    : 'bg-[#23c65e] text-white font-bold shadow-sm'
                  : isEmerald
                  ? 'text-slate-300 hover:text-white hover:bg-[#0c3654]'
                  : isPurple
                  ? 'text-[#d8b4fe] hover:text-white hover:bg-[#32145e]/80'
                  : isKinetic
                  ? 'text-slate-300 hover:text-white hover:bg-[#2a313a]'
                  : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-[#133e4a]/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Sugestões</span>
            </button>

            <button
              id="nav-sobre"
              onClick={() => setActiveTab('sobre')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'sobre'
                  ? isEmerald
                    ? 'bg-[#00e676] text-[#022c1b] font-extrabold shadow-[0_0_18px_rgba(0,230,118,0.5)]'
                    : isPurple
                    ? 'bg-gradient-to-r from-[#9333ea] to-[#a855f7] text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                    : isKinetic
                    ? 'bg-[#0088cc] text-white font-bold shadow-[0_0_12px_rgba(0,136,204,0.4)]'
                    : isDark
                    ? 'bg-[#1dbb64] text-slate-950 font-bold shadow-[0_0_12px_rgba(29,187,100,0.4)]'
                    : 'bg-[#23c65e] text-white font-bold shadow-sm'
                  : isEmerald
                  ? 'text-slate-300 hover:text-white hover:bg-[#0c3654]'
                  : isPurple
                  ? 'text-[#d8b4fe] hover:text-white hover:bg-[#32145e]/80'
                  : isKinetic
                  ? 'text-slate-300 hover:text-white hover:bg-[#2a313a]'
                  : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-[#133e4a]/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
            >
              <Info className={`w-3.5 h-3.5 ${isEmerald ? 'text-[#00e676]' : ''}`} />
              <span>Sobre</span>
            </button>
          </nav>

          {/* User Session & Header Actions */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* BOTÃO ASSISTIR VÍDEO DE ABERTURA DO APLICATIVO */}
            {onOpenOpeningVideo && (
              <button
                id="btn-header-opening-video"
                onClick={onOpenOpeningVideo}
                title="Assistir ao Vídeo de Abertura Oficial da Biblioteca"
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 ${
                  isEmerald
                    ? 'bg-[#042135] hover:bg-[#072c47] text-cyan-300 border-[#0b3d5b]'
                    : isPurple
                    ? 'bg-[#2e105e] hover:bg-[#3e147e] text-purple-200 border-[#a855f7]/50'
                    : isKinetic
                    ? 'bg-[#1a1c1e] hover:bg-[#2a313a] text-cyan-400 border-[#2a313a]'
                    : isDark
                    ? 'bg-[#092032] hover:bg-[#133e4a] text-cyan-300 border-[#163650]'
                    : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border-cyan-200'
                }`}
              >
                <Film className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xl:inline text-[11px]">Abertura</span>
              </button>
            )}

            {/* User Session Profile / Login Trigger */}
            {isAdmin ? (
              <div className="flex items-center gap-2 pl-1">
                <button
                  id="btn-header-go-admin"
                  onClick={() => setActiveTab('admin')}
                  title="Abrir Painel Administrativo"
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                      : isDark
                      ? 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-300'
                      : 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  <span>Painel ADM</span>
                </button>
                <button
                  onClick={onLogout}
                  title="Sair do Modo Administrador"
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-[#092032] hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border-[#163650]'
                      : 'bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 border-slate-200'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : isStudent && session.student ? (
              <div className="flex items-center gap-2 pl-1">
                <button
                  onClick={() => setActiveTab('meu_historico')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  <img
                    src={session.student.avatar}
                    alt={session.student.name}
                    className="w-5 h-5 rounded-full object-cover border border-emerald-400 student-avatar-zoom transition-transform duration-300 ease-out hover:scale-150 cursor-pointer hover:shadow-2xl hover:z-40 relative"
                  />
                  <span className="max-w-[100px] truncate">{session.student.name.split(' ')[0]}</span>
                  <span className={`font-mono text-[10px] ${isDark ? 'text-emerald-400/80' : 'text-emerald-700'}`}>
                    ({(session.student.studentCode || '').replace(/^ALU-/, '')})
                  </span>
                </button>
                <button
                  onClick={onLogout}
                  title="Sair da Conta do Aluno"
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-[#092032] hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border-[#163650]'
                      : 'bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 border-slate-200'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="btn-acessar-header"
                onClick={() => onOpenLogin('student')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isDark
                    ? 'bg-[#1dbb64] hover:bg-[#16a354] text-slate-950 shadow-[0_0_15px_rgba(29,187,100,0.3)] hover:shadow-[0_0_20px_rgba(29,187,100,0.5)]'
                    : 'bg-[#23c65e] hover:bg-[#1fa950] text-white shadow-sm'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Entrar / Acessar</span>
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            {isStudent && session.student && (
              <img
                src={session.student.avatar}
                alt={session.student.name}
                className="w-7 h-7 rounded-full border border-purple-400 object-cover"
                onClick={() => setActiveTab('meu_historico')}
              />
            )}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border bg-[#1e0a3c] text-purple-200 hover:text-white border-[#3e196e]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-b px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top duration-200 ${
            isDark ? 'bg-[#071828] border-[#163650]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          {/* User Session Bar in Mobile */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between mb-2 ${
              isDark ? 'bg-[#001424] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            {isAdmin ? (
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                <Shield className="w-4 h-4 text-amber-500" />
                <span>Administrador Conectado</span>
              </div>
            ) : isStudent && session.student ? (
              <div className="flex items-center gap-2 text-xs">
                <img
                  src={session.student.avatar}
                  alt={session.student.name}
                  className="w-7 h-7 rounded-full object-cover student-avatar-zoom transition-transform duration-300 ease-out hover:scale-150 cursor-pointer hover:shadow-2xl hover:z-40 relative"
                />
                <div>
                  <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{session.student.name}</div>
                  <div className="text-[10px] text-emerald-500 font-mono">
                    Cód: {(session.student.studentCode || '').replace(/^ALU-/, '')}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">
                Nenhum usuário identificado
              </div>
            )}

            {session.role !== 'guest' ? (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-rose-400 font-bold px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20"
              >
                Sair
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenLogin('student');
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-500 text-white"
              >
                Entrar
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => {
                setActiveTab('inicio');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-sm font-medium text-left ${
                activeTab === 'inicio'
                  ? 'bg-[#23c65e] text-white font-bold'
                  : isDark
                  ? 'bg-[#092032] text-slate-200'
                  : 'bg-white border border-slate-200 text-slate-800'
              }`}
            >
              Início
            </button>
            <button
              onClick={() => {
                setActiveTab('catalogo');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-sm font-medium text-left ${
                activeTab === 'catalogo'
                  ? 'bg-[#23c65e] text-white font-bold'
                  : isDark
                  ? 'bg-[#092032] text-slate-200'
                  : 'bg-white border border-slate-200 text-slate-800'
              }`}
            >
              Catálogo
            </button>
            <button
              onClick={() => {
                setActiveTab('ranking');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-sm font-medium text-left flex items-center gap-1.5 ${
                activeTab === 'ranking'
                  ? 'bg-[#23c65e] text-white font-bold'
                  : isDark
                  ? 'bg-[#092032] text-slate-200'
                  : 'bg-white border border-slate-200 text-slate-800'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Ranking</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('missao_quiterio');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-sm font-medium text-left flex items-center justify-between ${
                activeTab === 'missao_quiterio'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : isDark
                  ? 'bg-[#092032] text-amber-400'
                  : 'bg-amber-50 border border-amber-200 text-amber-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Cat className="w-4 h-4 text-amber-500" />
                <span>Missão Quitério</span>
              </div>
            </button>
            {isStudent && (
              <button
                onClick={() => {
                  setActiveTab('meu_historico');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-sm font-medium text-left flex items-center gap-2 ${
                  activeTab === 'meu_historico'
                    ? 'bg-[#23c65e] text-white font-bold'
                    : isDark
                    ? 'bg-[#092032] text-emerald-400'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                }`}
              >
                <BookMarked className="w-4 h-4" />
                <span>Meu Histórico</span>
              </button>
            )}
            <button
              onClick={() => {
                setActiveTab('sugestoes');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-sm font-medium text-left ${
                activeTab === 'sugestoes'
                  ? 'bg-[#23c65e] text-white font-bold'
                  : isDark
                  ? 'bg-[#092032] text-slate-200'
                  : 'bg-white border border-slate-200 text-slate-800'
              }`}
            >
              Sugestões
            </button>
            {onOpenOpeningVideo && (
              <button
                onClick={() => {
                  onOpenOpeningVideo();
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-sm font-semibold text-left flex items-center gap-2 ${
                  isDark
                    ? 'bg-[#092032] text-cyan-300 border border-cyan-500/30'
                    : 'bg-cyan-50 border border-cyan-200 text-cyan-900'
                }`}
              >
                <Film className="w-4 h-4 text-cyan-400" />
                <span>Vídeo de Abertura</span>
              </button>
            )}
          </div>

          {isAdmin && (
            <div className={`border-t pt-3 flex flex-col gap-2 ${isDark ? 'border-[#163650]' : 'border-slate-200'}`}>
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-sm font-medium ${
                  isDark ? 'bg-[#092032] text-amber-300' : 'bg-amber-50 text-amber-900 border border-amber-200'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-amber-500" />
                <span>Painel Administrativo</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('relatorios');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-sm font-medium ${
                  isDark ? 'bg-[#092032] text-emerald-400' : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Relatórios Estatísticos</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

