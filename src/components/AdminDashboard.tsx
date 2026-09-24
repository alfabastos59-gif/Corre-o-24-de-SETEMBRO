import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  BookmarkCheck,
  BookOpen,
  Users,
  Lightbulb,
  FileText,
  Database,
  Settings,
  LogOut,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Search,
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Star,
  Download,
  Upload,
  RefreshCw,
  Mail,
  Phone,
  Filter,
  Check,
  X,
  Pencil,
  Trash2,
  History,
  UserPlus,
  Award,
  ShieldCheck,
  Shield,
  CreditCard,
  Smartphone,
  Feather
} from 'lucide-react';
import { Book, Loan, Student, Suggestion, AdminSection, ActiveTab, AdminUser, AuditLog } from '../types';
import { Logo } from './Logo';
import { BackupRestoreView } from './BackupRestoreView';
import { StudentModal } from './StudentModal';
import { StudentHistoryModal } from './StudentHistoryModal';
import { StudentCardModal } from './StudentCardModal';
import { AdminUsersView } from './AdminUsersView';
import { AdminAuthorsView } from './AdminAuthorsView';
import { AuditLogView } from './AuditLogView';
import { AdminUserModal } from './AdminUserModal';
import { ADMIN_AVATAR_OPTIONS } from '../data/adminAvatars';
import { useTheme } from '../context/ThemeContext';
import { getCategoryColor } from '../data/mockData';

