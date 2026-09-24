import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { BookCatalog } from './components/BookCatalog';
import { BookDetailModal } from './components/BookDetailModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ReportsView } from './components/ReportsView';
import { MobileSimulator } from './components/MobileSimulator';
import { LoansView } from './components/LoansView';
import { SuggestionsView } from './components/SuggestionsView';
import { AboutView } from './components/AboutView';
import { DesignSystemModal } from './components/DesignSystemModal';
import { LoanModal } from './components/LoanModal';
import { ManageBooksModal } from './components/ManageBooksModal';
import { RegisterBookModal } from './components/RegisterBookModal';
import { AuthModal } from './components/AuthModal';
import { StudentPortalView } from './components/StudentPortalView';
import { RankingView } from './components/RankingView';
import { MissaoQuiterioView } from './components/MissaoQuiterioView';
import { LibrasAccessibilityModal } from './components/LibrasAccessibilityModal';
import { Footer } from './components/Footer';

import {
  INITIAL_BOOKS,
  INITIAL_LOANS,
  INITIAL_STUDENTS,
  INITIAL_SUGGESTIONS,
  INITIAL_ADMIN_USERS,
  INITIAL_AUDIT_LOGS,
} from './data/mockData';
import { Book, Loan, Student, Suggestion, ActiveTab, UserSession, AdminUser, AuditLog, AuditActionCategory } from './types';
import { useTheme } from './context/ThemeContext';
import {
  testConnection,
  subscribeToBooks,
  subscribeToLoans,
  subscribeToStudents,
  subscribeToSuggestions,
  subscribeToAdminUsers,
  subscribeToAuditLogs,
  saveBookToCloud,
  deleteBookFromCloud,
  saveLoanToCloud,
  deleteLoanFromCloud,
  saveStudentToCloud,
  deleteStudentFromCloud,
  saveSuggestionToCloud,
  deleteSuggestionFromCloud,
  saveAdminUserToCloud,
  deleteAdminUserFromCloud,
  saveAuditLogToCloud,
  seedCloudDatabaseIfEmpty,
  pushAllLocalDataToCloud,
} from './services/firebase';

