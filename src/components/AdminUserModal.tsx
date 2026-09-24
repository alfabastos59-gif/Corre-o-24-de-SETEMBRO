import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  User,
  Mail,
  Phone,
  Lock,
  FileText,
  Check,
  Sparkles,
  Camera,
  Layers,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { AdminUser, AdminRole } from '../types';
import { ADMIN_AVATAR_OPTIONS } from '../data/adminAvatars';
import { useTheme } from '../context/ThemeContext';

interface AdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (adminUser: AdminUser) => void;
  adminToEdit?: AdminUser | null;
}

export const AdminUserModal: React.FC<AdminUserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  adminToEdit,
}) => {
  const { isDark } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('bibliotecario');
  const [pin, setPin] = useState('1234');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'ativo' | 'inativo'>('ativo');
  const [avatar, setAvatar] = useState(ADMIN_AVATAR_OPTIONS[0].url);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [selectedAvatarCategory, setSelectedAvatarCategory] = useState<string>('todos');
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (adminToEdit) {
      setName(adminToEdit.name);
      setEmail(adminToEdit.email);
      setRole(adminToEdit.role);
      setPin(adminToEdit.pin || '1234');
      setPhone(adminToEdit.phone || '');
      setNotes(adminToEdit.notes || '');
      setStatus(adminToEdit.status);
      setAvatar(adminToEdit.avatar);
      setCustomAvatarUrl(adminToEdit.avatar.startsWith('http') && !ADMIN_AVATAR_OPTIONS.some(a => a.url === adminToEdit.avatar) ? adminToEdit.avatar : '');
    } else {
      setName('');
      setEmail('');
      setRole('bibliotecario');
      setPin('1234');
      setPhone('');
      setNotes('');
      setStatus('ativo');
      setAvatar(ADMIN_AVATAR_OPTIONS[0].url);
      setCustomAvatarUrl('');
    }
    setErrorMessage('');
  }, [adminToEdit, isOpen]);

  if (!isOpen) return null;

  const roleLabelMap: Record<AdminRole, string> = {
    superadmin: 'Super Administrador',
    bibliotecario: 'Bibliotecário',
    assistente: 'Assistente de Atendimento',
  };

  const filteredAvatars = selectedAvatarCategory === 'todos'
    ? ADMIN_AVATAR_OPTIONS
    : ADMIN_AVATAR_OPTIONS.filter((a) => a.category === selectedAvatarCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Por favor, informe o nome completo do administrador.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor, informe um e-mail institucional válido.');
      return;
    }
    if (!pin.trim() || pin.trim().length < 4) {
      setErrorMessage('A senha / PIN de acesso deve conter pelo menos 4 caracteres.');
      return;
    }

    const finalAvatar = customAvatarUrl.trim() ? customAvatarUrl.trim() : avatar;

    const updatedOrNewUser: AdminUser = {
      id: adminToEdit ? adminToEdit.id : `adm_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      roleLabel: roleLabelMap[role],
      avatar: finalAvatar,
      pin: pin.trim() || '1234',
      phone: phone.trim() || undefined,
      notes: notes.trim() || undefined,
      status,
      createdAt: adminToEdit ? adminToEdit.createdAt : new Date().toLocaleDateString('pt-BR'),
      lastLogin: adminToEdit ? adminToEdit.lastLogin : undefined,
    };

    onSave(updatedOrNewUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] flex flex-col border rounded-3xl shadow-2xl overflow-hidden ${
          isDark ? 'bg-[#001424] border-[#163650]' : 'bg-white border-slate-200'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-6 py-5 border-b flex items-center justify-between shrink-0 ${
            isDark
              ? 'bg-gradient-to-r from-[#092032] via-[#0d2e46] to-[#092032] border-[#163650]'
              : 'bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {adminToEdit ? 'Editar Usuário Administrador' : 'Cadastrar Novo Administrador'}
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Defina privilégios de acesso e identifique o membro da equipe
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-300 text-xs flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section: Avatar Selection */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border ${
              isDark ? 'bg-[#071828] border-[#163650]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={customAvatarUrl.trim() || avatar}
                    alt="Avatar Selecionado"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-md bg-slate-900"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = ADMIN_AVATAR_OPTIONS[0].url;
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-slate-950 rounded-full shadow">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Avatar do Administrador
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Escolha um personagem ilustrado ou informe um link de foto
                  </p>
                </div>
              </div>

              {/* Avatar Categories */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'todos', label: 'Todos (25)' },
                  { id: 'educadores', label: 'Educadores' },
                  { id: 'bibliotecarios', label: 'Bibliotecários' },
                  { id: 'atendimento', label: 'Atendimento' },
                  { id: 'criativos', label: 'Criativos' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedAvatarCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      selectedAvatarCategory === cat.id
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : isDark
                        ? 'bg-[#092032] text-slate-400 hover:text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Avatar Info */}
            {(() => {
              const activeOpt = ADMIN_AVATAR_OPTIONS.find((a) => a.url === avatar);
              if (!activeOpt || customAvatarUrl.trim()) return null;
              return (
                <div className={`mb-2.5 px-3 py-1.5 rounded-xl text-xs flex items-center justify-between border ${
                  isDark ? 'bg-[#092032]/60 border-[#163650] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <span className="font-semibold text-emerald-500">{activeOpt.name}</span>
                  <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{activeOpt.roleHint}</span>
                </div>
              );
            })()}

            {/* Avatar Gallery Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-9 gap-2 max-h-40 overflow-y-auto p-1 scrollbar-thin">
              {filteredAvatars.map((opt) => {
                const isSelected = avatar === opt.url && !customAvatarUrl.trim();
                return (
                  <button
                    key={opt.id}
                    type="button"
                    title={`${opt.name} - ${opt.roleHint}`}
                    onClick={() => {
                      setAvatar(opt.url);
                      setCustomAvatarUrl('');
                    }}
                    className={`relative p-1 rounded-2xl transition-all aspect-square flex items-center justify-center cursor-pointer border group hover:scale-105 ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500 shadow-md'
                        : isDark
                        ? 'bg-[#092032] border-[#163650] hover:border-slate-400'
                        : 'bg-white border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={opt.url}
                      alt={opt.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 p-0.5 rounded-full shadow">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom URL Option */}
            <div className="mt-3 pt-3 border-t flex items-center gap-2">
              <Camera className={`w-4 h-4 shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="url"
                value={customAvatarUrl}
                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                placeholder="Ou cole a URL de uma foto personalizada (ex: https://...)"
                className={`w-full px-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:border-emerald-500 ${
                  isDark
                    ? 'bg-[#00101c] border-[#163650] text-white placeholder-slate-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nome Completo */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Nome Completo *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Profª Ana Paula Silva"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-emerald-500 ${
                    isDark
                      ? 'bg-[#071828] border-[#163650] text-white placeholder-slate-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* E-mail Institucional */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                E-mail Institucional (Login) *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: ana.silva@escola.edu.br"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-emerald-500 ${
                    isDark
                      ? 'bg-[#071828] border-[#163650] text-white placeholder-slate-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* Nível de Privilégio (Role) */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Nível de Privilégio / Cargo *
              </label>
              <div className="relative">
                <Shield className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminRole)}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:border-emerald-500 cursor-pointer ${
                    isDark
                      ? 'bg-[#071828] border-[#163650] text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="superadmin">Super Administrador (Acesso Total + Gestão ADM)</option>
                  <option value="bibliotecario">Bibliotecário (Empréstimos, Acervo e Alunos)</option>
                  <option value="assistente">Assistente (Atendimento e Empréstimos)</option>
                </select>
              </div>
            </div>

            {/* Senha / PIN */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Senha / PIN de Acesso *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type={showPin ? 'text' : 'password'}
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Digite a senha ou PIN de acesso"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:border-purple-500 ${
                    isDark
                      ? 'bg-[#071828] border-[#163650] text-white placeholder-slate-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  title={showPin ? 'Ocultar senha' : 'Ver senha'}
                  aria-label={showPin ? 'Ocultar senha' : 'Ver senha'}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer`}
                >
                  {showPin ? <EyeOff className="w-4 h-4 text-purple-400" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className={`mt-1.5 text-[11px] flex items-center gap-1.5 ${isDark ? 'text-purple-300/80' : 'text-slate-500'}`}>
                <Shield className="w-3 h-3 text-purple-400 shrink-0" />
                <span>
                  {adminToEdit
                    ? 'Ao salvar, a senha anterior será imediatamente invalidada para entrar no painel ADM.'
                    : 'Esta senha/PIN será exigida para acessar as funções de administração.'}
                </span>
              </p>
            </div>

            {/* Telefone */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Telefone / WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: (75) 99876-1234"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-emerald-500 ${
                    isDark
                      ? 'bg-[#071828] border-[#163650] text-white placeholder-slate-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* Status do Usuário */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Status da Conta
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('ativo')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    status === 'ativo'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-sm'
                      : isDark
                      ? 'bg-[#071828] border-[#163650] text-slate-400'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Ativo / Liberado</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('inativo')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    status === 'inativo'
                      ? 'bg-rose-500/15 border-rose-500 text-rose-400 shadow-sm'
                      : isDark
                      ? 'bg-[#071828] border-[#163650] text-slate-400'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <X className="w-3.5 h-3.5 text-rose-500" />
                  <span>Inativo / Bloqueado</span>
                </button>
              </div>
            </div>
          </div>

          {/* Observações / Cargo Escolar */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Observações / Atribuições na Biblioteca
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Responsável pelo turno matutino, organização de eventos de leitura..."
              className={`w-full p-3 rounded-xl border text-sm focus:outline-none focus:border-emerald-500 resize-none ${
                isDark
                  ? 'bg-[#071828] border-[#163650] text-white placeholder-slate-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Privilégios explicativos */}
          <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
            isDark ? 'bg-[#00101c] border-[#163650] text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            <div className="font-bold flex items-center gap-2 text-amber-500">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Resumo dos Privilégios deste Perfil:</span>
            </div>
            {role === 'superadmin' && (
              <p className="leading-relaxed">
                • <strong>Acesso Total:</strong> Gerenciamento de outros ADMs, Histórico e Auditoria de Ações, Backup/Restauração, Livros, Alunos, Empréstimos e Relatórios.
              </p>
            )}
            {role === 'bibliotecario' && (
              <p className="leading-relaxed">
                • <strong>Gestão de Biblioteca:</strong> Cadastro e edição de livros, cadastro de alunos, registro de empréstimos e devoluções, moderação de sugestões e relatórios.
              </p>
            )}
            {role === 'assistente' && (
              <p className="leading-relaxed">
                • <strong>Operacional:</strong> Realização de empréstimos, confirmação de devoluções, renovações e consulta ao acervo.
              </p>
            )}
            <p className="text-[11px] text-slate-400 mt-1">
              * Todas as operações realizadas por este usuário serão carimbadas no <strong>Histórico de Auditoria</strong> da biblioteca.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                isDark ? 'bg-[#092032] hover:bg-[#163650] text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{adminToEdit ? 'Salvar Alterações' : 'Cadastrar Administrador'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
