// Type definitions for Biblioteca Maria Quitéria (CECMQ)

export interface Book {
  id: string;
  title: string;
  author?: string;
  cover?: string;
  category: string;
  rating?: number;
  reviewsCount?: number;
  status: 'disponivel' | 'emprestado' | 'manutencao' | 'reservado' | 'em_andamento' | string;
  pages?: number;
  year?: number;
  publisher?: string;
  location?: string;
  synopsis?: string;
  isbn?: string;
  totalCopies: number;
  availableCopies: number;
  featured?: boolean;
}

export interface Student {
  id: string;
  name: string;
  class: string;
  email?: string;
  phone?: string;
  studentCode: string;
  registration?: string;
  avatar?: string;
  activeLoansCount?: number;
  totalLoansCount?: number;
  joinedDate?: string;
  birthDate?: string;
  address?: string;
  notes?: string;
}

export interface Loan {
  id: string;
  studentId?: string;
  studentName: string;
  studentEmail?: string;
  studentAvatar?: string;
  studentClass?: string;
  studentCode?: string;
  bookId: string;
  bookTitle: string;
  bookAuthor?: string;
  bookCover?: string;
  loanDate: string;
  returnDate: string;
  actualReturnDate?: string;
  status: 'ativo' | 'devolvido' | 'atrasado' | 'em_andamento' | string;
  notes?: string;
}

export interface Suggestion {
  id: string;
  studentName: string;
  studentClass?: string;
  bookTitle: string;
  author: string;
  category?: string;
  reason?: string;
  date: string;
  status: 'pendente' | 'em_analise' | 'aprovado' | 'recusado' | 'adquirido';
}

export type AdminRole = 'superadmin' | 'bibliotecario' | 'assistente';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  roleLabel?: string;
  avatar: string;
  pin: string;
  status: 'ativo' | 'inativo';
  createdAt?: string;
  lastLogin?: string;
  phone?: string;
  notes?: string;
}

export type AuditActionCategory =
  | 'acesso'
  | 'livros'
  | 'emprestimos'
  | 'alunos'
  | 'sugestoes'
  | 'autores'
  | 'administradores'
  | 'usuarios_adm'
  | 'sistema'
  | 'backup'
  | 'geral';

export interface AuditLog {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  adminAvatar?: string;
  adminRole?: string;
  actionType?: string;
  actionCategory: AuditActionCategory;
  title: string;
  details: string;
  targetId?: string;
  targetName?: string;
}

export interface AuthorQuote {
  text: string;
  source?: string;
}

export interface AuthorItem {
  id: string;
  name: string;
  period?: string;
  role?: string;
  tag?: string;
  photoUrl: string;
  featuredQuote: string;
  quoteSource?: string;
  referenceUrl?: string;
  additionalQuotes?: AuthorQuote[];
  active?: boolean;
  createdAt?: string;
}

export type ActiveTab =
  | 'inicio'
  | 'catalogo'
  | 'ranking'
  | 'missao_quiterio'
  | 'meu_historico'
  | 'emprestimos'
  | 'sugestoes'
  | 'sobre'
  | 'admin'
  | 'relatorios'
  | 'mobile_view';

export type MobileTab = 'inicio' | 'catalogo' | 'emprestimos' | 'perfil' | 'sobre';

export type AdminSection =
  | 'dashboard'
  | 'livros'
  | 'alunos'
  | 'emprestimos'
  | 'carteirinhas'
  | 'autores'
  | 'sugestoes'
  | 'usuarios_adm'
  | 'auditoria'
  | 'configuracoes'
  | 'backup';

export interface UserSession {
  role: 'visitante' | 'aluno' | 'admin' | 'student' | 'guest';
  student?: Student | null;
  admin?: AdminUser | null;
  timestamp?: string;
}
