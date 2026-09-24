import React, { useState, useEffect } from 'react';
import { X, UserPlus, Check, Sparkles, Image as ImageIcon, Shuffle, Phone, GraduationCap, Hash, User } from 'lucide-react';
import { Student } from '../types';
import { AVATAR_BANK, AVATAR_CATEGORIES, getRandomAvatar } from '../data/avatarBank';
import { useTheme } from '../context/ThemeContext';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveStudent: (student: Student) => void;
  studentToEdit?: Student | null;
  existingCount?: number;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSaveStudent,
  studentToEdit,
  existingCount = 0,
}) => {
  const { isDark } = useTheme();
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [registration, setRegistration] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_BANK[0].url);
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showCustomUrlInput, setShowCustomUrlInput] = useState(false);
  const [error, setError] = useState('');

  // Populate when editing or resetting for new student
  useEffect(() => {
    if (studentToEdit) {
      setName(studentToEdit.name || '');
      setStudentClass(studentToEdit.class || '');
      setRegistration(studentToEdit.registration || '');
      setPhone(studentToEdit.phone || '');
      setSelectedAvatar(studentToEdit.avatar || AVATAR_BANK[0].url);
      setCustomAvatarUrl('');
      setShowCustomUrlInput(false);
    } else {
      setName('');
      setStudentClass('');
      setRegistration('');
      setPhone('');
      setSelectedAvatar(getRandomAvatar());
      setCustomAvatarUrl('');
      setShowCustomUrlInput(false);
    }
    setError('');
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  // Filter avatars based on selected category
  const filteredAvatars = activeCategory === 'todos'
    ? AVATAR_BANK
    : AVATAR_BANK.filter((av) => av.category === activeCategory);

  const formatPhone = (val: string) => {
    const numbers = val.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleRandomAvatar = () => {
    const randomUrl = getRandomAvatar();
    setSelectedAvatar(randomUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe o nome do aluno.');
      return;
    }
    if (!studentClass.trim()) {
      setError('Por favor, informe a turma do aluno.');
      return;
    }

    const cleanName = name
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z]/g, '');

    const initials = (cleanName.substring(0, 3) || 'EST').toUpperCase();
    const paddedNum = String((existingCount || 0) + 1).padStart(4, '0');
    const generatedCode = studentToEdit?.studentCode
      ? studentToEdit.studentCode.replace(/^ALU-/, '')
      : `${initials}-${paddedNum}`;

    const studentData: Student = {
      id: studentToEdit?.id || `stu_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: studentToEdit?.email || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@escola.com`,
      class: studentClass.trim(),
      phone: phone.trim() || undefined,
      registration: registration.trim() || undefined,
      studentCode: generatedCode,
      avatar: selectedAvatar,
      activeLoansCount: studentToEdit?.activeLoansCount || 0,
      totalLoansCount: studentToEdit?.totalLoansCount || 0,
      joinedDate: studentToEdit?.joinedDate || new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
    };

    onSaveStudent(studentData);
    onClose();
  };

  return (
    <div
      id="modal-student-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="modal-student-container"
        className={`relative w-full max-w-lg border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          isDark ? 'bg-[#001f35] border-[#163e5e] text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-[#163e5e] bg-[#001728]' : 'border-slate-200 bg-slate-50'
        }`}>
          <h2 className={`text-lg font-bold font-serif tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {studentToEdit ? 'Editar aluno' : 'Cadastrar aluno'}
          </h2>
          <button
            id="btn-close-student-modal"
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isDark ? 'bg-[#0d2a40] hover:bg-[#163e5e] text-slate-300 hover:text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900'
            }`}
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-600 dark:text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Nome * */}
          <div className="space-y-1.5">
            <label className={`block text-xs font-semibold flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              <User className="w-3.5 h-3.5 text-emerald-500" />
              <span>Nome *</span>
            </label>
            <input
              id="input-student-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo do aluno"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-emerald-500 transition-colors ${
                isDark ? 'bg-[#001424] border-[#163e5e] text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Turma * */}
          <div className="space-y-1.5">
            <label className={`block text-xs font-semibold flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              <GraduationCap className="w-3.5 h-3.5 text-cyan-500" />
              <span>Turma *</span>
            </label>
            <input
              id="input-student-class"
              type="text"
              required
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              placeholder="Ex: 9º A, 1º B, 3º INT"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-emerald-500 transition-colors ${
                isDark ? 'bg-[#001424] border-[#163e5e] text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Grid: Matrícula & Telefone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={`block text-xs font-semibold flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                <Hash className="w-3.5 h-3.5 text-amber-500" />
                <span>Matrícula</span>
              </label>
              <input
                id="input-student-registration"
                type="text"
                value={registration}
                onChange={(e) => setRegistration(e.target.value)}
                placeholder="Ex: 2026-0042"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-emerald-500 transition-colors ${
                  isDark ? 'bg-[#001424] border-[#163e5e] text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`block text-xs font-semibold flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>Telefone</span>
              </label>
              <input
                id="input-student-phone"
                type="text"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(00) 00000-0000"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-emerald-500 transition-colors ${
                  isDark ? 'bg-[#001424] border-[#163e5e] text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Avatar Section: Banco de Imagens de Avatares */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className={`block text-xs font-semibold flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Avatar do Perfil</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-random-avatar"
                  onClick={handleRandomAvatar}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                    isDark ? 'bg-[#0d2a40] hover:bg-[#163e5e] text-emerald-400 border-[#163e5e]' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                  }`}
                  title="Sortear Avatar Aleatório"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>Sortear</span>
                </button>

                <button
                  type="button"
                  id="btn-toggle-custom-url"
                  onClick={() => setShowCustomUrlInput(!showCustomUrlInput)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                    isDark ? 'bg-[#0d2a40] hover:bg-[#163e5e] text-slate-300 hover:text-white border-[#163e5e]' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>URL</span>
                </button>
              </div>
            </div>

            {/* Custom URL Input if toggled */}
            {showCustomUrlInput && (
              <div className={`p-3 rounded-xl border space-y-2 ${
                isDark ? 'bg-[#001424] border-[#163e5e]' : 'bg-slate-50 border-slate-200'
              }`}>
                <label className={`text-[11px] block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Link de Imagem Personalizada (URL):</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    placeholder="https://exemplo.com/avatar.jpg"
                    className={`flex-1 px-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:border-emerald-500 ${
                      isDark ? 'bg-[#092032] border-[#163e5e] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customAvatarUrl.trim()) {
                        setSelectedAvatar(customAvatarUrl.trim());
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Usar
                  </button>
                </div>
              </div>
            )}

            {/* Selected Avatar Preview Header */}
            <div className={`flex items-center gap-3.5 p-3.5 rounded-xl border ${
              isDark ? 'bg-[#001424]/70 border-[#163e5e]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="relative shrink-0">
                <img
                  src={selectedAvatar}
                  alt="Avatar Selecionado"
                  className={`w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-lg avatar-hover-zoom cursor-pointer ${
                    isDark ? 'bg-[#092032]' : 'bg-white'
                  }`}
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shadow">
                  ✓
                </div>
              </div>
              <div className="text-xs">
                <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Avatar Selecionado</span>
                <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Passe o mouse sobre os avatares abaixo para vê-los ampliados e escolha o perfil do aluno
                </span>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
              {AVATAR_CATEGORIES.map((cat) => {
                const count = cat.id === 'todos' 
                  ? AVATAR_BANK.length 
                  : AVATAR_BANK.filter((a) => a.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeCategory === cat.id
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : isDark
                        ? 'bg-[#001424] text-slate-400 hover:text-white border border-[#163e5e]'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      activeCategory === cat.id
                        ? 'bg-slate-900/30 text-slate-950 font-bold'
                        : isDark
                        ? 'bg-[#0d2a40] text-slate-400'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Avatar Selection Grid with Smooth Hover Zoom */}
            <div className={`grid grid-cols-6 sm:grid-cols-8 gap-3 p-3 rounded-xl border max-h-60 overflow-y-auto ${
              isDark ? 'bg-[#001424] border-[#163e5e]' : 'bg-slate-50 border-slate-200'
            }`}>
              {filteredAvatars.map((av) => {
                const isSelected = selectedAvatar === av.url;
                return (
                  <button
                    key={av.id}
                    type="button"
                    id={`avatar-option-${av.id}`}
                    onClick={() => setSelectedAvatar(av.url)}
                    title={av.name}
                    className={`relative rounded-full p-0.5 cursor-pointer focus:outline-none transition-all ${
                      isSelected
                        ? 'ring-2 ring-emerald-500 scale-110 shadow-lg shadow-emerald-500/30 z-20'
                        : 'opacity-90 hover:opacity-100 z-0 hover:z-30'
                    }`}
                  >
                    <img
                      src={av.url}
                      alt={av.name}
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border transition-transform duration-300 ease-out hover:scale-125 hover:shadow-xl hover:ring-2 hover:ring-emerald-400 ${
                        isDark ? 'bg-[#092032] border-[#163e5e]/60' : 'bg-white border-slate-300'
                      }`}
                      loading="lazy"
                    />
                    {isSelected && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold shadow ring-1 ring-white z-30">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              id="btn-submit-student"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all cursor-pointer"
            >
              {studentToEdit ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Cadastrar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

