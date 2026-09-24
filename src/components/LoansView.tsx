import React, { useState } from 'react';
import { Search, Plus, CheckCircle2, RefreshCw } from 'lucide-react';
import { Loan } from '../types';
import { useTheme } from '../context/ThemeContext';

interface LoansViewProps {
  loans: Loan[];
  onOpenNewLoan: () => void;
  onReturnLoan: (loanId: string) => void;
  onRenewLoan: (loanId: string) => void;
}

export const LoansView: React.FC<LoansViewProps> = ({
  loans,
  onOpenNewLoan,
  onReturnLoan,
  onRenewLoan,
}) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'todos' | 'em_andamento' | 'devolvido' | 'atrasado'>('todos');
  const [search, setSearch] = useState('');

  const filteredLoans = loans.filter((l) => {
    const matchesTab = activeTab === 'todos' || l.status === activeTab;
    const matchesSearch =
      l.studentName.toLowerCase().includes(search.toLowerCase()) ||
      l.bookTitle.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Gestão de Empréstimos
          </h1>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Controle de devoluções, renovações e status de empréstimos
          </p>
        </div>

        <button
          onClick={onOpenNewLoan}
          className="flex items-center gap-2 bg-[#23c65e] hover:bg-[#1fa950] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Empréstimo</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
        <div
          className={`flex gap-1.5 p-1.5 rounded-xl border overflow-x-auto no-scrollbar ${
            isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          {[
            { id: 'todos', label: 'Todos os Empréstimos' },
            { id: 'em_andamento', label: 'Em Andamento' },
            { id: 'atrasado', label: 'Atrasados' },
            { id: 'devolvido', label: 'Devolvidos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#23c65e] text-white shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            placeholder="Buscar por aluno ou livro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none transition-all ${
              isDark
                ? 'bg-[#092032] text-white placeholder-slate-400 border-[#163650] focus:border-emerald-500'
                : 'bg-white text-slate-900 placeholder-slate-400 border-slate-200 focus:border-[#23c65e] shadow-sm'
            }`}
          />
        </div>
      </div>

      {/* Loans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredLoans.map((loan) => (
          <div
            key={loan.id}
            className={`border rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all ${
              isDark
                ? 'bg-[#092032] border-[#163650] hover:border-emerald-500/40'
                : 'bg-white border-slate-200 hover:border-emerald-300 shadow-sm'
            }`}
          >
            <div>
              {/* Status Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <img
                    src={loan.studentAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt={loan.studentName}
                    className={`w-8 h-8 rounded-full object-cover border student-avatar-zoom transition-transform duration-300 ease-out hover:scale-150 cursor-pointer hover:shadow-2xl hover:z-40 relative ${
                      isDark ? 'border-[#163650]' : 'border-slate-200'
                    }`}
                  />
                  <div>
                    <span className={`text-xs font-bold block leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {loan.studentName}
                    </span>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {loan.studentClass}
                    </span>
                  </div>
                </div>

                {loan.status === 'devolvido' ? (
                  <span className="bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-[10px] font-semibold px-2.5 py-0.5 rounded-md">
                    Devolvido
                  </span>
                ) : loan.status === 'atrasado' ? (
                  <span className="bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[10px] font-semibold px-2.5 py-0.5 rounded-md">
                    Atrasado
                  </span>
                ) : (
                  <span className="bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-[10px] font-semibold px-2.5 py-0.5 rounded-md">
                    Em andamento
                  </span>
                )}
              </div>

              {/* Book Info */}
              <div
                className={`flex gap-3.5 p-3 rounded-xl border mb-4 ${
                  isDark ? 'bg-[#031320] border-[#163650]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <img
                  src={loan.bookCover}
                  alt={loan.bookTitle}
                  className="w-12 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className={`text-xs font-bold block truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {loan.bookTitle}
                  </span>
                  <span className={`text-[10px] block truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {loan.bookAuthor}
                  </span>
                  <div className={`mt-2 text-[10px] space-y-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <div>Empréstimo: <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>{loan.loanDate}</span></div>
                    <div>Devolução: <span className={isDark ? 'text-emerald-400 font-medium' : 'text-emerald-600 font-medium'}>{loan.returnDate}</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {loan.status !== 'devolvido' ? (
              <div className={`flex gap-2 pt-2 border-t ${isDark ? 'border-[#163650]/60' : 'border-slate-100'}`}>
                <button
                  onClick={() => onRenewLoan(loan.id)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    isDark
                      ? 'bg-[#133e4a] hover:bg-[#1a4f5f] text-emerald-400'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Renovar</span>
                </button>
                <button
                  onClick={() => onReturnLoan(loan.id)}
                  className="flex-1 py-2 rounded-lg bg-[#23c65e] hover:bg-[#1fa950] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Devolver</span>
                </button>
              </div>
            ) : (
              <div className={`text-center py-1.5 text-[11px] font-medium border-t ${isDark ? 'text-slate-500 border-[#163650]/60' : 'text-slate-400 border-slate-100'}`}>
                Devolvido com sucesso
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

