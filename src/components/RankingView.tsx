import React, { useState, useMemo, useEffect } from 'react';
import {
  Trophy,
  TrendingUp,
  Award,
  Medal,
  Flame,
  Search,
  Filter,
  GraduationCap,
  BookOpen,
  ArrowLeft,
  Sparkles,
  Users,
  Calendar,
  Share2,
  Printer,
  ChevronRight,
  Star,
  Cat,
  Target,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Book, Loan, Student } from '../types';
import { useTheme } from '../context/ThemeContext';
import { loadScoresMap } from '../utils/quiterioScores';

interface RankingViewProps {
  books: Book[];
  loans: Loan[];
  students: Student[];
  onSelectBook: (book: Book) => void;
  onBackToHome?: () => void;
  onSelectStudent?: (student: Student) => void;
  onNavigateToQuiterio?: () => void;
}

export const RankingView: React.FC<RankingViewProps> = ({
  books,
  loans,
  students,
  onSelectBook,
  onBackToHome,
  onNavigateToQuiterio,
}) => {
  const { isDark } = useTheme();

  // State Filters
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchStudent, setSearchStudent] = useState<string>('');
  const [searchBook, setSearchBook] = useState<string>('');
  const [studentSortOrder, setStudentSortOrder] = useState<'ranking' | 'alfabetica'>('ranking');
  const [bookSortOrder, setBookSortOrder] = useState<'ranking' | 'alfabetica'>('ranking');
  const [activeTab, setActiveTab] = useState<'geral' | 'alunos' | 'livros'>('geral');
  const [showAllQuiterio, setShowAllQuiterio] = useState<boolean>(false);
  const [scoresRevision, setScoresRevision] = useState<number>(0);

  // Re-render when Missão Quitério scores are updated or reset
  useEffect(() => {
    const handleUpdate = () => setScoresRevision((prev) => prev + 1);
    window.addEventListener('bmq_quiterio_scores_updated', handleUpdate);
    return () => window.removeEventListener('bmq_quiterio_scores_updated', handleUpdate);
  }, []);

  // Dynamic calculation of students who answered Missão Quitério challenges
  const quiterioAchievers = useMemo(() => {
    const scoresMap = loadScoresMap();
    const list = Object.values(scoresMap)
      .filter((s) => s.score > 0 || (s.correctAnswers && s.correctAnswers > 0) || (s.totalAnswered && s.totalAnswered > 0))
      .map((item) => {
        const cleanCode = (item.studentCode || item.studentId || '').toLowerCase().replace(/^alu-/, '');
        const matchedStudent = students.find((s) => {
          const sCleanCode = (s.studentCode || '').toLowerCase().replace(/^alu-/, '');
          return sCleanCode === cleanCode || s.name.toLowerCase() === item.studentName.toLowerCase();
        });

        const booksAnswered =
          item.completedBooks && item.completedBooks.length > 0
            ? item.completedBooks
            : item.bookScores
            ? Object.keys(item.bookScores)
            : [];

        return {
          id: item.studentId,
          code: matchedStudent?.studentCode
            ? `ALU-${matchedStudent.studentCode.replace(/^ALU-/, '')}`
            : item.studentCode
            ? (item.studentCode.startsWith('ALU-') ? item.studentCode : `ALU-${item.studentCode}`)
            : `ALU-${item.studentId.toUpperCase()}`,
          name: matchedStudent?.name || item.studentName,
          className: matchedStudent?.class || 'Ensino Fundamental/Médio',
          avatar:
            matchedStudent?.avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          score: item.score,
          correctAnswers: item.correctAnswers || 0,
          totalAnswered: item.totalAnswered || Math.max(item.correctAnswers || 0, 1),
          attemptsCount: item.attemptsCount || 1,
          booksAnswered,
          bookScores: item.bookScores,
        };
      })
      .sort((a, b) => b.score - a.score);

    return list;
  }, [students, scoresRevision]);

  const totalUniqueBooksAnswered = useMemo(() => {
    const booksSet = new Set<string>();
    quiterioAchievers.forEach((achiever) => {
      achiever.booksAnswered.forEach((bk) => booksSet.add(bk));
    });
    return booksSet.size;
  }, [quiterioAchievers]);

  // Available classes
  const classesList = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.class) set.add(s.class);
    });
    return Array.from(set).sort();
  }, [students]);

  // Dynamic Student Ranking Calculation
  const fullStudentRanking = useMemo(() => {
    const scoresMap = loadScoresMap();
    return students
      .map((student) => {
        const studentLoans = loans.filter((l) => {
          const nameMatch = l.studentName && student.name && l.studentName.trim().toLowerCase() === student.name.trim().toLowerCase();
          const emailMatch = l.studentEmail && student.email && l.studentEmail.trim().toLowerCase() === student.email.trim().toLowerCase();
          const codeMatch = l.studentCode && student.studentCode && l.studentCode.trim().toLowerCase() === student.studentCode.trim().toLowerCase();
          return nameMatch || emailMatch || codeMatch;
        });

        const calculatedCount = studentLoans.length;
        const totalCount = Math.max(calculatedCount, student.totalLoansCount || 0);

        // Find Missão Quitério points
        const cleanCode = (student.studentCode || '').toLowerCase().replace(/^alu-/, '');
        const scoreData =
          scoresMap[cleanCode] ||
          scoresMap[student.name.toLowerCase()] ||
          scoresMap[student.id];
        const quiterioScore = scoreData ? scoreData.score : 0;
        const totalPoints = totalCount * 100 + quiterioScore;

        return {
          ...student,
          totalCount,
          quiterioScore,
          totalPoints,
          activeLoans: studentLoans.filter((l) => l.status === 'em_andamento' || l.status === 'atrasado').length,
          returnedLoans: studentLoans.filter((l) => l.status === 'devolvido').length,
        };
      })
      .sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
        if (b.totalCount !== a.totalCount) return b.totalCount - a.totalCount;
        return a.name.localeCompare(b.name);
      });
  }, [students, loans, scoresRevision]);

  // Filtered Student Ranking
  const filteredStudents = useMemo(() => {
    const list = fullStudentRanking.filter((st) => {
      const matchClass = selectedClass === 'all' || st.class.toLowerCase() === selectedClass.toLowerCase();
      const matchSearch =
        searchStudent === '' ||
        st.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
        (st.studentCode && st.studentCode.toLowerCase().includes(searchStudent.toLowerCase())) ||
        st.class.toLowerCase().includes(searchStudent.toLowerCase());
      return matchClass && matchSearch;
    });

    if (studentSortOrder === 'alfabetica') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));
    }
    return list;
  }, [fullStudentRanking, selectedClass, searchStudent, studentSortOrder]);

  // Dynamic Book Ranking Calculation
  const fullBookRanking = useMemo(() => {
    return books
      .map((book) => {
        const bookLoans = loans.filter((l) => {
          const idMatch = l.bookId && l.bookId === book.id;
          const titleMatch = l.bookTitle && book.title && l.bookTitle.trim().toLowerCase() === book.title.trim().toLowerCase();
          return idMatch || titleMatch;
        });

        const totalLoans = bookLoans.length;
        return {
          ...book,
          totalLoans,
        };
      })
      .sort((a, b) => {
        if (b.totalLoans !== a.totalLoans) return b.totalLoans - a.totalLoans;
        if (b.rating !== a.rating) return b.rating - a.rating;
        return a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' });
      });
  }, [books, loans]);

  // Filtered Book Ranking
  const filteredBooks = useMemo(() => {
    const list = fullBookRanking.filter((bk) => {
      if (!searchBook) return true;
      const q = searchBook.toLowerCase();
      return (
        bk.title.toLowerCase().includes(q) ||
        bk.author.toLowerCase().includes(q) ||
        bk.category.toLowerCase().includes(q)
      );
    });

    if (bookSortOrder === 'alfabetica') {
      return [...list].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' }));
    }
    return list;
  }, [fullBookRanking, searchBook, bookSortOrder]);

  // Top 3 Podium for Students
  const top1 = fullStudentRanking[0];
  const top2 = fullStudentRanking[1];
  const top3 = fullStudentRanking[2];

  // Top 1 Book
  const top1Book = fullBookRanking[0];

  // Print Ranking Handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className={`min-h-screen py-8 sm:py-12 transition-colors duration-200 ${
        isDark ? 'bg-[#001424] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b gap-4 border-[#163650]/40">
          <div>
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className={`inline-flex items-center gap-2 text-xs font-semibold mb-3 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#092032] border-[#163650] text-slate-300 hover:text-white hover:border-emerald-500/40'
                    : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar para o Início</span>
              </button>
            )}

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Quadro Geral de Rankings
                </h1>
                <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Classificação oficial de leitores da Biblioteca Maria Quitéria e livros com maior circulação
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              title="Imprimir Ranking para Mural"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border shadow-sm transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#092032] border-[#163650] text-slate-300 hover:text-white hover:border-slate-500'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Printer className="w-4 h-4 text-emerald-500" />
              <span className="hidden sm:inline">Imprimir Mural</span>
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* PAINEL: ALUNOS QUE CONSEGUIRAM RESPONDER À MISSÃO QUITÉRIO             */}
        {/* ===================================================================== */}
        {onNavigateToQuiterio && (
          <div
            id="painel-alunos-missao-quiterio"
            className={`mb-10 rounded-3xl p-5 sm:p-7 border-2 transition-all shadow-2xl relative overflow-hidden ${
              isDark
                ? 'bg-gradient-to-br from-[#0c0f2b] via-[#14123b] to-[#251336] border-amber-400/60 shadow-[0_12px_36px_rgba(0,0,0,0.6),0_0_25px_rgba(245,158,11,0.12)] text-white'
                : 'bg-gradient-to-br from-[#fffbeb] via-[#fef3c7] to-[#f3e8ff] border-amber-400/80 shadow-xl text-slate-900'
            }`}
          >
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header: Cat Icon + Title + Action CTA */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-amber-400/20">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 border-2 border-amber-200 border-b-4 border-orange-700 text-amber-950 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Cat className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 dark:text-amber-300 text-amber-900 font-extrabold uppercase tracking-wider border border-amber-400/40">
                      🐾 Desafio Literário do Mascote
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{quiterioAchievers.length} {quiterioAchievers.length === 1 ? 'aluno respondeu' : 'alunos responderam'}</span>
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black mt-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 drop-shadow-sm">
                    Alunos que Responderam à Missão Quitério
                  </h3>
                  <p className={`text-xs sm:text-sm mt-0.5 max-w-2xl ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Estudantes que aceitaram o quiz literário do Quitério, responderam às perguntas sobre as obras e conquistaram pontos de sabedoria!
                  </p>
                </div>
              </div>

              {/* Botão Jogar Missão Quitério */}
              <button
                id="btn-jogar-missao-quiterio-painel"
                type="button"
                onClick={onNavigateToQuiterio}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black text-xs sm:text-sm shadow-[0_4px_0_#9a3412] active:translate-y-0.5 border-2 border-amber-200 flex items-center justify-center gap-2 cursor-pointer transition-all flex-shrink-0"
              >
                <span>Jogar Missão Quitério 🐾</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Metric Summary Bar */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 my-4">
              <div className={`p-3 rounded-2xl border flex items-center gap-2.5 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/70 border-amber-200'}`}>
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-500 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Alunos no Jogo</span>
                  <span className={`text-sm sm:text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{quiterioAchievers.length} Estudantes</span>
                </div>
              </div>

              <div className={`p-3 rounded-2xl border flex items-center gap-2.5 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/70 border-amber-200'}`}>
                <div className="w-8 h-8 rounded-xl bg-yellow-400/20 text-yellow-500 dark:text-yellow-300 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pontos Conquistados</span>
                  <span className="text-sm sm:text-base font-extrabold text-amber-500 dark:text-amber-300">
                    {quiterioAchievers.reduce((sum, s) => sum + s.score, 0).toLocaleString()} pts
                  </span>
                </div>
              </div>

              <div className={`p-3 rounded-2xl border flex items-center gap-2.5 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/70 border-amber-200'}`}>
                <div className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Perguntas Acertadas</span>
                  <span className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-300">
                    {quiterioAchievers.reduce((sum, s) => sum + s.correctAnswers, 0)} acertos
                  </span>
                </div>
              </div>

              <div className={`p-3 rounded-2xl border flex items-center gap-2.5 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/70 border-amber-200'}`}>
                <div className="w-8 h-8 rounded-xl bg-purple-400/20 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Livros Desafiados</span>
                  <span className={`text-sm sm:text-base font-extrabold ${isDark ? 'text-purple-200' : 'text-purple-800'}`}>
                    {totalUniqueBooksAnswered} {totalUniqueBooksAnswered === 1 ? 'livro' : 'livros'}
                  </span>
                </div>
              </div>
            </div>

            {/* Students Showcase Cards */}
            {quiterioAchievers.length === 0 ? (
              <div className="relative z-10 text-center py-8 rounded-2xl bg-white/5 border border-white/10">
                <Cat className="w-12 h-12 text-amber-400 mx-auto mb-2 opacity-60" />
                <h4 className="text-base font-bold text-white">Nenhum aluno respondeu aos desafios ainda!</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                  Seja o primeiro a encarar as perguntas do Quitério sobre os livros da biblioteca e apareça aqui!
                </p>
                <button
                  type="button"
                  onClick={onNavigateToQuiterio}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-amber-950 font-bold text-xs"
                >
                  Iniciar Primeiro Desafio
                </button>
              </div>
            ) : (
              <>
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
                  {(showAllQuiterio ? quiterioAchievers : quiterioAchievers.slice(0, 4)).map((student, idx) => {
                    const rank = idx + 1;
                    const isTop1 = rank === 1;
                    const isTop2 = rank === 2;
                    const isTop3 = rank === 3;

                    return (
                      <div
                        key={student.id || idx}
                        className={`rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                          isTop1
                            ? isDark
                              ? 'bg-gradient-to-b from-amber-500/20 via-amber-950/40 to-slate-950/80 border-amber-400 shadow-[0_4px_20px_rgba(245,158,11,0.25)]'
                              : 'bg-gradient-to-b from-amber-100 via-amber-50 to-white border-amber-400 shadow-md'
                            : isTop2
                            ? isDark
                              ? 'bg-gradient-to-b from-slate-400/15 via-slate-900/50 to-slate-950/80 border-slate-300 shadow-md'
                              : 'bg-gradient-to-b from-slate-100 via-white to-white border-slate-300 shadow-sm'
                            : isTop3
                            ? isDark
                              ? 'bg-gradient-to-b from-amber-700/20 via-orange-950/40 to-slate-950/80 border-amber-600 shadow-md'
                              : 'bg-gradient-to-b from-orange-50 via-white to-white border-orange-300 shadow-sm'
                            : isDark
                            ? 'bg-slate-900/70 border-white/10 hover:border-amber-400/40'
                            : 'bg-white border-amber-200/80 hover:border-amber-400 shadow-xs'
                        }`}
                      >
                        {/* Top: Rank Position & Attempt Badge */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-black shadow-xs flex items-center gap-1 ${
                              isTop1
                                ? 'bg-amber-400 text-amber-950'
                                : isTop2
                                ? 'bg-slate-200 text-slate-800'
                                : isTop3
                                ? 'bg-amber-600 text-white'
                                : isDark
                                ? 'bg-purple-950/80 text-purple-300 border border-purple-800'
                                : 'bg-purple-100 text-purple-900 border border-purple-200'
                            }`}
                          >
                            <span>
                              {isTop1 ? '🥇 1º Lugar' : isTop2 ? '🥈 2º Lugar' : isTop3 ? '🥉 3º Lugar' : `🐾 ${rank}º Lugar`}
                            </span>
                          </span>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isDark ? 'bg-white/10 text-amber-300' : 'bg-amber-100 text-amber-900'}`}>
                            🐾 {student.attemptsCount}/5 jogadas
                          </span>
                        </div>

                        {/* Student Info: Avatar + Name + Class */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="relative flex-shrink-0">
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className={`w-12 h-12 rounded-full object-cover border-2 student-avatar-zoom transition-transform duration-300 ease-out hover:scale-150 cursor-pointer hover:shadow-2xl hover:z-40 relative ${
                                isTop1
                                  ? 'border-amber-400 shadow-md ring-2 ring-amber-400/40'
                                  : isTop2
                                  ? 'border-slate-300'
                                  : isTop3
                                  ? 'border-amber-600'
                                  : 'border-purple-400/50'
                              }`}
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black flex items-center justify-center shadow">
                              🐾
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className={`text-sm font-extrabold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {student.name}
                            </h4>
                            <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              {student.className}
                            </p>
                            <span className={`text-[10px] font-mono block ${isDark ? 'text-amber-400/80' : 'text-amber-700'}`}>
                              {student.code}
                            </span>
                          </div>
                        </div>

                        {/* Metrics: Points & Accuracy */}
                        <div className={`p-2.5 rounded-xl mb-2.5 flex items-center justify-between text-xs ${isDark ? 'bg-black/30 border border-white/5' : 'bg-amber-50/80 border border-amber-200/60'}`}>
                          <div>
                            <span className={`text-[10px] font-semibold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pontuação</span>
                            <span className="font-black text-amber-500 dark:text-amber-300 text-sm flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span>{student.score.toLocaleString()} pts</span>
                            </span>
                          </div>

                          <div className="text-right">
                            <span className={`text-[10px] font-semibold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Acertos</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1 justify-end">
                              <Target className="w-3 h-3" />
                              <span>{student.correctAnswers} certas</span>
                            </span>
                          </div>
                        </div>

                        {/* Books Answered */}
                        <div className="pt-2 border-t border-white/10 text-[11px]">
                          <span className={`text-[10px] font-bold block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            📖 Livro(s) Respondido(s):
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {student.booksAnswered.length > 0 ? (
                              student.booksAnswered.slice(0, 2).map((bk, bIdx) => (
                                <span
                                  key={bIdx}
                                  className={`px-2 py-0.5 rounded-md font-semibold text-[10px] truncate max-w-[170px] ${
                                    isDark ? 'bg-purple-950/60 text-purple-200 border border-purple-800/60' : 'bg-purple-100 text-purple-900 border border-purple-200'
                                  }`}
                                  title={bk}
                                >
                                  {bk}
                                </span>
                              ))
                            ) : (
                              <span className={`text-[10px] italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Quiz Geral
                              </span>
                            )}
                            {student.booksAnswered.length > 2 && (
                              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
                                +{student.booksAnswered.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* View More / View Less Toggle if more than 4 students */}
                {quiterioAchievers.length > 4 && (
                  <div className="relative z-10 flex justify-center mt-5">
                    <button
                      type="button"
                      onClick={() => setShowAllQuiterio((prev) => !prev)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        isDark
                          ? 'bg-slate-900/80 hover:bg-slate-800 text-amber-300 border-amber-400/30'
                          : 'bg-white hover:bg-amber-50 text-amber-900 border-amber-300 shadow-sm'
                      }`}
                    >
                      <span>
                        {showAllQuiterio
                          ? 'Mostrar menos alunos'
                          : `Ver todos os ${quiterioAchievers.length} alunos que responderam`}
                      </span>
                      {showAllQuiterio ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ===================================================================== */}
        {/* PODIUM DOS CAMPEÕES DE LEITURA (TOP 3 ALUNOS)                         */}
        {/* ===================================================================== */}
        <div className="mb-10">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pódio de Honra aos Leitores 2026</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-end max-w-4xl mx-auto">
            {/* 2º LUGAR (PRATA) */}
            {top2 && (
              <div
                className={`order-2 md:order-1 rounded-2xl p-5 border text-center transition-all shadow-md relative ${
                  isDark ? 'bg-[#061e2f] border-slate-400/30' : 'bg-white border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-900 font-black text-sm flex items-center justify-center mx-auto mb-3 shadow-md border-2 border-white">
                  2º
                </div>
                <div className="w-16 h-16 rounded-full mx-auto p-1 bg-gradient-to-tr from-slate-400 to-slate-200 shadow-md mb-2.5 group">
                  <img
                    src={top2.avatar}
                    alt={top2.name}
                    className="w-full h-full object-cover rounded-full bg-slate-800 student-avatar-zoom transition-transform duration-300 ease-out hover:scale-150 cursor-pointer shadow-lg hover:shadow-2xl hover:z-40 relative"
                  />
                </div>
                <h3 className={`font-bold text-base truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {top2.name}
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{top2.class}</p>
                <div className="mt-3 py-1.5 px-3 rounded-xl bg-slate-500/10 text-slate-300 inline-flex flex-col items-center gap-0.5 font-bold text-xs">
                  <span>🥈 {top2.totalCount} {top2.totalCount === 1 ? 'livro lido' : 'livros lidos'}</span>
                  {top2.quiterioScore > 0 && (
                    <span className="text-[10px] text-amber-400 font-extrabold flex items-center gap-1">
                      <Cat className="w-3 h-3" /> +{top2.quiterioScore} pts
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 1º LUGAR (OURO - MAIS ALTO) */}
            {top1 && (
              <div
                className={`order-1 md:order-2 rounded-2xl p-6 border text-center transition-all shadow-xl relative -mt-4 md:-mt-8 ${
                  isDark
                    ? 'bg-gradient-to-b from-[#092b42] to-[#051824] border-amber-500/50 shadow-amber-500/10 ring-2 ring-amber-400/30'
                    : 'bg-gradient-to-b from-amber-50 to-white border-amber-300 shadow-lg'
                }`}
              >
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black uppercase mb-3 shadow">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Campeão Geral</span>
                </div>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto p-1.5 bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 shadow-lg mb-3 group">
                  <img
                    src={top1.avatar}
                    alt={top1.name}
                    className="w-full h-full object-cover rounded-full bg-slate-800 student-avatar-zoom transition-transform duration-300 ease-out hover:scale-150 cursor-pointer shadow-xl hover:shadow-2xl hover:rotate-2 hover:z-40 relative"
                  />
                </div>
                <h3 className={`font-extrabold text-lg sm:text-xl truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {top1.name}
                </h3>
                <p className={`text-xs font-semibold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                  Turma {top1.class}
                </p>
                <div className="mt-3.5 py-2 px-4 rounded-xl bg-amber-500 text-slate-950 font-black text-sm inline-flex flex-col items-center gap-0.5 shadow-md">
                  <span>🥇 {top1.totalCount} {top1.totalCount === 1 ? 'livro emprestado' : 'livros emprestados'}</span>
                  {top1.quiterioScore > 0 && (
                    <span className="text-[10px] bg-amber-950/20 text-amber-950 font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Cat className="w-3 h-3" /> Missão: +{top1.quiterioScore} pts
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 3º LUGAR (BRONZE) */}
            {top3 && (
              <div
                className={`order-3 rounded-2xl p-5 border text-center transition-all shadow-md relative ${
                  isDark ? 'bg-[#061e2f] border-amber-700/30' : 'bg-white border-amber-200'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-black text-sm flex items-center justify-center mx-auto mb-3 shadow-md border-2 border-white">
                  3º
                </div>
                <div className="w-16 h-16 rounded-full mx-auto p-1 bg-gradient-to-tr from-amber-700 to-amber-500 shadow-md mb-2.5 group">
                  <img
                    src={top3.avatar}
                    alt={top3.name}
                    className="w-full h-full object-cover rounded-full bg-slate-800 student-avatar-zoom transition-transform duration-300 ease-out hover:scale-150 cursor-pointer shadow-lg hover:shadow-2xl hover:z-40 relative"
                  />
                </div>
                <h3 className={`font-bold text-base truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {top3.name}
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{top3.class}</p>
                <div className="mt-3 py-1.5 px-3 rounded-xl bg-amber-600/10 text-amber-500 inline-flex flex-col items-center gap-0.5 font-bold text-xs">
                  <span>🥉 {top3.totalCount} {top3.totalCount === 1 ? 'livro lido' : 'livros lidos'}</span>
                  {top3.quiterioScore > 0 && (
                    <span className="text-[10px] text-amber-400 font-extrabold flex items-center gap-1">
                      <Cat className="w-3 h-3" /> +{top3.quiterioScore} pts
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs (Geral / Leitores / Livros) */}
        <div className="flex items-center justify-center mb-8">
          <div
            className={`inline-flex p-1 rounded-2xl border ${
              isDark ? 'bg-[#092032] border-[#163650]' : 'bg-slate-200/80 border-slate-300'
            }`}
          >
            <button
              onClick={() => setActiveTab('geral')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'geral'
                  ? 'bg-[#23c65e] text-white shadow-sm'
                  : isDark
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              Visão Geral Dupla
            </button>
            <button
              onClick={() => setActiveTab('alunos')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'alunos'
                  ? 'bg-[#23c65e] text-white shadow-sm'
                  : isDark
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              Ranking de Alunos ({students.length})
            </button>
            <button
              onClick={() => setActiveTab('livros')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'livros'
                  ? 'bg-[#23c65e] text-white shadow-sm'
                  : isDark
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              Livros Mais Lidos ({books.length})
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* TAB 1: VISÃO GERAL DUPLA (FIEL À IMAGEM DO USUÁRIO)                  */}
        {/* ===================================================================== */}
        {activeTab === 'geral' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CARD ESQUERDO: RANKING DE LEITORES */}
            <div
              className={`rounded-2xl p-5 sm:p-7 border shadow-md ${
                isDark ? 'bg-[#001424] border-[#163650]' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight flex items-center gap-2.5">
                  <span className="text-2xl">🏆</span>
                  <span>Ranking de leitores</span>
                </h2>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${isDark ? 'bg-[#092032] text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                  {fullStudentRanking.length} alunos
                </span>
              </div>

              <div className="space-y-2.5">
                {fullStudentRanking.slice(0, 10).map((st, index) => {
                  const pos = index + 1;
                  return (
                    <div
                      key={st.id}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                        isDark
                          ? pos === 1
                            ? 'bg-[#09263a] border-amber-500/40'
                            : 'bg-[#051a2a]/80 border-[#122e44] hover:bg-[#092237]'
                          : pos === 1
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 flex items-center justify-center shrink-0">
                          {pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : (
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              isDark ? 'bg-[#092032] text-slate-400' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {pos}
                            </span>
                          )}
                        </div>

                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-700 bg-slate-800 student-avatar-zoom transition-transform duration-300 ease-out hover:scale-150 hover:shadow-2xl cursor-pointer hover:z-40 relative"
                        />

                        <div className="min-w-0">
                          <h3 className={`text-sm font-semibold truncate ${pos === 1 ? 'font-bold' : ''}`}>
                            {st.name}
                          </h3>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{st.class}</p>
                        </div>
                      </div>

                      <div className="shrink-0 pl-2 text-right">
                        <span className={`text-xs font-bold block ${pos === 1 ? 'text-amber-400' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {st.totalCount} {st.totalCount === 1 ? 'livro' : 'livros'}
                        </span>
                        {st.quiterioScore > 0 && (
                          <span className="text-[10px] text-amber-400 font-bold flex items-center justify-end gap-1">
                            <Cat className="w-3 h-3" /> +{st.quiterioScore} pts
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CARD DIREITO: MAIS LIDOS */}
            <div
              className={`rounded-2xl p-5 sm:p-7 border shadow-md ${
                isDark ? 'bg-[#001424] border-[#163650]' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight flex items-center gap-2.5">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                  <span>Mais lidos</span>
                </h2>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${isDark ? 'bg-[#092032] text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                  {fullBookRanking.length} livros
                </span>
              </div>

              <div className="space-y-2.5">
                {fullBookRanking.slice(0, 10).map((bk, index) => {
                  const pos = index + 1;
                  return (
                    <div
                      key={bk.id}
                      onClick={() => onSelectBook(bk)}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer group ${
                        isDark
                          ? pos === 1
                            ? 'bg-[#06242a] border-emerald-500/40 hover:border-emerald-400'
                            : 'bg-[#051a2a]/80 border-[#122e44] hover:bg-[#092237]'
                          : pos === 1
                          ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-6 flex items-center justify-center shrink-0">
                          <span className={`text-xs sm:text-sm font-bold ${pos === 1 ? 'text-emerald-400 text-base' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {pos}
                          </span>
                        </div>

                        <div className="min-w-0 pr-2">
                          <h3 className={`text-sm font-semibold truncate group-hover:underline ${isDark ? 'text-white group-hover:text-emerald-400' : 'text-slate-900 group-hover:text-emerald-700'}`}>
                            {bk.title}
                          </h3>
                          <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{bk.author}</p>
                        </div>
                      </div>

                      <div className="shrink-0 pl-2">
                        <span className={`text-xs font-semibold ${pos === 1 ? 'text-emerald-400 font-bold' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {bk.totalLoans} empr.
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: RANKING COMPLETO DE ALUNOS COM FILTROS                         */}
        {/* ===================================================================== */}
        {activeTab === 'alunos' && (
          <div
            className={`rounded-2xl p-5 sm:p-7 border shadow-md ${
              isDark ? 'bg-[#001424] border-[#163650]' : 'bg-white border-slate-200'
            }`}
          >
            {/* Filters Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  placeholder="Buscar aluno por nome ou código..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none ${
                    isDark
                      ? 'bg-[#092032] border-[#163650] text-white focus:border-emerald-500'
                      : 'bg-white border-slate-200 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>

              {/* Class Selector */}
              <div className="relative">
                <Filter className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className={`w-full pl-10 pr-8 py-2.5 rounded-xl text-xs sm:text-sm border appearance-none focus:outline-none ${
                    isDark
                      ? 'bg-[#092032] border-[#163650] text-white focus:border-emerald-500'
                      : 'bg-white border-slate-200 text-slate-900 focus:border-emerald-500'
                  }`}
                >
                  <option value="all">Todas as turmas</option>
                  {classesList.map((c) => (
                    <option key={c} value={c}>
                      Turma: {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Order Selector (Ranking vs Alfabetica) */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setStudentSortOrder('ranking')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                    studentSortOrder === 'ranking'
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-500 shadow-xs'
                      : isDark
                      ? 'bg-[#092032] text-slate-400 border-[#163650] hover:text-white'
                      : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                  }`}
                  title="Ordenar por Pontuação / Posição no Ranking"
                >
                  🏆 Ranking
                </button>
                <button
                  type="button"
                  onClick={() => setStudentSortOrder('alfabetica')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                    studentSortOrder === 'alfabetica'
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-500 shadow-xs'
                      : isDark
                      ? 'bg-[#092032] text-slate-400 border-[#163650] hover:text-white'
                      : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                  }`}
                  title="Ordenar Alunos em Ordem Alfabética (A-Z)"
                >
                  🔤 A-Z
                </button>
              </div>

              {/* Counter tag */}
              <div className="flex items-center justify-end">
                <span className={`text-xs font-semibold px-3 py-2 rounded-xl border ${isDark ? 'bg-[#092032] border-[#163650] text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                  Exibindo {filteredStudents.length} de {students.length} leitores
                </span>
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className={`border-b text-[11px] uppercase tracking-wider ${isDark ? 'border-[#163650] text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                    <th className="py-3 px-3">Posição</th>
                    <th className="py-3 px-3">Aluno</th>
                    <th className="py-3 px-3">Turma</th>
                    <th className="py-3 px-3 text-center">Em Andamento</th>
                    <th className="py-3 px-3 text-center">Devolvidos</th>
                    <th className="py-3 px-3 text-center">Missão Quitério</th>
                    <th className="py-3 px-3 text-right">Total de Leituras</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-[#163650]/40' : 'divide-slate-100'}`}>
                  {filteredStudents.map((st, index) => {
                    const pos = index + 1;
                    return (
                      <tr
                        key={st.id}
                        className={`hover:bg-emerald-500/5 transition-colors ${
                          pos === 1 && isDark ? 'bg-amber-500/5' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-bold">
                          {pos === 1 ? '🥇 1º' : pos === 2 ? '🥈 2º' : pos === 3 ? '🥉 3º' : `${pos}º`}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={st.avatar}
                              alt={st.name}
                              className="w-8 h-8 rounded-full object-cover bg-slate-800 student-avatar-zoom transition-transform duration-300 ease-out hover:scale-150 hover:shadow-2xl cursor-pointer hover:z-40 relative"
                            />
                            <div>
                              <span className="font-bold block text-slate-100">{st.name}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-md font-medium text-xs ${isDark ? 'bg-[#092032] text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                            {st.class}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-semibold text-amber-400">
                          {st.activeLoans}
                        </td>
                        <td className="py-3 px-3 text-center font-semibold text-emerald-400">
                          {st.returnedLoans}
                        </td>
                        <td className="py-3 px-3 text-center font-semibold text-amber-400">
                          {st.quiterioScore > 0 ? (
                            <span className="inline-flex items-center gap-1 font-bold text-amber-400">
                              <Cat className="w-3.5 h-3.5" /> +{st.quiterioScore} pts
                            </span>
                          ) : (
                            <span className="text-slate-500 text-xs">-</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-black text-emerald-400 text-sm">
                          {st.totalCount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: RANKING COMPLETO DE LIVROS COM BUSCA                           */}
        {/* ===================================================================== */}
        {activeTab === 'livros' && (
          <div
            className={`rounded-2xl p-5 sm:p-7 border shadow-md ${
              isDark ? 'bg-[#001424] border-[#163650]' : 'bg-white border-slate-200'
            }`}
          >
            {/* Search Bar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="relative max-w-md w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchBook}
                  onChange={(e) => setSearchBook(e.target.value)}
                  placeholder="Buscar livros no ranking por título ou autor..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none ${
                    isDark
                      ? 'bg-[#092032] border-[#163650] text-white focus:border-emerald-500'
                      : 'bg-white border-slate-200 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>

              <div className="flex items-center gap-3">
                {/* Order Selector (Ranking vs Alfabetica) */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setBookSortOrder('ranking')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                      bookSortOrder === 'ranking'
                        ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-500 shadow-xs'
                        : isDark
                        ? 'bg-[#092032] text-slate-400 border-[#163650] hover:text-white'
                        : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                    }`}
                    title="Ordenar por Mais Lidos / Empréstimos"
                  >
                    🏆 Mais Lidos
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookSortOrder('alfabetica')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                      bookSortOrder === 'alfabetica'
                        ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-500 shadow-xs'
                        : isDark
                        ? 'bg-[#092032] text-slate-400 border-[#163650] hover:text-white'
                        : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                    }`}
                    title="Ordenar Livros em Ordem Alfabética (A-Z)"
                  >
                    🔤 A-Z
                  </button>
                </div>

                <span className={`text-xs font-semibold px-3 py-2 rounded-xl border ${isDark ? 'bg-[#092032] border-[#163650] text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                  {filteredBooks.length} obras cadastradas
                </span>
              </div>
            </div>

            {/* Grid of Books */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredBooks.map((bk, index) => {
                const pos = index + 1;
                return (
                  <div
                    key={bk.id}
                    onClick={() => onSelectBook(bk)}
                    className={`rounded-2xl p-3.5 border transition-all cursor-pointer group flex flex-col justify-between ${
                      isDark
                        ? pos === 1
                          ? 'bg-[#06242a] border-emerald-500/50 shadow-md'
                          : 'bg-[#092032] border-[#163650] hover:border-emerald-500/40'
                        : pos === 1
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                          pos === 1
                            ? 'bg-emerald-500 text-slate-950 font-extrabold'
                            : isDark
                            ? 'bg-[#001424] text-slate-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          #{pos} Mais Lido
                        </span>
                        <span className="text-xs font-bold text-emerald-400">
                          {bk.totalLoans} empréstimos
                        </span>
                      </div>

                      <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-slate-800">
                        <img
                          src={bk.cover}
                          alt={bk.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>

                      <h3 className={`text-sm font-bold truncate group-hover:underline ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {bk.title}
                      </h3>
                      <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {bk.author}
                      </p>
                    </div>

                    <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-xs ${isDark ? 'border-[#163650]' : 'border-slate-100'}`}>
                      <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{bk.category}</span>
                      <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{bk.rating}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
