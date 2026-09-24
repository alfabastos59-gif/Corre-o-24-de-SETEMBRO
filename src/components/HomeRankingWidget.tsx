import React from 'react';
import {
  Trophy,
  TrendingUp,
  Sparkles,
  BookOpen,
  Award,
  ChevronRight,
  Flame,
  Star,
  Users,
  GraduationCap,
  Bookmark
} from 'lucide-react';
import { Book, Loan, Student } from '../types';
import { useTheme } from '../context/ThemeContext';

interface HomeRankingWidgetProps {
  books: Book[];
  loans: Loan[];
  students: Student[];
  onSelectBook: (book: Book) => void;
  onViewFullRanking: () => void;
  onSelectStudent?: (student: Student) => void;
}

export const HomeRankingWidget: React.FC<HomeRankingWidgetProps> = ({
  books,
  loans,
  students,
  onSelectBook,
  onViewFullRanking,
}) => {
  const { isDark, isPurple, isEmerald } = useTheme();

  // 1. Calculate dynamic student ranking based on real loans
  const studentRanking = React.useMemo(() => {
    return students
      .map((student) => {
        // Count actual loans for this student
        const studentLoans = loans.filter((l) => {
          const nameMatch = l.studentName && student.name && l.studentName.trim().toLowerCase() === student.name.trim().toLowerCase();
          const emailMatch = l.studentEmail && student.email && l.studentEmail.trim().toLowerCase() === student.email.trim().toLowerCase();
          const codeMatch = l.studentCode && student.studentCode && l.studentCode.trim().toLowerCase() === student.studentCode.trim().toLowerCase();
          return nameMatch || emailMatch || codeMatch;
        });

        // Use maximum of calculated loans or student.totalLoansCount to respect initial records
        const calculatedCount = studentLoans.length;
        const totalCount = Math.max(calculatedCount, student.totalLoansCount || 0);

        return {
          ...student,
          totalCount,
        };
      })
      .sort((a, b) => {
        if (b.totalCount !== a.totalCount) {
          return b.totalCount - a.totalCount;
        }
        return a.name.localeCompare(b.name);
      });
  }, [students, loans]);

  // 2. Calculate dynamic book ranking based on real loans
  const bookRanking = React.useMemo(() => {
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
        if (b.totalLoans !== a.totalLoans) {
          return b.totalLoans - a.totalLoans;
        }
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        return a.title.localeCompare(b.title);
      });
  }, [books, loans]);

  // Top Student and Top Book
  const topStudent = studentRanking[0] || null;
  const topBook = bookRanking[0] || null;

  // Limit to top 7 for the widget view matching the uploaded screenshot
  const displayedStudents = studentRanking.slice(0, 7);
  const displayedBooks = bookRanking.slice(0, 7);

  return (
    <section className="mt-12 sm:mt-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2 bg-amber-500/10 text-amber-500 border border-amber-500/30">
            <Trophy className="w-3.5 h-3.5" />
            <span>Painel de Reconhecimento Escolar</span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Líderes de Leitura & Obras em Alta
          </h2>
          <p className={`text-sm mt-1 max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Acompanhe o engajamento dos alunos e os livros mais requisitados da nossa biblioteca em tempo real.
          </p>
        </div>

        <button
          id="btn-ver-ranking-completo"
          onClick={onViewFullRanking}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm shrink-0 border ${
            isPurple
              ? 'bg-[#240f47] hover:bg-[#32145e] text-[#c084fc] border-[#3e196e] hover:border-[#a855f7]'
              : isDark
              ? 'bg-[#092032] hover:bg-[#0f2e46] text-emerald-400 border-[#163650] hover:border-emerald-500/50'
              : 'bg-white hover:bg-slate-50 text-emerald-700 border-slate-200 hover:border-emerald-300'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Ver Ranking Completo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. DESTAQUE PRINCIPAL LADO A LADO: TOP ALUNO + LIVRO MAIS EMPRESTADO      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* CARD DESTAQUE 1: ALUNO QUE MAIS PEGA EMPRÉSTIMO */}
        {topStudent && (
          <div
            id="card-top-aluno-destaque"
            className={`relative rounded-2xl p-6 border transition-all duration-300 overflow-hidden shadow-lg ${
              isEmerald
                ? 'bg-gradient-to-br from-[#062438] via-[#083049] to-[#041c2c] border-amber-500/40 shadow-amber-500/5'
                : isPurple
                ? 'bg-gradient-to-br from-[#240f47] via-[#2f135b] to-[#1e0a3c] border-amber-500/40 shadow-amber-500/5'
                : isDark
                ? 'bg-gradient-to-br from-[#061b2b] via-[#092237] to-[#041320] border-amber-500/40 shadow-amber-500/5'
                : 'bg-gradient-to-br from-amber-50/70 via-white to-amber-50/40 border-amber-300 shadow-sm'
            }`}
          >
            {/* Ambient gold glow decoration */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-md">
                  <Trophy className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Top Leitor da Escola</span>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${
                    isDark
                      ? 'bg-[#001424]/80 border-amber-500/30 text-amber-300'
                      : 'bg-white border-amber-200 text-amber-800'
                  }`}
                >
                  🥇 1º Lugar no Ranking
                </span>
              </div>

              {/* Main Content Info */}
              <div className="flex items-center gap-4 sm:gap-5">
                {/* Student Avatar with Crown/Gold Ring */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 shadow-lg group">
                    <img
                      src={topStudent.avatar}
                      alt={topStudent.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(
                          topStudent.name
                        )}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
                      }}
                      className="w-full h-full object-cover rounded-xl bg-slate-800 student-avatar-zoom transition-transform duration-300 ease-out hover:scale-150 cursor-pointer shadow-md hover:shadow-2xl hover:z-40 relative"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-1 bg-amber-400 text-slate-950 text-xs font-extrabold w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                    1º
                  </div>
                </div>

                {/* Text Info */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-lg sm:text-xl font-bold truncate ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {topStudent.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-md font-medium ${
                        isDark ? 'bg-[#0d2a42] text-slate-300' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Turma: <strong>{topStudent.class}</strong></span>
                    </span>
                  </div>

                  {/* Highlights Metric */}
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-amber-400 leading-none">
                      {topStudent.totalCount}
                    </span>
                    <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {topStudent.totalCount === 1 ? 'livro emprestado' : 'livros emprestados'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer status / message */}
              <div
                className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${
                  isDark ? 'border-[#163650] text-slate-400' : 'border-amber-200/80 text-slate-600'
                }`}
              >
                <span className="flex items-center gap-1.5 font-medium text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Leitor Mais Ativo da Biblioteca</span>
                </span>
                <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Membro desde {topStudent.joinedDate || '2026'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* CARD DESTAQUE 2: LIVRO QUE MAIS É EMPRESTADO */}
        {topBook && (
          <div
            id="card-top-livro-destaque"
            className={`relative rounded-2xl p-6 border transition-all duration-300 overflow-hidden shadow-lg ${
              isEmerald
                ? 'bg-gradient-to-br from-[#052924] via-[#083832] to-[#031d1a] border-[#00e676]/40 shadow-[0_10px_30px_rgba(0,230,118,0.1)]'
                : isPurple
                ? 'bg-gradient-to-br from-[#240c49] via-[#320f5c] to-[#1a0733] border-purple-500/40 shadow-purple-500/5'
                : isDark
                ? 'bg-gradient-to-br from-[#061e27] via-[#082a35] to-[#04151b] border-emerald-500/40 shadow-emerald-500/5'
                : 'bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/40 border-emerald-300 shadow-sm'
            }`}
          >
            {/* Ambient emerald glow decoration */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#23c65e] text-white shadow-md">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  <span>Livro Mais Emprestado</span>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${
                    isDark
                      ? 'bg-[#001424]/80 border-emerald-500/30 text-emerald-300'
                      : 'bg-white border-emerald-200 text-emerald-800'
                  }`}
                >
                  🔥 Campeão de Leituras
                </span>
              </div>

              {/* Main Content Info */}
              <div className="flex items-center gap-4 sm:gap-5">
                {/* Book Cover */}
                <div
                  onClick={() => onSelectBook(topBook)}
                  className="relative shrink-0 cursor-pointer group"
                >
                  <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden shadow-md border border-emerald-500/40 bg-slate-900 group-hover:scale-105 transition-transform duration-200">
                    <img
                      src={topBook.cover}
                      alt={topBook.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md shadow-md">
                    Top 1
                  </div>
                </div>

                {/* Text Info */}
                <div className="flex-1 min-w-0">
                  <h3
                    onClick={() => onSelectBook(topBook)}
                    className={`text-lg sm:text-xl font-bold truncate cursor-pointer hover:underline ${
                      isDark ? 'text-white hover:text-emerald-400' : 'text-slate-900 hover:text-emerald-600'
                    }`}
                  >
                    {topBook.title}
                  </h3>
                  <p className={`text-xs font-medium truncate mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Por <strong className="text-emerald-400">{topBook.author}</strong>
                  </p>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                        isDark ? 'bg-[#0d2a42] text-slate-300' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {topBook.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{topBook.rating}</span>
                    </div>
                  </div>

                  {/* Highlights Metric */}
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400 leading-none">
                      {topBook.totalLoans}
                    </span>
                    <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {topBook.totalLoans === 1 ? 'empréstimo registrado' : 'empréstimos registrados'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer action button */}
              <div
                className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${
                  isDark ? 'border-[#163650]' : 'border-emerald-200/80'
                }`}
              >
                <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {topBook.availableCopies > 0 ? (
                    <strong className="text-emerald-400">● {topBook.availableCopies} disponíveis</strong>
                  ) : (
                    <strong className="text-amber-400">● Em circulação</strong>
                  )}
                </span>
                <button
                  onClick={() => onSelectBook(topBook)}
                  className={`font-bold flex items-center gap-1 text-xs transition-colors cursor-pointer ${
                    isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-700 hover:text-emerald-800'
                  }`}
                >
                  <span>Ver Detalhes do Livro</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. DUAL RANKING SECTION (MATCHING THE UPLOADED SCREENSHOT)                 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ===================================================================== */}
        {/* COLUNA ESQUERDA: RANKING DE LEITORES                                  */}
        {/* ===================================================================== */}
        <div
          id="ranking-de-leitores-card"
          className={`rounded-2xl p-4 sm:p-6 border transition-all shadow-md ${
            isEmerald
              ? 'bg-[#062438] border-[#0c4061]'
              : isPurple
              ? 'bg-[#1c0b3d] border-[#3e196e]'
              : isDark
              ? 'bg-[#001424] border-[#163650]'
              : 'bg-white border-slate-200'
          }`}
        >
          {/* Header matching image: 🏆 Ranking de leitores */}
          <div className="flex items-center justify-between mb-5">
            <h3
              className={`text-xl sm:text-2xl font-serif font-bold tracking-tight flex items-center gap-2.5 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              <span className="text-xl sm:text-2xl">🏆</span>
              <span>Ranking de leitores</span>
            </h3>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                isEmerald
                  ? 'bg-[#0c4061] text-[#00e676] border border-[#00e676]/30'
                  : isPurple
                  ? 'bg-[#2e105e] text-purple-300 border border-[#a855f7]/40'
                  : isDark
                  ? 'bg-[#092032] text-slate-400 border border-[#163650]'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              Top Leitores
            </span>
          </div>

          {/* Readers List */}
          <div className="space-y-2.5">
            {displayedStudents.map((st, index) => {
              const position = index + 1;
              const isFirst = position === 1;
              const isSecond = position === 2;
              const isThird = position === 3;

              return (
                <div
                  key={st.id}
                  id={`ranking-reader-row-${st.id}`}
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-200 border ${
                    isEmerald
                      ? isFirst
                        ? 'bg-[#0a3550] border-amber-500/40 shadow-sm shadow-amber-500/5'
                        : 'bg-[#041a29]/80 border-[#0a2e46] hover:bg-[#08283f] hover:border-[#0c4061]'
                      : isPurple
                      ? isFirst
                        ? 'bg-[#291054] border-amber-500/40 shadow-sm shadow-amber-500/10'
                        : 'bg-[#210c44]/80 border-[#381665] hover:bg-[#2b1057] hover:border-[#a855f7]/50'
                      : isDark
                      ? isFirst
                        ? 'bg-[#09263a]/90 border-amber-500/40 shadow-sm shadow-amber-500/5'
                        : 'bg-[#051a2a]/80 border-[#122e44] hover:bg-[#092237] hover:border-[#1a4464]'
                      : isFirst
                      ? 'bg-amber-50/80 border-amber-200'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Position Medal / Number */}
                    <div className="w-7 sm:w-8 flex items-center justify-center shrink-0">
                      {isFirst ? (
                        <span className="text-xl sm:text-2xl leading-none select-none" title="1º Lugar">
                          🥇
                        </span>
                      ) : isSecond ? (
                        <span className="text-xl sm:text-2xl leading-none select-none" title="2º Lugar">
                          🥈
                        </span>
                      ) : isThird ? (
                        <span className="text-xl sm:text-2xl leading-none select-none" title="3º Lugar">
                          🥉
                        </span>
                      ) : (
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isDark ? 'text-slate-400 bg-[#092032]' : 'text-slate-500 bg-slate-200'
                          }`}
                        >
                          {position}
                        </span>
                      )}
                    </div>

                    {/* Student Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={st.avatar}
                        alt={st.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(
                            st.name
                          )}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
                        }}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border student-avatar-zoom transition-transform duration-300 ease-out hover:scale-150 hover:shadow-2xl hover:z-40 cursor-pointer relative ${
                          isFirst
                            ? 'border-amber-400 ring-2 ring-amber-400/30'
                            : isDark
                            ? 'border-[#163650] bg-slate-800'
                            : 'border-slate-200 bg-white'
                        }`}
                      />
                    </div>

                    {/* Student Name and Class */}
                    <div className="min-w-0">
                      <h4
                        className={`text-sm font-semibold truncate ${
                          isDark ? 'text-slate-100' : 'text-slate-900'
                        } ${isFirst ? 'font-bold' : ''}`}
                      >
                        {st.name}
                      </h4>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {st.class}
                      </p>
                    </div>
                  </div>

                  {/* Loan Count Tag (e.g. "6 livros", "1 livro", "0 livros") */}
                  <div className="shrink-0 pl-2">
                    <span
                      className={`text-xs font-bold ${
                        isFirst
                          ? 'text-amber-400 font-extrabold'
                          : isDark
                          ? 'text-slate-300'
                          : 'text-slate-700'
                      }`}
                    >
                      {st.totalCount} {st.totalCount === 1 ? 'livro' : 'livros'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* COLUNA DIREITA: MAIS LIDOS                                            */}
        {/* ===================================================================== */}
        <div
          id="mais-lidos-card"
          className={`rounded-2xl p-4 sm:p-6 border transition-all shadow-md ${
            isEmerald
              ? 'bg-[#062438] border-[#0c4061]'
              : isPurple
              ? 'bg-[#1c0b3d] border-[#3e196e]'
              : isDark
              ? 'bg-[#001424] border-[#163650]'
              : 'bg-white border-slate-200'
          }`}
        >
          {/* Header matching image: 📈 Mais lidos */}
          <div className="flex items-center justify-between mb-5">
            <h3
              className={`text-xl sm:text-2xl font-serif font-bold tracking-tight flex items-center gap-2.5 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              <TrendingUp className={`w-5 h-5 sm:w-6 sm:h-6 ${isEmerald ? 'text-[#00e676]' : isPurple ? 'text-[#c084fc]' : 'text-emerald-400'}`} />
              <span>Mais lidos</span>
            </h3>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                isEmerald
                  ? 'bg-[#0c4061] text-[#00e676] border border-[#00e676]/30'
                  : isPurple
                  ? 'bg-[#2e105e] text-purple-300 border border-[#a855f7]/40'
                  : isDark
                  ? 'bg-[#092032] text-slate-400 border border-[#163650]'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              Top Livros
            </span>
          </div>

          {/* Books List */}
          <div className="space-y-2.5">
            {displayedBooks.map((bk, index) => {
              const position = index + 1;
              const isFirst = position === 1;

              return (
                <div
                  key={bk.id}
                  id={`ranking-book-row-${bk.id}`}
                  onClick={() => onSelectBook(bk)}
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-200 border cursor-pointer group ${
                    isEmerald
                      ? isFirst
                        ? 'bg-[#052924] border-[#00e676]/40 shadow-sm shadow-[#00e676]/10 hover:border-[#00e676]'
                        : 'bg-[#041a29]/80 border-[#0a2e46] hover:bg-[#08283f] hover:border-[#0c4061]'
                      : isPurple
                      ? isFirst
                        ? 'bg-[#2d0f52] border-purple-500/40 shadow-sm shadow-purple-500/10 hover:border-[#a855f7]'
                        : 'bg-[#210c44]/80 border-[#381665] hover:bg-[#2b1057] hover:border-[#a855f7]/50'
                      : isDark
                      ? isFirst
                        ? 'bg-[#06242a]/90 border-emerald-500/40 shadow-sm shadow-emerald-500/5 hover:border-emerald-400'
                        : 'bg-[#051a2a]/80 border-[#122e44] hover:bg-[#092237] hover:border-[#1a4464]'
                      : isFirst
                      ? 'bg-emerald-50/80 border-emerald-200 hover:bg-emerald-100/70'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Position Number */}
                    <div className="w-6 sm:w-7 flex items-center justify-center shrink-0">
                      <span
                        className={`text-xs sm:text-sm font-bold ${
                          isFirst
                            ? 'text-emerald-400 font-extrabold text-base'
                            : isDark
                            ? 'text-slate-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {position}
                      </span>
                    </div>

                    {/* Book Info */}
                    <div className="min-w-0 pr-2">
                      <h4
                        className={`text-sm font-semibold truncate group-hover:underline ${
                          isDark ? 'text-slate-100 group-hover:text-emerald-400' : 'text-slate-900 group-hover:text-emerald-700'
                        } ${isFirst ? 'font-bold' : ''}`}
                      >
                        {bk.title}
                      </h4>
                      <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {bk.author}
                      </p>
                    </div>
                  </div>

                  {/* Loans Count Tag (e.g. "2 empr.", "1 empr.") */}
                  <div className="shrink-0 pl-2">
                    <span
                      className={`text-xs font-semibold whitespace-nowrap ${
                        isFirst
                          ? 'text-emerald-400 font-bold'
                          : isDark
                          ? 'text-slate-300'
                          : 'text-slate-700'
                      }`}
                    >
                      {bk.totalLoans} {bk.totalLoans === 1 ? 'empr.' : 'empr.'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
