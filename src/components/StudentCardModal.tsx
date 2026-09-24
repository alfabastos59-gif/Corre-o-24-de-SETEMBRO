import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Printer,
  Search,
  Users,
  UserCheck,
  Check,
  CheckSquare,
  Square,
  Layers,
  Sparkles,
  Filter,
  Eye,
  CreditCard,
  Calendar,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { Student } from '../types';
import { StudentCard } from './StudentCard';
import { useTheme } from '../context/ThemeContext';

interface StudentCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  initialSelectedStudent?: Student | null;
}

export const StudentCardModal: React.FC<StudentCardModalProps> = ({
  isOpen,
  onClose,
  students,
  initialSelectedStudent = null,
}) => {
  const { isDark } = useTheme();
  
  // Selection state
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(() => {
    if (initialSelectedStudent) {
      return [initialSelectedStudent.id];
    }
    return students.map((s) => s.id);
  });

  // Highlighted student for live preview in split view
  const [previewStudentId, setPreviewStudentId] = useState<string>(() => {
    return initialSelectedStudent?.id || students[0]?.id || '';
  });

  // UI View Mode: 'list' (Selection List + Preview) or 'grid' (Visual Cards Gallery)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  
  // Custom emission date
  const [issueDate, setIssueDate] = useState<string>(() => {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    return `${d}/${m}/${y}`;
  });

  // Layout mode for printing
  const [printLayout, setPrintLayout] = useState<'grid2' | 'single' | 'grid4'>('grid2');

  // Update selection if initialSelectedStudent changes
  useEffect(() => {
    if (initialSelectedStudent) {
      setSelectedStudentIds([initialSelectedStudent.id]);
      setPreviewStudentId(initialSelectedStudent.id);
    }
  }, [initialSelectedStudent]);

  // Extract unique classes
  const availableClasses = useMemo(() => {
    const classes = Array.from(new Set(students.map((s) => s.class).filter(Boolean)));
    return ['all', ...classes.sort()];
  }, [students]);

  // Filter students based on search query, class, and showOnlySelected toggle
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        const matchClass = selectedClass === 'all' || s.class === selectedClass;
        const matchQuery =
          !searchQuery.trim() ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.studentCode && s.studentCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (s.registration && s.registration.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchOnlySelected = !showOnlySelected || selectedStudentIds.includes(s.id);
        return matchClass && matchQuery && matchOnlySelected;
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));
  }, [students, selectedClass, searchQuery, showOnlySelected, selectedStudentIds]);

  // Student currently displayed in the live preview panel
  const previewStudent = useMemo(() => {
    return students.find((s) => s.id === previewStudentId) || filteredStudents[0] || students[0] || null;
  }, [students, previewStudentId, filteredStudents]);

  // Students that will actually be printed
  const studentsToPrint = useMemo(() => {
    return students
      .filter((s) => selectedStudentIds.includes(s.id))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));
  }, [students, selectedStudentIds]);

  if (!isOpen) return null;

  // Selection handlers
  const handleToggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setPreviewStudentId(id);
  };

  const handleSelectAllFiltered = () => {
    const idsToAdd = filteredStudents.map((s) => s.id);
    setSelectedStudentIds((prev) => Array.from(new Set([...prev, ...idsToAdd])));
  };

  const handleDeselectAllFiltered = () => {
    const idsToRemove = new Set(filteredStudents.map((s) => s.id));
    setSelectedStudentIds((prev) => prev.filter((id) => !idsToRemove.has(id)));
  };

  const handleSelectOnlyClass = (className: string) => {
    if (className === 'all') {
      setSelectedStudentIds(students.map((s) => s.id));
    } else {
      setSelectedStudentIds(students.filter((s) => s.class === className).map((s) => s.id));
    }
  };

  const handleInvertSelection = () => {
    const currentFilteredIds = new Set(filteredStudents.map((s) => s.id));
    setSelectedStudentIds((prev) => {
      const prevSet = new Set(prev);
      const newSelected = [...prev.filter((id) => !currentFilteredIds.has(id))];
      filteredStudents.forEach((s) => {
        if (!prevSet.has(s.id)) {
          newSelected.push(s.id);
        }
      });
      return newSelected;
    });
  };

  const handleSelectOnlyThisStudent = (studentId: string) => {
    setSelectedStudentIds([studentId]);
    setPreviewStudentId(studentId);
  };

  const handlePrint = () => {
    if (studentsToPrint.length === 0) {
      alert('Selecione pelo menos uma carteira para imprimir.');
      return;
    }
    window.print();
  };

  const handlePrintSingle = (studentId: string) => {
    setSelectedStudentIds([studentId]);
    setPreviewStudentId(studentId);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      {/* Dynamic Print Stylesheet */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-area-carteirinhas, #print-area-carteirinhas * {
            visibility: visible !important;
          }
          #print-area-carteirinhas {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            display: block !important;
            padding: 8mm !important;
            background: white !important;
            color: black !important;
          }
          .print-grid-container {
            display: grid !important;
            grid-template-columns: repeat(2, 380px) !important;
            gap: 12mm 15mm !important;
            justify-content: center !important;
            align-items: start !important;
            page-break-inside: auto !important;
          }
          .print-card-wrapper {
            page-break-inside: avoid !important;
            margin-bottom: 8mm !important;
          }
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Modal Container */}
      <div
        className={`relative w-full max-w-6xl max-h-[94vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden no-print ${
          isDark ? 'bg-[#001726] border-[#163e5e] text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* 1. MODAL TOP HEADER */}
        <div className="px-5 py-3.5 border-b flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-[#023d24] via-[#024a2c] to-[#035934] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-xs">
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Escolher Carteiras para Impressão
                </h2>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-[#22c55e] text-slate-950 rounded-full">
                  CECMQ - TI
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 font-medium">
                Selecione quais alunos terão suas carteirinhas impressas com código de barras próprio e avatar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Print Button */}
            <button
              id="btn-print-carteirinhas-header"
              onClick={handlePrint}
              disabled={studentsToPrint.length === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95 ${
                studentsToPrint.length > 0
                  ? 'bg-[#22c55e] hover:bg-[#16a34a] text-slate-950 shadow-emerald-950/40'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>
                Imprimir Selecionadas ({studentsToPrint.length})
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. MODAL CONTROLS TOOLBAR & SELECTION SHORTCUTS */}
        <div
          className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
            isDark ? 'bg-[#001424] border-[#163e5e]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          {/* View Mode Toggle: List + Preview vs Grid Gallery */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/60 dark:bg-[#001f35] border border-slate-300/40 dark:border-[#163e5e]">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Lista de Seleção & Prévia</span>
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Grade de Carteirinhas</span>
            </button>
          </div>

          {/* Selection Stats Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 ${
                studentsToPrint.length > 0
                  ? isDark
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {studentsToPrint.length} de {students.length} carteira(s) marcada(s) para impressão
              </span>
            </span>

            {/* Date Picker */}
            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-slate-400 font-medium">Emissão:</span>
              <input
                type="text"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                placeholder="DD/MM/AAAA"
                className={`w-28 px-2.5 py-1 rounded-lg text-center font-mono font-semibold border text-xs ${
                  isDark ? 'bg-[#001726] border-[#163e5e] text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>
        </div>

        {/* 3. FILTERS & QUICK SELECTION BAR */}
        <div
          className={`px-5 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
            isDark ? 'bg-[#001726] border-[#163e5e]/80' : 'bg-white border-slate-200'
          }`}
        >
          {/* Search & Turma Filter */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <div className="relative min-w-[200px] max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por nome ou código..."
                className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:border-emerald-500 ${
                  isDark ? 'bg-[#001424] border-[#163e5e] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Turma:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className={`px-2.5 py-1.5 rounded-xl text-xs border ${
                  isDark ? 'bg-[#001424] border-[#163e5e] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="all">Todas as turmas</option>
                {availableClasses
                  .filter((c) => c !== 'all')
                  .map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
              </select>
            </div>

            {/* Filter Toggle: Only selected */}
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-200 select-none ml-1">
              <input
                type="checkbox"
                checked={showOnlySelected}
                onChange={(e) => setShowOnlySelected(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-[11px] font-medium">Apenas selecionadas</span>
            </label>
          </div>

          {/* Quick Selection Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={handleSelectAllFiltered}
              className="px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer hover:bg-emerald-500/10 hover:text-emerald-400 border-slate-400/40"
              title="Marca todas as carteiras visíveis"
            >
              <CheckSquare className="w-3 h-3 text-emerald-400" />
              <span>Marcar Todas ({filteredStudents.length})</span>
            </button>

            <button
              onClick={handleDeselectAllFiltered}
              className="px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer hover:bg-rose-500/10 hover:text-rose-400 border-slate-400/40"
              title="Desmarca todas as carteiras visíveis"
            >
              <Square className="w-3 h-3 text-rose-400" />
              <span>Desmarcar</span>
            </button>

            <button
              onClick={handleInvertSelection}
              className="px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer hover:bg-sky-500/10 hover:text-sky-400 border-slate-400/40"
              title="Inverte a seleção atual"
            >
              <RotateCcw className="w-3 h-3 text-sky-400" />
              <span>Inverter</span>
            </button>
          </div>
        </div>

        {/* 4. MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {viewMode === 'list' ? (
            /* ================= VIEW 1: SELECTION LIST + SIDE-BY-SIDE PREVIEW ================= */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Interactive Checkbox List */}
              <div
                className={`lg:col-span-6 p-4 rounded-2xl border flex flex-col gap-3 ${
                  isDark ? 'bg-[#001424] border-[#163e5e]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-xs uppercase tracking-wider">
                      Selecione os Alunos ({filteredStudents.length})
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {studentsToPrint.length} marcados para impressão
                  </span>
                </div>

                {/* Students Scrollable List */}
                <div className="max-h-[440px] overflow-y-auto space-y-2 pr-1">
                  {filteredStudents.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      Nenhum aluno encontrado para os filtros selecionados.
                    </div>
                  ) : (
                    filteredStudents.map((student) => {
                      const isSelected = selectedStudentIds.includes(student.id);
                      const isPreviewing = previewStudent?.id === student.id;

                      return (
                        <div
                          key={student.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                            isSelected
                              ? isDark
                                ? 'bg-emerald-950/20 border-emerald-500/50 shadow-xs'
                                : 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                              : isDark
                              ? 'bg-[#001726] border-[#163e5e]/60 hover:border-slate-500/50 opacity-70 hover:opacity-100'
                              : 'bg-white border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
                          } ${isPreviewing ? 'ring-2 ring-emerald-500/60' : ''}`}
                        >
                          {/* Checkbox and Student Info */}
                          <div
                            onClick={() => handleToggleStudent(student.id)}
                            className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer select-none"
                          >
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                                isSelected
                                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-xs'
                                  : 'bg-transparent border-slate-400'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>

                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-9 h-9 rounded-full object-cover border border-emerald-500/30 shrink-0 bg-slate-200 student-avatar-zoom transition-transform duration-300 ease-out hover:scale-150 cursor-pointer hover:shadow-2xl hover:z-40 relative"
                            />

                            <div className="min-w-0 flex-1">
                              <p className={`text-xs font-bold truncate leading-tight ${isSelected ? 'text-emerald-400 dark:text-emerald-300' : ''}`}>
                                {student.name}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                <span className="font-semibold text-slate-300">{student.class}</span> • Cód:{' '}
                                {student.studentCode || student.registration || 'S/C'}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons for this Student */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Preview Button */}
                            <button
                              type="button"
                              onClick={() => setPreviewStudentId(student.id)}
                              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                isPreviewing
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                              }`}
                              title="Visualizar Carteirinha"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Print ONLY this student card */}
                            <button
                              type="button"
                              onClick={() => handlePrintSingle(student.id)}
                              className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer active:scale-95"
                              title="Imprimir apenas esta carteirinha agora"
                            >
                              <Printer className="w-3 h-3" />
                              <span>Imprimir</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Live High-Resolution Card Preview */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center p-2">
                <div className="mb-2 flex items-center justify-between w-full max-w-[380px]">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Prévia da Carteira Selecionada</span>
                  </span>

                  {previewStudent && (
                    <button
                      onClick={() => handlePrintSingle(previewStudent.id)}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Imprimir Esta</span>
                    </button>
                  )}
                </div>

                {previewStudent ? (
                  <div className="flex flex-col items-center">
                    <StudentCard
                      student={previewStudent}
                      issueDate={issueDate}
                      className="shadow-2xl ring-1 ring-black/20"
                    />
                    <div className="mt-3 text-center text-xs text-slate-400">
                      Carteira de <strong className="text-white">{previewStudent.name}</strong> • Turma{' '}
                      <strong className="text-emerald-400">{previewStudent.class}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="w-[380px] h-[550px] rounded-2xl border border-dashed border-slate-600 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                    <CreditCard className="w-12 h-12 mb-2 opacity-30 text-emerald-400" />
                    <p className="text-sm font-semibold">Nenhuma carteira selecionada para visualização</p>
                    <p className="text-xs text-slate-500 mt-1">Marque um aluno na lista ao lado para ver a prévia oficial.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ================= VIEW 2: VISUAL CARDS GALLERY (BATCH VIEW) ================= */
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs text-slate-400">
                  Clique em qualquer carteirinha ou no botão de seleção para marcar/desmarcar para impressão.
                </p>
                <span className="text-xs font-bold text-emerald-400">
                  {studentsToPrint.length} carteirinhas selecionadas para impressão
                </span>
              </div>

              {/* Grid of Student Cards with Overlay Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                {filteredStudents.map((student) => {
                  const isSelected = selectedStudentIds.includes(student.id);

                  return (
                    <div
                      key={student.id}
                      className={`relative flex flex-col items-center p-3 rounded-2xl border transition-all ${
                        isSelected
                          ? 'ring-2 ring-emerald-500 bg-emerald-500/5 border-emerald-500/50 shadow-lg'
                          : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-90 border-slate-300/30'
                      }`}
                    >
                      {/* Top Bar on Card with Checkbox & Print Action */}
                      <div className="w-full flex items-center justify-between mb-2 px-1">
                        <button
                          type="button"
                          onClick={() => handleToggleStudent(student.id)}
                          className="flex items-center gap-2 cursor-pointer select-none text-left"
                        >
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                              isSelected
                                ? 'bg-emerald-600 border-emerald-500 text-white'
                                : 'bg-transparent border-slate-400'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-bold truncate max-w-[180px]">
                            {student.name}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePrintSingle(student.id)}
                          className="p-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                          title="Imprimir somente esta carteirinha"
                        >
                          <Printer className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Scaled Student Card */}
                      <div
                        onClick={() => handleToggleStudent(student.id)}
                        className="w-[342px] h-[495px] overflow-hidden flex items-center justify-center rounded-2xl cursor-pointer"
                      >
                        <StudentCard
                          student={student}
                          issueDate={issueDate}
                          scale={0.9}
                          className="shadow-md"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 5. MODAL BOTTOM FOOTER */}
        <div
          className={`px-5 py-3.5 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
            isDark ? 'bg-[#001424] border-[#163e5e]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-semibold text-emerald-400">Configuração de Impressão:</span>
            <span>Folha A4, 2 carteirinhas por página com cores de fundo ativadas.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl font-semibold border cursor-pointer transition-colors ${
                isDark
                  ? 'border-[#163e5e] hover:bg-[#001f35] text-slate-300'
                  : 'border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              Fechar
            </button>

            <button
              id="btn-print-carteirinhas-footer"
              onClick={handlePrint}
              disabled={studentsToPrint.length === 0}
              className={`px-5 py-2 rounded-xl font-extrabold flex items-center gap-2 shadow-lg cursor-pointer active:scale-95 transition-all ${
                studentsToPrint.length > 0
                  ? 'bg-[#22c55e] hover:bg-[#16a34a] text-slate-950 shadow-emerald-950/40'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir {studentsToPrint.length} Carteira(s) Selecionada(s)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= HIDDEN PRINT CONTAINER (ONLY EXECUTED IN @media print) ================= */}
      <div id="print-area-carteirinhas" className="hidden">
        <div className="print-grid-container">
          {studentsToPrint.map((student) => (
            <div key={`print-carteira-${student.id}`} className="print-card-wrapper">
              <StudentCard student={student} issueDate={issueDate} printMode={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
