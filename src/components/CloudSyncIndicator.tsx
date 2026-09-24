import React, { useState } from 'react';
import { Cloud, CloudCheck, RefreshCw, Laptop, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Book, Loan, Student, Suggestion, AdminUser, AuditLog } from '../types';
import { pushAllLocalDataToCloud } from '../services/firebase';

interface CloudSyncIndicatorProps {
  status: 'connecting' | 'synced' | 'syncing' | 'offline';
  lastSyncTime: Date | null;
  books: Book[];
  loans: Loan[];
  students: Student[];
  suggestions: Suggestion[];
  adminUsers?: AdminUser[];
  auditLogs?: AuditLog[];
  onManualSyncTrigger?: () => Promise<void>;
}

export const CloudSyncIndicator: React.FC<CloudSyncIndicatorProps> = ({
  status,
  lastSyncTime,
  books,
  loans,
  students,
  suggestions,
  adminUsers = [],
  auditLogs = [],
  onManualSyncTrigger,
}) => {
  const { isDark, isEmerald, isPurple } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleForcePush = async () => {
    setIsPushing(true);
    setFeedback(null);
    try {
      if (onManualSyncTrigger) {
        await onManualSyncTrigger();
      } else {
        await pushAllLocalDataToCloud({
          books,
          loans,
          students,
          suggestions,
          adminUsers,
          auditLogs,
        });
      }
      setFeedback('Acervo sincronizado com sucesso na nuvem para todos os computadores!');
    } catch (e: any) {
      setFeedback('Erro ao sincronizar com a nuvem: ' + (e?.message || 'Tente novamente'));
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <>
      {/* Pill Badge */}
      <button
        id="btn-cloud-sync-status"
        onClick={() => setIsOpen(true)}
        title="Status da Sincronização em Nuvem (Multi-computadores)"
        className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
          status === 'synced'
            ? isEmerald
              ? 'bg-[#032338] text-emerald-300 border-emerald-500/40 hover:bg-[#052d47]'
              : isPurple
              ? 'bg-[#250d4d] text-purple-200 border-purple-500/40 hover:bg-[#321266]'
              : isDark
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/40'
              : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
            : status === 'syncing' || status === 'connecting'
            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
        }`}
      >
        {status === 'synced' ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Cloud className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline text-[11px] font-bold">Nuvem Conectada</span>
          </>
        ) : status === 'syncing' || status === 'connecting' ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span className="hidden sm:inline text-[11px] font-bold">Sincronizando...</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline text-[11px] font-bold">Modo Offline</span>
          </>
        )}
      </button>

      {/* Detail Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl relative ${
              isDark
                ? 'bg-[#001424] border-[#163650] text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/50 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Banco de Dados em Nuvem</h3>
                  <p className="text-xs text-slate-400">Sincronização Multi-computadores ativa</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Explanation */}
            <div
              className={`p-3.5 rounded-xl border mb-4 text-xs space-y-1.5 ${
                isDark ? 'bg-[#092032] border-[#163650]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Acesso Compartilhado em Tempo Real</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Qualquer livro cadastrado, empréstimo realizado ou aluno registrado neste computador é
                sincronizado automaticamente com <strong>todos os outros computadores e tablets</strong> conectados na web.
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              <div
                className={`p-2.5 rounded-xl border text-center ${
                  isDark ? 'bg-[#041c2c] border-[#163650]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <p className="text-xs text-slate-400">Livros</p>
                <p className="text-lg font-bold text-cyan-400">{books.length}</p>
              </div>
              <div
                className={`p-2.5 rounded-xl border text-center ${
                  isDark ? 'bg-[#041c2c] border-[#163650]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <p className="text-xs text-slate-400">Empréstimos</p>
                <p className="text-lg font-bold text-amber-400">{loans.length}</p>
              </div>
              <div
                className={`p-2.5 rounded-xl border text-center ${
                  isDark ? 'bg-[#041c2c] border-[#163650]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <p className="text-xs text-slate-400">Alunos</p>
                <p className="text-lg font-bold text-emerald-400">{students.length}</p>
              </div>
            </div>

            {/* Last Synced details */}
            <div className="text-xs text-slate-400 flex items-center justify-between mb-4 px-1">
              <span className="flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-slate-500" />
                Multi-dispositivos:
              </span>
              <span className="font-semibold text-emerald-400">Conectado (Firestore)</span>
            </div>
            {lastSyncTime && (
              <div className="text-xs text-slate-400 flex items-center justify-between mb-4 px-1">
                <span>Última atualização recebida:</span>
                <span className="font-medium text-slate-300">
                  {lastSyncTime.toLocaleTimeString('pt-BR')}
                </span>
              </div>
            )}

            {feedback && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={handleForcePush}
                disabled={isPushing}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isPushing ? 'animate-spin' : ''}`} />
                <span>{isPushing ? 'Sincronizando...' : 'Forçar Sincronização Agora'}</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
