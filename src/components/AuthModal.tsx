import React, { useState, useEffect } from 'react';
import { Shield, User, Lock, KeyRound, AlertCircle, ArrowRight, X, BookOpen, Check, Eye, EyeOff } from 'lucide-react';
import { Student, UserSession, AdminUser } from '../types';
import { useTheme } from '../context/ThemeContext';

import { ADMIN_AVATAR_OPTIONS } from '../data/adminAvatars';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  adminUsers?: AdminUser[];
  onLoginSuccess: (session: UserSession) => void;
  initialMode?: 'student' | 'admin';
  targetFeatureName?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  students,
  adminUsers = [],
  onLoginSuccess,
  initialMode = 'student',
  targetFeatureName,
}) => {
  const { isDark } = useTheme();
  const [tab, setTab] = useState<'student' | 'admin'>(initialMode);
  const [studentCodeInput, setStudentCodeInput] = useState('');
  const [selectedAdminId, setSelectedAdminId] = useState<string>(adminUsers[0]?.id || '');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Always reset password and inputs whenever modal is opened or closed or initial mode changes
  useEffect(() => {
    if (isOpen) {
      setAdminPasswordInput('');
      setShowPassword(false);
      setErrorMessage('');
      setStudentCodeInput('');
      setTab(initialMode);
      if (adminUsers.length > 0) {
        setSelectedAdminId((prev) => prev || adminUsers[0].id);
      }
    } else {
      setAdminPasswordInput('');
      setShowPassword(false);
      setErrorMessage('');
      setStudentCodeInput('');
    }
  }, [isOpen, initialMode, adminUsers]);

  const handleClose = () => {
    setAdminPasswordInput('');
    setStudentCodeInput('');
    setShowPassword(false);
    setErrorMessage('');
    onClose();
  };

  if (!isOpen) return null;

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const inputCode = studentCodeInput.trim().toUpperCase().replace(/^ALU-/, '');

    if (!inputCode) {
      setErrorMessage('Por favor, digite seu código de aluno para acessar.');
      return;
    }

    const found = students.find((s) => {
      const code = (s.studentCode || '').toUpperCase().replace(/^ALU-/, '');
      return code === inputCode;
    });

    if (found) {
      setAdminPasswordInput('');
      setShowPassword(false);
      setErrorMessage('');
      onLoginSuccess({ role: 'student', student: found });
      handleClose();
    } else {
      setErrorMessage(`Código "${inputCode}" não encontrado. Verifique seu código com a biblioteca ou secretaria.`);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Localiza o administrador selecionado exatamente na lista atualizada
    const targetAdmin = adminUsers.find((a) => a.id === selectedAdminId) || adminUsers[0];

    if (!targetAdmin) {
      setErrorMessage('Nenhum administrador selecionado.');
      return;
    }

    if (targetAdmin.status === 'inativo') {
      setErrorMessage('Este usuário administrador está desativado no sistema.');
      return;
    }

    // Validação estrita: apenas o PIN atual cadastrado é válido.
    // Senhas antigas ou senhas padrão mestras são completamente invalidadas.
    const enteredPass = adminPasswordInput.trim();
    const currentPass = (targetAdmin.pin || '').trim();

    if (enteredPass && currentPass && enteredPass === currentPass) {
      // Clear password immediately on successful login
      setAdminPasswordInput('');
      setShowPassword(false);
      setErrorMessage('');

      onLoginSuccess({
        role: 'admin',
        admin: targetAdmin,
      });
      handleClose();
    } else {
      setErrorMessage('Senha ou PIN de Administrador incorreto. Se a senha foi alterada recentemente, utilize a nova senha cadastrada.');
    }
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md border rounded-2xl shadow-2xl overflow-hidden ${
          isDark ? 'bg-[#001424] border-[#163e5e]' : 'bg-white border-slate-200'
        }`}
      >
        {/* Header decoration */}
        <div className={`relative p-6 pb-5 border-b ${
          isDark
            ? 'bg-gradient-to-r from-[#092032] via-[#0d2e46] to-[#092032] border-[#163e5e]'
            : 'bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 border-slate-200'
        }`}>
          <button
            onClick={handleClose}
            className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${
              tab === 'admin'
                ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
            }`}>
              {tab === 'admin' ? <Shield className="w-6 h-6" /> : <User className="w-6 h-6" />}
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {tab === 'admin' ? 'Acesso Administrativo' : 'Identificação do Aluno'}
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {targetFeatureName ? `Necessário para acessar: ${targetFeatureName}` : 'Entre para continuar com segurança'}
              </p>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className={`grid grid-cols-2 gap-1.5 mt-5 p-1 rounded-xl border ${
            isDark ? 'bg-[#00101c] border-[#163e5e]' : 'bg-slate-200/80 border-slate-300'
          }`}>
            <button
              type="button"
              onClick={() => {
                setTab('student');
                setAdminPasswordInput('');
                setShowPassword(false);
                setErrorMessage('');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                tab === 'student'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Sou Aluno</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('admin');
                setAdminPasswordInput('');
                setShowPassword(false);
                setErrorMessage('');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                tab === 'admin'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Administrador (ADM)</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {tab === 'student' ? (
            <form onSubmit={handleStudentLogin} autoComplete="off" className="space-y-4">
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Código do Aluno
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={studentCodeInput}
                    onChange={(e) => setStudentCodeInput(e.target.value)}
                    placeholder="Digite seu código (ex: GUS-0001)"
                    autoFocus
                    autoComplete="off"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-mono uppercase focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 ${
                      isDark
                        ? 'bg-[#071828] border-[#163e5e] text-white placeholder-slate-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
                <p className={`mt-1.5 text-[11px] flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <BookOpen className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span>Use o código fornecido no seu cadastro ou carteirinha escolar.</span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <span>Acessar Meu Histórico e Empréstimos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminLogin} autoComplete="off" className="space-y-4">
              {/* Select Admin Profile with Avatars */}
              {adminUsers.length > 0 && (
                <div>
                  <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Selecione seu Perfil de Administrador:
                  </label>
                  <div className="grid grid-cols-1 gap-2 max-h-44 overflow-y-auto pr-1">
                    {adminUsers.map((adm) => {
                      const isSelected = selectedAdminId === adm.id || (!selectedAdminId && adm.id === adminUsers[0].id);
                      return (
                        <button
                          key={adm.id}
                          type="button"
                          onClick={() => {
                            setSelectedAdminId(adm.id);
                            setAdminPasswordInput('');
                            setShowPassword(false);
                            setErrorMessage('');
                          }}
                          className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-500 shadow-sm'
                              : isDark
                              ? 'bg-[#071828] border-[#163650] hover:border-slate-500'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={adm.avatar}
                              alt={adm.name}
                              className="w-9 h-9 rounded-xl object-cover border border-amber-500/40 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {adm.name}
                              </div>
                              <div className="text-[11px] text-amber-500 font-medium truncate">
                                {adm.roleLabel}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="p-1 rounded-full bg-amber-500 text-slate-950 shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Senha / PIN de Acesso
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="Digite a senha ou PIN de acesso"
                    autoFocus
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    name="admin_pass_pin"
                    className={`w-full pl-10 pr-12 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 ${
                      isDark
                        ? 'bg-[#071828] border-[#163650] text-white placeholder-slate-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                    aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                    className={`absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs cursor-pointer ${
                      isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
                <p className={`mt-1.5 text-[11px] flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Acesso exclusivo. Todas as alterações serão registradas no histórico.</span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95"
              >
                <span>Entrar no Painel ADM</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
