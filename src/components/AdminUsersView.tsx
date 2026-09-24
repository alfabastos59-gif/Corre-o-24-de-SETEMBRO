import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  UserPlus,
  Search,
  Filter,
  Pencil,
  Trash2,
  Lock,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  Sparkles,
  Info
} from 'lucide-react';
import { AdminUser, AdminRole } from '../types';
import { useTheme } from '../context/ThemeContext';

interface AdminUsersViewProps {
  adminUsers: AdminUser[];
  onOpenCreateAdmin: () => void;
  onEditAdmin: (adminUser: AdminUser) => void;
  onDeleteAdmin: (adminId: string) => void;
  onToggleStatus: (adminUser: AdminUser) => void;
  onViewAuditLog: () => void;
  currentSessionAdmin?: AdminUser;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({
  adminUsers,
  onOpenCreateAdmin,
  onEditAdmin,
  onDeleteAdmin,
  onToggleStatus,
  onViewAuditLog,
  currentSessionAdmin,
}) => {
  const { isDark } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | AdminRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ativo' | 'inativo'>('all');
  const [adminToDelete, setAdminToDelete] = useState<AdminUser | null>(null);

  // Statistics
  const totalCount = adminUsers.length;
  const activeCount = adminUsers.filter((u) => u.status === 'ativo').length;
  const superAdminCount = adminUsers.filter((u) => u.role === 'superadmin').length;
  const librarianCount = adminUsers.filter((u) => u.role === 'bibliotecario').length;

  const filteredUsers = adminUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.notes && u.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case 'superadmin':
        return {
          label: 'Super Administrador',
          bg: isDark ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' : 'bg-amber-100 border-amber-300 text-amber-900',
          icon: Shield,
        };
      case 'bibliotecario':
        return {
          label: 'Bibliotecário',
          bg: isDark ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-emerald-100 border-emerald-300 text-emerald-900',
          icon: ShieldCheck,
        };
      case 'assistente':
        return {
          label: 'Assistente',
          bg: isDark ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : 'bg-blue-100 border-blue-300 text-blue-900',
          icon: ShieldCheck,
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner with Stats and Add Button */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Total de Administradores
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {totalCount}
          </div>
          <span className="text-[11px] text-emerald-500 font-medium">Equipe cadastrada</span>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Usuários Ativos
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {activeCount}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Com acesso liberado</span>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Super Administradores
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {superAdminCount}
          </div>
          <span className="text-[11px] text-purple-400 font-medium">Controle total & Gestão</span>
        </div>

        <div
          className={`p-4 rounded-2xl border flex flex-col justify-between ${
            isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Histórico & Auditoria
            </span>
            <button
              onClick={onViewAuditLog}
              className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20 transition-colors cursor-pointer"
              title="Abrir Histórico de Modificações"
            >
              <History className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={onViewAuditLog}
            className={`text-xs font-bold text-left flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'
            }`}
          >
            <span>Ver Registro de Ações →</span>
          </button>
          <span className="text-[11px] text-slate-400 font-medium">Rastreabilidade completa</span>
        </div>
      </div>

      {/* Control Bar: Search + Filters + New Admin Button */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
          isDark ? 'bg-[#071828] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por nome, e-mail ou cargo..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-emerald-500 ${
              isDark
                ? 'bg-[#001424] border-[#163650] text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as 'all' | AdminRole)}
            className={`px-3 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer ${
              isDark ? 'bg-[#001424] border-[#163650] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="all">Todos os Cargos</option>
            <option value="superadmin">Super Administradores</option>
            <option value="bibliotecario">Bibliotecários</option>
            <option value="assistente">Assistentes</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'ativo' | 'inativo')}
            className={`px-3 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer ${
              isDark ? 'bg-[#001424] border-[#163650] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="all">Todos os Status</option>
            <option value="ativo">Apenas Ativos</option>
            <option value="inativo">Apenas Inativos</option>
          </select>

          {/* New Admin Button */}
          <button
            onClick={onOpenCreateAdmin}
            className="px-4 py-2.5 rounded-xl bg-[#009b5a] hover:bg-[#00b368] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Cadastrar Administrador</span>
          </button>
        </div>
      </div>

      {/* Admin Users Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => {
          const badge = getRoleBadge(user.role);
          const BadgeIcon = badge.icon;
          const isCurrentUser = currentSessionAdmin?.id === user.id;

          return (
            <div
              key={user.id}
              className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                user.status === 'inativo' ? 'opacity-70 grayscale-[20%]' : ''
              } ${
                isDark
                  ? 'bg-[#071828] border-[#163650] hover:border-emerald-500/40 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-emerald-500/40 shadow-sm'
              }`}
            >
              <div>
                {/* Header card with Avatar and status badge */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-md bg-slate-900"
                    />
                    <span
                      title={user.status === 'ativo' ? 'Administrador Ativo' : 'Conta Desativada'}
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
                        isDark ? 'border-[#071828]' : 'border-white'
                      } ${user.status === 'ativo' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${badge.bg}`}>
                        <BadgeIcon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>
                      {isCurrentUser && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500 text-slate-950">
                          VOCÊ
                        </span>
                      )}
                    </div>
                    <h3 className={`text-base font-extrabold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {user.name}
                    </h3>
                    <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Details list */}
                <div className={`space-y-1.5 py-3 border-t border-b text-xs mb-4 ${
                  isDark ? 'border-[#163650]/60 text-slate-300' : 'border-slate-100 text-slate-600'
                }`}>
                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Último Acesso: <strong>{user.lastLogin || 'Primeiro acesso pendente'}</strong></span>
                  </div>
                  {user.notes && (
                    <p className="text-[11px] italic text-slate-400 line-clamp-2 pt-1">
                      "{user.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1">
                {/* Toggle Status Button */}
                <button
                  type="button"
                  onClick={() => onToggleStatus(user)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    user.status === 'ativo'
                      ? isDark
                        ? 'bg-[#00101c] text-emerald-400 border-[#163650] hover:bg-rose-500/10 hover:text-rose-400'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-rose-50 hover:text-rose-700'
                      : isDark
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-emerald-500/10 hover:text-emerald-400'
                      : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  {user.status === 'ativo' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Ativo</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Inativo</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditAdmin(user)}
                    title="Editar Administrador"
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      isDark
                        ? 'bg-[#00101c] hover:bg-[#163650] text-slate-300 hover:text-white border-[#163650]'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setAdminToDelete(user)}
                    title="Excluir Administrador"
                    disabled={isCurrentUser || adminUsers.length <= 1}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      isCurrentUser || adminUsers.length <= 1
                        ? 'opacity-40 cursor-not-allowed bg-transparent text-slate-500 border-slate-700'
                        : isDark
                        ? 'bg-[#00101c] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border-[#163650]'
                        : 'bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 border-slate-200'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div
          className={`p-12 text-center rounded-3xl border ${
            isDark ? 'bg-[#071828] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <Shield className="w-12 h-12 mx-auto mb-3 text-slate-400 opacity-50" />
          <h3 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Nenhum administrador encontrado
          </h3>
          <p className={`text-xs max-w-md mx-auto mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Nenhum usuário corresponde aos filtros de pesquisa selecionados.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setRoleFilter('all');
              setStatusFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
          >
            Limpar Filtros
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {adminToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl ${
              isDark ? 'bg-[#001424] border-[#163650]' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Excluir Administrador?
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Esta ação removerá as permissões de acesso deste usuário.
                </p>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border mb-5 flex items-center gap-3 ${
              isDark ? 'bg-[#071828] border-[#163650]' : 'bg-slate-50 border-slate-200'
            }`}>
              <img
                src={adminToDelete.avatar}
                alt={adminToDelete.name}
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div>
                <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {adminToDelete.name}
                </div>
                <div className="text-xs text-slate-400">{adminToDelete.email} • {adminToDelete.roleLabel}</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setAdminToDelete(null)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold ${
                  isDark ? 'bg-[#092032] text-slate-300' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteAdmin(adminToDelete.id);
                  setAdminToDelete(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/20 cursor-pointer"
              >
                Sim, Excluir Usuário
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
