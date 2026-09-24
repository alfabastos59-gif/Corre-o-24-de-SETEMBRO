import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BookOpen,
  Award,
  BookMarked,
  Flame,
  Volume2,
  VolumeX,
  ChevronRight,
  GraduationCap,
  X,
  ShieldAlert,
  ArrowLeft,
  User,
  AlertCircle,
  Check,
} from 'lucide-react';
import { Book, Loan, Student, UserSession } from '../types';
import { useTheme } from '../context/ThemeContext';
import { QuiterioMascot, MascotMood } from './QuiterioMascot';
import { getQuestionsForBook, QuizQuestion } from '../data/quizQuestions';
import {
  getStudentGameData,
  addGamePoints,
  getTopSchoolRanking,
  recordAttemptCompletion,
  MAX_QUIZ_ATTEMPTS,
  StudentScoreData,
  BookScoreDetail,
} from '../utils/quiterioScores';
import {
  playCorrectSound,
  playWrongSound,
  playTickSound,
  playCatMeowSound,
  playCelebrationSound,
  setSoundEnabled,
} from '../utils/gameAudio';

interface MissaoQuiterioViewProps {
  books: Book[];
  loans: Loan[];
  students: Student[];
  currentSession: UserSession;
  onSelectBook?: (book: Book) => void;
  onNavigateToCatalog?: () => void;
  onNavigateToRanking?: () => void;
  onBackToHome?: () => void;
}

// 20 minutes timer per question/challenge (1200 seconds)
const QUESTION_TIMER_SECONDS = 1200;