export default function App() {
  const { isDark, isKinetic, isOcean, isPurple, isEmerald } = useTheme();
  const DB_VERSION = 'bmq_db_v10_ordem_alfabetica';

  // Cloud Synchronization state across multiple computers
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'connecting' | 'synced' | 'syncing' | 'offline'>('connecting');
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<Date | null>(null);

  const [books, setBooks] = useState<Book[]>(() => {
    const version = localStorage.getItem('bmq_db_version');
    const sortedInitBooks = [...INITIAL_BOOKS].sort((a, b) =>
      a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' })
    );
    const sortedInitStudents = [...INITIAL_STUDENTS].sort((a, b) =>
      a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
    );

    if (version !== DB_VERSION) {
      localStorage.setItem('bmq_db_version', DB_VERSION);
      localStorage.setItem('bmq_books', JSON.stringify(sortedInitBooks));
      localStorage.setItem('bmq_loans', JSON.stringify(INITIAL_LOANS));
      localStorage.setItem('bmq_students', JSON.stringify(sortedInitStudents));
      localStorage.setItem('bmq_suggestions', JSON.stringify(INITIAL_SUGGESTIONS));
      localStorage.setItem('bmq_admin_users', JSON.stringify(INITIAL_ADMIN_USERS));
      localStorage.setItem('bmq_audit_logs', JSON.stringify(INITIAL_AUDIT_LOGS));
      return sortedInitBooks;
    }
    const saved = localStorage.getItem('bmq_books');
    const parsed: Book[] = saved ? JSON.parse(saved) : sortedInitBooks;
    return parsed.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' }));
  });

  const [loans, setLoans] = useState<Loan[]>(() => {
    const version = localStorage.getItem('bmq_db_version');
    if (version !== DB_VERSION) return INITIAL_LOANS;
    const saved = localStorage.getItem('bmq_loans');
    if (!saved) return INITIAL_LOANS;
    const parsed: Loan[] = JSON.parse(saved);
    return parsed.map((l) => ({
      ...l,
      studentCode: l.studentCode ? l.studentCode.replace(/^ALU-/, '') : undefined,
    }));
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const version = localStorage.getItem('bmq_db_version');
    const sortedInitStudents = [...INITIAL_STUDENTS].sort((a, b) =>
      a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
    );
    if (version !== DB_VERSION) return sortedInitStudents;
    const saved = localStorage.getItem('bmq_students');
    if (!saved) return sortedInitStudents;
    const parsed: Student[] = JSON.parse(saved);
    return parsed
      .map((s) => ({
        ...s,
        studentCode: s.studentCode ? s.studentCode.replace(/^ALU-/, '') : s.studentCode,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));
  });

  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => {
    const version = localStorage.getItem('bmq_db_version');
    if (version !== DB_VERSION) return INITIAL_SUGGESTIONS;
    const saved = localStorage.getItem('bmq_suggestions');
    return saved ? JSON.parse(saved) : INITIAL_SUGGESTIONS;
  });

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    const version = localStorage.getItem('bmq_db_version');
    if (version !== DB_VERSION) return INITIAL_ADMIN_USERS;
    const saved = localStorage.getItem('bmq_admin_users');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const version = localStorage.getItem('bmq_db_version');
    if (version !== DB_VERSION) return INITIAL_AUDIT_LOGS;
    const saved = localStorage.getItem('bmq_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('bmq_favorites');
    return saved ? JSON.parse(saved) : [INITIAL_BOOKS[0]?.id || ''];
  });

  // User Security & Auth Session (Sessão temporária por aba/navegador - fecha o navegador, encerra o login)
  const [session, setSession] = useState<UserSession>(() => {
    // 1. Limpa resquícios antigos do localStorage para impedir que usuários fiquem permanentemente logados
    try {
      localStorage.removeItem('bmq_auth_session');
    } catch (e) {
      // Ignora restrições de sandbox se houver
    }

    // 2. Lê exclusivamente do sessionStorage (expira automaticamente ao fechar a aba/navegador)
    try {
      const savedSession = sessionStorage.getItem('bmq_auth_session');
      if (savedSession) {
        return JSON.parse(savedSession);
      }
    } catch (e) {
      return { role: 'guest' };
    }
    return { role: 'guest' };
  });

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'student' | 'admin'>('student');
  const [authTargetFeature, setAuthTargetFeature] = useState<string>('');
  const [authModalKey, setAuthModalKey] = useState(0);

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('inicio');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isManageBooksOpen, setIsManageBooksOpen] = useState(false);
  const [isRegisterBookOpen, setIsRegisterBookOpen] = useState(false);
  const [isDesignSystemOpen, setIsDesignSystemOpen] = useState(false);
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('bmq_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('bmq_loans', JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem('bmq_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('bmq_suggestions', JSON.stringify(suggestions));
  }, [suggestions]);

  useEffect(() => {
    localStorage.setItem('bmq_admin_users', JSON.stringify(adminUsers));
  }, [adminUsers]);

  useEffect(() => {
    localStorage.setItem('bmq_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('bmq_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    try {
      if (session.role === 'guest') {
        sessionStorage.removeItem('bmq_auth_session');
        localStorage.removeItem('bmq_auth_session');
      } else {
        sessionStorage.setItem('bmq_auth_session', JSON.stringify(session));
        localStorage.removeItem('bmq_auth_session'); // Garante que nunca fique no localStorage
      }
    } catch (e) {
      // Ignora restrições se sessionStorage não estiver disponível
    }
  }, [session]);

  // Sincronização em Nuvem (Multi-computadores) via Firebase Firestore
  useEffect(() => {
    let isSubscribed = true;

    async function initCloudSync() {
      try {
        setCloudSyncStatus('connecting');
        const isOnline = await testConnection();
        if (!isOnline) {
          if (isSubscribed) setCloudSyncStatus('offline');
          return;
        }

        // Garante que o banco em nuvem possua os dados iniciais se estiver vazio
        await seedCloudDatabaseIfEmpty({
          books,
          loans,
          students,
          suggestions,
          adminUsers,
          auditLogs,
        });

        if (isSubscribed) {
          setCloudSyncStatus('synced');
          setLastCloudSyncTime(new Date());
        }
      } catch (err) {
        console.error('Erro na inicialização da sincronização em nuvem:', err);
        if (isSubscribed) setCloudSyncStatus('offline');
      }
    }

    initCloudSync();

    // Listeners em tempo real para sincronização contínua com outros computadores na web
    const unsubBooks = subscribeToBooks((cloudBooks) => {
      if (cloudBooks && cloudBooks.length > 0) {
        setBooks((prev) => {
          const sorted = [...cloudBooks].sort((a, b) =>
            a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' })
          );
          return sorted;
        });
        setCloudSyncStatus('synced');
        setLastCloudSyncTime(new Date());
      }
    });

    const unsubLoans = subscribeToLoans((cloudLoans) => {
      if (cloudLoans) {
        setLoans(cloudLoans);
        setCloudSyncStatus('synced');
        setLastCloudSyncTime(new Date());
      }
    });

    const unsubStudents = subscribeToStudents((cloudStudents) => {
      if (cloudStudents && cloudStudents.length > 0) {
        setStudents((prev) => {
          const sorted = [...cloudStudents].sort((a, b) =>
            a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
          );
          return sorted;
        });
        setCloudSyncStatus('synced');
        setLastCloudSyncTime(new Date());
      }
    });

    const unsubSuggestions = subscribeToSuggestions((cloudSuggestions) => {
      if (cloudSuggestions) {
        setSuggestions(cloudSuggestions);
        setCloudSyncStatus('synced');
      }
    });

    const unsubAdmins = subscribeToAdminUsers((cloudAdmins) => {
      if (cloudAdmins && cloudAdmins.length > 0) {
        setAdminUsers(cloudAdmins);
        setCloudSyncStatus('synced');
      }
    });

    const unsubLogs = subscribeToAuditLogs((cloudLogs) => {
      if (cloudLogs && cloudLogs.length > 0) {
        setAuditLogs(cloudLogs);
        setCloudSyncStatus('synced');
      }
    });

    return () => {
      isSubscribed = false;
      unsubBooks();
      unsubLoans();
      unsubStudents();
      unsubSuggestions();
      unsubAdmins();
      unsubLogs();
    };
  }, []);

  // Forçar sincronização completa para a nuvem
  const handleManualSyncToCloud = async () => {
    setCloudSyncStatus('syncing');
    try {
      await pushAllLocalDataToCloud({
        books,
        loans,
        students,
        suggestions,
        adminUsers,
        auditLogs,
      });
      setCloudSyncStatus('synced');
      setLastCloudSyncTime(new Date());
    } catch (e) {
      setCloudSyncStatus('offline');
      throw e;
    }
  };

  // Centralized Audit Logger function
  const logAuditEvent = (
    actionCategory: AuditActionCategory,
    title: string,
    details: string,
    targetName?: string,
    customAdmin?: AdminUser
  ) => {
    const currentAdmin = customAdmin || session.admin || adminUsers[0] || INITIAL_ADMIN_USERS[0];
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: `${dateStr} às ${timeStr}`,
      adminId: currentAdmin.id,
      adminName: currentAdmin.name,
      adminAvatar: currentAdmin.avatar,
      adminRole: currentAdmin.roleLabel,
      actionCategory,
      title,
      details,
      targetName,
    };

    setAuditLogs((prev) => [newLog, ...prev]);
    saveAuditLogToCloud(newLog).catch(console.error);
  };

  // Auth Triggers
  const handleOpenLogin = (mode: 'student' | 'admin' = 'student', featureName: string = '') => {
    setAuthModalMode(mode);
    setAuthTargetFeature(featureName);
    setAuthModalKey((k) => k + 1);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (newSession: UserSession) => {
    setSession(newSession);
    if (newSession.role === 'admin') {
      const activeAdm = newSession.admin || adminUsers[0] || INITIAL_ADMIN_USERS[0];
      const nowStr = new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      // Update lastLogin on AdminUser
      setAdminUsers((prev) =>
        prev.map((adm) => (adm.id === activeAdm.id ? { ...adm, lastLogin: nowStr } : adm))
      );

      logAuditEvent(
        'acesso',
        'Login Administrativo Realizado',
        `Acesso autenticado ao Painel Administrativo da Biblioteca Maria Quitéria por ${activeAdm.name}.`,
        activeAdm.name,
        activeAdm
      );

      setActiveTab('admin');
    } else if (newSession.role === 'student') {
      setActiveTab('meu_historico');
    }
  };

  const handleLogout = () => {
    if (session.role === 'admin' && session.admin) {
      logAuditEvent(
        'acesso',
        'Logout Administrativo',
        `Sessão administrativa encerrada por ${session.admin.name}.`,
        session.admin.name
      );
    }
    try {
      sessionStorage.removeItem('bmq_auth_session');
      localStorage.removeItem('bmq_auth_session');
    } catch (e) {}
    setSession({ role: 'guest' });
    setActiveTab('inicio');
    setIsAuthModalOpen(false);
    setAuthModalKey((k) => k + 1);
  };

  // Safe Navigation Handler with Security Checks
  const handleNavigateTab = (tab: ActiveTab) => {
    if (tab === 'admin' || tab === 'relatorios') {
      if (session.role !== 'admin') {
        handleOpenLogin('admin', tab === 'admin' ? 'Painel Administrativo' : 'Relatórios');
        return;
      }
    }
    if (tab === 'meu_historico') {
      if (session.role !== 'student' || !session.student) {
        handleOpenLogin('student', 'Meu Histórico de Empréstimos');
        return;
      }
    }
    setActiveTab(tab);
  };

  // Book Selection & Loan Request
  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
  };

  const handleRequestLoan = (book: Book) => {
    setSelectedBook(book);
    setIsLoanModalOpen(true);
  };

  const handleConfirmLoan = (loanData: Omit<Loan, 'id'>) => {
    const newLoan: Loan = {
      ...loanData,
      id: `l_${Date.now()}`,
    };

    setLoans((prev) => [newLoan, ...prev]);
    saveLoanToCloud(newLoan).catch(console.error);

    // Decrement available copy
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === loanData.bookId) {
          const updatedBook = {
            ...b,
            availableCopies: Math.max(0, b.availableCopies - 1),
            status: b.availableCopies - 1 <= 0 ? ('reservado' as const) : b.status,
          };
          saveBookToCloud(updatedBook).catch(console.error);
          return updatedBook;
        }
        return b;
      })
    );

    // Audit log
    logAuditEvent(
      'emprestimos',
      'Novo Empréstimo Registrado',
      `Empréstimo do livro "${loanData.bookTitle}" emitido para ${loanData.studentName} (${loanData.studentClass}). Devolução prevista para ${loanData.returnDate}.`,
      loanData.bookTitle
    );
  };

  const handleReturnLoan = (loanId: string) => {
    const targetLoan = loans.find((l) => l.id === loanId);
    if (!targetLoan) return;

    const todayStr = new Date().toLocaleDateString('pt-BR');
    const updatedLoan: Loan = { ...targetLoan, status: 'devolvido', actualReturnDate: todayStr };

    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId ? updatedLoan : l
      )
    );
    saveLoanToCloud(updatedLoan).catch(console.error);

    // Increment available copy
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === targetLoan.bookId) {
          const restoredBook: Book = {
            ...b,
            availableCopies: Math.min(b.totalCopies, b.availableCopies + 1),
            status: 'disponivel',
          };
          saveBookToCloud(restoredBook).catch(console.error);
          return restoredBook;
        }
        return b;
      })
    );

    // Audit log
    logAuditEvent(
      'emprestimos',
      'Livro Devolvido ao Acervo',
      `Devolução do livro "${targetLoan.bookTitle}" concluída com sucesso. Aluno: ${targetLoan.studentName}.`,
      targetLoan.bookTitle
    );
  };

  const handleRenewLoan = (loanId: string) => {
    const targetLoan = loans.find((l) => l.id === loanId);
    let newDateStr = '';

    setLoans((prev) =>
      prev.map((l) => {
        if (l.id === loanId) {
          const [d, m, y] = l.returnDate.split('/').map(Number);
          const currentReturn = new Date(y, m - 1, d);
          currentReturn.setDate(currentReturn.getDate() + 7);
          newDateStr = currentReturn.toLocaleDateString('pt-BR');
          const renewedLoan: Loan = { ...l, returnDate: newDateStr, status: 'em_andamento' };
          saveLoanToCloud(renewedLoan).catch(console.error);
          return renewedLoan;
        }
        return l;
      })
    );

    if (targetLoan) {
      logAuditEvent(
        'emprestimos',
        'Prazo de Empréstimo Renovado',
        `Prazo do livro "${targetLoan.bookTitle}" estendido em +7 dias para ${targetLoan.studentName} (novo vencimento: ${newDateStr}).`,
        targetLoan.bookTitle
      );
    }
  };

  const handleAddSuggestion = (
    newSug: Omit<Suggestion, 'id' | 'date' | 'status'>
  ) => {
    const item: Suggestion = {
      ...newSug,
      id: `sg_${Date.now()}`,
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'pendente',
    };
    setSuggestions((prev) => [item, ...prev]);
    saveSuggestionToCloud(item).catch(console.error);
  };

  const handleDeleteSuggestion = (suggestionId: string) => {
    if (session.role !== 'admin') {
      handleOpenLogin('admin', 'Excluir Sugestão');
      return;
    }
    const target = suggestions.find((s) => s.id === suggestionId);
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
    deleteSuggestionFromCloud(suggestionId).catch(console.error);

    logAuditEvent(
      'sugestoes',
      'Sugestão de Livro Excluída',
      `A sugestão "${target?.bookTitle || 'Sem título'}" indicada por ${target?.studentName || 'Estudante'} foi removida do painel.`,
      target?.bookTitle
    );
  };

  const handleUpdateSuggestionStatus = (
    suggestionId: string,
    status: 'aprovado' | 'recusado' | 'pendente'
  ) => {
    if (session.role !== 'admin') {
      handleOpenLogin('admin', 'Moderar Sugestão');
      return;
    }
    const target = suggestions.find((s) => s.id === suggestionId);
    if (target) {
      const updated = { ...target, status };
      setSuggestions((prev) =>
        prev.map((s) => (s.id === suggestionId ? updated : s))
      );
      saveSuggestionToCloud(updated).catch(console.error);
    }

    const statusText = status === 'aprovado' ? 'APROVADA para aquisição' : status === 'recusado' ? 'RECUSADA' : 'PENDENTE';
    logAuditEvent(
      'sugestoes',
      `Sugestão de Livro Moderada: ${status.toUpperCase()}`,
      `Sugestão "${target?.bookTitle}" marcada como ${statusText}. Indicado por: ${target?.studentName}.`,
      target?.bookTitle
    );
  };

  const handleToggleFavorite = (bookId: string) => {
    setFavorites((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('catalogo');
  };

  const handleSaveBook = (updatedBook: Book) => {
    if (session.role !== 'admin') {
      handleOpenLogin('admin', 'Alterar Livro');
      return;
    }
    setBooks((prev) =>
      prev
        .map((b) => (b.id === updatedBook.id ? updatedBook : b))
        .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' }))
    );
    saveBookToCloud(updatedBook).catch(console.error);

    setLoans((prev) =>
      prev.map((l) =>
        l.bookId === updatedBook.id
          ? {
              ...l,
              bookTitle: updatedBook.title,
              bookAuthor: updatedBook.author,
              bookCover: updatedBook.cover,
            }
          : l
      )
    );
    if (selectedBook?.id === updatedBook.id) {
      setSelectedBook(updatedBook);
    }

    logAuditEvent(
      'livros',
      'Dados de Livro Atualizados',
      `Informações da obra "${updatedBook.title}" (Autor: ${updatedBook.author}, Exemplares: ${updatedBook.totalCopies}) foram editadas no acervo.`,
      updatedBook.title
    );
  };

  const handleCreateBook = (newBook: Book) => {
    if (session.role !== 'admin') {
      handleOpenLogin('admin', 'Cadastrar Novo Livro');
      return;
    }
    setBooks((prev) =>
      [...prev, newBook].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' }))
    );
    saveBookToCloud(newBook).catch(console.error);

    logAuditEvent(
      'livros',
      'Novo Livro Cadastrado no Acervo',
      `Obra "${newBook.title}" cadastrada com sucesso. Categoria: ${newBook.category}, Quantidade: ${newBook.totalCopies} exemplares.`,
      newBook.title
    );
  };

  const handleRegisterBook = (newBook: Book) => {
    setBooks((prev) =>
      [...prev, newBook].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' }))
    );
    saveBookToCloud(newBook).catch(console.error);

    logAuditEvent(
      'livros',
      'Novo Livro Cadastrado / Compartilhado',
      `Obra "${newBook.title}" (Autor: ${newBook.author}, Categoria: ${newBook.category}) adicionada à biblioteca escolar.`,
      newBook.title
    );
  };

  const handleDeleteBook = (bookId: string) => {
    if (session.role !== 'admin') {
      handleOpenLogin('admin', 'Excluir Livro');
      return;
    }
    const targetBook = books.find((b) => b.id === bookId);
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    deleteBookFromCloud(bookId).catch(console.error);
    if (selectedBook?.id === bookId) {
      setSelectedBook(null);
    }

    logAuditEvent(
      'livros',
      'Livro Removido do Acervo',
      `A obra "${targetBook?.title || bookId}" foi permanentemente removida do catálogo da biblioteca.`,
      targetBook?.title
    );
  };

  const handleSaveStudent = (updatedStudent: Student) => {
    if (session.role !== 'admin') {
      handleOpenLogin('admin', 'Editar Cadastro de Aluno');
      return;
    }
    setStudents((prev) =>
      prev
        .map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
        .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }))
    );
    saveStudentToCloud(updatedStudent).catch(console.error);

    setLoans((prev) =>
      prev.map((l) =>
        l.studentCode === updatedStudent.studentCode || l.studentName === updatedStudent.name
          ? {
              ...l,
              studentName: updatedStudent.name,
              studentAvatar: updatedStudent.avatar,
              studentClass: updatedStudent.class,
            }
          : l
      )
    );

    logAuditEvent(
      'alunos',
      'Cadastro de Aluno Atualizado',
      `Ficha cadastral do estudante ${updatedStudent.name} (Turma: ${updatedStudent.class}, Código: ${updatedStudent.studentCode}) foi atualizada.`,
      updatedStudent.name
    );
  };

  const handleCreateStudent = (newStudent: Student) => {
    if (session.role !== 'admin') {
      handleOpenLogin('admin', 'Cadastrar Aluno');
      return;
    }
    setStudents((prev) =>
      [...prev, newStudent].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }))
    );
    saveStudentToCloud(newStudent).catch(console.error);

    logAuditEvent(
      'alunos',
      'Novo Aluno Cadastrado',
      `Estudante ${newStudent.name} registrado com sucesso na turma ${newStudent.class} com código ${newStudent.studentCode}.`,
      newStudent.name
    );
  };

  const handleDeleteStudent = (studentId: string) => {
    if (session.role !== 'admin') {
      handleOpenLogin('admin', 'Excluir Aluno');
      return;
    }
    const targetStudent = students.find((s) => s.id === studentId);
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    deleteStudentFromCloud(studentId).catch(console.error);

    logAuditEvent(
      'alunos',
      'Cadastro de Aluno Excluído',
      `Registro do estudante ${targetStudent?.name || studentId} (${targetStudent?.class}) foi removido do sistema.`,
      targetStudent?.name
    );
  };

  // ADMIN USER CRUD HANDLERS
  const handleCreateAdminUser = (newAdmin: AdminUser) => {
    if (session.role !== 'admin') {
      handleOpenLogin('admin', 'Cadastrar Administrador');
      return;
    }
    const updatedList = [newAdmin, ...adminUsers];
    setAdminUsers(updatedList);
    try {
      localStorage.setItem('bmq_admin_users', JSON.stringify(updatedList));
    } catch (e) {}
    saveAdminUserToCloud(newAdmin).catch(console.error);

    logAuditEvent(
      'usuarios_adm',
      'Novo Administrador Cadastrado',
      `Novo administrador ${newAdmin.name} (${newAdmin.roleLabel}) foi adicionado à equipe com acesso autorizado.`,
      newAdmin.name
    );
  };

  const handleSaveAdminUser = (updatedAdmin: AdminUser) => {
    if (session.role !== 'admin') {
      handleOpenLogin('admin', 'Editar Administrador');
      return;
    }
    
    // Atualiza a lista de administradores e persiste imediatamente para invalidar a senha antiga
    const updatedList = adminUsers.map((a) => (a.id === updatedAdmin.id ? updatedAdmin : a));
    setAdminUsers(updatedList);
    try {
      localStorage.setItem('bmq_admin_users', JSON.stringify(updatedList));
    } catch (e) {}
    saveAdminUserToCloud(updatedAdmin).catch(console.error);

    // Se o administrador atual da sessão foi o alterado, atualiza o perfil em tempo real
    if (session.admin && session.admin.id === updatedAdmin.id) {
      setSession({
        ...session,
        admin: updatedAdmin,
      });
    }

    logAuditEvent(
      'usuarios_adm',
      'Perfil de Administrador Editado',
      `Privilégios e senha de ${updatedAdmin.name} (${updatedAdmin.roleLabel}) foram modificados. A senha anterior foi completamente invalidada.`,
      updatedAdmin.name
    );
  };

  const handleDeleteAdminUser = (adminId: string) => {
    if (session.role !== 'admin') {
      handleOpenLogin('admin', 'Excluir Administrador');
      return;
    }
    const targetAdmin = adminUsers.find((a) => a.id === adminId);
    const updatedList = adminUsers.filter((a) => a.id !== adminId);
    setAdminUsers(updatedList);
    try {
      localStorage.setItem('bmq_admin_users', JSON.stringify(updatedList));
    } catch (e) {}
    deleteAdminUserFromCloud(adminId).catch(console.error);

    if (session.admin && session.admin.id === adminId) {
      handleLogout();
    }

    logAuditEvent(
      'usuarios_adm',
      'Administrador Excluído',
      `O usuário administrativo ${targetAdmin?.name || adminId} foi removido do sistema com revogação de acessos.`,
      targetAdmin?.name
    );
  };

  const handleToggleAdminStatus = (adminUser: AdminUser) => {
    if (session.role !== 'admin') {
      handleOpenLogin('admin', 'Alterar Status do Administrador');
      return;
    }
    const newStatus = adminUser.status === 'ativo' ? 'inativo' : 'ativo';
    const updated = { ...adminUser, status: newStatus as 'ativo' | 'inativo' };

    setAdminUsers((prev) =>
      prev.map((a) => (a.id === adminUser.id ? updated : a))
    );
    saveAdminUserToCloud(updated).catch(console.error);

    logAuditEvent(
      'usuarios_adm',
      `Status do Administrador Alterado para ${newStatus.toUpperCase()}`,
      `A conta de ${adminUser.name} (${adminUser.roleLabel}) foi ${newStatus === 'ativo' ? 'ativada' : 'desativada'}.`,
      adminUser.name
    );
  };

  const handleClearAuditLogs = () => {
    if (session.role !== 'admin') {
      handleOpenLogin('admin', 'Limpar Auditoria');
      return;
    }
    setAuditLogs([]);
    logAuditEvent(
      'sistema',
      'Histórico de Auditoria Limpo',
      'O registro histórico de auditoria foi reiniciado pelo administrador.',
      'Auditoria'
    );
  };

  const handleRestoreData = (data: {
    books?: Book[];
    loans?: Loan[];
    students?: Student[];
    suggestions?: Suggestion[];
    adminUsers?: AdminUser[];
    auditLogs?: AuditLog[];
  }) => {
    if (session.role !== 'admin') {
      handleOpenLogin('admin', 'Restaurar Dados');
      return;
    }
    if (data.books) setBooks(data.books);
    if (data.loans) setLoans(data.loans);
    if (data.students) setStudents(data.students);
    if (data.suggestions) setSuggestions(data.suggestions);
    if (data.adminUsers) setAdminUsers(data.adminUsers);
    if (data.auditLogs) setAuditLogs(data.auditLogs);

    // Sincroniza os dados restaurados com a nuvem para que outros computadores vejam a restauração
    pushAllLocalDataToCloud({
      books: data.books || books,
      loans: data.loans || loans,
      students: data.students || students,
      suggestions: data.suggestions || suggestions,
      adminUsers: data.adminUsers || adminUsers,
      auditLogs: data.auditLogs || auditLogs,
    }).catch(console.error);

    logAuditEvent(
      'sistema',
      'Restauração de Backup Concluída',
      `Restauração completa de dados realizada com sucesso. Total restaurado: ${data.books?.length || 0} livros, ${data.students?.length || 0} alunos.`,
      'Backup & Restauração'
    );
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isEmerald
          ? 'bg-[#021726] text-slate-100 selection:bg-[#00e676] selection:text-slate-950'
          : isPurple
          ? 'bg-[#13072b] text-slate-100 selection:bg-purple-500 selection:text-white'
          : isKinetic
          ? 'bg-[#0c1014] text-slate-100 selection:bg-[#0088cc] selection:text-white'
          : isOcean
          ? 'bg-[#001424] text-slate-100 selection:bg-cyan-500 selection:text-slate-950'
          : 'bg-[#00101c] text-slate-100 selection:bg-emerald-500 selection:text-slate-950'
      }`}
    >
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        onOpenDesignSystem={() => setIsDesignSystemOpen(true)}
        onOpenRegisterBook={() => setIsRegisterBookOpen(true)}
        onOpenAccessibility={() => setIsAccessibilityModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        session={session}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
        cloudSyncStatus={cloudSyncStatus}
        lastSyncTime={lastCloudSyncTime}
        books={books}
        loans={loans}
        students={students}
        suggestions={suggestions}
        adminUsers={adminUsers}
        auditLogs={auditLogs}
        onManualSyncTrigger={handleManualSyncToCloud}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {/* TAB 1: INÍCIO (Hero + Destaques da Biblioteca) */}
        {activeTab === 'inicio' && (
          <div className="space-y-6">
            <HeroBanner
              books={books}
              loans={loans}
              students={students}
              onSelectBook={handleSelectBook}
              onViewCatalog={() => setActiveTab('catalogo')}
              onViewRanking={() => setActiveTab('ranking')}
              onViewMissaoQuiterio={() => setActiveTab('missao_quiterio')}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearchSubmit={handleSearchSubmit}
            />
          </div>
        )}

        {/* TAB 2: CATÁLOGO */}
        {activeTab === 'catalogo' && (
          <BookCatalog
            books={books}
            onSelectBook={handleSelectBook}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenRegisterBook={() => setIsRegisterBookOpen(true)}
            onOpenSuggestions={() => setActiveTab('sugestoes')}
          />
        )}

        {/* TAB: RANKING DE LEITORES E MAIS LIDOS */}
        {activeTab === 'ranking' && (
          <RankingView
            books={books}
            loans={loans}
            students={students}
            onSelectBook={handleSelectBook}
            onBackToHome={() => setActiveTab('inicio')}
            onNavigateToQuiterio={() => setActiveTab('missao_quiterio')}
          />
        )}

        {/* TAB: MISSÃO QUITÉRIO (Jogo de Perguntas Literárias) */}
        {activeTab === 'missao_quiterio' && (
          <MissaoQuiterioView
            books={books}
            loans={loans}
            students={students}
            currentSession={session}
            onSelectBook={handleSelectBook}
            onNavigateToCatalog={() => setActiveTab('catalogo')}
            onNavigateToRanking={() => setActiveTab('ranking')}
            onBackToHome={() => setActiveTab('inicio')}
          />
        )}

        {/* TAB: MEU HISTÓRICO (Área Exclusiva do Aluno) */}
        {activeTab === 'meu_historico' && session.student && (
          <StudentPortalView
            student={session.student}
            loans={loans}
            books={books}
            onOpenCatalog={() => setActiveTab('catalogo')}
            onLogout={handleLogout}
            onRequestReturn={handleReturnLoan}
          />
        )}

        {/* TAB 3: EMPRÉSTIMOS GERAIS */}
        {activeTab === 'emprestimos' && (
          <LoansView
            loans={loans}
            onOpenNewLoan={() => {
              const firstAvail = books.find((b) => b.availableCopies > 0) || books[0];
              setSelectedBook(firstAvail);
              setIsLoanModalOpen(true);
            }}
            onReturnLoan={handleReturnLoan}
            onRenewLoan={handleRenewLoan}
          />
        )}

        {/* TAB 4: SUGESTÕES */}
        {activeTab === 'sugestoes' && (
          <SuggestionsView
            suggestions={suggestions}
            onAddSuggestion={handleAddSuggestion}
          />
        )}

        {/* TAB 5: SOBRE */}
        {activeTab === 'sobre' && (
          <AboutView onBackToCatalog={() => setActiveTab('catalogo')} />
        )}

        {/* TAB 6: ADMIN DASHBOARD (Painel 4 - Protegido por Senha) */}
        {activeTab === 'admin' && session.role === 'admin' && (
          <AdminDashboard
            books={books}
            loans={loans}
            students={students}
            suggestions={suggestions}
            adminUsers={adminUsers}
            auditLogs={auditLogs}
            currentSessionAdmin={session.admin}
            onOpenBookDetail={handleSelectBook}
            onOpenNewLoan={() => {
              const firstAvail = books.find((b) => b.availableCopies > 0) || books[0];
              setSelectedBook(firstAvail);
              setIsLoanModalOpen(true);
            }}
            onOpenNewBook={() => setIsRegisterBookOpen(true)}
            onOpenManageBooks={() => setIsManageBooksOpen(true)}
            onSaveStudent={handleSaveStudent}
            onCreateStudent={handleCreateStudent}
            onDeleteStudent={handleDeleteStudent}
            onCreateAdminUser={handleCreateAdminUser}
            onSaveAdminUser={handleSaveAdminUser}
            onDeleteAdminUser={handleDeleteAdminUser}
            onToggleAdminStatus={handleToggleAdminStatus}
            onClearAuditLogs={handleClearAuditLogs}
            onRestoreData={handleRestoreData}
            onReturnLoan={handleReturnLoan}
            onRenewLoan={handleRenewLoan}
            onDeleteSuggestion={handleDeleteSuggestion}
            onUpdateSuggestionStatus={handleUpdateSuggestionStatus}
            setActiveTab={handleNavigateTab}
            onLogout={handleLogout}
            cloudSyncStatus={cloudSyncStatus}
            lastSyncTime={lastCloudSyncTime}
            onManualSyncTrigger={handleManualSyncToCloud}
          />
        )}

        {/* TAB 7: RELATÓRIOS (Painel 5 - Protegido e 100% Dinâmico) */}
        {activeTab === 'relatorios' && session.role === 'admin' && (
          <ReportsView loans={loans} books={books} students={students} />
        )}

        {/* TAB 8: MOBILE SIMULATOR */}
        {activeTab === 'mobile_view' && (
          <MobileSimulator
            books={books}
            loans={loans}
            onSelectBook={handleSelectBook}
            onOpenRegisterBook={() => setIsRegisterBookOpen(true)}
          />
        )}
      </main>

      {/* Register Book Modal (com Câmera Fotográfica de Smartphone) */}
      <RegisterBookModal
        isOpen={isRegisterBookOpen}
        onClose={() => setIsRegisterBookOpen(false)}
        onRegisterBook={handleRegisterBook}
      />

      {/* Authentication Modal */}
      <AuthModal
        key={authModalKey}
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        students={students}
        adminUsers={adminUsers}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authModalMode}
        targetFeatureName={authTargetFeature}
      />

      {/* Gerenciar Livros Modal (Acesso Restrito ao ADM) */}
      <ManageBooksModal
        isOpen={isManageBooksOpen && session.role === 'admin'}
        onClose={() => setIsManageBooksOpen(false)}
        books={books}
        onSaveBook={handleSaveBook}
        onCreateBook={handleCreateBook}
        onDeleteBook={handleDeleteBook}
      />

      {/* Book Detail Modal */}
      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onRequestLoan={() => {
          setIsLoanModalOpen(true);
        }}
        isFavorite={selectedBook ? favorites.includes(selectedBook.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Loan Creation Modal */}
      <LoanModal
        book={selectedBook}
        students={students}
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        onConfirmLoan={handleConfirmLoan}
        session={session}
      />

      {/* Design System Reference Modal */}
      <DesignSystemModal
        isOpen={isDesignSystemOpen}
        onClose={() => setIsDesignSystemOpen(false)}
      />

      {/* Acessibilidade em Libras & Inclusão (Surdos e Mudos / Deficiência Auditiva e Fala) */}
      <LibrasAccessibilityModal
        isOpen={isAccessibilityModalOpen}
        onClose={() => setIsAccessibilityModalOpen(false)}
        isDark={isDark}
      />

      {/* Footer */}
      {activeTab !== 'admin' && activeTab !== 'missao_quiterio' && (
        <Footer
          setActiveTab={handleNavigateTab}
          onOpenDesignSystem={() => setIsDesignSystemOpen(true)}
          onOpenAccessibility={() => setIsAccessibilityModalOpen(true)}
        />
      )}
    </div>
  );
}

