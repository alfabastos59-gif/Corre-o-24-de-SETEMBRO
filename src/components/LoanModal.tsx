import React, { useState, useEffect, useMemo } from 'react';
import { X, BookmarkCheck, Calendar, User, Check, ShieldCheck, Search, CheckCircle2, RotateCcw } from 'lucide-react';
import { Book, Student, Loan, UserSession } from '../types';
import { useTheme } from '../context/ThemeContext';

interface LoanModalProps {
  book: Book | null;
  students: Student[];
  isOpen: boolean;
  onClose: () => void;
  onConfirmLoan: (loanData: Omit<Loan, 'id'>) => void;
  session?: UserSession;
}

export const LoanModal: React.FC<LoanModalProps> = ({
  book,
  students,
  isOpen,
  onClose,
  onConfirmLoan,
  session,
}) => {
  const { isDark } = useTheme();
  const isStudent = session?.role === 'student' && !!session.student;

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(
    isStudent && session?.student ? session.student : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [loanDays, setLoanDays] = useState(7);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setIsSuccess(false);
      if (!isStudent) {
        setSelectedStudent(null);
      }
    } else {
      if (isStudent && session?.student) {
        setSelectedStudent(session.student);
      } else {
        setSelectedStudent(null);
        setSearchQuery('');
      }
    }
  }, [isOpen, isStudent, session]);

  // Normalize string for diacritic-insensitive search
  const normalizeText = (text: string) =>
    text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  // Filter students based on query (name or student code / registration)
  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return [];

    const normQ = normalizeText(q);
    const cleanQ = normQ.replace(/^alu-/, '');

    return students.filter((s) => {
      const normName = normalizeText(s.name);
      const rawCode = (s.studentCode || '').toLowerCase();
      const cleanCode = rawCode.replace(/^alu-/, '');
      const reg = (s.registration || '').toLowerCase();
      const studentClass = normalizeText(s.class || '');

      return (
        normName.includes(normQ) ||
        rawCode.includes(normQ) ||
        cleanCode.includes(cleanQ) ||
        reg.includes(normQ) ||
        studentClass.includes(normQ)
      );
    });
  }, [students, searchQuery]);

  if (!isOpen || !book) return null;

  const currentStudent = isStudent ? session?.student : selectedStudent;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    const today = new Date();
    const loanDateFormatted = today.toLocaleDateString('pt-BR');

    const returnDateObj = new Date();
    returnDateObj.setDate(today.getDate() + loanDays);
    const returnDateFormatted = returnDateObj.toLocaleDateString('pt-BR');

    const studentCodeClean = (currentStudent.studentCode || '').replace(/^ALU-/, '');

    onConfirmLoan({
      studentName: currentStudent.name,
      studentEmail: currentStudent.email,
      studentAvatar: currentStudent.avatar,
      studentClass: currentStudent.class,
      studentCode: studentCodeClean,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookCover: book.cover,
      loanDate: loanDateFormatted,
      returnDate: returnDateFormatted,
      status: 'em_andamento',
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className={`relative z-10 w-full max-w-md border rounded-3xl p-6 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${
        isDark ? 'bg-[#092032] border-[#163650] text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full border cursor-pointer transition-colors ${
            isDark ? 'bg-[#031320] text-slate-400 hover:text-white border-[#163650]' : 'bg-slate-100 text-slate-500 hover:text-slate-900 border-slate-200'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Empréstimo Solicitado!
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              O livro <strong>{book.title}</strong> foi reservado para{' '}
              <strong className="text-emerald-500">{currentStudent?.name}</strong> com sucesso.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className={`flex items-center gap-3 border-b pb-4 ${isDark ? 'border-[#163650]' : 'border-slate-200'}`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-lg font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Solicitar Empréstimo
                </h3>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {book.title} ({book.author})
                </span>
              </div>
            </div>

            {/* Student Selector / Active Student Card */}
            {isStudent && session?.student ? (
              <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                isDark ? 'bg-[#001424] border-emerald-500/30' : 'bg-emerald-50/50 border-emerald-300'
              }`}>
                <img
                  src={session.student.avatar}
                  alt={session.student.name}
                  className={`w-11 h-11 rounded-full object-cover border border-emerald-500 ${
                    isDark ? 'bg-[#071828]' : 'bg-white'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                      Identificado como Aluno
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 px-1.5 py-0.5 rounded font-semibold">
                      Cód: {(session.student.studentCode || '').replace(/^ALU-/, '')}
                    </span>
                  </div>
                  <h4 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{session.student.name}</h4>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{session.student.class}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-semibold flex items-center gap-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <User className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Aluno do Empréstimo:</span>
                  </label>
                  <span className="text-[10px] text-amber-500 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Modo Gestão
                  </span>
                </div>

                {/* If student is already selected, display confirmation card with button to change */}
                {selectedStudent ? (
                  <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                    isDark ? 'bg-[#001424] border-emerald-500/40' : 'bg-emerald-50/50 border-emerald-300'
                  }`}>
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <img
                        src={selectedStudent.avatar}
                        alt={selectedStudent.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            Aluno Selecionado
                          </span>
                          {selectedStudent.studentCode && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold">
                              Cód: {selectedStudent.studentCode.replace(/^ALU-/, '')}
                            </span>
                          )}
                        </div>
                        <h4 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {selectedStudent.name}
                        </h4>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {selectedStudent.class}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStudent(null);
                        setSearchQuery('');
                      }}
                      className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                        isDark
                          ? 'bg-[#031320] border-[#163650] text-slate-300 hover:text-white hover:border-emerald-500 hover:bg-[#062035]'
                          : 'bg-white border-slate-300 text-slate-700 hover:text-slate-900 hover:border-emerald-500 hover:bg-slate-50'
                      }`}
                      title="Pesquisar outro aluno"
                    >
                      <RotateCcw className="w-3 h-3 text-emerald-500" />
                      <span>Trocar</span>
                    </button>
                  </div>
                ) : (
                  /* Search input & live matches */
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Pesquisar por nome ou código..."
                        autoFocus
                        className={`w-full text-xs sm:text-sm pl-9 pr-8 py-2.5 rounded-xl border focus:outline-none focus:border-emerald-500 transition-colors ${
                          isDark
                            ? 'bg-[#031320] text-white border-[#163650] placeholder-slate-500'
                            : 'bg-slate-50 text-slate-900 border-slate-300 placeholder-slate-400'
                        }`}
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Results or Helper guide */}
                    {!searchQuery.trim() ? (
                      <div className={`p-3 rounded-xl border border-dashed text-center text-xs ${
                        isDark ? 'border-[#163650] text-slate-400 bg-[#031320]/40' : 'border-slate-200 text-slate-500 bg-slate-50/60'
                      }`}>
                        <p className="font-medium text-slate-300 dark:text-slate-300">
                          Digite o nome ou código do aluno para pesquisar
                        </p>
                      </div>
                    ) : filteredStudents.length === 0 ? (
                      <div className={`p-3 rounded-xl border text-center text-xs ${
                        isDark ? 'border-[#163650] bg-[#031320] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
                      }`}>
                        <p className="font-semibold text-amber-500">Nenhum aluno encontrado</p>
                        <p className="text-[11px] mt-0.5">
                          Não encontramos nenhum aluno para "{searchQuery}".
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                        <div className="text-[10px] font-semibold text-slate-400 px-1 flex items-center justify-between">
                          <span>Resultados ({filteredStudents.length}):</span>
                          <span>Clique para selecionar</span>
                        </div>
                        {filteredStudents.map((s) => {
                          const code = (s.studentCode || '').replace(/^ALU-/, '');
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => {
                                setSelectedStudent(s);
                                setSearchQuery('');
                              }}
                              className={`w-full p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                                isDark
                                  ? 'bg-[#031320] border-[#163650] hover:border-emerald-500 hover:bg-[#07243a]'
                                  : 'bg-white border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40'
                              }`}
                            >
                              <img
                                src={s.avatar}
                                alt={s.name}
                                className="w-8 h-8 rounded-full object-cover border border-emerald-500/40 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {s.name}
                                  </span>
                                  {code && (
                                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                                      {code}
                                    </span>
                                  )}
                                </div>
                                <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                  {s.class}
                                </span>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-500 px-2 py-1 rounded-lg bg-emerald-500/10 shrink-0">
                                Selecionar
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Period Selection */}
            <div>
              <label className={`text-xs font-semibold block mb-1.5 flex items-center gap-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                <span>Prazo de Devolução:</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[7, 14, 21].map((days) => (
                  <button
                    type="button"
                    key={days}
                    onClick={() => setLoanDays(days)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      loanDays === days
                        ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-500 shadow-sm'
                        : isDark
                        ? 'bg-[#031320] text-slate-400 border-[#163650] hover:text-white'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {days} dias
                  </button>
                ))}
              </div>
            </div>

            <div className={`p-3 rounded-xl border text-[11px] space-y-1 ${
              isDark ? 'bg-[#031320] border-[#163650] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <div className="flex justify-between">
                <span>Data do Empréstimo:</span>
                <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Hoje ({new Date().toLocaleDateString('pt-BR')})</span>
              </div>
              <div className="flex justify-between">
                <span>Exemplares Restantes:</span>
                <span className="text-emerald-500 font-bold">{book.availableCopies}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                  isDark ? 'bg-[#031320] text-slate-300 border-[#163650] hover:text-white' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!currentStudent}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${
                  currentStudent
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20 cursor-pointer'
                    : 'bg-slate-700/50 text-slate-400 border border-slate-700/50 cursor-not-allowed opacity-60'
                }`}
              >
                {currentStudent ? 'Confirmar Empréstimo' : 'Selecione um Aluno'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};


