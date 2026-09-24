import { Book, Loan, Student, Suggestion, AdminUser, AuditLog } from '../types';

/**
 * Maps Supabase storage cover URLs when relative path is used
 */
export function normalizeCoverUrl(url: string | null | undefined, title?: string): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80';
  }

  const trimmed = url.trim();

  // If already full http(s) URL, return directly
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // If it's a relative path from the Maria Quitéria API
  if (trimmed.startsWith('/api/public/capa/')) {
    const filename = trimmed.replace('/api/public/capa/', '');
    return `https://pdwgbhmktifznyguctaf.supabase.co/storage/v1/object/public/capas/${filename}`;
  }

  if (trimmed.startsWith('capas/')) {
    return `https://pdwgbhmktifznyguctaf.supabase.co/storage/v1/object/public/${trimmed}`;
  }

  return trimmed;
}

/**
 * Normalizes student avatars (supporting Dicebear seeds like "adventurer:Helena")
 */
export function normalizeAvatarUrl(avatar: string | null | undefined, name: string): string {
  if (!avatar || typeof avatar !== 'string' || avatar.trim() === '') {
    const cleanName = encodeURIComponent(name || 'Aluno');
    return `https://api.dicebear.com/7.x/personas/svg?seed=${cleanName}`;
  }

  const trimmed = avatar.trim();

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // Handle dicebear shorthand like "adventurer:Helena" or "big-smile:Noah"
  if (trimmed.includes(':')) {
    const [style, seed] = trimmed.split(':');
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed || name)}`;
  }

  return `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(trimmed)}`;
}

/**
 * Converts any raw book item (Portuguese or English properties) to a valid Book
 */
export function normalizeBook(raw: any, index: number = 0): Book {
  const title = raw.titulo || raw.title || 'Livro sem título';
  const author = raw.autor || raw.author || 'Autor não informado';
  const category = raw.categoria || raw.category || 'Literatura Brasileira';
  const cover = normalizeCoverUrl(raw.capa_url || raw.cover || raw.capa, title);
  const totalCopies = Number(raw.quantidade ?? raw.totalCopies ?? 1) || 1;
  const availableCopies = Number(raw.quantidade_disponivel ?? raw.availableCopies ?? (raw.disponivel !== false ? totalCopies : 0));
  const isAvailable = raw.disponivel !== false && availableCopies > 0;

  return {
    id: String(raw.id || `book-${Date.now()}-${index}`),
    title,
    author,
    cover,
    category: category || 'Geral',
    rating: Number(raw.rating) || 4.8,
    reviewsCount: Number(raw.reviewsCount) || 15,
    status: isAvailable ? 'disponivel' : 'em_andamento',
    pages: Number(raw.paginas || raw.pages) || 160,
    year: Number(raw.ano || raw.year) || 2020,
    publisher: raw.editora || raw.publisher || 'Acervo Biblioteca',
    location: raw.localizacao || raw.location || 'Estante 01 - Prateleira A',
    synopsis: raw.descricao || raw.sinopse || raw.synopsis || `Obra do acervo da Biblioteca Maria Quitéria. Título: ${title}, por ${author}.`,
    isbn: raw.isbn || '978-85-00000-00-0',
    totalCopies,
    availableCopies,
    featured: Boolean(raw.destaque ?? raw.featured ?? index < 4),
  };
}

/**
 * Converts any raw student item (Portuguese or English properties) to a valid Student
 */
export function normalizeStudent(raw: any, index: number = 0): Student {
  const name = raw.nome || raw.name || 'Estudante';
  const studentCode = raw.codigo_aluno || raw.matricula || raw.studentCode || `ALU-${String(index + 1).padStart(4, '0')}`;
  const studentClass = raw.turma || raw.class || '1º Ano';
  const phone = raw.telefone || raw.phone || '';
  const email = raw.email || `${name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '.')}@escola.ba.gov.br`;
  const avatar = normalizeAvatarUrl(raw.avatar, name);

  return {
    id: String(raw.id || `student-${Date.now()}-${index}`),
    name,
    email,
    class: studentClass,
    phone,
    studentCode,
    avatar,
    activeLoansCount: Number(raw.activeLoansCount) || 0,
    totalLoansCount: Number(raw.totalLoansCount) || 0,
    joinedDate: raw.created_at ? new Date(raw.created_at).toLocaleDateString('pt-BR') : '2026-02-10',
  };
}

/**
 * Converts any raw loan item (Portuguese or English properties) to a valid Loan
 */
export function normalizeLoan(
  raw: any,
  booksMap: Map<string, Book>,
  studentsMap: Map<string, Student>,
  index: number = 0
): Loan {
  const studentId = raw.aluno_id || raw.studentId;
  const matchedStudent = studentId ? studentsMap.get(studentId) : undefined;
  const bookId = String(raw.livro_id || raw.bookId || '');
  const matchedBook = bookId ? booksMap.get(bookId) : undefined;

  const studentName = raw.aluno_nome || raw.studentName || matchedStudent?.name || 'Estudante';
  const studentClass = raw.aluno_turma || raw.studentClass || matchedStudent?.class || 'Ensino Médio';
  const studentCode = raw.codigo_aluno || raw.studentCode || matchedStudent?.studentCode || '';
  const studentEmail = raw.studentEmail || matchedStudent?.email || `${studentName.toLowerCase().replace(/\s+/g, '.')}@escola.ba.gov.br`;
  const studentAvatar = normalizeAvatarUrl(raw.studentAvatar || matchedStudent?.avatar, studentName);

  const bookTitle = raw.livro_titulo || raw.bookTitle || matchedBook?.title || 'Livro da Biblioteca';
  const bookAuthor = raw.livro_autor || raw.bookAuthor || matchedBook?.author || 'Autor da Obra';
  const bookCover = normalizeCoverUrl(raw.livro_capa || raw.bookCover || matchedBook?.cover, bookTitle);

  // Parse dates nicely
  const formatDateString = (dt: string | undefined | null) => {
    if (!dt) return '';
    if (dt.includes('T')) {
      const parts = dt.split('T')[0].split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    if (dt.includes('-')) {
      const parts = dt.split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dt;
  };

  const loanDate = formatDateString(raw.data_emprestimo || raw.loanDate) || new Date().toLocaleDateString('pt-BR');
  const returnDate = formatDateString(raw.data_devolucao_prevista || raw.returnDate) || '15/08/2026';
  const actualReturnDate = raw.data_devolucao || raw.actualReturnDate ? formatDateString(raw.data_devolucao || raw.actualReturnDate) : undefined;

  // Status mapping
  let status: 'devolvido' | 'em_andamento' | 'atrasado' = 'em_andamento';
  const rawStatus = String(raw.status || '').toLowerCase();
  if (rawStatus === 'devolvido' || actualReturnDate) {
    status = 'devolvido';
  } else if (rawStatus === 'atrasado') {
    status = 'atrasado';
  } else {
    status = 'em_andamento';
  }

  return {
    id: String(raw.id || `loan-${Date.now()}-${index}`),
    studentName,
    studentEmail,
    studentAvatar,
    studentClass,
    studentCode,
    bookId,
    bookTitle,
    bookAuthor,
    bookCover,
    loanDate,
    returnDate,
    ...(actualReturnDate ? { actualReturnDate } : {}),
    status,
    notes: raw.observacoes || raw.notes || '',
  };
}

/**
 * Converts any raw suggestion item to a valid Suggestion
 */
export function normalizeSuggestion(raw: any, index: number = 0): Suggestion {
  return {
    id: String(raw.id || `sug-${Date.now()}-${index}`),
    studentName: raw.aluno_nome || raw.studentName || 'Estudante',
    studentClass: raw.turma || raw.studentClass || '1º Ano',
    bookTitle: raw.titulo || raw.bookTitle || 'Livro Sugerido',
    author: raw.autor || raw.author || 'Autor',
    category: raw.categoria || raw.category || 'Geral',
    reason: raw.motivo || raw.reason || 'Recomendação de leitura para o acervo.',
    date: raw.created_at ? new Date(raw.created_at).toLocaleDateString('pt-BR') : raw.date || new Date().toLocaleDateString('pt-BR'),
    status: raw.status || 'pendente',
  };
}

export interface ParseResult {
  success: boolean;
  books?: Book[];
  loans?: Loan[];
  students?: Student[];
  suggestions?: Suggestion[];
  adminUsers?: AdminUser[];
  auditLogs?: AuditLog[];
  projectName?: string;
  generatedAt?: string;
  version?: number | string;
  summary: {
    totalLivros: number;
    totalAlunos: number;
    totalEmprestimos: number;
    totalSugestoes: number;
    totalAdministradores?: number;
    totalAuditoria?: number;
  };
  errorMessage?: string;
}

/**
 * Universal JSON parser for Biblioteca Maria Quitéria backups
 */
export function parseBackupJson(rawJson: string | object): ParseResult {
  try {
    let parsed: any;
    if (typeof rawJson === 'string') {
      parsed = JSON.parse(rawJson);
    } else {
      parsed = rawJson;
    }

    if (!parsed || typeof parsed !== 'object') {
      return {
        success: false,
        summary: { totalLivros: 0, totalAlunos: 0, totalEmprestimos: 0, totalSugestoes: 0 },
        errorMessage: 'O arquivo JSON não contém um objeto válido.',
      };
    }

    // Identify nested payload
    const dataContainer = parsed.dados || parsed.data || parsed;

    // Check for books
    const rawBooks = dataContainer.livros || dataContainer.books || parsed.livros || parsed.books;
    // Check for students
    const rawStudents = dataContainer.alunos || dataContainer.students || parsed.alunos || parsed.students;
    // Check for loans
    const rawLoans = dataContainer.emprestimos || dataContainer.loans || parsed.emprestimos || parsed.loans;
    // Check for suggestions
    const rawSuggestions =
      dataContainer.sugestoes_livros ||
      dataContainer.sugestoes ||
      dataContainer.suggestions ||
      parsed.sugestoes_livros ||
      parsed.sugestoes ||
      parsed.suggestions;
    // Check for admin users
    const rawAdminUsers = dataContainer.usuarios_administradores || dataContainer.adminUsers || parsed.usuarios_administradores || parsed.adminUsers;
    // Check for audit logs
    const rawAuditLogs = dataContainer.historico_auditoria || dataContainer.auditLogs || parsed.historico_auditoria || parsed.auditLogs;

    const hasAnyArray =
      Array.isArray(rawBooks) ||
      Array.isArray(rawStudents) ||
      Array.isArray(rawLoans) ||
      Array.isArray(rawSuggestions) ||
      Array.isArray(rawAdminUsers) ||
      Array.isArray(rawAuditLogs);

    if (!hasAnyArray) {
      return {
        success: false,
        summary: { totalLivros: 0, totalAlunos: 0, totalEmprestimos: 0, totalSugestoes: 0 },
        errorMessage:
          'Estrutura não reconhecida. O arquivo deve conter coleções de "livros", "alunos", "emprestimos" ou "sugestoes_livros".',
      };
    }

    // 1. Normalize books
    const books: Book[] = Array.isArray(rawBooks)
      ? rawBooks.map((b: any, idx: number) => normalizeBook(b, idx))
      : [];

    const booksMap = new Map<string, Book>();
    books.forEach((b) => booksMap.set(b.id, b));

    // 2. Normalize students
    const students: Student[] = Array.isArray(rawStudents)
      ? rawStudents.map((s: any, idx: number) => normalizeStudent(s, idx))
      : [];

    const studentsMap = new Map<string, Student>();
    students.forEach((s) => {
      studentsMap.set(s.id, s);
      if (s.studentCode) studentsMap.set(s.studentCode, s);
    });

    // 3. Normalize loans with books/students cross-references
    const loans: Loan[] = Array.isArray(rawLoans)
      ? rawLoans.map((l: any, idx: number) => normalizeLoan(l, booksMap, studentsMap, idx))
      : [];

    // 4. Update student loan counters from normalized loans
    students.forEach((student) => {
      const studentLoans = loans.filter(
        (l) =>
          (l.studentCode && l.studentCode === student.studentCode) ||
          l.studentName.toLowerCase() === student.name.toLowerCase()
      );
      student.totalLoansCount = studentLoans.length;
      student.activeLoansCount = studentLoans.filter(
        (l) => l.status === 'em_andamento' || l.status === 'atrasado'
      ).length;
    });

    // 5. Normalize suggestions
    const suggestions: Suggestion[] = Array.isArray(rawSuggestions)
      ? rawSuggestions.map((sg: any, idx: number) => normalizeSuggestion(sg, idx))
      : [];

    // 6. Admin users and Audit logs
    const adminUsers: AdminUser[] | undefined = Array.isArray(rawAdminUsers) ? rawAdminUsers : undefined;
    const auditLogs: AuditLog[] | undefined = Array.isArray(rawAuditLogs) ? rawAuditLogs : undefined;

    return {
      success: true,
      books: books.length > 0 ? books : undefined,
      students: students.length > 0 ? students : undefined,
      loans: loans.length > 0 ? loans : undefined,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      adminUsers,
      auditLogs,
      projectName: parsed.projeto || parsed.sistema || 'biblioteca-maria-quiteria',
      generatedAt: parsed.gerado_em || parsed.dataExportacao || new Date().toISOString(),
      version: parsed.versao || parsed.version || 1,
      summary: {
        totalLivros: books.length,
        totalAlunos: students.length,
        totalEmprestimos: loans.length,
        totalSugestoes: suggestions.length,
        totalAdministradores: adminUsers?.length || 0,
        totalAuditoria: auditLogs?.length || 0,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      summary: { totalLivros: 0, totalAlunos: 0, totalEmprestimos: 0, totalSugestoes: 0 },
      errorMessage: `Erro de sintaxe JSON: ${err.message || 'Arquivo corrompido'}`,
    };
  }
}
