import React, { useState, useMemo } from 'react';
import {
  Download,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Search,
  Check,
  BookOpen,
  Award,
  Users,
  BarChart3
} from 'lucide-react';
import { Loan, Book, Student } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ReportsViewProps {
  loans: Loan[];
  books?: Book[];
  students?: Student[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ loans = [], books = [], students = [] }) => {
  const { isDark } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('todos');
  const [tableSearch, setTableSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'devolvido' | 'em_andamento' | 'atrasado'>('todos');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Helper date parsing (DD/MM/YYYY or YYYY-MM-DD)
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

  // Filter loans by period
  const periodFilteredLoans = useMemo(() => {
    if (selectedPeriod === 'todos') return loans;
    const now = new Date();

    return loans.filter((loan) => {
      const d = parseLoanDate(loan.loanDate);
      if (!d) return true;

      if (selectedPeriod === '30dias') {
        const past30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return d >= past30;
      }
      if (selectedPeriod === '6meses') {
        const past6m = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        return d >= past6m;
      }
      if (selectedPeriod === 'ano2026') {
        return d.getFullYear() === 2026;
      }
      return true;
    });
  }, [loans, selectedPeriod]);

  // Real Dynamic Calculations
  const totalCount = periodFilteredLoans.length;
  const devolvidosCount = periodFilteredLoans.filter((l) => l.status === 'devolvido').length;
  const emAndamentoCount = periodFilteredLoans.filter((l) => l.status === 'em_andamento').length;
  const atrasadosCount = periodFilteredLoans.filter((l) => l.status === 'atrasado').length;

  const devolvidosPercent = totalCount > 0 ? Math.round((devolvidosCount / totalCount) * 100) : 0;
  const emAndamentoPercent = totalCount > 0 ? Math.round((emAndamentoCount / totalCount) * 100) : 0;
  const atrasadosPercent = totalCount > 0 ? Math.round((atrasadosCount / totalCount) * 100) : 0;

  // Real Monthly Distribution
  const monthlyData = useMemo(() => {
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const counts = new Array(12).fill(0);

    periodFilteredLoans.forEach((l) => {
      const d = parseLoanDate(l.loanDate);
      if (d) {
        const m = d.getMonth();
        if (m >= 0 && m < 12) counts[m]++;
      } else {
        counts[7]++; // default to Ago if unparseable
      }
    });

    const maxCount = Math.max(...counts, 1);
    return monthNames.map((m, idx) => ({
      month: m,
      count: counts[idx],
      max: maxCount,
    }));
  }, [periodFilteredLoans]);

  // Real Most Borrowed Books
  const popularBooks = useMemo(() => {
    const counts: Record<string, { count: number; author: string }> = {};
    periodFilteredLoans.forEach((l) => {
      if (!counts[l.bookTitle]) {
        counts[l.bookTitle] = { count: 0, author: l.bookAuthor };
      }
      counts[l.bookTitle].count++;
    });

    const sorted = Object.entries(counts)
      .map(([title, data]) => ({
        title,
        author: data.author,
        count: data.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const maxPopular = Math.max(...sorted.map((b) => b.count), 1);
    return sorted.map((b) => ({ ...b, max: maxPopular }));
  }, [periodFilteredLoans]);

  // Real Top Readers
  const topStudents = useMemo(() => {
    const map: Record<string, { name: string; class: string; avatar?: string; count: number }> = {};
    periodFilteredLoans.forEach((l) => {
      const key = l.studentName;
      if (!map[key]) {
        map[key] = {
          name: l.studentName,
          class: l.studentClass,
          avatar: l.studentAvatar,
          count: 0,
        };
      }
      map[key].count++;
    });

    return Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [periodFilteredLoans]);

  // Filter Table
  const filteredLoans = useMemo(() => {
    return periodFilteredLoans.filter((loan) => {
      const term = tableSearch.toLowerCase().trim();
      const code = (loan.studentCode || '').toLowerCase();
      const matchesSearch =
        !term ||
        loan.studentName.toLowerCase().includes(term) ||
        loan.bookTitle.toLowerCase().includes(term) ||
        loan.bookAuthor.toLowerCase().includes(term) ||
        code.includes(term);

      const matchesStatus = statusFilter === 'todos' || loan.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [periodFilteredLoans, tableSearch, statusFilter]);

  const handleExport = () => {
    setIsExporting(true);
    
    // Generate real CSV from database
    const headers = ['ID', 'Aluno', 'Código', 'Turma', 'Livro', 'Autor', 'Data Empréstimo', 'Data Devolução', 'Situação'];
    const rows = filteredLoans.map((l) => [
      l.id,
      `"${l.studentName}"`,
      `"${(l.studentCode || '').replace(/^ALU-/, '')}"`,
      `"${l.studentClass || ''}"`,
      `"${l.bookTitle}"`,
      `"${l.bookAuthor}"`,
      `"${l.loanDate}"`,
      `"${l.returnDate}"`,
      `"${l.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_biblioteca_bmq_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }, 600);
  };

  const getStatusBadge = (status: Loan['status']) => {
    switch (status) {
      case 'devolvido':
        return (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 border ${
            isDark ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            <CheckCircle2 className="w-3 h-3" />
            Devolvido
          </span>
        );
      case 'em_andamento':
        return (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 border ${
            isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            <Clock className="w-3 h-3" />
            Em andamento
          </span>
        );
      case 'atrasado':
        return (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 border ${
            isDark ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            <AlertCircle className="w-3 h-3" />
            Atrasado
          </span>
        );
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 animate-in fade-in duration-300">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <BarChart3 className="w-7 h-7 text-emerald-500" />
            <span>Relatórios & Estatísticas Reais</span>
          </h1>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Indicadores sincronizados em tempo real com o banco de dados da biblioteca
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Period Selector */}
          <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border ${
            isDark
              ? 'bg-[#092032] border-[#163650] text-slate-300'
              : 'bg-white border-slate-200 text-slate-700 shadow-sm'
          }`}>
            <Calendar className="w-4 h-4 text-emerald-500" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className={`bg-transparent font-medium focus:outline-none cursor-pointer text-xs sm:text-sm ${
                isDark ? 'text-white' : 'text-slate-800'
              }`}
            >
              <option value="todos" className={isDark ? 'bg-[#092032] text-white' : 'bg-white text-slate-900'}>
                Todos os Empréstimos ({loans.length})
              </option>
              <option value="ano2026" className={isDark ? 'bg-[#092032] text-white' : 'bg-white text-slate-900'}>
                Ano Letivo 2026
              </option>
              <option value="30dias" className={isDark ? 'bg-[#092032] text-white' : 'bg-white text-slate-900'}>
                Últimos 30 dias
              </option>
              <option value="6meses" className={isDark ? 'bg-[#092032] text-white' : 'bg-white text-slate-900'}>
                Últimos 6 meses
              </option>
            </select>
          </div>

          {/* Export Button */}
          <button
            id="btn-export-reports"
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 bg-[#1dbb64] hover:bg-[#16a354] text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            {exportSuccess ? (
              <>
                <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                <span>CSV Baixado!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Exportando...' : 'Exportar Dados'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Metric Cards with REAL Database Numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
        {/* 1. Total de Empréstimos */}
        <div className={`border rounded-2xl p-4 sm:p-5 shadow-lg ${
          isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-2xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalCount}</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#1dbb64]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <span className={`text-xs sm:text-sm font-medium block ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Total de Empréstimos
          </span>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-500 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>100% dos registros ativos</span>
          </div>
        </div>

        {/* 2. Devolvidos */}
        <div className={`border rounded-2xl p-4 sm:p-5 shadow-lg ${
          isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl sm:text-4xl font-extrabold text-blue-500">{devolvidosCount}</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <span className={`text-xs sm:text-sm font-medium block ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Devolvidos
          </span>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-blue-500 font-semibold">
            <span>{devolvidosPercent}% do total devolvido</span>
          </div>
        </div>

        {/* 3. Em andamento */}
        <div className={`border rounded-2xl p-4 sm:p-5 shadow-lg ${
          isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl sm:text-4xl font-extrabold text-amber-500">{emAndamentoCount}</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <span className={`text-xs sm:text-sm font-medium block ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Em andamento
          </span>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-amber-500 font-semibold">
            <span>{emAndamentoPercent}% em leitura ativa</span>
          </div>
        </div>

        {/* 4. Atrasados */}
        <div className={`border rounded-2xl p-4 sm:p-5 shadow-lg ${
          isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl sm:text-4xl font-extrabold text-rose-500">{atrasadosCount}</span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <span className={`text-xs sm:text-sm font-medium block ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Atrasados
          </span>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-rose-500 font-semibold">
            <span>{atrasadosPercent}% pendentes</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Bar Chart: Empréstimos por mês */}
        <div className={`lg:col-span-7 border rounded-2xl p-5 sm:p-6 flex flex-col justify-between ${
          isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Empréstimos por mês
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Distribuição mensal do banco de dados</p>
            </div>
            <span className={`text-xs font-mono px-2.5 py-1 rounded-lg border ${
              isDark ? 'text-emerald-400 bg-[#031320] border-[#163650]' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
            }`}>
              Total: {totalCount}
            </span>
          </div>

          {/* Bar Chart Bars */}
          <div className="h-44 flex items-end justify-between gap-1.5 sm:gap-2 px-2">
            {monthlyData.map((item) => {
              const maxVal = Math.max(...monthlyData.map((d) => d.count), 1);
              const height = item.count > 0 ? Math.max((item.count / maxVal) * 100, 15) : 4;
              return (
                <div
                  key={item.month}
                  className="flex-1 flex flex-col items-center gap-2 group relative cursor-pointer"
                >
                  {/* Tooltip on hover */}
                  <div className={`absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] px-2 py-1 rounded-md border whitespace-nowrap z-10 shadow-lg font-mono ${
                    isDark ? 'bg-slate-900 text-white border-[#163650]' : 'bg-slate-800 text-white border-slate-700'
                  }`}>
                    {item.count} {item.count === 1 ? 'empréstimo' : 'empréstimos'}
                  </div>

                  <div className={`w-full h-32 rounded-t-lg flex items-end overflow-hidden border-b ${
                    isDark ? 'bg-[#031320] border-[#163650]' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <div
                      style={{ height: `${height}%` }}
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        item.count > 0
                          ? 'bg-gradient-to-t from-emerald-600 to-[#1dbb64] group-hover:from-emerald-500 group-hover:to-emerald-300'
                          : isDark ? 'bg-slate-800/40' : 'bg-slate-200'
                      }`}
                    />
                  </div>
                  <span className={`text-[10px] sm:text-xs font-medium ${
                    item.count > 0 ? (isDark ? 'text-white font-bold' : 'text-slate-900 font-bold') : (isDark ? 'text-slate-500' : 'text-slate-400')
                  }`}>
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Horizontal Progress Bars: Livros mais emprestados */}
        <div className={`lg:col-span-5 border rounded-2xl p-5 sm:p-6 flex flex-col justify-between ${
          isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-base sm:text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <span>Livros mais emprestados</span>
            </h3>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Top Leituras</span>
          </div>

          <div className="space-y-4 my-auto">
            {popularBooks.length === 0 ? (
              <p className={`text-xs text-center py-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Nenhum livro registrado no período.</p>
            ) : (
              popularBooks.map((book) => {
                const percent = Math.round((book.count / totalCount) * 100) || 10;
                return (
                  <div key={book.title}>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className={`truncate pr-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`} title={book.title}>{book.title}</span>
                      <span className="text-emerald-500 font-mono font-bold shrink-0">{book.count}x ({percent}%)</span>
                    </div>
                    <div className={`w-full h-2.5 rounded-full overflow-hidden border ${
                      isDark ? 'bg-[#031320] border-[#163650]' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <div
                        style={{ width: `${Math.max((book.count / book.max) * 100, 10)}%` }}
                        className="h-full bg-gradient-to-r from-emerald-600 to-[#1dbb64] rounded-full"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Top Readers Ranking */}
      {topStudents.length > 0 && (
        <div className={`border rounded-2xl p-5 sm:p-6 mb-8 ${
          isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-base sm:text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Award className="w-5 h-5 text-amber-500" />
              <span>Ranking de Alunos Mais Leitores</span>
            </h3>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Baseado no histórico</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {topStudents.map((st, idx) => (
              <div
                key={st.name}
                className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                  isDark ? 'bg-[#001424] border-[#163e5e]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="relative">
                  <img
                    src={st.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=' + st.name}
                    alt={st.name}
                    className={`w-11 h-11 rounded-full object-cover border student-avatar-zoom transition-transform duration-300 ease-out hover:scale-150 cursor-pointer hover:shadow-2xl hover:z-40 relative ${
                      isDark ? 'border-[#163e5e] bg-[#071828]' : 'border-slate-200 bg-white'
                    }`}
                  />
                  <span className={`absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-950 ${
                    idx === 0 ? 'bg-amber-400 shadow-md shadow-amber-500/30' : idx === 1 ? 'bg-slate-300' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-emerald-500'
                  }`}>
                    {idx + 1}º
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className={`font-bold text-xs truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{st.name}</h4>
                  <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">{st.class}</p>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                    {st.count} {st.count === 1 ? 'empréstimo' : 'empréstimos'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empréstimos recentes Table */}
      <div className={`border rounded-2xl p-5 sm:p-6 ${
        isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Empréstimos no Banco de Dados
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Exibindo {filteredLoans.length} de {totalCount} registros</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Buscar aluno, livro ou código..."
                className={`text-xs pl-8 pr-3 py-2 rounded-xl border focus:outline-none focus:border-emerald-500 ${
                  isDark
                    ? 'bg-[#031320] text-white placeholder-slate-400 border-[#163650]'
                    : 'bg-slate-50 text-slate-900 placeholder-slate-400 border-slate-200'
                }`}
              />
            </div>

            <div className={`flex gap-1 p-1 rounded-xl border ${
              isDark ? 'bg-[#031320] border-[#163650]' : 'bg-slate-100 border-slate-200'
            }`}>
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'devolvido', label: 'Devolvidos' },
                { id: 'em_andamento', label: 'Em andamento' },
                { id: 'atrasado', label: 'Atrasados' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setStatusFilter(filter.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                    statusFilter === filter.id
                      ? 'bg-[#1dbb64] text-slate-950 font-bold shadow-sm'
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className={`uppercase text-[11px] font-bold border-b ${
              isDark ? 'bg-[#031320] text-slate-400 border-[#163650]' : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}>
              <tr>
                <th className="py-3.5 px-4 rounded-l-xl">Cód.</th>
                <th className="py-3.5 px-4">Aluno</th>
                <th className="py-3.5 px-4">Livro</th>
                <th className="py-3.5 px-4">Data Empréstimo</th>
                <th className="py-3.5 px-4">Data Devolução</th>
                <th className="py-3.5 px-4 rounded-r-xl">Situação</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#163650]/40' : 'divide-slate-200'}`}>
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`py-8 text-center italic ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Nenhum empréstimo encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan.id} className={`transition-colors ${
                    isDark ? 'hover:bg-[#071b2b]' : 'hover:bg-slate-50'
                  }`}>
                    <td className="py-3.5 px-4 font-mono text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                      {(loan.studentCode || '').replace(/^ALU-/, '') || '-'}
                    </td>
                    <td className={`py-3.5 px-4 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <div className="flex items-center gap-2.5">
                        <img
                          src={loan.studentAvatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=' + loan.studentName}
                          alt={loan.studentName}
                          className={`w-7 h-7 rounded-full object-cover border student-avatar-zoom transition-transform duration-300 ease-out hover:scale-150 cursor-pointer hover:shadow-2xl hover:z-40 relative ${
                            isDark ? 'border-[#163650] bg-[#001424]' : 'border-slate-200 bg-white'
                          }`}
                        />
                        <div>
                          <span>{loan.studentName}</span>
                          <span className={`block text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{loan.studentClass}</span>
                        </div>
                      </div>
                    </td>
                    <td className={`py-3.5 px-4 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <div>
                        <span>{loan.bookTitle}</span>
                        <span className={`block text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{loan.bookAuthor}</span>
                      </div>
                    </td>
                    <td className={`py-3.5 px-4 font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {loan.loanDate}
                    </td>
                    <td className={`py-3.5 px-4 font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {loan.returnDate}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(loan.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
