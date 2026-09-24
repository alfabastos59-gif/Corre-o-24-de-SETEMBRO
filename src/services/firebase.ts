import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  getDocFromServer,
  writeBatch,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { Book, Loan, Student, Suggestion, AdminUser, AuditLog } from '../types';
import firebaseConfigData from '../../firebase-applet-config.json';

// Inicialização segura do Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfigData);

// Inicialização do Firestore apontando para o banco de dados dedicado
export const db = getFirestore(app, firebaseConfigData.firestoreDatabaseId);

// Teste inicial de conectividade conforme diretrizes do Firestore
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline ou não acessível temporariamente.');
      return false;
    }
    // Erro de documento não existente é esperado e confirma que o servidor foi contactado
    return true;
  }
}

// Executa verificação inicial de conectividade
testConnection();

// ============================================================================
// ESCUTAS EM TEMPO REAL (onSnapshot) - Sincronização entre múltiplos computadores
// ============================================================================

export function subscribeToBooks(
  onSuccess: (books: Book[]) => void,
  onError?: (err: Error) => void
): () => void {
  const booksCol = collection(db, 'books');
  return onSnapshot(
    booksCol,
    (snapshot) => {
      const list: Book[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Book);
      });
      // Ordenação alfabética por título em português
      list.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' }));
      onSuccess(list);
    },
    (err) => {
      console.error('Erro ao sincronizar livros em tempo real:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToLoans(
  onSuccess: (loans: Loan[]) => void,
  onError?: (err: Error) => void
): () => void {
  const loansCol = collection(db, 'loans');
  return onSnapshot(
    loansCol,
    (snapshot) => {
      const list: Loan[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Loan);
      });
      onSuccess(list);
    },
    (err) => {
      console.error('Erro ao sincronizar empréstimos em tempo real:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToStudents(
  onSuccess: (students: Student[]) => void,
  onError?: (err: Error) => void
): () => void {
  const studentsCol = collection(db, 'students');
  return onSnapshot(
    studentsCol,
    (snapshot) => {
      const list: Student[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Student);
      });
      list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));
      onSuccess(list);
    },
    (err) => {
      console.error('Erro ao sincronizar estudantes em tempo real:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToSuggestions(
  onSuccess: (suggestions: Suggestion[]) => void,
  onError?: (err: Error) => void
): () => void {
  const col = collection(db, 'suggestions');
  return onSnapshot(
    col,
    (snapshot) => {
      const list: Suggestion[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Suggestion);
      });
      onSuccess(list);
    },
    (err) => {
      console.error('Erro ao sincronizar sugestões em tempo real:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToAdminUsers(
  onSuccess: (adminUsers: AdminUser[]) => void,
  onError?: (err: Error) => void
): () => void {
  const col = collection(db, 'adminUsers');
  return onSnapshot(
    col,
    (snapshot) => {
      const list: AdminUser[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as AdminUser);
      });
      onSuccess(list);
    },
    (err) => {
      console.error('Erro ao sincronizar administradores em tempo real:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToAuditLogs(
  onSuccess: (logs: AuditLog[]) => void,
  onError?: (err: Error) => void
): () => void {
  const col = collection(db, 'auditLogs');
  const q = query(col, limit(100));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: AuditLog[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as AuditLog);
      });
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      onSuccess(list);
    },
    (err) => {
      console.error('Erro ao sincronizar registros de auditoria:', err);
      if (onError) onError(err);
    }
  );
}

// ============================================================================
// OPERAÇÕES DE ESCRITA NA NUVEM (Refletem instantaneamente em todos os PCs)
// ============================================================================

/**
 * Remove recursivamente todas as propriedades 'undefined' de qualquer objeto
 * para evitar o erro fatal do Firestore: "Unsupported field value: undefined".
 */
