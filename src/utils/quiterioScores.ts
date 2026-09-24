export const MAX_QUIZ_ATTEMPTS = 5;

const STORAGE_KEY = 'cecmq_quiterio_scores_v2';

export interface BookScoreDetail {
  bookTitle: string;
  author?: string;
  bookAuthor?: string;
  cover?: string;
  bookCover?: string;
  points: number;
  correctAnswers: number;
  totalQuestions: number;
  attempts: number;
  lastAttemptDate?: string;
}

export interface StudentScoreData {
  studentId?: string;
  studentCode: string;
  studentName: string;
  score: number;
  points?: number;
  correctAnswers: number;
  totalAnswered: number;
  attemptsCount: number;
  completedBooks?: string[];
  bookScores?: Record<string, BookScoreDetail>;
  lastUpdated?: string;
}

export interface LeaderboardEntry {
  rank: number;
  studentCode: string;
  studentName: string;
  score: number;
  attemptsCount: number;
  isCurrentStudent?: boolean;
}

export type LeaderboardResult = LeaderboardEntry[] & {
  topThree: LeaderboardEntry[];
  currentRank: number;
  list: LeaderboardEntry[];
};

export function loadScoresMap(): Record<string, StudentScoreData> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveScoresMap(map: Record<string, StudentScoreData>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Ignore storage quota errors
  }
}

export function getStudentGameData(studentKey: string, studentName = 'Estudante'): StudentScoreData {
  const map = loadScoresMap();
  const normalizedKey = (studentKey || 'anon').trim().toLowerCase();

  if (map[normalizedKey]) {
    return map[normalizedKey];
  }

  const initial: StudentScoreData = {
    studentId: studentKey,
    studentCode: studentKey,
    studentName,
    score: 0,
    points: 0,
    correctAnswers: 0,
    totalAnswered: 0,
    attemptsCount: 0,
    completedBooks: [],
    bookScores: {},
    lastUpdated: new Date().toISOString(),
  };

  map[normalizedKey] = initial;
  saveScoresMap(map);
  return initial;
}

export function addGamePoints(
  studentKey: string,
  studentName: string,
  points: number,
  isCorrect: boolean,
  bookTitle?: string,
  author?: string,
  cover?: string
): { updatedData: StudentScoreData } {
  const map = loadScoresMap();
  const normalizedKey = (studentKey || 'anon').trim().toLowerCase();
  const current = map[normalizedKey] || getStudentGameData(studentKey, studentName);

  const updated: StudentScoreData = {
    ...current,
    studentName: studentName || current.studentName,
    score: (current.score || 0) + points,
    points: (current.points || 0) + points,
    correctAnswers: (current.correctAnswers || 0) + (isCorrect ? 1 : 0),
    totalAnswered: (current.totalAnswered || 0) + 1,
    lastUpdated: new Date().toISOString(),
    bookScores: { ...(current.bookScores || {}) },
  };

  if (bookTitle) {
    const existingBook = updated.bookScores?.[bookTitle] || {
      bookTitle,
      author: author || '',
      bookAuthor: author || '',
      cover: cover || '',
      bookCover: cover || '',
      points: 0,
      correctAnswers: 0,
      totalQuestions: 0,
      attempts: 0,
      lastAttemptDate: new Date().toISOString(),
    };

    updated.bookScores![bookTitle] = {
      ...existingBook,
      author: author || existingBook.author,
      bookAuthor: author || existingBook.bookAuthor,
      cover: cover || existingBook.cover,
      bookCover: cover || existingBook.bookCover,
      points: existingBook.points + points,
      correctAnswers: existingBook.correctAnswers + (isCorrect ? 1 : 0),
      totalQuestions: existingBook.totalQuestions + 1,
      lastAttemptDate: new Date().toISOString(),
    };
  }

  map[normalizedKey] = updated;
  saveScoresMap(map);

  return { updatedData: updated };
}

export function recordAttemptCompletion(
  studentKey: string,
  studentName: string,
  bookTitle: string,
  author?: string,
  cover?: string,
  roundPoints = 0,
  correctCount = 0,
  totalQuestions = 0
): { updatedData: StudentScoreData; isLimitReached: boolean } {
  const map = loadScoresMap();
  const normalizedKey = (studentKey || 'anon').trim().toLowerCase();
  const current = map[normalizedKey] || getStudentGameData(studentKey, studentName);

  const attemptsCount = (current.attemptsCount || 0) + 1;
  const isLimitReached = attemptsCount >= MAX_QUIZ_ATTEMPTS;

  const bookScores = { ...(current.bookScores || {}) };
  const existingBook = bookScores[bookTitle] || {
    bookTitle,
    author: author || '',
    bookAuthor: author || '',
    cover: cover || '',
    bookCover: cover || '',
    points: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    attempts: 0,
  };

  bookScores[bookTitle] = {
    ...existingBook,
    author: author || existingBook.author,
    bookAuthor: author || existingBook.bookAuthor,
    cover: cover || existingBook.cover,
    bookCover: cover || existingBook.bookCover,
    attempts: (existingBook.attempts || 0) + 1,
    points: (existingBook.points || 0) + roundPoints,
    correctAnswers: (existingBook.correctAnswers || 0) + correctCount,
    totalQuestions: (existingBook.totalQuestions || 0) + totalQuestions,
    lastAttemptDate: new Date().toISOString(),
  };

  const completedBooks = Array.from(new Set([...(current.completedBooks || []), bookTitle]));

  const updated: StudentScoreData = {
    ...current,
    studentName: studentName || current.studentName,
    attemptsCount,
    completedBooks,
    bookScores,
    lastUpdated: new Date().toISOString(),
  };

  map[normalizedKey] = updated;
  saveScoresMap(map);

  return { updatedData: updated, isLimitReached };
}

export function getTopSchoolRanking(currentStudentCode?: string): LeaderboardResult {
  const map = loadScoresMap();
  const list = Object.values(map);

  list.sort((a, b) => (b.score || 0) - (a.score || 0));

  const cleanCurrent = (currentStudentCode || '').trim().toLowerCase();

  const formattedList: LeaderboardEntry[] = list.map((item, idx) => ({
    rank: idx + 1,
    studentCode: item.studentCode || item.studentId || '',
    studentName: item.studentName || 'Estudante',
    score: item.score || 0,
    attemptsCount: item.attemptsCount || 0,
    isCurrentStudent:
      Boolean(cleanCurrent) &&
      (item.studentCode || item.studentId || '').trim().toLowerCase() === cleanCurrent,
  }));

  const topThree = formattedList.slice(0, 3);
  let currentRank = 1;
  const foundIdx = formattedList.findIndex((item) => item.isCurrentStudent);
  if (foundIdx !== -1) {
    currentRank = foundIdx + 1;
  }

  const result = Object.assign([...formattedList], {
    topThree,
    currentRank,
    list: formattedList,
  }) as LeaderboardResult;

  return result;
}
