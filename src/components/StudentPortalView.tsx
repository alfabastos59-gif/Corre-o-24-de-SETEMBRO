import React, { useState } from 'react';
import { BookOpen, CheckCircle, Clock, AlertTriangle, Calendar, ArrowRight, ShieldAlert, LogOut, Sparkles, BookCheck, CreditCard } from 'lucide-react';
import { Student, Loan, Book } from '../types';
import { useTheme } from '../context/ThemeContext';
import { StudentCardModal } from './StudentCardModal';

interface StudentPortalViewProps {
  student: Student;
  loans: Loan[];
  books: Book[];
  onOpenCatalog: () => void;
  onLogout: () => void;
  onRequestReturn?: (loanId: string) => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  student,
  loans,
  books,
  onOpenCatalog,
  onLogout,
  onRequestReturn,
}) => {
  const { isDark } = useTheme();
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const studentCode = (student.studentCode || '').replace(/^ALU-/, '');
  
  // Filter loans strictly for this student
  const studentLoans = loans.filter((l) => {
    const lCode = (l.studentCode || '').replace(/^ALU-/, '');
    return (
      (studentCode && lCode === studentCode) ||
      (l.studentEmail && l.studentEmail.toLowerCase() === student.email.toLowerCase()) ||
      l.studentName.toLowerCase() === student.name.toLowerCase()
    );
  });

  const activeLoans = studentLoans.filter((l) => l.status === 'em_andamento');
  const overdueLoans = studentLoans.filter((l) => l.status === 'atrasado');
  const returnedLoans = studentLoans.filter((l) => l.status === 'devolvido');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Student Profile Card Header */}
      <div
        className={`p-6 rounded-2xl border shadow-xl ${
          isDark
            ? 'bg-gradient-to-r from-[#092032] via-[#0d2a40] to-[#092032] border-[#163e5e]'
            : 'bg-white border-slate-200 shadow-md'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={student.avatar}
                alt={student.name}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-emerald-400 shadow-lg student-avatar-zoom transition-transform duration-300 ease-out hover:scale-150 cursor-pointer hover:shadow-2xl hover:z-40 relative ${
                  isDark ? 'bg-[#001424]' : 'bg-slate-100'
                }`}
              />
              <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-[#23c65e] text-white font-bold text-[10px] uppercase tracking-wider shadow">
                Aluno
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{student.name}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                <span
                  className={`px-2.5 py-0.5 rounded-full font-medium ${
                    isDark ? 'bg-[#163e5e] text-cyan-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {student.class}
                </span>
                <span
                  className={`font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                    isDark ? 'bg-[#001424] text-emerald-400 border-[#163e5e]' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  Código: {studentCode}
                </span>
                {student.registration && (
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    Matrícula: {student.registration}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              id="btn-student-my-card"
              onClick={() => setIsCardModalOpen(true)}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                isDark
                  ? 'bg-[#004d2c]/60 hover:bg-[#00663a] text-emerald-300 border-emerald-500/40'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}
              title="Visualizar e Imprimir minha Carteira do Estudante"
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Minha Carteirinha</span>
            </button>

            <button
              onClick={onOpenCatalog}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#23c65e] hover:bg-[#1fa950] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explorar Catálogo</span>
            </button>
            <button
              onClick={onLogout}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#001424] hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border-[#163e5e]'
                  : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-slate-200'
              }`}
              title="Encerrar Sessão do Aluno"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Security Notice for Student */}
        <div className={`mt-5 pt-4 border-t flex items-center gap-2 text-xs ${isDark ? 'border-[#163e5e]/60 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
          <ShieldAlert className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Área segura do estudante. Acesso restrito a empréstimos e histórico pessoal. Para cadastrar livros ou alterar dados gerais, utilize o acesso administrativo.</span>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#071828] border-[#163e5e]' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total de Leituras</span>
            <BookCheck className="w-4 h-4 text-cyan-500" />
          </div>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{studentLoans.length}</p>
          <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Livros solicitados</span>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#071828] border-[#163e5e]' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Em Andamento</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-500">{activeLoans.length}</p>
          <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Com você atualmente</span>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#071828] border-[#163e5e]' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Devolvidos</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-500">{returnedLoans.length}</p>
          <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Finalizados com sucesso</span>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#071828] border-[#163e5e]' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pendências / Atrasos</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-500">{overdueLoans.length}</p>
          <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Livros atrasados</span>
        </div>
      </div>

      {/* Active Loans Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Clock className="w-5 h-5 text-amber-500" />
            <span>Livros em Andamento ({activeLoans.length + overdueLoans.length})</span>
          </h2>
        </div>

        {activeLoans.length === 0 && overdueLoans.length === 0 ? (
          <div className={`p-8 rounded-2xl border text-center space-y-3 ${isDark ? 'bg-[#071828] border-[#163e5e]' : 'bg-white border-slate-200 shadow-sm'}`}>
            <Sparkles className="w-8 h-8 text-emerald-500 mx-auto" />
            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Nenhum livro em aberto no momento</h3>
            <p className={`text-xs max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Você não possui nenhum empréstimo ativo. Que tal explorar o catálogo da biblioteca e escolher sua próxima leitura?
            </p>
            <button
              onClick={onOpenCatalog}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#23c65e] hover:bg-[#1fa950] text-white font-bold text-xs cursor-pointer shadow-sm"
            >
              <span>Ver Livros Disponíveis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...overdueLoans, ...activeLoans].map((loan) => {
              const isOverdue = loan.status === 'atrasado';
              return (
                <div
                  key={loan.id}
                  className={`p-4 rounded-2xl border flex gap-4 ${
                    isOverdue
                      ? 'border-rose-500/50 bg-rose-500/10'
                      : isDark
                      ? 'bg-[#071828] border-[#163e5e]'
                      : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <img
                    src={loan.bookCover}
                    alt={loan.bookTitle}
                    className={`w-20 h-28 rounded-xl object-cover shrink-0 border ${
                      isDark ? 'bg-[#001424] border-[#163e5e]' : 'bg-slate-100 border-slate-200'
                    }`}
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isOverdue
                              ? 'bg-rose-500 text-white font-bold'
                              : 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {isOverdue ? 'Atrasado' : 'Em Leitura'}
                        </span>
                        <span className={`text-[11px] flex items-center gap-1 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          <Calendar className="w-3 h-3" />
                          Devolução: {loan.returnDate}
                        </span>
                      </div>
                      <h4 className={`font-bold text-sm mt-1 truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{loan.bookTitle}</h4>
                      <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{loan.bookAuthor}</p>
                    </div>

                    <div className={`pt-2 border-t flex items-center justify-between text-xs ${isDark ? 'border-[#163e5e]/50 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                      <span>Retirado em: <strong className={isDark ? 'text-slate-200' : 'text-slate-700'}>{loan.loanDate}</strong></span>
                      {onRequestReturn && (
                        <button
                          onClick={() => onRequestReturn(loan.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#23c65e] hover:bg-[#1fa950] text-white text-[11px] font-bold transition-colors cursor-pointer shadow-sm"
                        >
                          Devolver Livro
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* History of Returned Books */}
      <div className="space-y-4">
        <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <span>Histórico de Leituras Concluídas ({returnedLoans.length})</span>
        </h2>

        {returnedLoans.length === 0 ? (
          <p className={`text-xs italic p-4 rounded-xl border ${isDark ? 'text-slate-500 bg-[#071828] border-[#163e5e]' : 'text-slate-400 bg-white border-slate-200'}`}>
            Ainda não há livros finalizados no histórico.
          </p>
        ) : (
          <div className={`border rounded-2xl overflow-hidden ${isDark ? 'bg-[#071828] border-[#163e5e]' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-[#163e5e] text-slate-400 bg-[#001424]' : 'border-slate-200 text-slate-600 bg-slate-50'}`}>
                    <th className="py-3 px-4">Livro</th>
                    <th className="py-3 px-4">Autor</th>
                    <th className="py-3 px-4">Data Empréstimo</th>
                    <th className="py-3 px-4">Data Devolução</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-[#163e5e]/50' : 'divide-slate-100'}`}>
                  {returnedLoans.map((l) => (
                    <tr key={l.id} className={isDark ? 'hover:bg-[#0d2a40]/30 transition-colors' : 'hover:bg-slate-50 transition-colors'}>
                      <td className={`py-3 px-4 font-semibold flex items-center gap-2.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <img src={l.bookCover} alt={l.bookTitle} className="w-7 h-9 rounded object-cover" />
                        <span>{l.bookTitle}</span>
                      </td>
                      <td className={`py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{l.bookAuthor}</td>
                      <td className={`py-3 px-4 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{l.loanDate}</td>
                      <td className={`py-3 px-4 font-mono font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        {l.actualReturnDate || l.returnDate}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                          <CheckCircle className="w-3 h-3" />
                          Devolvido
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal da Carteira do Estudante */}
      <StudentCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        students={[student]}
        initialSelectedStudent={student}
      />
    </div>
  );
};

