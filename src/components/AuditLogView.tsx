import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  BookOpen,
  Users,
  BookmarkCheck,
  Lightbulb,
  Shield,
  Clock,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { AuditLog, AuditActionCategory, AdminUser } from '../types';
import { useTheme } from '../context/ThemeContext';

interface AuditLogViewProps {
  logs: AuditLog[];
  adminUsers: AdminUser[];
  onClearLogs?: () => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({
  logs,
  adminUsers,
  onClearLogs,
}) => {
  const { isDark } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdminId, setSelectedAdminId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        log.title.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.adminName.toLowerCase().includes(q) ||
        (log.targetName && log.targetName.toLowerCase().includes(q)) ||
        log.timestamp.toLowerCase().includes(q);

      const matchesAdmin = selectedAdminId === 'all' || log.adminId === selectedAdminId;
      const matchesCategory = selectedCategory === 'all' || log.actionCategory === selectedCategory;

      return matchesSearch && matchesAdmin && matchesCategory;
    });
  }, [logs, searchQuery, selectedAdminId, selectedCategory]);

  const getCategoryConfig = (category: AuditActionCategory) => {
    switch (category) {
      case 'livros':
        return {
          label: 'Acervo / Livros',
          icon: BookOpen,
          bg: isDark ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : 'bg-blue-100 border-blue-300 text-blue-900',
        };
      case 'alunos':
        return {
          label: 'Alunos / Estudantes',
          icon: Users,
          bg: isDark ? 'bg-purple-500/15 border-purple-500/30 text-purple-400' : 'bg-purple-100 border-purple-300 text-purple-900',
        };
      case 'emprestimos':
        return {
          label: 'Empréstimos',
          icon: BookmarkCheck,
          bg: isDark ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-emerald-100 border-emerald-300 text-emerald-900',
        };
      case 'sugestoes':
        return {
          label: 'Sugestões',
          icon: Lightbulb,
          bg: isDark ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' : 'bg-amber-100 border-amber-300 text-amber-900',
        };
      case 'usuarios_adm':
        return {
          label: 'Gestão de ADM',
          icon: Shield,
          bg: isDark ? 'bg-rose-500/15 border-rose-500/30 text-rose-400' : 'bg-rose-100 border-rose-300 text-rose-900',
        };
      case 'acesso':
        return {
          label: 'Login / Acesso',
          icon: Clock,
          bg: isDark ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400' : 'bg-cyan-100 border-cyan-300 text-cyan-900',
        };
      case 'sistema':
      default:
        return {
          label: 'Sistema / Backup',
          icon: Layers,
          bg: isDark ? 'bg-slate-500/15 border-slate-500/30 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-900',
        };
    }
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = ['ID', 'Data/Hora', 'Administrador', 'Cargo', 'Categoria', 'Ação', 'Detalhes', 'Alvo'];
    const rows = filteredLogs.map((l) => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.adminName}"`,
      `"${l.adminRole}"`,
      `"${l.actionCategory}"`,
      `"${l.title.replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${(l.targetName || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `auditoria_biblioteca_maria_quiteria_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON Handler
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `auditoria_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Summary */}
      <div
        className={`p-6 rounded-3xl border ${
          isDark
            ? 'bg-gradient-to-r from-[#092032] via-[#0b273d] to-[#092032] border-[#163650]'
            : 'bg-gradient-to-r from-slate-50 via-white to-slate-50 border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Histórico & Auditoria de Administradores
              </h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Rastreabilidade transparente: saiba exatamente qual Administrador acessou, cadastrou ou alterou dados na Biblioteca Maria Quitéria.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportCSV}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#00101c] hover:bg-[#163650] text-slate-200 border-[#163650]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-sm'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>Exportar Planilha (CSV)</span>
            </button>

            <button
              onClick={handleExportJSON}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#00101c] hover:bg-[#163650] text-slate-200 border-[#163650]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-sm'
              }`}
            >
              <Download className="w-4 h-4 text-blue-500" />
              <span>Exportar JSON</span>
            </button>

            {onClearLogs && (
              <button
                onClick={() => setIsConfirmClearOpen(true)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#00101c] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border-[#163650]'
                    : 'bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border-slate-300'
                }`}
                title="Limpar Histórico Antigo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isDark ? 'bg-[#071828] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por ação, livro, aluno, administrador ou detalhe..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-cyan-500 ${
              isDark
                ? 'bg-[#001424] border-[#163650] text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Admin Filter */}
          <select
            value={selectedAdminId}
            onChange={(e) => setSelectedAdminId(e.target.value)}
            className={`px-3 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer ${
              isDark ? 'bg-[#001424] border-[#163650] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="all">Todos os Administradores</option>
            {adminUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.roleLabel})
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-3 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer ${
              isDark ? 'bg-[#001424] border-[#163650] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="all">Todas as Categorias</option>
            <option value="livros">Livros / Acervo</option>
            <option value="alunos">Alunos / Estudantes</option>
            <option value="emprestimos">Empréstimos e Devoluções</option>
            <option value="sugestoes">Sugestões e Moderações</option>
            <option value="usuarios_adm">Gestão de Usuários ADM</option>
            <option value="acesso">Logins e Acessos</option>
            <option value="sistema">Sistema e Backups</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div
        className={`rounded-3xl border overflow-hidden ${
          isDark ? 'bg-[#071828] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDark ? 'bg-[#001424] border-[#163650]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-500" />
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Registro de Operações ({filteredLogs.length})
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Atualizado automaticamente em tempo real
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-[#163650]/60">
          {filteredLogs.map((log) => {
            const cat = getCategoryConfig(log.actionCategory);
            const CatIcon = cat.icon;

            return (
              <div
                key={log.id}
                className={`p-5 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                  isDark ? 'hover:bg-[#001424]/60' : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Left: Avatar + Details */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={log.adminAvatar}
                      alt={log.adminName}
                      className="w-11 h-11 rounded-2xl object-cover border border-emerald-500/40 bg-slate-900"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 bg-cyan-500 text-slate-950 rounded-full shadow">
                      <CatIcon className="w-2.5 h-2.5 stroke-[2.5]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {log.adminName}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${cat.bg}`}>
                        {cat.label}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        ({log.adminRole})
                      </span>
                    </div>

                    <h4 className={`text-sm font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      {log.title}
                    </h4>

                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {log.details}
                    </p>

                    {log.targetName && (
                      <div className="pt-0.5">
                        <span className={`inline-block text-[11px] px-2 py-0.5 rounded-md font-mono ${
                          isDark ? 'bg-[#00101c] text-cyan-300' : 'bg-slate-100 text-slate-700'
                        }`}>
                          Alvo: {log.targetName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Timestamp */}
                <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-1 text-right">
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{log.timestamp}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">
                    ID: {log.id}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="p-12 text-center">
              <History className="w-12 h-12 mx-auto mb-3 text-slate-400 opacity-40" />
              <h3 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Nenhum registro de auditoria encontrado
              </h3>
              <p className={`text-xs max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Tente alterar os termos de pesquisa ou os filtros de administrador e categoria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal to Clear Logs */}
      {isConfirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl ${
              isDark ? 'bg-[#001424] border-[#163650]' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Limpar Histórico de Auditoria?
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Recomendamos exportar um backup antes de limpar os registros.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsConfirmClearOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold ${
                  isDark ? 'bg-[#092032] text-slate-300' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (onClearLogs) onClearLogs();
                  setIsConfirmClearOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/20 cursor-pointer"
              >
                Sim, Limpar Histórico
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