interface AdminDashboardProps {
  books: Book[];
  loans: Loan[];
  students: Student[];
  suggestions: Suggestion[];
  adminUsers?: AdminUser[];
  auditLogs?: AuditLog[];
  currentSessionAdmin?: AdminUser;
  onOpenBookDetail: (book: Book) => void;
  onOpenNewLoan: () => void;
  onOpenNewBook: () => void;
  onOpenManageBooks?: () => void;
  onSaveStudent?: (student: Student) => void;
  onCreateStudent?: (student: Student) => void;
  onDeleteStudent?: (studentId: string) => void;
  onDeleteSuggestion?: (suggestionId: string) => void;
  onUpdateSuggestionStatus?: (suggestionId: string, status: 'aprovado' | 'recusado' | 'pendente') => void;
  onCreateAdminUser?: (adminUser: AdminUser) => void;
  onSaveAdminUser?: (adminUser: AdminUser) => void;
  onDeleteAdminUser?: (adminId: string) => void;
  onToggleAdminStatus?: (adminUser: AdminUser) => void;
  onClearAuditLogs?: () => void;
  onRestoreData?: (data: {
    books?: Book[];
    loans?: Loan[];
    students?: Student[];
    suggestions?: Suggestion[];
    adminUsers?: AdminUser[];
    auditLogs?: AuditLog[];
  }) => void;
  onReturnLoan?: (loanId: string) => void;
  onRenewLoan?: (loanId: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  onLogout?: () => void;
  cloudSyncStatus?: 'connecting' | 'synced' | 'syncing' | 'offline';
  lastSyncTime?: Date | null;
  onManualSyncTrigger?: () => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  books,
  loans,
  students,
  suggestions,
  adminUsers = [],
  auditLogs = [],
  currentSessionAdmin,
  onOpenBookDetail,
  onOpenNewLoan,
  onOpenNewBook,
  onOpenManageBooks,
  onSaveStudent,
  onCreateStudent,
  onDeleteStudent,
  onDeleteSuggestion,
  onUpdateSuggestionStatus,
  onCreateAdminUser,
  onSaveAdminUser,
  onDeleteAdminUser,
  onToggleAdminStatus,
  onClearAuditLogs,
  onRestoreData,
  onReturnLoan,
  onRenewLoan,
  setActiveTab,
  onLogout,
  cloudSyncStatus,
  lastSyncTime,
  onManualSyncTrigger,
}) => {
  const { isDark } = useTheme();
  const [adminSection, setAdminSection] = useState<AdminSection>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [loanSearchQuery, setLoanSearchQuery] = useState('');
  const [loanStatusFilter, setLoanStatusFilter] = useState<'all' | 'em_andamento' | 'atrasado' | 'devolvido'>('all');
  const [suggestionSearchQuery, setSuggestionSearchQuery] = useState('');
  const [suggestionStatusFilter, setSuggestionStatusFilter] = useState<'all' | 'pendente' | 'aprovado' | 'recusado'>('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Student management modal state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [isStudentHistoryOpen, setIsStudentHistoryOpen] = useState(false);
  const [studentForHistory, setStudentForHistory] = useState<Student | null>(null);
  const [isStudentCardModalOpen, setIsStudentCardModalOpen] = useState(false);
  const [studentForCard, setStudentForCard] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [suggestionToDelete, setSuggestionToDelete] = useState<Suggestion | null>(null);

  // Admin user modal state
  const [isAdminUserModalOpen, setIsAdminUserModalOpen] = useState(false);
  const [adminUserToEdit, setAdminUserToEdit] = useState<AdminUser | null>(null);

  const activeAdmin = currentSessionAdmin || adminUsers[0] || {
    id: 'adm-001',
    name: 'Prof. Eliel Bastos',
    email: 'eliel.bastos@escola.edu.br',
    role: 'superadmin',
    roleLabel: 'Super Administrador',
    avatar: ADMIN_AVATAR_OPTIONS[7].url,
    status: 'ativo',
    createdAt: '15/02/2026',
  };

  // Helper date parser
  const parseLoanDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      }
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  // Real Dynamic Calculations from database
  const activeLoansCount = loans.filter((l) => l.status === 'em_andamento').length;
  const returnedLoansCount = loans.filter((l) => l.status === 'devolvido').length;
  const overdueLoansCount = loans.filter((l) => l.status === 'atrasado').length;
  const totalLoansCount = loans.length;

  const returnedPercent = totalLoansCount > 0 ? Math.round((returnedLoansCount / totalLoansCount) * 100) : 0;
  const activePercent = totalLoansCount > 0 ? Math.round((activeLoansCount / totalLoansCount) * 100) : 0;
  const overduePercent = totalLoansCount > 0 ? Math.round((overdueLoansCount / totalLoansCount) * 100) : 0;

  // Real Monthly Distribution
  const monthlyData = useMemo(() => {
    const months = [
      { label: 'Jan', index: 0 },
      { label: 'Fev', index: 1 },
      { label: 'Mar', index: 2 },
      { label: 'Abr', index: 3 },
      { label: 'Mai', index: 4 },
      { label: 'Jun', index: 5 },
      { label: 'Jul', index: 6 },
      { label: 'Ago', index: 7 },
      { label: 'Set', index: 8 },
      { label: 'Out', index: 9 },
      { label: 'Nov', index: 10 },
      { label: 'Dez', index: 11 },
    ];
    const counts = new Array(12).fill(0);

    loans.forEach((l) => {
      const d = parseLoanDate(l.loanDate);
      if (d) {
        const m = d.getMonth();
        if (m >= 0 && m < 12) counts[m]++;
      } else {
        counts[7]++;
      }
    });

    const maxCount = Math.max(...counts, 1);
    return months.map((m) => ({
      label: m.label,
      value: counts[m.index],
      heightPercent: Math.max(Math.round((counts[m.index] / maxCount) * 100), 10),
    }));
  }, [loans]);

  // Real popular books from actual loans
  const dynamicPopularBooks = useMemo(() => {
    const counts: Record<string, { count: number; author: string }> = {};
    loans.forEach((l) => {
      if (!counts[l.bookTitle]) {
        counts[l.bookTitle] = { count: 0, author: l.bookAuthor };
      }
      counts[l.bookTitle].count++;
    });

    const sorted = Object.entries(counts)
      .map(([title, data], idx) => ({
        id: idx + 1,
        title,
        author: data.author,
        count: data.count,
        bg:
          idx === 0
            ? 'bg-emerald-500/20 text-emerald-400'
            : idx === 1
            ? 'bg-blue-500/20 text-blue-400'
            : idx === 2
            ? 'bg-purple-500/20 text-purple-400'
            : 'bg-amber-500/20 text-amber-400',
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    if (sorted.length === 0 && books.length > 0) {
      return books.slice(0, 4).map((b, idx) => ({
        id: idx + 1,
        title: b.title,
        author: b.author,
        count: b.totalCopies - b.availableCopies,
        bg: 'bg-emerald-500/20 text-emerald-400',
      }));
    }

    return sorted;
  }, [loans, books]);

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${isDark ? 'bg-[#001424]' : 'bg-slate-50'}`}>
      {/* Sidebar matching Panel 4 */}
      <aside className={`w-full lg:w-64 border-r flex flex-col justify-between shrink-0 p-4 lg:p-5 ${
        isDark ? 'bg-[#071828] border-[#163650]' : 'bg-white border-slate-200'
      }`}>
        <div>
          {/* Logo */}
          <div
            onClick={() => setActiveTab('inicio')}
            className="mb-8 cursor-pointer select-none group"
          >
            <Logo size="sm" />
          </div>

          {/* Navigation Menu Links */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'emprestimos', label: 'Empréstimos', icon: BookmarkCheck },
              { id: 'livros', label: 'Livros', icon: BookOpen },
              { id: 'alunos', label: 'Alunos', icon: Users },
              { id: 'carteirinhas', label: 'Carteira do Estudante', icon: CreditCard },
              { id: 'autores', label: 'Escritores', icon: Feather },
              { id: 'sugestoes', label: 'Sugestões', icon: Lightbulb },
              { id: 'usuarios_adm', label: 'Usuários ADM', icon: ShieldCheck },
              { id: 'auditoria', label: 'Histórico & Auditoria', icon: History },
              { id: 'relatorios', label: 'Relatórios', icon: FileText },
              { id: 'backup', label: 'Backup & Restauração', icon: Database },
              { id: 'configuracoes', label: 'Configurações', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = adminSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  onClick={() => {
                    if (item.id === 'relatorios') {
                      setActiveTab('relatorios');
                    } else if (item.id === 'carteirinhas') {
                      setStudentForCard(null);
                      setIsStudentCardModalOpen(true);
                    } else {
                      setAdminSection(item.id as AdminSection);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1dbb64] text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : isDark
                      ? 'text-slate-400 hover:text-white hover:bg-[#092032]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sair Action */}
        <div className={`pt-6 border-t mt-6 ${isDark ? 'border-[#163650]/60' : 'border-slate-200'}`}>
          <button
            id="btn-admin-sair"
            onClick={() => {
              if (onLogout) {
                onLogout();
              } else {
                setActiveTab('inicio');
              }
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-rose-400 hover:bg-[#092032]'
                : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50'
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {adminSection === 'dashboard' && 'Painel Administrativo'}
              {adminSection === 'backup' && 'Backup & Restauração de Dados'}
              {adminSection === 'livros' && 'Gerenciamento de Livros'}
              {adminSection === 'alunos' && 'Cadastro de Alunos'}
              {adminSection === 'emprestimos' && 'Controle de Empréstimos'}
              {adminSection === 'carteirinhas' && 'Emissão de Carteirinhas'}
              {adminSection === 'autores' && 'Escritores'}
              {adminSection === 'sugestoes' && 'Sugestões de Leitores'}
              {adminSection === 'usuarios_adm' && 'Gestão de Usuários Administradores'}
              {adminSection === 'auditoria' && 'Histórico de Ações & Auditoria'}
              {adminSection === 'configuracoes' && 'Configurações do Sistema'}
            </h1>
            <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {adminSection === 'dashboard' && 'Visão geral da biblioteca e métricas sincronizadas em tempo real'}
              {adminSection === 'backup' && 'Download, exportação e restauração segura do banco de dados'}
              {adminSection === 'livros' && `Total de ${books.length} títulos cadastrados no acervo`}
              {adminSection === 'alunos' && `Total de ${students.length} estudantes ativos`}
              {adminSection === 'emprestimos' && `Total de ${loans.length} registros no histórico`}
              {adminSection === 'autores' && 'Cadastre nome, foto e frases semanais que serão exibidas no HeroBanner da página inicial'}
              {adminSection === 'sugestoes' && `Total de ${suggestions.length} sugestões recebidas`}
              {adminSection === 'usuarios_adm' && `Total de ${adminUsers.length} administradores autorizados com avatares e controle de privilégios`}
              {adminSection === 'auditoria' && `Total de ${auditLogs.length} eventos registrados para rastreamento de acessos e modificações`}
              {adminSection === 'configuracoes' && 'Parâmetros institucionais e regras de empréstimo'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Carteira do Estudante Button in Header */}
            <button
              id="btn-admin-header-carteirinhas"
              onClick={() => {
                setStudentForCard(null);
                setIsStudentCardModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md bg-[#004d2c] hover:bg-[#00663a] text-white active:scale-95 border border-emerald-500/30"
              title="Gerar e imprimir carteirinhas dos estudantes"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Carteira do Estudante</span>
            </button>

            {/* Quick New Loan Button */}
            <button
              id="btn-admin-header-new-loan"
              onClick={onOpenNewLoan}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md bg-[#009b5a] hover:bg-[#00b368] text-white active:scale-95"
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Novo Empréstimo</span>
            </button>

            {/* Quick Manage Books Button */}
            {onOpenManageBooks && (
              <button
                id="btn-admin-header-manage-books"
                onClick={onOpenManageBooks}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm border ${
                  isDark
                    ? 'bg-[#092032] hover:bg-[#163650] text-emerald-400 border-[#163650]'
                    : 'bg-white hover:bg-slate-50 text-emerald-700 border-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gerenciar Livros</span>
              </button>
            )}

            {/* Quick Reports Button */}
            <button
              onClick={() => setActiveTab('relatorios')}
              title="Ver Relatórios Estatísticos"
              className={`hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                isDark
                  ? 'bg-[#092032] hover:bg-[#163650] text-emerald-400 border-[#163650]'
                  : 'bg-white hover:bg-slate-50 text-emerald-700 border-slate-200 shadow-sm'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Relatórios</span>
            </button>

            {/* Quick Backup Button */}
            {adminSection !== 'backup' && (
              <button
                onClick={() => setAdminSection('backup')}
                className={`hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  isDark
                    ? 'bg-[#092032] hover:bg-[#163650] text-slate-300 hover:text-white border-[#163650]'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-emerald-500" />
                <span>Backup</span>
              </button>
            )}

            {/* Admin Avatar Profile */}
            <div
              onClick={() => setAdminSection('usuarios_adm')}
              title={`Logado como ${activeAdmin.name} (${activeAdmin.roleLabel})`}
              className={`flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-2xl border transition-all cursor-pointer hover:border-emerald-500/50 ${
                isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="text-right">
                <span className={`text-[10px] block leading-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {activeAdmin.roleLabel}
                </span>
                <span className={`text-xs font-bold block leading-tight truncate max-w-[130px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {activeAdmin.name}
                </span>
              </div>
              <img
                src={activeAdmin.avatar}
                alt={activeAdmin.name}
                className="w-9 h-9 rounded-xl object-cover border border-emerald-500/40 bg-slate-900"
              />
            </div>

            {/* Quick Logout Button */}
            {onLogout && (
              <button
                id="btn-admin-header-logout"
                onClick={onLogout}
                title="Encerrar sessão e sair do Painel ADM"
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-[#092032] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border-[#163650]'
                    : 'bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border-slate-200 shadow-sm'
                }`}
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* SECTION: DASHBOARD PRINCIPAL */}
        {adminSection === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* 4 Metric Cards matching Panel 4 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {/* 1. Livros cadastrados */}
              <div
                onClick={() => setAdminSection('livros')}
                className={`border rounded-2xl p-4 sm:p-5 transition-all cursor-pointer shadow-sm ${
                  isDark
                    ? 'bg-[#092032] border-[#163650] hover:border-emerald-500/30'
                    : 'bg-white border-slate-200 hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {books.length}
                  </span>
                </div>
                <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Livros cadastrados
                </span>
              </div>

              {/* 2. Alunos cadastrados */}
              <div
                onClick={() => setAdminSection('alunos')}
                className={`border rounded-2xl p-4 sm:p-5 transition-all cursor-pointer shadow-sm ${
                  isDark
                    ? 'bg-[#092032] border-[#163650] hover:border-purple-500/30'
                    : 'bg-white border-slate-200 hover:border-purple-500/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-500">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {students.length}
                  </span>
                </div>
                <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Alunos cadastrados
                </span>
              </div>

              {/* 3. Empréstimos ativos */}
              <div
                onClick={() => setAdminSection('emprestimos')}
                className={`border rounded-2xl p-4 sm:p-5 transition-all cursor-pointer shadow-sm ${
                  isDark
                    ? 'bg-[#092032] border-[#163650] hover:border-amber-500/30'
                    : 'bg-white border-slate-200 hover:border-amber-500/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {activeLoansCount}
                  </span>
                </div>
                <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Empréstimos ativos
                </span>
              </div>

              {/* 4. Total de empréstimos */}
              <div
                onClick={() => setActiveTab('relatorios')}
                className={`border rounded-2xl p-4 sm:p-5 transition-all cursor-pointer shadow-sm ${
                  isDark
                    ? 'bg-[#092032] border-[#163650] hover:border-emerald-500/30'
                    : 'bg-white border-slate-200 hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#1dbb64]">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {loans.length}
                  </span>
                </div>
                <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Total de empréstimos
                </span>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm ${
              isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200'
            }`}>
              <div>
                <span className={`text-sm font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Ações Rápidas do Administrador
                </span>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Operações diárias da biblioteca e controle de fluxo
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  id="btn-quick-new-loan"
                  onClick={onOpenNewLoan}
                  className="px-4 py-2 rounded-xl bg-[#009b5a] hover:bg-[#00b368] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
                >
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Novo Empréstimo</span>
                </button>
                <button
                  id="btn-quick-manage-loans"
                  onClick={() => setAdminSection('emprestimos')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all border ${
                    isDark
                      ? 'bg-[#163650]/60 hover:bg-[#163650] text-emerald-300 border-[#163650]'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Ver Empréstimos</span>
                </button>
                {onOpenManageBooks && (
                  <button
                    id="btn-quick-new-book"
                    onClick={onOpenManageBooks}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all border ${
                      isDark
                        ? 'bg-[#001424] hover:bg-[#163650] text-slate-200 border-[#163650]'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                    <span>Gerenciar Livros</span>
                  </button>
                )}
                <button
                  id="btn-quick-new-student"
                  onClick={() => {
                    setStudentToEdit(null);
                    setIsStudentModalOpen(true);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all border ${
                    isDark
                      ? 'bg-[#001424] hover:bg-[#163650] text-slate-200 border-[#163650]'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5 text-purple-500" />
                  <span>Novo Aluno</span>
                </button>
                <button
                  id="btn-quick-autores-destaque"
                  onClick={() => setAdminSection('autores')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all border ${
                    isDark
                      ? 'bg-[#001424] hover:bg-[#163650] text-amber-300 border-[#163650]'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                  }`}
                >
                  <Feather className="w-3.5 h-3.5 text-amber-500" />
                  <span>Escritores</span>
                </button>
              </div>
            </div>

            {/* Quick Backup Banner Inside Dashboard */}
            <div className={`border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isDark
                ? 'bg-gradient-to-r from-[#092032] to-[#0d2a40] border-[#163650]'
                : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <span className={`text-sm font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Backup Automático & Proteção de Dados
                  </span>
                  <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Mantenha cópias atualizadas dos {books.length} livros e {loans.length} empréstimos em formato JSON seguro.
                  </span>
                </div>
              </div>
              <button
                onClick={() => setAdminSection('backup')}
                className="px-4 py-2 rounded-xl bg-[#009b5a] hover:bg-[#00b368] text-white text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
              >
                Abrir Central de Backup
              </button>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Chart: Empréstimos por mês */}
              <div className={`lg:col-span-7 border rounded-2xl p-5 sm:p-6 flex flex-col justify-between ${
                isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Empréstimos por mês
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Dados sincronizados com o banco</p>
                  </div>
                  <span className={`text-xs font-mono px-2.5 py-1 rounded-lg border ${
                    isDark ? 'text-slate-300 bg-[#031320] border-[#163650]' : 'text-slate-700 bg-slate-100 border-slate-200'
                  }`}>
                    Total: {loans.length}
                  </span>
                </div>

                {/* Bars Representation */}
                <div className="h-44 flex items-end justify-between gap-1.5 sm:gap-2 px-2 pt-4">
                  {monthlyData.map((item) => (
                    <div
                      key={item.label}
                      className="flex-1 flex flex-col items-center gap-2 group relative cursor-pointer"
                    >
                      <div className={`absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] px-2 py-0.5 rounded border whitespace-nowrap z-10 font-mono ${
                        isDark ? 'bg-slate-900 text-white border-[#163650]' : 'bg-slate-800 text-white border-slate-700'
                      }`}>
                        {item.value} emp.
                      </div>

                      <div className={`w-full h-28 rounded-t-lg flex items-end overflow-hidden border-b ${
                        isDark ? 'bg-[#031320] border-[#163650]' : 'bg-slate-100 border-slate-200'
                      }`}>
                        <div
                          style={{ height: `${item.heightPercent}%` }}
                          className={`w-full rounded-t-md transition-all duration-300 ${
                            item.value > 0
                              ? 'bg-gradient-to-t from-emerald-600 to-[#1dbb64]'
                              : isDark ? 'bg-slate-800/40' : 'bg-slate-200'
                          }`}
                        />
                      </div>
                      <span className={`text-[10px] font-medium ${
                        item.value > 0 ? (isDark ? 'text-white font-bold' : 'text-slate-900 font-bold') : (isDark ? 'text-slate-500' : 'text-slate-400')
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Chart: Situação dos empréstimos (Donut) */}
              <div className={`lg:col-span-5 border rounded-2xl p-5 sm:p-6 flex flex-col justify-between ${
                isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <h3 className={`text-base sm:text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Situação dos empréstimos
                </h3>

                <div className="flex items-center justify-center gap-6 my-auto">
                  {/* Donut graphic */}
                  <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      {/* Background track */}
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={isDark ? '#163650' : '#e2e8f0'}
                        strokeWidth="4"
                      />
                      {/* Devolvidos */}
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="4.5"
                        strokeDasharray={`${returnedPercent || 0}, 100`}
                      />
                      {/* Em andamento */}
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#eab308"
                        strokeWidth="4.5"
                        strokeDasharray={`${activePercent || 0}, 100`}
                        strokeDashoffset={`-${returnedPercent || 0}`}
                      />
                      {/* Atrasados */}
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="4.5"
                        strokeDasharray={`${overduePercent || 0}, 100`}
                        strokeDashoffset={`-${(returnedPercent || 0) + (activePercent || 0)}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className={`text-xl font-extrabold leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {loans.length}
                      </span>
                      <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total</span>
                    </div>
                  </div>

                  {/* Donut Legend */}
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Devolvidos</span>
                      </div>
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{returnedLoansCount} ({returnedPercent}%)</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Em andamento</span>
                      </div>
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeLoansCount} ({activePercent}%)</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Atrasados</span>
                      </div>
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{overdueLoansCount} ({overduePercent}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Ranked Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Livros mais populares */}
              <div className={`lg:col-span-6 border rounded-2xl p-5 sm:p-6 ${
                isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <h3 className={`text-base sm:text-lg font-bold mb-4 flex items-center justify-between ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  <span>Livros mais populares</span>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Base de Empréstimos</span>
                </h3>

                <div className="space-y-3">
                  {dynamicPopularBooks.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                        isDark
                          ? 'bg-[#031320]/60 border-[#163650]/60 hover:border-emerald-500/40'
                          : 'bg-slate-50 border-slate-200 hover:border-emerald-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg ${item.bg} text-xs font-bold flex items-center justify-center`}>
                          {item.id}
                        </span>
                        <div>
                          <span className={`text-sm font-semibold block leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {item.title}
                          </span>
                          <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {item.author}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                        {item.count} {item.count === 1 ? 'empréstimo' : 'empréstimos'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Empréstimos recentes */}
              <div className={`lg:col-span-6 border rounded-2xl p-5 sm:p-6 ${
                isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <h3 className={`text-base sm:text-lg font-bold mb-4 flex items-center justify-between ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  <span>Empréstimos recentes</span>
                  <button
                    onClick={() => setActiveTab('relatorios')}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer font-semibold"
                  >
                    Ver todos
                  </button>
                </h3>

                <div className="space-y-3">
                  {loans.slice(0, 3).map((loan) => (
                    <div
                      key={loan.id}
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        isDark ? 'bg-[#031320]/60 border-[#163650]/60' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={loan.studentAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                          alt={loan.studentName}
                          className={`w-8 h-8 rounded-full object-cover border student-avatar-zoom transition-transform duration-300 ease-out hover:scale-150 cursor-pointer hover:shadow-2xl hover:z-40 relative ${
                            isDark ? 'border-[#163650]' : 'border-slate-300'
                          }`}
                        />
                        <div>
                          <span className={`text-xs sm:text-sm font-semibold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {loan.studentName} - {loan.bookTitle}
                          </span>
                          <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {loan.studentClass}
                          </span>
                        </div>
                      </div>
                      <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {loan.loanDate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: LIVROS */}
        {adminSection === 'livros' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar livros no acervo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-emerald-500 ${
                    isDark
                      ? 'bg-[#092032] border-[#163650] text-white placeholder-slate-400'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm'
                  }`}
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {onOpenManageBooks && (
                  <button
                    id="btn-open-manage-books-modal"
                    onClick={onOpenManageBooks}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm border ${
                      isDark
                        ? 'bg-[#092032] hover:bg-[#163650] text-emerald-400 border-emerald-500/40'
                        : 'bg-white hover:bg-slate-50 text-emerald-700 border-slate-200'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Gerenciar Livros</span>
                  </button>
                )}
                <button
                  onClick={onOpenNewBook || onOpenManageBooks || (() => setActiveTab('catalogo'))}
                  className="px-4 py-2.5 rounded-xl bg-[#009b5a] hover:bg-[#00b368] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Novo Livro</span>
                </button>
              </div>
            </div>

            <div className={`border rounded-2xl overflow-hidden ${
              isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className={`text-[11px] uppercase tracking-wider border-b ${
                    isDark ? 'bg-[#001424] text-slate-400 border-[#163650]' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    <tr>
                      <th className="py-3 px-4">Capa & Título</th>
                      <th className="py-3 px-4">Autor</th>
                      <th className="py-3 px-4">Categoria</th>
                      <th className="py-3 px-4">Ano</th>
                      <th className="py-3 px-4">Exemplares</th>
                      <th className="py-3 px-4">Localização</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-[#163650]/60' : 'divide-slate-200'}`}>
                    {books
                      .filter((b) =>
                        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.category.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' }))
                      .map((book) => (
                        <tr key={book.id} className={`transition-colors ${
                          isDark ? 'hover:bg-[#0d2a40]/50' : 'hover:bg-slate-50'
                        }`}>
                          <td className="py-3 px-4 flex items-center gap-3">
                            <img
                              src={book.cover}
                              alt={book.title}
                              className="w-8 h-11 object-cover rounded shadow-sm shrink-0"
                            />
                            <div>
                              <span className={`font-semibold block leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {book.title}
                              </span>
                              <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                ISBN: {book.isbn}
                              </span>
                            </div>
                          </td>
                          <td className={`py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{book.author}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold text-white shadow-xs ${getCategoryColor(book.category).bg}`}>
                              {book.category}
                            </span>
                          </td>
                          <td className={`py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{book.year}</td>
                          <td className="py-3 px-4">
                            <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{book.availableCopies}</span>
                            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>/{book.totalCopies} disp.</span>
                          </td>
                          <td className={`py-3 px-4 font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{book.location}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {onOpenManageBooks && (
                                <button
                                  onClick={onOpenManageBooks}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border ${
                                    isDark
                                      ? 'bg-[#001424] hover:bg-[#163650] text-slate-300 hover:text-white border-[#163650]'
                                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                                  }`}
                                >
                                  Alterar
                                </button>
                              )}
                              <button
                                onClick={() => onOpenBookDetail(book)}
                                className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold text-xs cursor-pointer"
                              >
                                Detalhes
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: ALUNOS */}
        {adminSection === 'alunos' && (() => {
          const filteredStudents = students
            .filter((student) => {
              const query = studentSearchQuery.toLowerCase().trim();
              if (!query) return true;
              return (
                student.name.toLowerCase().includes(query) ||
                (student.studentCode && student.studentCode.toLowerCase().includes(query)) ||
                (student.class && student.class.toLowerCase().includes(query)) ||
                (student.registration && student.registration.toLowerCase().includes(query)) ||
                (student.phone && student.phone.includes(query))
              );
            })
            .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));

          return (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Card Container styled like user's screenshot */}
              <div className={`border rounded-2xl p-5 shadow-xl space-y-4 ${
                isDark ? 'bg-[#002237] border-[#163e5e]' : 'bg-white border-slate-200'
              }`}>
                {/* Header with Title, Carteira do Estudante and '+ Novo aluno' button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className={`font-bold text-lg font-serif tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Alunos cadastrados ({filteredStudents.length})
                  </h3>
                  <div className="flex items-center gap-2.5">
                    <button
                      id="btn-print-all-student-cards"
                      onClick={() => {
                        setStudentForCard(null);
                        setIsStudentCardModalOpen(true);
                      }}
                      className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                        isDark
                          ? 'bg-[#004d2c]/60 hover:bg-[#00663a] text-emerald-300 border-emerald-500/40'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span>Carteira do Estudante</span>
                    </button>

                    <button
                      id="btn-add-new-student"
                      onClick={() => {
                        setStudentToEdit(null);
                        setIsStudentModalOpen(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#009b5a] hover:bg-[#00b368] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-950/40"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Novo aluno</span>
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="input-search-students"
                    type="text"
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    placeholder="Pesquisar por nome ou código do aluno..."
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors border ${
                      isDark ? 'bg-[#001726] border-[#163e5e] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                  {studentSearchQuery && (
                    <button
                      onClick={() => setStudentSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                {/* Table with Colorful Headers */}
                <div className="overflow-x-auto rounded-xl">
                  <table className="w-full text-left text-xs border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-white text-[11px] font-bold tracking-wider uppercase">
                        <th className="py-2.5 px-3.5 bg-[#2563eb] first:rounded-l-xl text-center">
                          CÓDIGO
                        </th>
                        <th className="py-2.5 px-4 bg-[#a855f7] text-left">
                          NOME
                        </th>
                        <th className="py-2.5 px-4 bg-[#06b6d4] text-center">
                          TURMA
                        </th>
                        <th className="py-2.5 px-4 bg-[#f59e0b] text-center">
                          MATRÍCULA
                        </th>
                        <th className="py-2.5 px-4 bg-[#10b981] text-center">
                          TELEFONE
                        </th>
                        <th className="py-2.5 px-4 bg-[#6366f1] last:rounded-r-xl text-center">
                          AÇÕES
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={6} className={`py-8 text-center rounded-xl ${
                            isDark ? 'text-slate-400 bg-[#001726]/60' : 'text-slate-500 bg-slate-50'
                          }`}>
                            Nenhum aluno encontrado para a busca "{studentSearchQuery}".
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((student) => (
                          <tr
                            key={student.id}
                            className={`transition-colors rounded-xl overflow-hidden ${
                              isDark ? 'bg-[#001726] hover:bg-[#082a44]' : 'bg-slate-50 hover:bg-slate-100'
                            }`}
                          >
                            {/* CÓDIGO */}
                            <td className={`py-3 px-3.5 font-mono font-semibold text-center first:rounded-l-xl border-y border-l ${
                              isDark ? 'text-emerald-400 border-[#163e5e]' : 'text-emerald-700 border-slate-200'
                            }`}>
                              {student.studentCode
                                ? student.studentCode.replace(/^ALU-/, '')
                                : (student.name.substring(0, 3).toUpperCase() || 'EST') + '-0001'}
                            </td>

                            {/* NOME com Avatar */}
                            <td className={`py-3 px-4 border-y ${isDark ? 'border-[#163e5e]' : 'border-slate-200'}`}>
                              <div className="flex items-center gap-3">
                                <img
                                  src={student.avatar}
                                  alt={student.name}
                                  className={`w-9 h-9 rounded-full object-cover border flex-shrink-0 student-avatar-zoom transition-transform duration-300 ease-out hover:scale-150 cursor-pointer hover:shadow-2xl hover:z-40 relative ${
                                    isDark ? 'border-[#163e5e] bg-[#092032]' : 'border-slate-200 bg-white'
                                  }`}
                                />
                                <span className={`font-semibold truncate max-w-[200px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                  {student.name}
                                </span>
                              </div>
                            </td>

                            {/* TURMA */}
                            <td className={`py-3 px-4 text-center font-medium border-y ${
                              isDark ? 'text-slate-200 border-[#163e5e]' : 'text-slate-700 border-slate-200'
                            }`}>
                              {student.class}
                            </td>

                            {/* MATRÍCULA */}
                            <td className={`py-3 px-4 text-center font-mono border-y ${
                              isDark ? 'text-slate-400 border-[#163e5e]' : 'text-slate-500 border-slate-200'
                            }`}>
                              {student.registration || '—'}
                            </td>

                            {/* TELEFONE */}
                            <td className={`py-3 px-4 text-center font-mono border-y ${
                              isDark ? 'text-slate-300 border-[#163e5e]' : 'text-slate-700 border-slate-200'
                            }`}>
                              {student.phone || '—'}
                            </td>

                            {/* AÇÕES (Histórico, Editar, Excluir) */}
                            <td className={`py-3 px-4 text-center last:rounded-r-xl border-y border-r ${
                              isDark ? 'border-[#163e5e]' : 'border-slate-200'
                            }`}>
                              <div className="flex items-center justify-center gap-2">
                                {/* Carteira do Estudante */}
                                <button
                                  id={`btn-student-card-${student.id}`}
                                  onClick={() => {
                                    setStudentForCard(student);
                                    setIsStudentCardModalOpen(true);
                                  }}
                                  title="Imprimir Carteira do Estudante (com Código de Barras e Avatar)"
                                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    isDark
                                      ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20'
                                      : 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100'
                                  }`}
                                >
                                  <CreditCard className="w-4 h-4" />
                                </button>

                                {/* Histórico */}
                                <button
                                  id={`btn-student-history-${student.id}`}
                                  onClick={() => {
                                    setStudentForHistory(student);
                                    setIsStudentHistoryOpen(true);
                                  }}
                                  title="Histórico de Empréstimos"
                                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    isDark
                                      ? 'text-slate-400 hover:text-cyan-400 hover:bg-[#001f35]'
                                      : 'text-slate-500 hover:text-cyan-600 hover:bg-slate-200'
                                  }`}
                                >
                                  <History className="w-4 h-4" />
                                </button>

                                {/* Editar */}
                                <button
                                  id={`btn-student-edit-${student.id}`}
                                  onClick={() => {
                                    setStudentToEdit(student);
                                    setIsStudentModalOpen(true);
                                  }}
                                  title="Editar Aluno e Avatar"
                                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    isDark
                                      ? 'text-slate-400 hover:text-white hover:bg-[#001f35]'
                                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                                  }`}
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>

                                {/* Excluir */}
                                <button
                                  id={`btn-student-delete-${student.id}`}
                                  onClick={() => setStudentToDelete(student)}
                                  title="Excluir Aluno"
                                  className="p-1.5 rounded-lg text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* SECTION: EMPRESTIMOS */}
        {adminSection === 'emprestimos' && (() => {
          const filteredLoans = loans.filter((l) => {
            // Status filter
            if (loanStatusFilter !== 'all' && l.status !== loanStatusFilter) return false;

            // Text search
            if (loanSearchQuery.trim()) {
              const q = loanSearchQuery.toLowerCase();
              const matchName = l.studentName.toLowerCase().includes(q);
              const matchCode = l.studentCode ? l.studentCode.toLowerCase().includes(q) : false;
              const matchBook = l.bookTitle.toLowerCase().includes(q);
              const matchAuthor = l.bookAuthor.toLowerCase().includes(q);
              const matchClass = l.studentClass.toLowerCase().includes(q);
              return matchName || matchCode || matchBook || matchAuthor || matchClass;
            }

            return true;
          });

          return (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Controle de Empréstimos Ativos & Devoluções</h3>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Gerencie saídas, prazos de devolução e renovações de livros
                  </p>
                </div>
                <button
                  id="btn-admin-section-new-loan"
                  onClick={onOpenNewLoan}
                  className="px-4 py-2.5 rounded-xl bg-[#009b5a] hover:bg-[#00b368] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Empréstimo</span>
                </button>
              </div>

              {/* Filters & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Status Tabs */}
                <div className={`flex items-center p-1 rounded-xl border overflow-x-auto ${
                  isDark ? 'bg-[#092032] border-[#163650]' : 'bg-slate-100 border-slate-200'
                }`}>
                  {[
                    { id: 'all', label: `Todos (${loans.length})` },
                    { id: 'em_andamento', label: `Em dia (${activeLoansCount})` },
                    { id: 'atrasado', label: `Atrasados (${overdueLoansCount})` },
                    { id: 'devolvido', label: `Devolvidos (${returnedLoansCount})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setLoanStatusFilter(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                        loanStatusFilter === tab.id
                          ? isDark
                            ? 'bg-[#1dbb64] text-slate-950 font-bold shadow-sm'
                            : 'bg-[#23c65e] text-white font-bold shadow-sm'
                          : isDark
                          ? 'text-slate-400 hover:text-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Search input */}
                <div className="relative w-full sm:w-72">
                  <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                  <input
                    type="text"
                    value={loanSearchQuery}
                    onChange={(e) => setLoanSearchQuery(e.target.value)}
                    placeholder="Buscar por aluno, código, livro..."
                    className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                      isDark
                        ? 'bg-[#092032] border-[#163650] text-white placeholder-slate-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  {loanSearchQuery && (
                    <button
                      onClick={() => setLoanSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className={`border rounded-2xl overflow-hidden ${
                isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className={`text-[11px] uppercase tracking-wider border-b ${
                      isDark ? 'bg-[#001424] text-slate-400 border-[#163650]' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      <tr>
                        <th className="py-3 px-4">Aluno</th>
                        <th className="py-3 px-4">Livro</th>
                        <th className="py-3 px-4">Data Empréstimo</th>
                        <th className="py-3 px-4">Devolução Prevista</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-[#163650]/60' : 'divide-slate-200'}`}>
                      {filteredLoans.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-10 text-center">
                            <BookmarkCheck className={`w-8 h-8 mx-auto mb-2 opacity-30 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              Nenhum registro de empréstimo encontrado para esta busca/filtro.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredLoans.map((loan) => (
                          <tr key={loan.id} className={`transition-colors ${
                            isDark ? 'hover:bg-[#0d2a40]/50' : 'hover:bg-slate-50'
                          }`}>
                            <td className="py-3 px-4">
                              <span className={`font-semibold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{loan.studentName}</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {loan.studentCode && (
                                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                                    isDark ? 'bg-[#031320] text-emerald-400 border-[#163650]' : 'bg-slate-100 text-emerald-700 border-slate-200'
                                  }`}>
                                    {loan.studentCode.replace(/^ALU-/, '')}
                                  </span>
                                )}
                                <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{loan.studentClass}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`font-medium block ${isDark ? 'text-white' : 'text-slate-900'}`}>{loan.bookTitle}</span>
                              <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{loan.bookAuthor}</span>
                            </td>
                            <td className={`py-3 px-4 font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{loan.loanDate}</td>
                            <td className={`py-3 px-4 font-mono font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{loan.returnDate}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                  loan.status === 'devolvido'
                                    ? isDark ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : loan.status === 'atrasado'
                                    ? isDark ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : isDark ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {loan.status === 'devolvido' ? 'Devolvido' : loan.status === 'atrasado' ? 'Atrasado' : 'Em dia'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right space-x-2">
                              {loan.status !== 'devolvido' && onReturnLoan && (
                                <button
                                  onClick={() => onReturnLoan(loan.id)}
                                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer shadow-sm transition-colors"
                                >
                                  Devolver
                                </button>
                              )}
                              {loan.status !== 'devolvido' && onRenewLoan && (
                                <button
                                  onClick={() => onRenewLoan(loan.id)}
                                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer border transition-colors ${
                                    isDark
                                      ? 'bg-[#001424] hover:bg-[#163650] text-slate-300 border-[#163650]'
                                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                                  }`}
                                >
                                  Renovar
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* SECTION: SUGESTÕES */}
        {adminSection === 'sugestoes' && (() => {
          const filteredSuggestions = suggestions.filter((s) => {
            if (suggestionStatusFilter !== 'all' && s.status !== suggestionStatusFilter) {
              return false;
            }
            if (suggestionSearchQuery.trim()) {
              const q = suggestionSearchQuery.toLowerCase();
              const matchTitle = s.bookTitle.toLowerCase().includes(q);
              const matchAuthor = s.author.toLowerCase().includes(q);
              const matchStudent = s.studentName.toLowerCase().includes(q);
              const matchCat = s.category.toLowerCase().includes(q);
              const matchReason = s.reason ? s.reason.toLowerCase().includes(q) : false;
              return matchTitle || matchAuthor || matchStudent || matchCat || matchReason;
            }
            return true;
          });

          const pendingCount = suggestions.filter((s) => s.status === 'pendente').length;
          const approvedCount = suggestions.filter((s) => s.status === 'aprovado').length;
          const rejectedCount = suggestions.filter((s) => s.status === 'recusado').length;

          return (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Sugestões de Livros dos Estudantes
                    </h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                      isDark ? 'bg-[#001424] text-emerald-400 border-[#163650]' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {suggestions.length} total
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Modere, aprove ou exclua as indicações de títulos enviadas pelos alunos
                  </p>
                </div>
              </div>

              {/* Filters & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Status Tabs */}
                <div className={`flex items-center p-1 rounded-xl border overflow-x-auto ${
                  isDark ? 'bg-[#092032] border-[#163650]' : 'bg-slate-100 border-slate-200'
                }`}>
                  {[
                    { id: 'all', label: `Todas (${suggestions.length})` },
                    { id: 'pendente', label: `Pendentes (${pendingCount})` },
                    { id: 'aprovado', label: `Aprovadas (${approvedCount})` },
                    { id: 'recusado', label: `Recusadas (${rejectedCount})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSuggestionStatusFilter(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                        suggestionStatusFilter === tab.id
                          ? isDark
                            ? 'bg-[#1dbb64] text-slate-900 font-bold shadow-sm'
                            : 'bg-[#23c65e] text-white font-bold shadow-sm'
                          : isDark
                          ? 'text-slate-400 hover:text-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Search input */}
                <div className="relative w-full sm:w-72">
                  <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                  <input
                    type="text"
                    value={suggestionSearchQuery}
                    onChange={(e) => setSuggestionSearchQuery(e.target.value)}
                    placeholder="Buscar por livro, autor ou aluno..."
                    className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                      isDark
                        ? 'bg-[#092032] border-[#163650] text-white placeholder-slate-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  {suggestionSearchQuery && (
                    <button
                      onClick={() => setSuggestionSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Suggestions Grid */}
              {filteredSuggestions.length === 0 ? (
                <div className={`border rounded-2xl p-10 text-center ${
                  isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200'
                }`}>
                  <Lightbulb className={`w-10 h-10 mx-auto mb-2 opacity-30 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  <p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Nenhuma sugestão encontrada
                  </p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Nenhum registro corresponde aos filtros ou termos buscados.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {filteredSuggestions.map((sug) => (
                    <div
                      key={sug.id}
                      className={`border rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm transition-all ${
                        isDark ? 'bg-[#092032] border-[#163650] hover:border-[#214a6e]' : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                            isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {sug.category}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{sug.date}</span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                sug.status === 'aprovado'
                                  ? isDark ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : sug.status === 'recusado'
                                  ? isDark ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : isDark ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {sug.status === 'aprovado' ? 'Aprovado' : sug.status === 'recusado' ? 'Recusado' : 'Em análise'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>{sug.bookTitle}</h4>
                          <span className={`text-xs font-medium block ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>por {sug.author}</span>
                        </div>

                        <div className="text-xs sm:text-sm p-3.5 rounded-xl border italic leading-relaxed bg-white text-slate-900 border-slate-200 shadow-sm font-normal">
                          "{sug.reason || 'Sem justificativa adicional informada.'}"
                        </div>
                      </div>

                      {/* Footer with Student Name & Action Buttons */}
                      <div className={`pt-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isDark ? 'border-[#163650]' : 'border-slate-100'
                      }`}>
                        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Sugerido por: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{sug.studentName}</strong>
                        </span>

                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                          {/* Moderate Status Buttons */}
                          {onUpdateSuggestionStatus && (
                            <>
                              {sug.status !== 'aprovado' && (
                                <button
                                  id={`btn-approve-sug-${sug.id}`}
                                  onClick={() => onUpdateSuggestionStatus(sug.id, 'aprovado')}
                                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer transition-colors shadow-sm"
                                  title="Aprovar sugestão para aquisição"
                                >
                                  Aprovar
                                </button>
                              )}
                              {sug.status !== 'recusado' && (
                                <button
                                  id={`btn-reject-sug-${sug.id}`}
                                  onClick={() => onUpdateSuggestionStatus(sug.id, 'recusado')}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                                    isDark
                                      ? 'bg-[#001424] hover:bg-[#163650] text-slate-400 hover:text-slate-200 border-[#163650]'
                                      : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                                  }`}
                                  title="Marcar como recusada"
                                >
                                  Recusar
                                </button>
                              )}
                            </>
                          )}

                          {/* Botão de Excluir Sugestão */}
                          <button
                            id={`btn-delete-sug-${sug.id}`}
                            onClick={() => setSuggestionToDelete(sug)}
                            className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-all flex items-center gap-1 ${
                              isDark
                                ? 'bg-rose-950/30 hover:bg-rose-900/60 text-rose-400 border-rose-900/50'
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                            }`}
                            title="Excluir esta sugestão permanentemente"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Excluir</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* SECTION: CONFIGURAÇÕES */}
        {adminSection === 'configuracoes' && (
          <div className="space-y-6 animate-in fade-in duration-150 max-w-4xl">
            <div className={`border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm ${
              isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200'
            }`}>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Parâmetros da Biblioteca Maria Quitéria</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={`text-xs block mb-1 font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Nome da Instituição</label>
                  <input
                    type="text"
                    disabled
                    value="Colégio Estadual do Campo Maria Quitéria - TI"
                    className={`w-full text-xs rounded-xl p-3 border ${
                      isDark ? 'bg-[#001424] border-[#163650] text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs block mb-1 font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Prazo Padrão de Empréstimo</label>
                  <input
                    type="text"
                    disabled
                    value="14 dias corridos (renovável por +7 dias)"
                    className={`w-full text-xs rounded-xl p-3 border ${
                      isDark ? 'bg-[#001424] border-[#163650] text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs block mb-1 font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Limite de Livros por Aluno</label>
                  <input
                    type="text"
                    disabled
                    value="Até 2 livros simultâneos"
                    className={`w-full text-xs rounded-xl p-3 border ${
                      isDark ? 'bg-[#001424] border-[#163650] text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs block mb-1 font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Horário de Funcionamento</label>
                  <input
                    type="text"
                    disabled
                    value="Segunda a Sexta, das 07:30 às 17:00"
                    className={`w-full text-xs rounded-xl p-3 border ${
                      isDark ? 'bg-[#001424] border-[#163650] text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              <div className={`pt-4 border-t flex justify-end ${isDark ? 'border-[#163650]' : 'border-slate-200'}`}>
                <button
                  onClick={() => setAdminSection('backup')}
                  className="px-5 py-2.5 bg-[#009b5a] hover:bg-[#00b368] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Database className="w-4 h-4" />
                  <span>Gerenciar Backup & Restauração</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: BACKUP & RESTAURAÇÃO */}
        {adminSection === 'backup' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <BackupRestoreView
              books={books}
              loans={loans}
              students={students}
              suggestions={suggestions}
              adminUsers={adminUsers}
              auditLogs={auditLogs}
              cloudSyncStatus={cloudSyncStatus}
              lastSyncTime={lastSyncTime}
              onManualSyncTrigger={onManualSyncTrigger}
              onRestoreData={onRestoreData || (() => {})}
            />
          </div>
        )}

        {/* SECTION: USUÁRIOS ADMINISTRADORES */}
        {adminSection === 'usuarios_adm' && (
          <AdminUsersView
            adminUsers={adminUsers}
            onOpenCreateAdmin={() => {
              setAdminUserToEdit(null);
              setIsAdminUserModalOpen(true);
            }}
            onEditAdmin={(adm) => {
              setAdminUserToEdit(adm);
              setIsAdminUserModalOpen(true);
            }}
            onDeleteAdmin={(adminId) => {
              onDeleteAdminUser?.(adminId);
            }}
            onToggleStatus={(adm) => {
              onToggleAdminStatus?.(adm);
            }}
            onViewAuditLog={() => {
              setAdminSection('auditoria');
            }}
            currentSessionAdmin={activeAdmin}
          />
        )}

        {/* SECTION: HISTÓRICO & AUDITORIA */}
        {adminSection === 'auditoria' && (
          <AuditLogView
            logs={auditLogs}
            adminUsers={adminUsers}
            onClearLogs={onClearAuditLogs}
          />
        )}

        {/* SECTION: AUTORES DA SEMANA (CADASTRO E GESTÃO) */}
        {adminSection === 'autores' && (
          <AdminAuthorsView />
        )}
      </main>

      {/* Modal de Gestão de Usuários Administradores */}
      <AdminUserModal
        isOpen={isAdminUserModalOpen}
        onClose={() => {
          setIsAdminUserModalOpen(false);
          setAdminUserToEdit(null);
        }}
        adminToEdit={adminUserToEdit}
        onSave={(savedAdmin: AdminUser) => {
          if (adminUserToEdit) {
            onSaveAdminUser?.(savedAdmin);
          } else {
            onCreateAdminUser?.(savedAdmin);
          }
        }}
      />

      {/* Modal de Cadastro / Edição de Aluno com Banco de Avatares */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setStudentToEdit(null);
        }}
        studentToEdit={studentToEdit}
        existingCount={students.length}
        onSaveStudent={(savedStudent) => {
          if (studentToEdit) {
            onSaveStudent?.(savedStudent);
          } else {
            onCreateStudent ? onCreateStudent(savedStudent) : onSaveStudent?.(savedStudent);
          }
        }}
      />

      {/* Modal de Histórico do Aluno */}
      <StudentHistoryModal
        isOpen={isStudentHistoryOpen}
        onClose={() => {
          setIsStudentHistoryOpen(false);
          setStudentForHistory(null);
        }}
        student={studentForHistory}
        loans={loans}
      />

      {/* Diálogo de Confirmação de Exclusão de Aluno */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className={`w-full max-w-sm border rounded-2xl p-6 shadow-2xl space-y-4 ${
            isDark ? 'bg-[#001f35] border-[#163e5e]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <img
                src={studentToDelete.avatar}
                alt={studentToDelete.name}
                className={`w-12 h-12 rounded-full object-cover border ${
                  isDark ? 'border-[#163e5e]' : 'border-slate-200'
                }`}
              />
              <div>
                <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Excluir Aluno?</h4>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {studentToDelete.name} ({studentToDelete.class})
                </p>
              </div>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Tem certeza que deseja remover o cadastro deste aluno da biblioteca? Esta ação não pode ser desfeita.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#0d2a40] hover:bg-[#163e5e] text-slate-300 hover:text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (studentToDelete) {
                    onDeleteStudent?.(studentToDelete.id);
                    setStudentToDelete(null);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-rose-900/30"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diálogo de Confirmação de Exclusão de Sugestão */}
      {suggestionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className={`w-full max-w-sm border rounded-2xl p-6 shadow-2xl space-y-4 ${
            isDark ? 'bg-[#001f35] border-[#163e5e]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-600'
              }`}>
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Excluir Sugestão?</h4>
                <p className={`text-xs truncate max-w-[200px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {suggestionToDelete.bookTitle}
                </p>
              </div>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Deseja realmente remover a sugestão do livro <strong>"{suggestionToDelete.bookTitle}"</strong> indicada por <strong>{suggestionToDelete.studentName}</strong>?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSuggestionToDelete(null)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#0d2a40] hover:bg-[#163e5e] text-slate-300 hover:text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Cancelar
              </button>
              <button
                type="button"
                id="confirm-delete-suggestion-btn"
                onClick={() => {
                  if (suggestionToDelete) {
                    onDeleteSuggestion?.(suggestionToDelete.id);
                    setSuggestionToDelete(null);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-rose-900/30"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal da Carteira do Estudante */}
      <StudentCardModal
        isOpen={isStudentCardModalOpen}
        onClose={() => {
          setIsStudentCardModalOpen(false);
          setStudentForCard(null);
        }}
        students={students}
        initialSelectedStudent={studentForCard}
      />
    </div>
  );
};