export const MissaoQuiterioView: React.FC<MissaoQuiterioViewProps> = ({
  books,
  loans,
  students,
  currentSession,
  onNavigateToCatalog,
  onNavigateToRanking,
  onBackToHome,
}) => {
  const { isDark } = useTheme();

  // Student Identification State
  const initialStudent = currentSession.student || null;
  const [activeStudent, setActiveStudent] = useState<Student | null>(initialStudent);
  const [studentCodeInput, setStudentCodeInput] = useState<string>(
    initialStudent?.studentCode || ''
  );
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(!initialStudent);
  const [codeError, setCodeError] = useState<string>('');
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState<boolean>(false);
  const [isBookSelectorModalOpen, setIsBookSelectorModalOpen] = useState<boolean>(false);

  // Audio mute state
  const [soundOn, setSoundOn] = useState<boolean>(true);

  // Score & Gamification Data
  const [gameData, setGameData] = useState<StudentScoreData>(() => {
    const codeOrId = activeStudent?.studentCode || activeStudent?.id || 'anon';
    return getStudentGameData(codeOrId, activeStudent?.name || 'Estudante');
  });

  // Controls displaying the mascot's book-by-book scoreboard view
  const [showBookScoresView, setShowBookScoresView] = useState<boolean>(() => {
    const codeOrId = activeStudent?.studentCode || activeStudent?.id || 'anon';
    const initData = getStudentGameData(codeOrId, activeStudent?.name || 'Estudante');
    return (initData.attemptsCount || 0) >= MAX_QUIZ_ATTEMPTS;
  });

  const [leaderboard, setLeaderboard] = useState(() =>
    getTopSchoolRanking(activeStudent?.studentCode)
  );

  // Sync when student changes
  useEffect(() => {
    if (activeStudent) {
      const data = getStudentGameData(
        activeStudent.studentCode || activeStudent.id,
        activeStudent.name
      );
      setGameData(data);
      setLeaderboard(getTopSchoolRanking(activeStudent.studentCode));
      if ((data.attemptsCount || 0) >= MAX_QUIZ_ATTEMPTS) {
        setShowBookScoresView(true);
      }
    }
  }, [activeStudent]);

  // Cross-reference books borrowed or returned by this student
  const studentLoans = useMemo(() => {
    if (!activeStudent) return [];
    return loans.filter((l) => {
      const studentCodeNormalized = (activeStudent.studentCode || '').trim().toLowerCase().replace(/^alu-/, '');
      const loanCodeNormalized = (l.studentCode || '').trim().toLowerCase().replace(/^alu-/, '');
      const codeMatch =
        Boolean(studentCodeNormalized && loanCodeNormalized && studentCodeNormalized === loanCodeNormalized);

      const studentNameNormalized = (activeStudent.name || '').trim().toLowerCase();
      const loanNameNormalized = (l.studentName || '').trim().toLowerCase();
      const nameMatch =
        Boolean(studentNameNormalized && loanNameNormalized && studentNameNormalized === loanNameNormalized);

      const studentEmailNormalized = (activeStudent.email || '').trim().toLowerCase();
      const loanEmailNormalized = (l.studentEmail || '').trim().toLowerCase();
      const emailMatch =
        Boolean(studentEmailNormalized && loanEmailNormalized && studentEmailNormalized === loanEmailNormalized);

      const studentIdNormalized = (activeStudent.id || '').trim().toLowerCase();
      const loanIdMatch = Boolean(studentIdNormalized && loanCodeNormalized === studentIdNormalized);

      return codeMatch || nameMatch || emailMatch || loanIdMatch;
    });
  }, [activeStudent, loans]);

  // Unique books from student's loans (strictly the books the student has borrowed/read)
  const studentBooks = useMemo(() => {
    const map = new Map<string, { book: Book; loan: Loan }>();
    studentLoans.forEach((loan) => {
      const matchedBook =
        books.find((b) => b.id === loan.bookId) ||
        books.find((b) => b.title.toLowerCase() === loan.bookTitle.toLowerCase()) || {
          id: loan.bookId,
          title: loan.bookTitle,
          author: loan.bookAuthor,
          cover: loan.bookCover,
          category: 'Literatura',
          rating: 5,
          reviewsCount: 1,
          status: 'disponivel',
          pages: 100,
          year: 2026,
          publisher: 'Biblioteca',
          location: 'Geral',
          synopsis: `Obra emprestada por ${loan.studentName}.`,
          isbn: '000',
          totalCopies: 1,
          availableCopies: 1,
        };

      if (!map.has(matchedBook.title.toLowerCase())) {
        map.set(matchedBook.title.toLowerCase(), { book: matchedBook, loan });
      }
    });
    return Array.from(map.values());
  }, [studentLoans, books]);

  // Default book for quiz: Strictly drawn from the books the student has read
  const defaultBook = useMemo(() => {
    if (studentBooks.length > 0) return studentBooks[0].book;
    return (
      books[0] || {
        id: 'default_book',
        title: 'Livro da Biblioteca',
        author: 'Autor',
        cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&auto=format&fit=crop&q=80',
        category: 'Literatura',
        rating: 5,
        reviewsCount: 1,
        status: 'disponivel',
        pages: 100,
        year: 2026,
        publisher: 'Biblioteca',
        location: 'Geral',
        synopsis: 'Livro do acervo escolar.',
        isbn: '000',
        totalCopies: 1,
        availableCopies: 1,
      }
    );
  }, [books, studentBooks]);

  const [selectedBookForQuiz, setSelectedBookForQuiz] = useState<Book>(defaultBook);

  // Sync selected book when student books change: MUST always be one of the student's read books!
  useEffect(() => {
    if (studentBooks.length > 0) {
      const isAlreadyInStudentBooks = studentBooks.some(
        (sb) =>
          sb.book.id === selectedBookForQuiz?.id ||
          sb.book.title.toLowerCase() === selectedBookForQuiz?.title?.toLowerCase()
      );
      if (!isAlreadyInStudentBooks) {
        setSelectedBookForQuiz(studentBooks[0].book);
      }
    }
  }, [studentBooks, selectedBookForQuiz]);

  // Sync mascot speech bubble and mood based on student loan verification
  useEffect(() => {
    if (!activeStudent) {
      setSpeechBubbleText(
        'Miau! Identifique-se com seu código ou nome para cruzarmos seus empréstimos e liberar o Desafio! 🐾'
      );
      setMascotMood('talking');
    } else if (studentLoans.length === 0) {
      setSpeechBubbleText(
        'Miau! Identificamos que você ainda não tem livros emprestados. Por favor, leia um livro para participar do Desafio! 🐾'
      );
      setMascotMood('thinking');
    } else {
      setSpeechBubbleText(
        `Miau! Perguntas retiradas dos livros que você leu na biblioteca! Mostre o que você aprendeu com a leitura! 🐾`
      );
      setMascotMood('talking');
    }
  }, [activeStudent, studentLoans.length]);

  // Current Question Set - Exclusively derived from the selected read book!
  const currentQuestions: QuizQuestion[] = useMemo(() => {
    return getQuestionsForBook(selectedBookForQuiz);
  }, [selectedBookForQuiz]);

  // Quiz Game State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIMER_SECONDS);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const [roundCompleted, setRoundCompleted] = useState<boolean>(false);
  const [roundStats, setRoundStats] = useState({ correct: 0, pointsEarned: 0 });
  const [floatingScore, setFloatingScore] = useState<number | null>(null);
  const [coverHasError, setCoverHasError] = useState<boolean>(false);

  // Mascot Mood & Speech Bubble Text (Exact from video)
  const [mascotMood, setMascotMood] = useState<MascotMood>('talking');
  const [isMeowing, setIsMeowing] = useState<boolean>(false);
  const [speechBubbleText, setSpeechBubbleText] = useState<string>(
    'Vamos testar seu conhecimento sobre o livro que você leu? 🐾'
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeQuestion: QuizQuestion | undefined = currentQuestions[currentQuestionIndex];

  // Reset question state
  const startQuestion = (idx: number) => {
    setCurrentQuestionIndex(idx);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setTimeLeft(QUESTION_TIMER_SECONDS);
    setIsTimerActive(true);
    setMascotMood('talking');
    setIsMeowing(false);
    setSpeechBubbleText('Vamos testar seu conhecimento sobre o livro que você leu? 🐾');
    setFloatingScore(null);
    setCoverHasError(false);
  };

  const handlePetQuiterio = () => {
    if (soundOn) playCatMeowSound();
    setIsMeowing(true);
    setSpeechBubbleText('Miau!! 🐾 Quitério adora carinho e leitores dedicados!');
    setTimeout(() => {
      setIsMeowing(false);
    }, 2200);
  };

  // Timer countdown
  useEffect(() => {
    if (!isTimerActive || isAnswered || roundCompleted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeUp();
          return 0;
        }
        if (prev <= 6 && soundOn) {
          playTickSound();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive, isAnswered, roundCompleted, soundOn]);

  const handleTimeUp = () => {
    setIsAnswered(true);
    setIsCorrect(false);
    setIsTimerActive(false);
    setMascotMood('thinking');
    setSpeechBubbleText('O tempo acabou! Mas não desanime, o aprendizado continua! 🐾');
    if (soundOn) playWrongSound();
  };

  // Handle Option Click
  const handleSelectOption = (index: number) => {
    if (isAnswered || !activeQuestion) return;

    setIsAnswered(true);
    setIsTimerActive(false);
    setSelectedOption(index);

    const correct = index === activeQuestion.correctIndex;
    setIsCorrect(correct);

    const studentKey = activeStudent?.studentCode || activeStudent?.id || 'aluno_anonimo';
    const studentName = activeStudent?.name || 'Leitor Apaixonado';

    if (correct) {
      const totalPoints = 100;

      setFloatingScore(totalPoints);
      setMascotMood('celebrating');
      setIsMeowing(true);
      // Exact praise from user video
      setSpeechBubbleText('Miau!! 🐾 Você mandou bem! Continua lendo e acertando as perguntas!');

      if (soundOn) {
        playCorrectSound();
        setTimeout(() => {
          playCatMeowSound();
        }, 250);
      }

      // Confetti burst
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#fbbf24', '#34d399', '#f43f5e', '#a855f7'],
        });
      } catch {
        // Confetti fallback
      }

      // Persist score & update leaderboard
      const { updatedData } = addGamePoints(
        studentKey,
        studentName,
        totalPoints,
        true,
        selectedBookForQuiz.title,
        selectedBookForQuiz.author,
        selectedBookForQuiz.cover
      );
      setGameData(updatedData);
      setLeaderboard(getTopSchoolRanking(activeStudent?.studentCode));
      setRoundStats((prev) => ({
        correct: prev.correct + 1,
        pointsEarned: prev.pointsEarned + totalPoints,
      }));
    } else {
      setMascotMood('thinking');
      setIsMeowing(false);
      setSpeechBubbleText('Quase lá! Na próxima pergunta você brilha! Continue lendo! 🐾');

      if (soundOn) playWrongSound();

      const { updatedData } = addGamePoints(
        studentKey,
        studentName,
        0,
        false,
        selectedBookForQuiz.title,
        selectedBookForQuiz.author,
        selectedBookForQuiz.cover
      );
      setGameData(updatedData);
      setLeaderboard(getTopSchoolRanking(activeStudent?.studentCode));
    }
  };

  // Next Question or Complete with 5-attempt limit tracking
  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      startQuestion(currentQuestionIndex + 1);
    } else {
      const studentKey = activeStudent?.studentCode || activeStudent?.id || 'aluno_anonimo';
      const studentName = activeStudent?.name || 'Leitor Apaixonado';

      // Record completed attempt for this book (enforcing max 5 attempts)
      const { updatedData, isLimitReached } = recordAttemptCompletion(
        studentKey,
        studentName,
        selectedBookForQuiz.title,
        selectedBookForQuiz.author,
        selectedBookForQuiz.cover,
        roundStats.pointsEarned,
        roundStats.correct,
        currentQuestions.length
      );

      setGameData(updatedData);
      setLeaderboard(getTopSchoolRanking(activeStudent?.studentCode));
      setRoundCompleted(true);
      setIsTimerActive(false);

      if (isLimitReached) {
        setMascotMood('celebrating');
        setIsMeowing(true);
        setSpeechBubbleText(
          'Miau!! 🎓 Incrível! Você completou sua 5ª e última tentativa! Veja sua pontuação para cada livro! 🐾'
        );
        setShowBookScoresView(true);
        if (soundOn) playCelebrationSound();
      } else {
        setMascotMood('celebrating');
        setSpeechBubbleText(
          `Parabéns, Leitor de Ouro! Tentativa ${updatedData.attemptsCount} de ${MAX_QUIZ_ATTEMPTS} concluída com sucesso! 🏆`
        );
        if (soundOn) playCelebrationSound();
      }
    }
  };

  const restartQuiz = () => {
    if ((gameData.attemptsCount || 0) >= MAX_QUIZ_ATTEMPTS) {
      setShowBookScoresView(true);
      setMascotMood('talking');
      setSpeechBubbleText(
        'Miau! Você já utilizou suas 5 tentativas na Missão! Não é possível iniciar novas partidas. Veja sua pontuação por livro! 🐾'
      );
      return;
    }
    setRoundCompleted(false);
    setRoundStats({ correct: 0, pointsEarned: 0 });
    setShowBookScoresView(false);
    startQuestion(0);
  };

  const handleSelectBookForQuiz = (book: Book) => {
    setIsBookSelectorModalOpen(false);
    if ((gameData.attemptsCount || 0) >= MAX_QUIZ_ATTEMPTS) {
      setShowBookScoresView(true);
      setMascotMood('talking');
      setSpeechBubbleText(
        'Miau! Você já utilizou todas as 5 tentativas disponíveis! Veja sua pontuação em cada livro! 🐾'
      );
      return;
    }
    setSelectedBookForQuiz(book);
    setRoundCompleted(false);
    setRoundStats({ correct: 0, pointsEarned: 0 });
    setShowBookScoresView(false);
    startQuestion(0);
    setMascotMood('talking');
    setSpeechBubbleText(`Miau! Vamos testar o livro "${book.title}"! Boa sorte no desafio! 🐾`);
  };

  // Student Identification Modal handler with cross-referencing code or name verification
  const handleIdentifyStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError('');

    const rawInput = studentCodeInput.trim();
    if (!rawInput) {
      setCodeError('Digite seu Código ou Nome de Aluno para entrar na Missão.');
      return;
    }

    const cleanInput = rawInput.toLowerCase().replace(/^alu-/, '');

    const foundStudent = students.find((s) => {
      const sCode = (s.studentCode || '').trim().toLowerCase().replace(/^alu-/, '');
      const sId = (s.id || '').trim().toLowerCase().replace(/^alu-/, '');
      const sName = (s.name || '').trim().toLowerCase();
      return (
        sCode === cleanInput ||
        sId === cleanInput ||
        sName === rawInput.toLowerCase() ||
        sName.includes(rawInput.toLowerCase())
      );
    });

    if (!foundStudent) {
      if (soundOn) playWrongSound();
      setCodeError(
        'Aluno não encontrado! Verifique o código ou nome digitado e tente novamente.'
      );
      return;
    }

    setActiveStudent(foundStudent);
    setIsCodeModalOpen(false);
    setCodeError('');

    const existingData = getStudentGameData(
      foundStudent.studentCode || foundStudent.id,
      foundStudent.name
    );
    setGameData(existingData);
    setLeaderboard(getTopSchoolRanking(foundStudent.studentCode));
  };

  // Handle Close Modal: if student not active, return to home
  const handleCloseModal = () => {
    setIsCodeModalOpen(false);
    if (!activeStudent) {
      if (onBackToHome) {
        onBackToHome();
      }
    }
  };

  return (
    <div
      className={`min-h-[calc(100vh-80px)] py-4 px-3 sm:px-6 relative overflow-hidden transition-colors ${
        isDark
          ? 'bg-gradient-to-b from-[#0b102b] via-[#10133a] to-[#0a0e27] text-slate-100'
          : 'bg-gradient-to-b from-[#181a4a] via-[#1a1e54] to-[#121438] text-white'
      }`}
    >
      {/* Background Soft Stars Atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:32px_32px]"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col gap-4 sm:gap-5">
        {/* ========================================================================= */}
        {/* 1. TOP HEADER BANNER: "RANKING DE LEITURA - Desafie-se • Leia • Conquiste Pontos!" */}
        {/* ========================================================================= */}
        <div className="relative flex flex-col items-center justify-center text-center pt-1 pb-1">
          {/* Back to Home button */}
          {onBackToHome && (
            <div className="absolute left-0 top-0 flex items-center gap-2">
              <button
                id="btn-quiterio-back-home"
                type="button"
                onClick={onBackToHome}
                title="Voltar para a Página Inicial"
                className="px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Início</span>
              </button>
            </div>
          )}

          {/* Sound & Student Profile button */}
          <div className="absolute right-0 top-0 flex items-center gap-2">
            <button
              id="btn-quiterio-sound-toggle"
              onClick={() => {
                const next = !soundOn;
                setSoundOn(next);
                setSoundEnabled(next);
              }}
              title={soundOn ? 'Desativar Sons' : 'Ativar Sons'}
              className={`p-2 rounded-full border transition-all cursor-pointer shadow-md ${
                soundOn
                  ? 'bg-amber-400 text-amber-950 border-amber-300 hover:bg-amber-300 hover:scale-105'
                  : 'bg-slate-700/80 text-slate-300 border-slate-600 hover:bg-slate-600'
              }`}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* 3D Stylized Title Banner (Exact match to video) */}
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 20 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center justify-center gap-2.5 sm:gap-4 flex-wrap">
              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-300 to-amber-500 drop-shadow-[0_4px_12px_rgba(245,158,11,0.5)]">
                Ranking de Leitura
              </h1>

              {/* 3D Countdown Timer beside "Ranking de Leitura" (20 Minutos) */}
              <div
                className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl font-black text-xs sm:text-base border-2 border-b-4 transition-all shadow-md ${
                  timeLeft <= 60
                    ? 'bg-rose-600 border-rose-400 border-b-rose-900 text-white shadow-[0_3px_0_#4c0519] animate-pulse ring-2 ring-rose-400/60'
                    : 'bg-gradient-to-r from-[#3b0764] via-[#4c1d95] to-[#1e1b4b] border-amber-300 border-b-purple-950 text-amber-300 shadow-[0_3px_0_#0f172a]'
                }`}
                title="Tempo do Desafio: 20 minutos"
              >
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                <span className="font-mono font-black tracking-wider">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Arched subtitle ribbon */}
            <div className="mt-1 px-5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-xs sm:text-sm font-black shadow-md tracking-wide flex items-center gap-1.5 border border-amber-300">
              <Star className="w-3 h-3 fill-amber-950" />
              <span>Desafie-se • Leia • Conquiste Pontos!</span>
              <Star className="w-3 h-3 fill-amber-950" />
            </div>
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* 2. TOP CARDS BAR: [Left: Sua Pontuação] [Right: Ranking da Escola] */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-stretch">
          {/* Top Left Card: Sua Pontuação (3D Tactile Card with Quitério Colors) */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative p-3.5 sm:p-4 rounded-2xl border-2 border-amber-400 border-b-4 border-amber-600 bg-gradient-to-r from-amber-500/20 via-orange-950/40 to-amber-900/30 backdrop-blur-md shadow-[0_4px_0_#9a3412] flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              {/* Mascot Mini Portrait wearing graduation cap */}
              <div
                onClick={() => setIsCodeModalOpen(true)}
                title="Trocar aluno"
                className="relative w-12 h-12 rounded-2xl border-2 border-amber-300 border-b-3 border-amber-600 bg-gradient-to-br from-amber-400/30 to-orange-500/30 flex items-center justify-center overflow-hidden shadow-md flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
              >
                <QuiterioMascot size="sm" className="scale-65 -mt-3" />
              </div>

              <div>
                <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider block">
                  Sua Pontuação
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white truncate max-w-[150px]">
                    {activeStudent ? activeStudent.name : 'Aluno Convidado'}
                  </span>
                  <button
                    onClick={() => setIsCodeModalOpen(true)}
                    className="text-[10px] font-bold text-amber-300 hover:text-white underline cursor-pointer"
                    title="Trocar Aluno"
                  >
                    Trocar
                  </button>
                </div>

                {/* 🐾 Status de Empréstimos ou Tentativas */}
                <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                  {studentLoans.length === 0 ? (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border bg-rose-500/30 text-rose-200 border-rose-400/60 flex items-center gap-1 shadow-xs">
                      <span>📖</span>
                      <span>Sem empréstimos</span>
                    </span>
                  ) : (
                    <>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border bg-emerald-500/25 text-emerald-200 border-emerald-400/50 flex items-center gap-1 shadow-xs">
                        <BookOpen className="w-3 h-3" />
                        <span>{studentBooks.length} livro(s) lido(s)</span>
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border flex items-center gap-1 shadow-xs ${
                          (gameData.attemptsCount || 0) >= MAX_QUIZ_ATTEMPTS
                            ? 'bg-rose-500/30 text-rose-200 border-rose-400/60'
                            : 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                        }`}
                      >
                        <span>🐾</span>
                        <span>
                          Tentativas: <strong>{gameData.attemptsCount || 0}/{MAX_QUIZ_ATTEMPTS}</strong>
                          {(gameData.attemptsCount || 0) >= MAX_QUIZ_ATTEMPTS ? ' (Fim)' : ''}
                        </span>
                      </span>
                    </>
                  )}

                  {/* 5 mini paws */}
                  <div
                    className="flex items-center gap-0.5 bg-black/30 px-1.5 py-0.5 rounded-md border border-white/10"
                    title={`${gameData.attemptsCount || 0} de ${MAX_QUIZ_ATTEMPTS} tentativas utilizadas`}
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <span
                        key={num}
                        className={`text-[10px] transition-all ${
                          num <= (gameData.attemptsCount || 0)
                            ? 'opacity-100 scale-105'
                            : 'opacity-25 grayscale'
                        }`}
                      >
                        🐾
                      </span>
                    ))}
                  </div>

                  {/* Direct button to open per-book score */}
                  <button
                    type="button"
                    onClick={() => setShowBookScoresView(true)}
                    className="text-[10px] font-bold text-amber-200 hover:text-white underline cursor-pointer"
                  >
                    Ver por livro
                  </button>
                </div>
              </div>
            </div>

            {/* Score Big Display with 3D Golden Star Pill */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 px-3.5 py-1.5 rounded-xl border-2 border-amber-200 border-b-3 border-amber-700 shadow-[0_2px_0_#b45309]">
              <Star className="w-5 h-5 text-amber-950 fill-amber-950 drop-shadow-sm" />
              <span className="text-2xl sm:text-3xl font-black tracking-tight">
                {gameData.score}
              </span>
            </div>
          </motion.div>

          {/* Top Right Card: Ranking da Escola (3D Card) */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative p-3.5 sm:p-4 rounded-2xl border-2 border-purple-400/80 border-b-4 border-purple-900 bg-gradient-to-r from-purple-950/60 via-indigo-950/50 to-purple-900/40 backdrop-blur-md shadow-[0_4px_0_#2e1065] flex flex-col justify-between gap-2"
          >
            {/* Top 3 List */}
            <div className="grid grid-cols-3 gap-2">
              {leaderboard.topThree && leaderboard.topThree.length > 0 ? (
                leaderboard.topThree.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 rounded-xl bg-slate-900/70 border border-purple-400/30 border-b-2 border-purple-900 flex flex-col items-center text-center shadow-sm"
                  >
                    <span className="text-[11px] font-black text-amber-400 leading-tight">
                      {idx === 0 ? '🥇 1º' : idx === 1 ? '🥈 2º' : '🥉 3º'}
                    </span>
                    <span className="text-xs font-bold text-white truncate max-w-[75px]">
                      {item.studentName.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-mono text-amber-300 font-extrabold">
                      {item.score}
                    </span>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-2.5 px-3 text-center rounded-xl bg-slate-900/70 border border-purple-400/30 text-[11px] text-amber-200/90 font-semibold">
                  🐾 Nenhum ponto registrado ainda!
                </div>
              )}
            </div>

            {/* Current Student Rank Pill (3D Amber Yellow Pill) */}
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 text-xs font-black shadow-[0_2px_0_#b45309] border border-amber-200 border-b-2 border-amber-700">
              <span className="flex items-center gap-1.5">
                <span>🐾</span>
                <span>
                  {gameData.score > 0 ? (
                    <>Você está em <strong>{leaderboard.currentRank}º lugar</strong>!</>
                  ) : (
                    <>Responda para entrar no <strong>Ranking</strong>!</>
                  )}
                </span>
              </span>
              <span className="text-[10px] font-mono text-amber-950 font-extrabold bg-amber-300/60 px-1.5 py-0.5 rounded-md">
                {gameData.correctAnswers} acertos
              </span>
            </div>
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* 3. MAIN GAME QUIZ AREA: Quitério Mascot (Left) + 3D Cat Quiz Window (Right) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center my-auto pt-2">
          {/* Left Column: Mascot Quitério with Speech Bubble */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center order-2 lg:order-1">
            <QuiterioMascot
              mood={mascotMood}
              size="lg"
              showSpeechBubble={true}
              speechText={speechBubbleText}
              isMeowing={isMeowing}
              onPetCat={handlePetQuiterio}
            />
          </div>

          {/* Right Column: 3D Quiz Window Themed on Quitério the Cat */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <motion.div
              layout
              className="relative p-4 sm:p-6 md:p-7 rounded-[28px] sm:rounded-[36px] border-4 sm:border-[5px] border-[#ea580c] border-b-[8px] sm:border-b-[10px] border-[#9a3412] bg-gradient-to-b from-[#fffefc] via-[#fff9f2] to-[#ffedd5] text-[#2e1305] shadow-[0_12px_0_#7c2d12,0_20px_35px_rgba(0,0,0,0.45)] ring-2 sm:ring-4 ring-orange-300/60"
            >
              {/* Cute Cat Badge Header on top of 3D Window with Interactive Tabs */}
              <div className="flex items-center justify-center -mt-8 sm:-mt-10 mb-3 flex-wrap gap-2">
                <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 shadow-[0_4px_0_#9a3412] border-2 border-amber-200 border-b-[3px] border-[#9a3412]">
                  {!activeStudent ? (
                    <span className="px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-black text-amber-100 flex items-center gap-1.5">
                      <span>🐾</span>
                      <span>Identificação do Aluno</span>
                    </span>
                  ) : studentLoans.length === 0 ? (
                    <span className="px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-black bg-amber-400 text-amber-950 shadow-sm border border-amber-200 flex items-center gap-1.5">
                      <span>📖</span>
                      <span>Leitura Necessária</span>
                    </span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          if ((gameData.attemptsCount || 0) >= MAX_QUIZ_ATTEMPTS) {
                            setSpeechBubbleText(
                              'Miau! Você já completou suas 5 tentativas! Confira seus pontos por livro abaixo! 🐾'
                            );
                            return;
                          }
                          setShowBookScoresView(false);
                        }}
                        className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                          !showBookScoresView && (gameData.attemptsCount || 0) < MAX_QUIZ_ATTEMPTS
                            ? 'bg-amber-400 text-amber-950 shadow-sm border border-amber-200'
                            : 'text-amber-100 hover:text-white'
                        }`}
                      >
                        <span>🐾</span>
                        <span>
                          {(gameData.attemptsCount || 0) >= MAX_QUIZ_ATTEMPTS
                            ? 'Desafio Finalizado (5/5)'
                            : `Questão ${currentQuestionIndex + 1}/${currentQuestions.length}`}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowBookScoresView(true)}
                        className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                          showBookScoresView || (gameData.attemptsCount || 0) >= MAX_QUIZ_ATTEMPTS
                            ? 'bg-amber-400 text-amber-950 shadow-sm border border-amber-200'
                            : 'text-amber-100 hover:text-white'
                        }`}
                      >
                        <span>⭐</span>
                        <span>Pontos por Livro</span>
                        {Object.keys(gameData.bookScores || {}).length > 0 && (
                          <span className="bg-amber-950 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                            {Object.keys(gameData.bookScores || {}).length}
                          </span>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Floating +100 Points animated badge when user clicks right answer */}
              <AnimatePresence>
                {floatingScore !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 0, scale: 0.5 }}
                    animate={{ opacity: 1, y: -45, scale: 1.25 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.8 }}
                    className="absolute top-4 right-6 sm:right-8 z-30 pointer-events-none px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 font-black text-base sm:text-xl shadow-[0_4px_0_#9a3412] flex items-center gap-1.5 border-2 border-amber-200 border-b-3 border-orange-800"
                  >
                    <Sparkles className="w-5 h-5 text-amber-950 fill-amber-950" />
                    +{floatingScore} PONTOS!
                  </motion.div>
                )}
              </AnimatePresence>

              {!activeStudent ? (
                /* Card de Acesso Bloqueado se não houver aluno identificado */
                <div className="py-8 px-4 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border-2 border-amber-500/30 flex items-center justify-center text-amber-600 mb-3 shadow-inner">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#2e1305] mb-2">
                    Acesso Restrito a Alunos Cadastrados
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-900/80 max-w-md mx-auto mb-5 font-medium">
                    Digite seu <strong>Código ou Nome de Aluno</strong> para cruzarmos seus empréstimos de livros e liberar o desafio!
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {onBackToHome && (
                      <button
                        type="button"
                        onClick={onBackToHome}
                        className="px-5 py-2.5 rounded-2xl border-2 border-amber-300 bg-white text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer hover:bg-amber-50 text-amber-950 shadow-sm transition-all"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Voltar ao Início</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsCodeModalOpen(true)}
                      className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-amber-950 text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer shadow-[0_4px_0_#9a3412] border-2 border-amber-200 border-b-3 border-orange-800 active:translate-y-0.5 transition-all"
                    >
                      <User className="w-4 h-4" />
                      <span>Identificar Aluno</span>
                    </button>
                  </div>
                </div>
              ) : studentLoans.length === 0 ? (
                /* ========================================================================= */
                /* BLOQUEIO DO ALUNO SEM EMPRÉSTIMO COM LETRAS GRANDES "POR FAVOR LEIA UM LIVRO" */
                /* ========================================================================= */
                <div className="py-8 sm:py-12 px-4 sm:px-6 text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-300 via-orange-400 to-amber-500 p-1.5 shadow-[0_6px_0_#9a3412] flex items-center justify-center mb-3">
                    <div className="w-full h-full rounded-full bg-white/95 flex items-center justify-center text-4xl sm:text-5xl">
                      📖
                    </div>
                  </div>

                  {/* EM LETRAS GRANDES CONFORME SOLICITADO */}
                  <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase text-[#2e1305] tracking-tight leading-tight my-2 drop-shadow-sm">
                    Por favor Leia um Livro
                  </h2>

                  <div className="max-w-xl mx-auto my-3 p-4 sm:p-5 rounded-2xl bg-amber-100/90 border-2 border-amber-300 border-b-4 border-amber-400 text-amber-950 text-sm sm:text-base font-medium shadow-sm">
                    <p className="font-black text-base sm:text-lg text-orange-950 mb-1 flex items-center justify-center gap-1.5">
                      <span>🐾</span>
                      <span>Olá, {activeStudent.name}!</span>
                    </p>
                    <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-semibold">
                      Cruzamos seus dados com o registro de empréstimos da biblioteca e não encontramos nenhum livro retirado por você.
                      Para poder participar do <strong>Desafio da Missão Quitério</strong>, você precisa primeiro retirar e ler um livro na biblioteca escolar! As perguntas são retiradas exclusivamente dos livros que você leu.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                    {onNavigateToCatalog && (
                      <button
                        type="button"
                        onClick={onNavigateToCatalog}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-amber-950 font-black text-sm flex items-center gap-2 border-2 border-amber-200 border-b-4 border-orange-800 shadow-[0_4px_0_#9a3412] active:translate-y-0.5 cursor-pointer transition-all"
                      >
                        <BookOpen className="w-5 h-5" />
                        <span>Ir para o Catálogo de Livros</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsCodeModalOpen(true)}
                      className="px-5 py-3 rounded-2xl border-2 border-amber-300 bg-white hover:bg-amber-50 text-amber-950 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                    >
                      <User className="w-4 h-4" />
                      <span>Consultar Outro Aluno</span>
                    </button>
                    {onBackToHome && (
                      <button
                        type="button"
                        onClick={onBackToHome}
                        className="px-4 py-3 rounded-2xl text-amber-900 hover:text-amber-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Voltar ao Início</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : showBookScoresView || (gameData.attemptsCount || 0) >= MAX_QUIZ_ATTEMPTS ? (
                /* ========================================================================= */
                /* 🐾 BOLETIM DO QUITÉRIO: PONTUAÇÃO POR LIVRO (Cat's Book Scoreboard) */
                /* ========================================================================= */
                <div className="py-2 flex flex-col gap-3.5">
                  {/* Top Header inside 3D Window */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 border-b-2 border-amber-300/80 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-amber-200 border-b-4 border-orange-800 flex items-center justify-center text-white shadow-md flex-shrink-0">
                        <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg sm:text-xl font-black text-[#2e1305]">
                            Boletim do Quitério
                          </h3>
                          <span className="text-[10px] sm:text-xs font-black bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300">
                            Pontos por Livro
                          </span>
                        </div>
                        <p className="text-xs text-amber-900/80 font-medium">
                          Desempenho de <strong>{activeStudent ? activeStudent.name : 'Aluno'}</strong> em cada livro
                        </p>
                      </div>
                    </div>

                    {/* Attempts Status Pill */}
                    <div
                      className={`px-3 py-1.5 rounded-xl border-2 font-black text-xs flex items-center gap-1.5 shadow-sm ${
                        (gameData.attemptsCount || 0) >= MAX_QUIZ_ATTEMPTS
                          ? 'bg-rose-100 text-rose-950 border-rose-400 border-b-3 border-rose-700'
                          : 'bg-amber-100 text-amber-950 border-amber-300 border-b-3 border-amber-600'
                      }`}
                    >
                      <span>🐾</span>
                      <span>
                        {(gameData.attemptsCount || 0) >= MAX_QUIZ_ATTEMPTS
                          ? '5 de 5 Tentativas Usadas (Finalizado)'
                          : `${gameData.attemptsCount || 0} de ${MAX_QUIZ_ATTEMPTS} Tentativas Usadas`}
                      </span>
                    </div>
                  </div>

                  {/* Warning Notice when 5 attempts are exhausted */}
                  {(gameData.attemptsCount || 0) >= MAX_QUIZ_ATTEMPTS && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-100 via-orange-100 to-amber-200 border-2 border-amber-400 border-b-4 border-amber-600 text-amber-950 shadow-sm flex items-start sm:items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-400 border border-amber-500 flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                        🐱🎓
                      </div>
                      <div className="text-xs sm:text-sm font-bold leading-snug">
                        <span className="font-black text-orange-950">
                          Miau! Limite de 5 tentativas concluído!
                        </span>{' '}
                        Você utilizou todas as suas 5 chances no quiz. Conforme as regras da missão, você não pode mais jogar novas partidas. Veja abaixo sua pontuação conquistada em cada livro! 🐾
                      </div>
                    </motion.div>
                  )}

                  {/* Books Scores List */}
                  <div className="space-y-2.5 max-h-[340px] sm:max-h-[380px] overflow-y-auto pr-1">
                    {Object.keys(gameData.bookScores || {}).length === 0 ? (
                      <div className="p-6 text-center rounded-2xl bg-white/70 border-2 border-amber-200 border-dashed flex flex-col items-center">
                        <BookOpen className="w-10 h-10 text-amber-400 mb-2" />
                        <h4 className="text-base font-black text-[#2e1305]">Nenhum livro pontuado ainda!</h4>
                        <p className="text-xs text-amber-800/80 max-w-xs mt-1">
                          Escolha um livro e responda às perguntas do Quitério para registrar seus primeiros pontos no boletim!
                        </p>
                      </div>
                    ) : (
                      (Object.values(gameData.bookScores || {}) as BookScoreDetail[]).map((bookScore, idx) => {
                        const matchedBook =
                          books.find((b) => b.title.toLowerCase() === bookScore.bookTitle.toLowerCase()) ||
                          selectedBookForQuiz;
                        const cover = bookScore.bookCover || matchedBook.cover;
                        const percentage =
                          bookScore.totalQuestions > 0
                            ? Math.round((bookScore.correctAnswers / bookScore.totalQuestions) * 100)
                            : 0;

                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.06 }}
                            className="p-3 sm:p-3.5 rounded-2xl bg-white/95 border-2 border-amber-300 border-b-4 border-amber-500 shadow-[0_3px_0_#d97706] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-amber-400 transition-all"
                          >
                            {/* Left: Book Cover + Details */}
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                              <div className="w-12 h-16 sm:w-13 sm:h-17 rounded-xl border-2 border-amber-400 border-b-3 border-amber-600 shadow-md overflow-hidden bg-amber-100 flex-shrink-0 flex items-center justify-center">
                                {cover ? (
                                  <img
                                    src={cover}
                                    alt={bookScore.bookTitle}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white">
                                    <BookOpen className="w-5 h-5 text-amber-100" />
                                  </div>
                                )}
                              </div>

                              <div className="truncate flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[9px] font-black uppercase text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md border border-orange-200">
                                    Livro Desafiado
                                  </span>
                                  <span className="text-[10px] font-semibold text-amber-800 truncate">
                                    {bookScore.bookAuthor || matchedBook.author || 'Literatura'}
                                  </span>
                                </div>
                                <h4 className="text-sm sm:text-base font-black text-[#2e1305] truncate mt-0.5">
                                  {bookScore.bookTitle}
                                </h4>
                                <p className="text-[11px] text-amber-900/90 font-bold mt-0.5 flex items-center gap-1">
                                  <span>🐾</span>
                                  <span>
                                    {percentage === 100
                                      ? '🏆 Miau! Acertou tudo! Leitor Nota 10!'
                                      : percentage >= 60
                                      ? '🌟 Muito bem! Você leu com bastante atenção!'
                                      : '📖 Bom esforço! Continue explorando esta obra!'}
                                  </span>
                                </p>
                              </div>
                            </div>

                            {/* Right: Score and Accuracy Stats */}
                            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-amber-200">
                              {/* Accuracy */}
                              <div className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-center">
                                <span className="text-[9px] uppercase font-extrabold text-amber-800 block">
                                  Acertos
                                </span>
                                <span className="text-xs sm:text-sm font-black text-emerald-700">
                                  {bookScore.correctAnswers}/{bookScore.totalQuestions} ({percentage}%)
                                </span>
                              </div>

                              {/* Score Pill 3D */}
                              <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-black text-sm sm:text-base border-2 border-amber-200 border-b-3 border-amber-700 shadow-[0_2px_0_#b45309] flex items-center gap-1.5">
                                <Star className="w-4 h-4 fill-amber-950 text-amber-950" />
                                <span>{bookScore.points} pts</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>

                  {/* Summary & Actions inside 3D Window */}
                  <div className="pt-2 border-t-2 border-amber-300/70 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-amber-950 flex-wrap">
                      <span>
                        Total Geral: <strong>{gameData.score} pts</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Ranking: <strong>{gameData.score > 0 ? `${leaderboard.currentRank}º lugar` : 'A definir'}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap justify-end w-full sm:w-auto">
                      {(gameData.attemptsCount || 0) < MAX_QUIZ_ATTEMPTS ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setIsBookSelectorModalOpen(true)}
                            className="px-3.5 py-2 rounded-xl border-2 border-amber-300 bg-white hover:bg-amber-50 text-amber-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Trocar Livro</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowBookScoresView(false);
                              if (roundCompleted) restartQuiz();
                            }}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs shadow-[0_3px_0_#064e3b] border-2 border-emerald-300 border-b-3 border-emerald-800 active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
                          >
                            <span>Jogar Desafio ({MAX_QUIZ_ATTEMPTS - (gameData.attemptsCount || 0)} restantes)</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          {onNavigateToCatalog && (
                            <button
                              type="button"
                              onClick={onNavigateToCatalog}
                              className="px-4 py-2 rounded-xl border-2 border-amber-300 bg-white hover:bg-amber-50 text-amber-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Catálogo de Livros</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : activeQuestion && !roundCompleted ? (
                <>
                  {/* Quiz Card Top Row: Book Badge & 3D Countdown Timer */}
                  <div className="flex items-center justify-between gap-3 border-b-2 border-amber-200/80 pb-3">
                    {/* Book Badge (3D Thumbnail + Title) */}
                    <div className="flex items-center gap-2.5 sm:gap-3 max-w-[70%] sm:max-w-[75%]">
                      <div className="w-10 h-13 sm:w-11 sm:h-15 rounded-xl border-2 border-amber-400 border-b-3 border-amber-600 shadow-md overflow-hidden bg-amber-100 flex-shrink-0 flex items-center justify-center relative">
                        {!coverHasError && activeQuestion.bookCover ? (
                          <img
                            src={activeQuestion.bookCover}
                            alt={activeQuestion.bookTitle}
                            onError={() => setCoverHasError(true)}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-600 flex flex-col items-center justify-center p-1 text-white">
                            <BookOpen className="w-4 h-4 text-amber-100" />
                            <span className="text-[7px] font-black uppercase text-center mt-0.5 line-clamp-1">
                              Livro
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="truncate">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md border border-orange-200">
                            Livro Lido
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-semibold text-amber-900 truncate">
                            {activeQuestion.bookAuthor || 'Literatura'}
                          </span>
                          {studentBooks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setIsBookSelectorModalOpen(true)}
                              className="text-[10px] font-bold text-amber-800 hover:text-amber-950 bg-amber-200/80 hover:bg-amber-300 px-2 py-0.5 rounded-md border border-amber-300 transition-all cursor-pointer flex items-center gap-1"
                              title="Trocar para outro livro que você leu"
                            >
                              <BookOpen className="w-3 h-3" />
                              <span>Trocar Livro ({studentBooks.length})</span>
                            </button>
                          )}
                        </div>
                        <h3 className="text-sm sm:text-base md:text-lg font-black text-[#2e1305] truncate mt-0.5">
                          {activeQuestion.bookTitle}
                        </h3>
                      </div>
                    </div>

                    {/* 3D Countdown Timer Pill (Quitério Purple & Gold) */}
                    <div
                      className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-2xl font-black text-xs sm:text-sm border-2 border-b-4 transition-all shadow-md flex-shrink-0 ${
                        timeLeft <= 60
                          ? 'bg-rose-600 border-rose-400 border-b-rose-900 text-white shadow-[0_3px_0_#4c0519] animate-pulse ring-2 ring-rose-400/60'
                          : 'bg-gradient-to-r from-[#3b0764] via-[#4c1d95] to-[#1e1b4b] border-amber-300 border-b-purple-950 text-amber-300 shadow-[0_3px_0_#0f172a]'
                      }`}
                      title="Tempo restante"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-mono font-black">
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="my-3.5 sm:my-5 p-3.5 sm:p-4 rounded-2xl bg-white/80 border-2 border-amber-200/90 border-b-3 border-amber-300 shadow-sm">
                    <h2 className="text-sm sm:text-base md:text-lg font-black leading-snug text-[#2b1408]">
                      {activeQuestion.question}
                    </h2>
                  </div>

                  {/* 3D Options Grid (A, B, C, D) - Optimized for Smartphone single-column & Tablet 2-column */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
                    {activeQuestion.options.map((optionText, optIndex) => {
                      const letter = String.fromCharCode(65 + optIndex); // A, B, C, D
                      const isSelected = selectedOption === optIndex;
                      const isThisCorrect = optIndex === activeQuestion.correctIndex;

                      // Visual styling with 3D depth and cat tabby colors
                      let cardStyle =
                        'bg-white hover:bg-amber-50/90 active:bg-amber-100 text-[#2b1408] border-2 border-amber-300 border-b-4 border-amber-500 shadow-[0_4px_0_#d97706] active:translate-y-1 active:border-b-2 active:shadow-[0_1px_0_#d97706]';
                      let badgeStyle =
                        'bg-gradient-to-br from-amber-400 to-orange-500 text-white border border-amber-200 border-b-2 border-orange-700';

                      if (isAnswered) {
                        if (isThisCorrect) {
                          // Bright emerald green with 3D depth
                          cardStyle =
                            'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold border-2 border-emerald-300 border-b-4 border-emerald-800 shadow-[0_4px_0_#064e3b]';
                          badgeStyle = 'bg-white text-emerald-700 border border-emerald-200';
                        } else if (isSelected && !isThisCorrect) {
                          // Rose red on wrong choice with 3D depth
                          cardStyle =
                            'bg-rose-50 text-rose-950 font-bold border-2 border-rose-300 border-b-4 border-rose-600 shadow-[0_4px_0_#9f1239]';
                          badgeStyle = 'bg-rose-600 text-white border border-rose-400';
                        } else {
                          cardStyle =
                            'opacity-40 bg-amber-50/40 border-2 border-amber-200/70 border-b-2 border-amber-300 text-amber-900/60 shadow-none';
                          badgeStyle = 'bg-amber-200 text-amber-700 border-transparent';
                        }
                      }

                      return (
                        <motion.button
                          key={optIndex}
                          whileHover={!isAnswered ? { scale: 1.01 } : {}}
                          whileTap={!isAnswered ? { scale: 0.98 } : {}}
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(optIndex)}
                          className={`p-3 sm:p-3.5 rounded-2xl text-left transition-all flex items-center justify-between gap-2.5 cursor-pointer min-h-[52px] ${cardStyle}`}
                        >
                          <div className="flex items-center sm:items-start gap-2.5">
                            <span
                              className={`font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${badgeStyle}`}
                            >
                              {letter}
                            </span>
                            <span className="text-xs sm:text-sm font-bold leading-tight">
                              {optionText}
                            </span>
                          </div>

                          {/* Status Icon */}
                          {isAnswered && (
                            <div className="flex-shrink-0">
                              {isThisCorrect ? (
                                <CheckCircle2 className="w-5 h-5 text-white fill-emerald-600 drop-shadow-sm" />
                              ) : isSelected ? (
                                <XCircle className="w-5 h-5 text-rose-600 drop-shadow-sm" />
                              ) : null}
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Feedback & Next Button Row (3D Tactile Layout) */}
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 pt-3.5 border-t-2 border-amber-300/60 flex flex-col sm:flex-row items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {/* +100 Pontos 3D Badge */}
                        {isCorrect ? (
                          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-black text-xs sm:text-sm shadow-[0_3px_0_#b45309] border-2 border-amber-300 border-b-3 border-amber-700 flex-shrink-0">
                            <Star className="w-4 h-4 fill-amber-950" />
                            <span>+100 pontos!</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-200 text-slate-700 font-bold text-xs shadow-sm border border-slate-300 flex-shrink-0">
                            <span>0 pontos</span>
                          </div>
                        )}

                        {/* Kitten cheer bubble pill */}
                        <div className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300/80 border-b-3 border-amber-400 text-xs sm:text-sm text-amber-950 font-bold leading-tight flex items-center gap-2 shadow-sm">
                          <span className="text-sm">🐾</span>
                          <span>
                            {isCorrect
                              ? 'Você mandou bem! Continua lendo e acertando as perguntas!'
                              : 'Quase lá! Continue lendo que você consegue!'}
                          </span>
                        </div>
                      </div>

                      {/* 3D Next Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleNextQuestion}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs sm:text-sm shadow-[0_4px_0_#064e3b] border-2 border-emerald-300 border-b-4 border-emerald-800 active:translate-y-1 active:border-b-2 active:shadow-[0_1px_0_#064e3b] flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <span>
                          {currentQuestionIndex < currentQuestions.length - 1
                            ? 'Próxima Pergunta'
                            : 'Ver Resultado'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  )}
                </>
              ) : (
                /* ========================================================================= */
                /* ROUND COMPLETED VIEW (With 5 Attempts Limit Check) */
                /* ========================================================================= */
                <div className="py-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-3xl bg-amber-400/30 border-2 border-amber-400 border-b-4 border-amber-600 flex items-center justify-center text-amber-600 shadow-[0_4px_0_#b45309] mb-3">
                    <Trophy className="w-9 h-9" />
                  </div>
                  <h3 className="text-2xl font-black text-[#2e1305]">
                    {(gameData.attemptsCount || 0) >= MAX_QUIZ_ATTEMPTS
                      ? '5 de 5 Tentativas Concluídas! 🎓'
                      : 'Missão Cumprida!'}
                  </h3>
                  <p className="text-sm text-amber-900/80 max-w-md mt-1 mb-5 font-medium">
                    {(gameData.attemptsCount || 0) >= MAX_QUIZ_ATTEMPTS ? (
                      <span>
                        Miau! Você atingiu o limite de <strong>5 tentativas</strong> na Missão do Quitério! Veja agora a sua pontuação para cada livro desafiado!
                      </span>
                    ) : (
                      <span>
                        Você completou o desafio do livro{' '}
                        <strong className="text-orange-700">{selectedBookForQuiz.title}</strong>!
                      </span>
                    )}
                  </p>

                  <div className="grid grid-cols-2 gap-3 max-w-xs w-full mb-5">
                    <div className="p-3 rounded-2xl bg-white/90 border-2 border-amber-300 border-b-4 border-amber-500 shadow-[0_3px_0_#d97706]">
                      <span className="text-[10px] uppercase font-black text-amber-700 block">
                        Pontos Ganhos
                      </span>
                      <span className="text-xl font-black text-amber-600">
                        +{roundStats.pointsEarned}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/90 border-2 border-emerald-300 border-b-4 border-emerald-600 shadow-[0_3px_0_#059669]">
                      <span className="text-[10px] uppercase font-black text-emerald-700 block">
                        Acertos
                      </span>
                      <span className="text-xl font-black text-emerald-600">
                        {roundStats.correct} / {currentQuestions.length}
                      </span>
                    </div>
                  </div>

                  {/* Attempts summary badge */}
                  <div className="mb-5 px-4 py-1.5 rounded-full bg-amber-200/90 border border-amber-300 text-amber-950 text-xs font-black">
                    🐾 Tentativa {gameData.attemptsCount || 0} de {MAX_QUIZ_ATTEMPTS} finalizada
                    {(gameData.attemptsCount || 0) >= MAX_QUIZ_ATTEMPTS
                      ? ' • Limite máximo alcançado'
                      : ` • Restam ${MAX_QUIZ_ATTEMPTS - (gameData.attemptsCount || 0)} tentativa(s)`}
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {(gameData.attemptsCount || 0) >= MAX_QUIZ_ATTEMPTS ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setShowBookScoresView(true)}
                          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-amber-950 font-black text-sm flex items-center gap-2 border-2 border-amber-200 border-b-4 border-orange-800 shadow-[0_4px_0_#9a3412] active:translate-y-0.5 cursor-pointer transition-all"
                        >
                          <span>🐾 Ver Pontuação de Cada Livro</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        {onNavigateToCatalog && (
                          <button
                            type="button"
                            onClick={onNavigateToCatalog}
                            className="px-5 py-3 rounded-2xl border-2 border-amber-300 bg-white hover:bg-amber-50 text-amber-900 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                          >
                            <BookOpen className="w-4 h-4" />
                            <span>Ver Outros Livros</span>
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <button
                          onClick={restartQuiz}
                          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-amber-950 font-black text-xs sm:text-sm flex items-center gap-2 border-2 border-amber-200 border-b-3 border-orange-700 shadow-[0_3px_0_#c2410c] active:translate-y-0.5 cursor-pointer transition-all"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Jogar Novamente ({MAX_QUIZ_ATTEMPTS - (gameData.attemptsCount || 0)} restantes)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsBookSelectorModalOpen(true)}
                          className="px-4 py-2.5 rounded-2xl border-2 border-amber-300 bg-white hover:bg-amber-50 text-amber-900 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Trocar Livro</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowBookScoresView(true)}
                          className="px-4 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <span>⭐ Pontos por Livro</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. BOTTOM BAR: Responsive for Smartphone [Conquistas] [3 Step Pills] [Mês de Leitura] */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 pb-4 border-t border-white/15">
          {/* Left / Mobile Row: Conquistas 3D Button + Mobile Trophy */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsBadgesModalOpen(true)}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 border-2 border-purple-400 border-b-4 border-purple-950 shadow-[0_3px_0_#1e1b4b] active:translate-y-0.5 active:border-b-2 text-white font-black text-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Conquistas</span>
            </button>

            <button
              type="button"
              onClick={() => setShowBookScoresView(true)}
              className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 border-2 border-amber-300 border-b-4 border-orange-800 shadow-[0_3px_0_#9a3412] active:translate-y-0.5 active:border-b-2 text-amber-950 font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>🐾</span>
              <span>Pontos por Livro</span>
            </button>

            {/* Mobile-only Mês de Leitura badge */}
            <div className="flex sm:hidden items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-black text-xs shadow-[0_2px_0_#b45309] border border-amber-200 border-b-2 border-amber-700 flex items-center gap-1.5">
                <Star className="w-3 h-3 fill-amber-950" />
                <span>Mês de Leitura</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-amber-400/20 border-2 border-amber-400/60 flex items-center justify-center text-amber-400 shadow-sm">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Center: 3 Connected Purple Pills (Responsive) */}
          <div className="flex items-center justify-center gap-1 sm:gap-2 px-3 py-1.5 rounded-2xl bg-purple-950/70 border-2 border-purple-500/40 border-b-3 border-purple-950 text-white shadow-md w-full sm:w-auto text-center">
            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-slate-200">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Leia livros</span>
            </div>
            <ChevronRight className="w-3 h-3 text-purple-400 flex-shrink-0" />
            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-slate-200">
              <GraduationCap className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
              <span>Responda desafios</span>
            </div>
            <ChevronRight className="w-3 h-3 text-purple-400 flex-shrink-0" />
            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-slate-200">
              <Trophy className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>Ganhe pontos</span>
            </div>
          </div>

          {/* Right: Mês de Leitura Badge (Desktop) */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-black text-xs shadow-[0_3px_0_#b45309] flex items-center gap-1.5 border-2 border-amber-300 border-b-3 border-amber-700">
              <Star className="w-3 h-3 fill-amber-950" />
              <span>Mês de Leitura</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-amber-400/20 border-2 border-amber-400/60 flex items-center justify-center text-amber-400 shadow-md">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. CONQUISTAS POPUP MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isBadgesModalOpen && (
          <div
            onClick={() => setIsBadgesModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm border-2 rounded-3xl p-5 bg-[#0e1233] border-purple-500/50 text-white shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setIsBadgesModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base text-amber-300">
                  Suas Conquistas
                </h3>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 border border-indigo-400 text-amber-300 flex items-center justify-center flex-shrink-0">
                    <BookMarked className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">Leitor Dedicado</h4>
                    <p className="text-[11px] text-slate-400">Acerte ao menos 1 pergunta no Quiz Literário</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 border border-amber-300 text-amber-950 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">Mestre das Histórias</h4>
                    <p className="text-[11px] text-slate-400">Alcance mais de 500 pontos no ranking escolar</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-500 border border-rose-300 text-white flex items-center justify-center flex-shrink-0">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">Desafio Ler Mais</h4>
                    <p className="text-[11px] text-slate-400">Acerte 3 ou mais perguntas seguidas sem errar</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 6. STUDENT CODE INPUT MODAL (Prompt for Student Code) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isCodeModalOpen && (
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-md border-2 rounded-3xl p-6 shadow-2xl ${
                isDark ? 'bg-[#001424] border-[#163e5e]' : 'bg-white border-slate-200'
              }`}
            >
              {/* Botão Fechar (X) - Retorna ao início se não houver aluno logado */}
              <button
                id="btn-fechar-modal-aluno"
                type="button"
                onClick={handleCloseModal}
                className={`absolute top-4 right-4 p-2 rounded-full transition-all cursor-pointer ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                aria-label="Fechar janela"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Mascot welcome in the modal */}
              <div className="flex flex-col items-center text-center mb-5">
                <QuiterioMascot size="sm" mood="talking" />
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
                  Entrar na Missão Quitério
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
                  Digite seu <strong>Código ou Nome de Aluno</strong> para cruzarmos os livros que você já
                  leu e computar seus pontos no Ranking da Escola!
                </p>
              </div>

              {codeError && (
                <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs text-center font-medium">
                  {codeError}
                </div>
              )}

              <form onSubmit={handleIdentifyStudent} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Código ou Nome do Aluno
                  </label>
                  <input
                    type="text"
                    value={studentCodeInput}
                    onChange={(e) => setStudentCodeInput(e.target.value)}
                    autoFocus
                    placeholder="Ex: ALU-001 ou código do aluno"
                    className={`w-full px-4 py-3 rounded-2xl border text-sm font-semibold text-center focus:outline-none focus:ring-2 ${
                      isDark
                        ? 'bg-[#071828] border-[#163e5e] text-white focus:border-amber-400 focus:ring-amber-400/20'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 focus:ring-amber-500/20'
                    }`}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className={`px-4 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      isDark
                        ? 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                        : 'border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {activeStudent ? 'Cancelar' : 'Voltar ao Início'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Verificar Empréstimos 🐾</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 7. BOOK SELECTOR MODAL: Escolha de Livro Lido para Quiz */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isBookSelectorModalOpen && (
          <div
            onClick={() => setIsBookSelectorModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[85vh] rounded-[28px] border-4 border-amber-500 border-b-[8px] border-orange-800 bg-gradient-to-b from-[#fffefc] to-[#ffedd5] text-[#2e1305] shadow-2xl p-4 sm:p-6 flex flex-col"
            >
              <button
                type="button"
                onClick={() => setIsBookSelectorModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-amber-900/60 hover:text-amber-950 hover:bg-amber-200/60 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-3 border-b-2 border-amber-300/80 pb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400 border-2 border-amber-200 border-b-4 border-orange-700 flex items-center justify-center text-xl shadow-sm flex-shrink-0">
                  📚
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#2e1305]">
                    Livros Lidos por Você ({studentBooks.length})
                  </h3>
                  <p className="text-xs text-amber-900/80 font-medium">
                    As perguntas da Missão Quitério são retiradas exclusivamente dos livros que você retirou na biblioteca!
                  </p>
                </div>
              </div>

              {/* Book List Grid - Strictly Student's Borrowed/Read Books */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-1">
                {studentBooks.length === 0 ? (
                  <div className="p-6 text-center rounded-2xl bg-white/70 border-2 border-amber-200 border-dashed flex flex-col items-center">
                    <BookOpen className="w-10 h-10 text-amber-400 mb-2" />
                    <h4 className="text-base font-black text-[#2e1305]">Nenhum livro retirado ainda!</h4>
                    <p className="text-xs text-amber-800/80 max-w-xs mt-1">
                      Pegue um livro emprestado na biblioteca para poder participar do Desafio Quitério.
                    </p>
                  </div>
                ) : (
                  studentBooks.map(({ book: b, loan }) => {
                    const isCurrent =
                      selectedBookForQuiz.id === b.id ||
                      selectedBookForQuiz.title.toLowerCase() === b.title.toLowerCase();
                    const bookScore = (gameData.bookScores || {})[b.title];

                    return (
                      <div
                        key={b.id}
                        onClick={() => handleSelectBookForQuiz(b)}
                        className={`p-2.5 sm:p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isCurrent
                            ? 'bg-amber-200/90 border-amber-500 border-b-4 border-orange-700 shadow-[0_2px_0_#c2410c]'
                            : 'bg-white/90 hover:bg-amber-50 border-amber-300/80 border-b-3 border-amber-400 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="w-10 h-14 rounded-lg overflow-hidden border border-amber-300 flex-shrink-0 bg-amber-100 flex items-center justify-center">
                            {b.cover ? (
                              <img
                                src={b.cover}
                                alt={b.title}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <BookOpen className="w-4 h-4 text-amber-500" />
                            )}
                          </div>
                          <div className="truncate">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md ${
                                  loan.status === 'devolvido'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                                }`}
                              >
                                {loan.status === 'devolvido' ? 'Devolvido (Lido)' : 'Empréstimo Ativo'}
                              </span>
                              {loan.loanDate && (
                                <span className="text-[10px] text-amber-800/80 font-medium">
                                  Retirado em {loan.loanDate}
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs sm:text-sm font-black text-[#2e1305] truncate mt-0.5">
                              {b.title}
                            </h4>
                            <span className="text-[11px] text-amber-900/80 font-medium block truncate">
                              {b.author}
                            </span>
                            {bookScore && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md mt-1">
                                <span>✓ Pontuado:</span>
                                <strong>{bookScore.points} pts</strong>
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          {isCurrent ? (
                            <span className="text-[10px] sm:text-xs font-black bg-orange-600 text-white px-2.5 py-1 rounded-xl shadow-xs">
                              Selecionado
                            </span>
                          ) : (
                            <span className="text-[10px] sm:text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-xl hover:bg-amber-200">
                              Desafiar
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t-2 border-amber-300/80 flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="text-xs font-bold text-amber-900">
                  {studentBooks.length} livro(s) no seu histórico
                </span>
                <div className="flex items-center gap-2">
                  {onNavigateToCatalog && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsBookSelectorModalOpen(false);
                        onNavigateToCatalog();
                      }}
                      className="px-3 py-1.5 rounded-xl border border-amber-400 bg-white hover:bg-amber-50 text-amber-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Catálogo de Livros</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsBookSelectorModalOpen(false)}
                    className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs border border-amber-500 shadow-xs cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