export function sanitizeForFirestore<T>(val: T): T {
  if (val === undefined) {
    return null as unknown as T;
  }
  if (val === null || typeof val !== 'object') {
    return val;
  }
  if (val instanceof Date) {
    return val;
  }
  if (Array.isArray(val)) {
    return val
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(val as Record<string, any>)) {
    if (value !== undefined) {
      cleaned[key] = sanitizeForFirestore(value);
    }
  }
  return cleaned as T;
}

/**
 * Executa gravações em lote divididas em blocos de até 400 documentos
 * para respeitar com segurança o limite máximo de 500 operações por batch do Firestore.
 */
async function commitInBatches(
  operations: { ref: ReturnType<typeof doc>; data: any; merge?: boolean }[]
): Promise<void> {
  const BATCH_SIZE = 400;
  for (let i = 0; i < operations.length; i += BATCH_SIZE) {
    const chunk = operations.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);
    chunk.forEach(({ ref, data, merge }) => {
      const sanitized = sanitizeForFirestore(data);
      if (merge) {
        batch.set(ref, sanitized, { merge: true });
      } else {
        batch.set(ref, sanitized);
      }
    });
    await batch.commit();
  }
}

export async function saveBookToCloud(book: Book): Promise<void> {
  try {
    const bookRef = doc(db, 'books', book.id);
    await setDoc(bookRef, sanitizeForFirestore(book), { merge: true });
  } catch (error) {
    console.error('Falha ao salvar livro na nuvem:', error);
    throw error;
  }
}

export async function deleteBookFromCloud(bookId: string): Promise<void> {
  try {
    const bookRef = doc(db, 'books', bookId);
    await deleteDoc(bookRef);
  } catch (error) {
    console.error('Falha ao remover livro da nuvem:', error);
    throw error;
  }
}

export async function saveLoanToCloud(loan: Loan): Promise<void> {
  try {
    const loanRef = doc(db, 'loans', loan.id);
    await setDoc(loanRef, sanitizeForFirestore(loan), { merge: true });
  } catch (error) {
    console.error('Falha ao salvar empréstimo na nuvem:', error);
    throw error;
  }
}

export async function deleteLoanFromCloud(loanId: string): Promise<void> {
  try {
    const loanRef = doc(db, 'loans', loanId);
    await deleteDoc(loanRef);
  } catch (error) {
    console.error('Falha ao excluir empréstimo da nuvem:', error);
    throw error;
  }
}

export async function saveStudentToCloud(student: Student): Promise<void> {
  try {
    const studentRef = doc(db, 'students', student.id);
    await setDoc(studentRef, sanitizeForFirestore(student), { merge: true });
  } catch (error) {
    console.error('Falha ao salvar estudante na nuvem:', error);
    throw error;
  }
}

export async function deleteStudentFromCloud(studentId: string): Promise<void> {
  try {
    const studentRef = doc(db, 'students', studentId);
    await deleteDoc(studentRef);
  } catch (error) {
    console.error('Falha ao remover estudante da nuvem:', error);
    throw error;
  }
}

export async function saveSuggestionToCloud(suggestion: Suggestion): Promise<void> {
  try {
    const ref = doc(db, 'suggestions', suggestion.id);
    await setDoc(ref, sanitizeForFirestore(suggestion), { merge: true });
  } catch (error) {
    console.error('Falha ao salvar sugestão na nuvem:', error);
    throw error;
  }
}

export async function deleteSuggestionFromCloud(suggestionId: string): Promise<void> {
  try {
    const ref = doc(db, 'suggestions', suggestionId);
    await deleteDoc(ref);
  } catch (error) {
    console.error('Falha ao excluir sugestão na nuvem:', error);
    throw error;
  }
}

export async function saveAdminUserToCloud(adminUser: AdminUser): Promise<void> {
  try {
    const ref = doc(db, 'adminUsers', adminUser.id);
    await setDoc(ref, sanitizeForFirestore(adminUser), { merge: true });
  } catch (error) {
    console.error('Falha ao salvar administrador na nuvem:', error);
    throw error;
  }
}

