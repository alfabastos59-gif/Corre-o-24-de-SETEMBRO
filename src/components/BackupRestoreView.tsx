import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  FileJson,
  CheckCircle2,
  AlertTriangle,
  Database,
  FileCheck,
  BookOpen,
  Users,
  BookmarkCheck
} from 'lucide-react';
import { Book, Loan, Student, Suggestion, AdminUser, AuditLog } from '../types';
import { parseBackupJson, ParseResult } from '../utils/dataParser';
import { useTheme } from '../context/ThemeContext';

interface BackupRestoreViewProps {
  books: Book[];
  loans: Loan[];
  students: Student[];
  suggestions: Suggestion[];
  adminUsers?: AdminUser[];
  auditLogs?: AuditLog[];
  cloudSyncStatus?: 'connecting' | 'synced' | 'syncing' | 'offline';
  lastSyncTime?: Date | null;
  onManualSyncTrigger?: () => Promise<void>;
  onRestoreData: (data: {
    books?: Book[];
    loans?: Loan[];
    students?: Student[];
    suggestions?: Suggestion[];
    adminUsers?: AdminUser[];
    auditLogs?: AuditLog[];
  }) => void;
}

export const BackupRestoreView: React.FC<BackupRestoreViewProps> = ({
  books,
  loans,
  students,
  suggestions,
  adminUsers = [],
  auditLogs = [],
  onRestoreData,
}) => {
  const { isDark } = useTheme();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [parsedRestoreData, setParsedRestoreData] = useState<{
    books?: Book[];
    loans?: Loan[];
    students?: Student[];
    suggestions?: Suggestion[];
    adminUsers?: AdminUser[];
    auditLogs?: AuditLog[];
    metadata?: any;
    projectName?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate backup payload object
  const createBackupPayload = () => {
    return {
      versao: 2,
      gerado_em: new Date().toISOString(),
      projeto: 'biblioteca-maria-quiteria',
      sistema: 'Biblioteca Maria Quitéria',
      instituicao: 'Colégio Estadual do Campo Maria Quitéria - TI',
      resumo: {
        totalLivros: books.length,
        totalEmprestimos: loans.length,
        totalAlunos: students.length,
        totalSugestoes: suggestions.length,
        totalAdministradores: adminUsers.length,
        totalAuditoria: auditLogs.length,
      },
      dados: {
        livros: books.map((b) => ({
          id: b.id,
          titulo: b.title,
          autor: b.author,
          descricao: b.synopsis,
          capa_url: b.cover,
          cadastrado_por: null,
          disponivel: b.status === 'disponivel',
          isbn: b.isbn === 'N/A' ? null : b.isbn,
          ano: b.year,
          categoria: b.category,
          quantidade: b.totalCopies,
          quantidade_disponivel: b.availableCopies,
          created_at: new Date().toISOString(),
        })),
        alunos: students.map((s) => ({
          id: s.id,
          nome: s.name,
          turma: s.class,
          matricula: null,
          telefone: s.phone || null,
          codigo_aluno: s.studentCode || `ALU-${s.id.slice(0, 4)}`,
          created_at: s.joinedDate || new Date().toISOString(),
          avatar: s.avatar,
        })),
        emprestimos: loans.map((l) => ({
          id: l.id,
          aluno_id: students.find((s) => s.name === l.studentName)?.id || null,
          livro_id: l.bookId,
          data_emprestimo: l.loanDate,
          data_devolucao_prevista: l.returnDate,
          data_devolucao: l.actualReturnDate || null,
          observacoes: l.notes || null,
          codigo_aluno: l.studentCode || null,
          aluno_nome: l.studentName,
          status: l.status === 'devolvido' ? 'Devolvido' : 'Emprestado',
          created_at: new Date().toISOString(),
        })),
        sugestoes_livros: suggestions.map((s) => ({
          id: s.id,
          aluno_nome: s.studentName,
          turma: s.studentClass || '1º Ano',
          titulo: s.bookTitle,
          autor: s.author,
          motivo: s.reason,
          created_at: s.date || new Date().toISOString(),
        })),
        usuarios_administradores: adminUsers,
        historico_auditoria: auditLogs,
      },
    };
  };

  // Download JSON File
  const handleDownloadBackup = () => {
    try {
      const backupJsonString = JSON.stringify(createBackupPayload(), null, 2);
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(backupJsonString);
      const downloadAnchor = document.createElement('a');
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const timeStr = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `backup_biblioteca_maria_quiteria_${dateStr}_${timeStr}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showSuccess('Backup gerado e baixado com sucesso!');
    } catch (err: any) {
      setErrorMessage('Erro ao gerar o arquivo de backup. Tente novamente.');
    }
  };

  // File Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setErrorMessage('Por favor, selecione um arquivo válido com extensão .json');
      return;
    }

    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        processJsonRestore(text);
      } catch {
        setErrorMessage('Erro ao ler o arquivo selecionado.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Process and validate JSON text
  const processJsonRestore = (rawJson: string) => {
    setErrorMessage(null);
    const result: ParseResult = parseBackupJson(rawJson);

    if (!result.success) {
      setErrorMessage(result.errorMessage || 'Arquivo inválido ou não reconhecido.');
      return;
    }

    setParsedRestoreData({
      books: result.books,
      loans: result.loans,
      students: result.students,
      suggestions: result.suggestions,
      metadata: result.summary,
      projectName: result.projectName,
    });

    setIsRestoreConfirmOpen(true);
  };

  // Apply parsed restore
  const handleConfirmRestore = () => {
    if (!parsedRestoreData) return;

    onRestoreData({
      books: parsedRestoreData.books,
      loans: parsedRestoreData.loans,
      students: parsedRestoreData.students,
      suggestions: parsedRestoreData.suggestions,
    });

    const totalLivros = parsedRestoreData.books?.length || 0;
    const totalEmprestimos = parsedRestoreData.loans?.length || 0;
    const totalAlunos = parsedRestoreData.students?.length || 0;

    setIsRestoreConfirmOpen(false);
    setParsedRestoreData(null);
    setSelectedFileName(null);
    showSuccess(
      `Dados restaurados com sucesso! (${totalLivros} livros, ${totalAlunos} alunos e ${totalEmprestimos} empréstimos carregados)`
    );
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setErrorMessage(null);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 animate-in fade-in duration-200">
      {/* Mensagens de Feedback */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-sm flex items-center gap-3 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* APENAS DUAS JANELAS: FAZER BACKUP E RESTAURAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* JANELA 1: FAZER BACKUP */}
        <div
          className={`border rounded-2xl p-6 sm:p-7 flex flex-col justify-between ${
            isDark ? 'bg-[#061e30] border-[#0e2d42]' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="space-y-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Download className="w-5 h-5" />
            </div>

            <div>
              <h3 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Fazer Backup
              </h3>
              <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Baixe uma cópia de segurança contendo todos os livros, alunos, empréstimos e sugestões da biblioteca.
              </p>
            </div>

            {/* Resumo simples dos registros */}
            <div
              className={`rounded-xl border p-4 flex items-center justify-around ${
                isDark ? 'bg-[#02111d] border-[#0e2d42]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="text-center flex-1">
                <span className={`block font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {books.length}
                </span>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Livros</span>
              </div>
              <div className={`w-px h-7 ${isDark ? 'bg-[#0e2d42]' : 'bg-slate-200'}`} />
              <div className="text-center flex-1">
                <span className={`block font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {students.length}
                </span>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Alunos</span>
              </div>
              <div className={`w-px h-7 ${isDark ? 'bg-[#0e2d42]' : 'bg-slate-200'}`} />
              <div className="text-center flex-1">
                <span className={`block font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {loans.length}
                </span>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Empréstimos</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadBackup}
            className="w-full mt-6 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#00a86b] hover:bg-[#00945e] active:scale-[0.99] text-white font-bold text-sm transition-all shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Fazer Backup Agora</span>
          </button>
        </div>

        {/* JANELA 2: RESTAURAR */}
        <div
          className={`border rounded-2xl p-6 sm:p-7 flex flex-col justify-between ${
            isDark ? 'bg-[#061e30] border-[#0e2d42]' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="space-y-4">
            <div className="w-11 h-11 rounded-xl bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Upload className="w-5 h-5" />
            </div>

            <div>
              <h3 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Restaurar
              </h3>
              <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Selecione um arquivo de backup (.JSON) para recuperar as informações do sistema.
              </p>
            </div>

            {/* Zona de Seleção do Arquivo */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl py-6 px-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                isDark
                  ? 'border-[#0e2d42] hover:border-blue-500/60 bg-[#02111d]/60 hover:bg-[#02111d]'
                  : 'border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-blue-400 border ${
                  isDark ? 'bg-blue-950/80 border-blue-500/30' : 'bg-white border-slate-200'
                }`}
              >
                {selectedFileName ? <FileCheck className="w-5 h-5 text-emerald-400" /> : <Upload className="w-5 h-5" />}
              </div>
              <div className="space-y-0.5">
                <span className={`text-xs sm:text-sm font-semibold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {selectedFileName ? selectedFileName : 'Clique para selecionar o arquivo .JSON'}
                </span>
                <span className={`text-[11px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Suporta arquivos de backup da biblioteca
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full mt-6 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#1b64ff] hover:bg-[#1554e2] active:scale-[0.99] text-white font-bold text-sm transition-all shadow-md cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Selecionar Arquivo para Restaurar</span>
          </button>
        </div>
      </div>

      {/* MODAL DE CONFIRMAÇÃO DE RESTAURAÇÃO */}
      {isRestoreConfirmOpen && parsedRestoreData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div
            className={`border rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 ${
              isDark ? 'bg-[#092032] border-[#163650]' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-500 shrink-0">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Confirmar Restauração?
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Os registros atuais serão substituídos pelos itens do backup.
                </p>
              </div>
            </div>

            {/* Resumo do arquivo encontrado */}
            <div className={`p-4 rounded-xl border space-y-2 text-xs ${
              isDark ? 'bg-[#001424] border-[#163650]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                  Livros:
                </span>
                <span className="font-bold text-emerald-500">
                  {parsedRestoreData.books?.length ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  Alunos:
                </span>
                <span className="font-bold text-blue-500">
                  {parsedRestoreData.students?.length ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-500" />
                  Empréstimos:
                </span>
                <span className="font-bold text-amber-500">
                  {parsedRestoreData.loans?.length ?? 0}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsRestoreConfirmOpen(false);
                  setParsedRestoreData(null);
                  setSelectedFileName(null);
                }}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-xs border transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#001424] hover:bg-[#163650] text-slate-300 border-[#163650]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmRestore}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Sim, Restaurar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
