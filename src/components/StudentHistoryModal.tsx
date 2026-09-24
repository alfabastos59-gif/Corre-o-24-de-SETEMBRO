import React from 'react';
import { X, Clock, Calendar } from 'lucide-react';
import { Student, Loan } from '../types';
import { useTheme } from '../context/ThemeContext';

interface StudentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  loans: Loan[];
}

export const StudentHistoryModal: React.FC<StudentHistoryModalProps> = ({
  isOpen,
  onClose,
  student,
  loans,
}) => {
  const { isDark } = useTheme();

  if (!isOpen || !student) return null;

  const studentLoans = loans.filter(
    (l) =>
      l.studentName.toLowerCase().trim() === student.name.toLowerCase().trim() ||
      (student.studentCode && l.studentCode === student.studentCode) ||
      (student.email && l.studentEmail.toLowerCase() === student.email.toLowerCase())
  );

  const activeLoans = studentLoans.filter((l) => l.status !== 'devolvido');
  const returnedLoans = studentLoans.filter((l) => l.status === 'devolvido');

  return (
    <div
      id="modal-student-history-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="modal-student-history-container"
        className={`relative w-full max-w-2xl border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          isDark ? 'bg-[#001f35] border-[#163e5e] text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-[#163e5e] bg-[#001728]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-3">
            <img
              src={student.avatar}
              alt={student.name}
              className={`w-11 h-11 rounded-full object-cover border student-avatar-zoom transition-transform duration-300 ease-out hover:scale-150 cursor-pointer hover:shadow-2xl hover:z-40 relative ${
                isDark ? 'border-[#163e5e] bg-[#092032]' : 'border-slate-200 bg-slate-100'
              }`}
            />
            <div>
              <h2 className={`text-base font-bold font-serif ${isDark ? 'text-white' : 'text-slate-900'}`}>{student.name}</h2>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-cyan-500 font-medium">{student.class}</span>
                <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>•</span>
                <span className="font-mono text-emerald-500 font-semibold">
                  {student.studentCode
                    ? student.studentCode.replace(/^ALU-/, '')
                    : (student.name.substring(0, 3).toUpperCase() || 'EST') + '-0001'}
                </span>
                {student.registration && (
                  <>
                    <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>•</span>
                    <span className="text-amber-500 font-medium">Matrícula: {student.registration}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            id="btn-close-student-history-modal"
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isDark ? 'bg-[#0d2a40] hover:bg-[#163e5e] text-slate-300 hover:text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900'
            }`}
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className={`p-3 rounded-xl border text-center ${isDark ? 'bg-[#001424] border-[#163e5e]' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-[11px] block uppercase font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Empréstimos Ativos</span>
              <span className="text-xl font-bold text-amber-500">{activeLoans.length}</span>
            </div>
            <div className={`p-3 rounded-xl border text-center ${isDark ? 'bg-[#001424] border-[#163e5e]' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-[11px] block uppercase font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Livros Devolvidos</span>
              <span className="text-xl font-bold text-emerald-500">{returnedLoans.length}</span>
            </div>
            <div className={`p-3 rounded-xl border text-center ${isDark ? 'bg-[#001424] border-[#163e5e]' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-[11px] block uppercase font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Histórico</span>
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{studentLoans.length}</span>
            </div>
          </div>

          {/* Loans History List */}
          <div className="space-y-3">
            <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>Histórico de Leituras & Empréstimos</span>
            </h3>

            {studentLoans.length === 0 ? (
              <div className={`p-6 text-center rounded-xl border text-xs ${
                isDark ? 'bg-[#001424] border-[#163e5e] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                Nenhum registro de empréstimo encontrado para este aluno ainda.
              </div>
            ) : (
              <div className="space-y-2">
                {studentLoans.map((loan) => (
                  <div
                    key={loan.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      isDark ? 'bg-[#001424] border-[#163e5e]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {loan.bookCover && (
                        <img
                          src={loan.bookCover}
                          alt={loan.bookTitle}
                          className={`w-10 h-14 object-cover rounded shadow border ${
                            isDark ? 'border-[#163e5e]' : 'border-slate-200'
                          }`}
                        />
                      )}
                      <div>
                        <span className={`text-sm font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{loan.bookTitle}</span>
                        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{loan.bookAuthor}</span>
                        <div className={`flex items-center gap-3 mt-1 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            Retirada: {loan.loanDate}
                          </span>
                          <span>•</span>
                          <span>Devolução: {loan.returnDate}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          loan.status === 'devolvido'
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : loan.status === 'atrasado'
                            ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {loan.status === 'devolvido'
                          ? 'Devolvido'
                          : loan.status === 'atrasado'
                          ? 'Atrasado'
                          : 'Ativo'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex justify-end ${
          isDark ? 'border-[#163e5e] bg-[#001728]' : 'border-slate-200 bg-slate-50'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              isDark ? 'bg-[#0d2a40] hover:bg-[#163e5e] text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