export async function deleteAdminUserFromCloud(adminId: string): Promise<void> {
  try {
    const ref = doc(db, 'adminUsers', adminId);
    await deleteDoc(ref);
  } catch (error) {
    console.error('Falha ao remover administrador na nuvem:', error);
    throw error;
  }
}

export async function saveAuditLogToCloud(log: AuditLog): Promise<void> {
  try {
    const ref = doc(db, 'auditLogs', log.id);
    await setDoc(ref, sanitizeForFirestore(log), { merge: true });
  } catch (error) {
    console.error('Falha ao registrar log de auditoria na nuvem:', error);
    throw error;
  }
}

// ============================================================================
// POPULAÇÃO AUTOMÁTICA INICIAL (Se o Firestore estiver vazio no primeiro acesso)
// ============================================================================

export async function seedCloudDatabaseIfEmpty(initialData: {
  books: Book[];
  loans: Loan[];
  students: Student[];
  suggestions: Suggestion[];
  adminUsers: AdminUser[];
  auditLogs: AuditLog[];
}): Promise<boolean> {
  try {
    const booksSnap = await getDocs(collection(db, 'books'));
    if (!booksSnap.empty) {
      // O banco na nuvem já possui livros sincronizados
      return false;
    }

    console.log('Banco na nuvem vazio detectado. Inicializando dados na nuvem...');
    const ops: { ref: ReturnType<typeof doc>; data: any }[] = [];

    initialData.books.forEach((book) => ops.push({ ref: doc(db, 'books', book.id), data: book }));
    initialData.loans.forEach((loan) => ops.push({ ref: doc(db, 'loans', loan.id), data: loan }));
    initialData.students.forEach((student) => ops.push({ ref: doc(db, 'students', student.id), data: student }));
    initialData.suggestions.forEach((sug) => ops.push({ ref: doc(db, 'suggestions', sug.id), data: sug }));
    initialData.adminUsers.forEach((admin) => ops.push({ ref: doc(db, 'adminUsers', admin.id), data: admin }));
    initialData.auditLogs.forEach((log) => ops.push({ ref: doc(db, 'auditLogs', log.id), data: log }));

    await commitInBatches(ops);
    console.log('Banco de dados na nuvem populado com sucesso para acesso multi-computadores!');
    return true;
  } catch (error) {
    console.error('Erro ao realizar carga inicial no Firestore:', error);
    return false;
  }
}

// Envio forçado de todos os dados locais para a nuvem
export async function pushAllLocalDataToCloud(data: {
  books: Book[];
  loans: Loan[];
  students: Student[];
  suggestions: Suggestion[];
  adminUsers: AdminUser[];
  auditLogs: AuditLog[];
}): Promise<{ success: boolean; error?: string }> {
  try {
    const ops: { ref: ReturnType<typeof doc>; data: any; merge?: boolean }[] = [];

    data.books.forEach((b) => ops.push({ ref: doc(db, 'books', b.id), data: b, merge: true }));
    data.loans.forEach((l) => ops.push({ ref: doc(db, 'loans', l.id), data: l, merge: true }));
    data.students.forEach((s) => ops.push({ ref: doc(db, 'students', s.id), data: s, merge: true }));
    data.suggestions.forEach((sg) => ops.push({ ref: doc(db, 'suggestions', sg.id), data: sg, merge: true }));
    data.adminUsers.forEach((a) => ops.push({ ref: doc(db, 'adminUsers', a.id), data: a, merge: true }));
    data.auditLogs.forEach((lg) => ops.push({ ref: doc(db, 'auditLogs', lg.id), data: lg, merge: true }));

    await commitInBatches(ops);
    return { success: true };
  } catch (error: any) {
    console.error('Erro no envio forçado:', error);
    return { success: false, error: error?.message || 'Falha ao sincronizar' };
  }
}
