/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ExamModel } from './types/exam';
import { INITIAL_EXAMS } from './data/exams';
import { loadAllExams, saveExam, saveAllExams, resetToDefaultExams } from './utils/storage';
import { exportExamToDocx, exportAnswerKeyToDocx } from './utils/docxExport';
import { generatePdfFromHtmlElement, downloadBlob } from './utils/pdfExport';
import { exportAllExamsZip, exportSingleExamZip, generateExamSummaryText } from './utils/zipExport';
import { translations, Language } from './utils/i18n';
import { AppThemeId, APP_THEMES } from './utils/theme';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { OfficialExamPaper } from './components/OfficialExamPaper';
import { AnswerKeyPaper } from './components/AnswerKeyPaper';
import { ExamEditor } from './components/ExamEditor';
import { InteractiveTestMode } from './components/InteractiveTestMode';
import { StylePanel } from './components/StylePanel';
import { ValidationModal } from './components/ValidationModal';
import { ExamDownloadModal } from './components/ExamDownloadModal';
import { AiTestGeneratorModal } from './components/AiTestGeneratorModal';
import { SplitScreenPreview } from './components/preview/SplitScreenPreview';
import { DigitalExamPreview } from './components/preview/DigitalExamPreview';
import { AccessibleReaderPreview } from './components/preview/AccessibleReaderPreview';
import { StreamlinedPreviewBar, PageFilter } from './components/preview/StreamlinedPreviewBar';
import { BottomNavBar } from './components/BottomNavBar';
import {
  ZoomIn,
  ZoomOut,
  Palette,
  Printer,
  Undo2,
  Redo2,
  Download,
  Eye,
  FileText,
  Columns,
  Monitor,
  BookOpen,
  Sparkles,
} from 'lucide-react';

export type PreviewUiAlternative =
  | 'official-booklet'
  | 'split-screen'
  | 'digital-exam'
  | 'accessible-reader';

export default function App() {
  const [exams, setExams] = useState<ExamModel[]>(INITIAL_EXAMS);
  const [selectedExamId, setSelectedExamId] = useState<string>('b1-lesen-01');
  const [viewMode, setViewMode] = useState<'dashboard' | 'paper' | 'solutions' | 'editor' | 'interactive'>('dashboard');
  const [previewUiMode, setPreviewUiMode] = useState<PreviewUiAlternative>(() => {
    const saved = localStorage.getItem('b1_preview_ui_mode');
    return saved === 'official-booklet' ||
      saved === 'split-screen' ||
      saved === 'digital-exam' ||
      saved === 'accessible-reader'
      ? (saved as PreviewUiAlternative)
      : 'official-booklet';
  });
  const [pageFilter, setPageFilter] = useState<PageFilter>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showStylePanel, setShowStylePanel] = useState<boolean>(false);
  const [showValidationModal, setShowValidationModal] = useState<boolean>(false);
  const [showAiGeneratorModal, setShowAiGeneratorModal] = useState<boolean>(false);
  const [downloadModalExam, setDownloadModalExam] = useState<ExamModel | null>(null);
  const [offscreenRender, setOffscreenRender] = useState<{ exam: ExamModel; type: 'paper' | 'solutions' } | null>(null);
  const offscreenRef = useRef<HTMLDivElement>(null);

  const handleSetPreviewUiMode = (mode: PreviewUiAlternative) => {
    setPreviewUiMode(mode);
    localStorage.setItem('b1_preview_ui_mode', mode);
  };

  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('b1_exam_lang');
    return (saved === 'de' || saved === 'en') ? saved : 'en';
  });

  const [themeId, setThemeId] = useState<AppThemeId>(() => {
    const saved = localStorage.getItem('b1_exam_theme');
    return (saved && APP_THEMES[saved as AppThemeId]) ? (saved as AppThemeId) : 'goethe';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('b1_exam_dark_mode');
    return saved !== null ? saved === 'true' : true;
  });

  const currentAppTheme = APP_THEMES[themeId] || APP_THEMES.goethe;

  const handleThemeChange = (newTheme: AppThemeId) => {
    setThemeId(newTheme);
    localStorage.setItem('b1_exam_theme', newTheme);
    showToast(lang === 'en' ? `Theme activated: ${APP_THEMES[newTheme].nameEn}` : `Farbschema aktiviert: ${APP_THEMES[newTheme].nameDe}`);
  };

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('b1_exam_dark_mode', String(next));
      return next;
    });
  };

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = translations[lang];

  const handleToggleLang = () => {
    setLang((prev) => {
      const next = prev === 'de' ? 'en' : 'de';
      localStorage.setItem('b1_exam_lang', next);
      return next;
    });
  };

  // Undo / Redo history
  const [history, setHistory] = useState<ExamModel[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const paperRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  // Load from IndexedDB on initial mount
  useEffect(() => {
    loadAllExams().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setExams(loaded);
        setHistory([loaded]);
        setHistoryIndex(0);
      }
    });
  }, []);

  const currentExam = exams.find((e) => e.id === selectedExamId) || exams[0];

  // Record history for Undo/Redo
  const recordHistory = (newExams: ExamModel[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newExams);
    if (updatedHistory.length > 50) {
      updatedHistory.shift();
    }
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  };

  // Update Exam
  const handleUpdateExam = (updated: ExamModel) => {
    const newExams = exams.map((e) => (e.id === updated.id ? updated : e));
    setExams(newExams);
    recordHistory(newExams);
    // Trigger save
    setIsSaving(true);
    saveExam(updated).finally(() => {
      setTimeout(() => setIsSaving(false), 300);
    });
  };

  // Undo / Redo handlers
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const pastState = history[newIndex];
      setExams(pastState);
      saveAllExams(pastState);
      showToast(lang === 'en' ? 'Undone (Undo)' : 'Rückgängig gemacht (Undo)');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const futureState = history[newIndex];
      setExams(futureState);
      saveAllExams(futureState);
      showToast(lang === 'en' ? 'Restored (Redo)' : 'Wiederhergestellt (Redo)');
    }
  };

  // Duplicate exam
  const handleDuplicateExam = (id: string) => {
    const source = exams.find((e) => e.id === id);
    if (!source) return;
    const newNumber = exams.length + 1;
    const duplicated: ExamModel = {
      ...JSON.parse(JSON.stringify(source)),
      id: `b1-lesen-copy-${Date.now()}`,
      examNumber: newNumber,
      title: `${source.title} (${lang === 'en' ? 'Copy' : 'Kopie'})`,
      status: 'Draft',
      updatedAt: new Date().toISOString(),
    };
    const newExams = [...exams, duplicated];
    setExams(newExams);
    recordHistory(newExams);
    saveAllExams(newExams);
    setSelectedExamId(duplicated.id);
    showToast(lang === 'en' ? `Exam duplicated as #${newNumber}!` : `Prüfung als #${newNumber} dupliziert!`);
  };

  // AI Exam Created handler
  const handleExamCreated = (newExam: ExamModel) => {
    const updatedExams = [newExam, ...exams];
    setExams(updatedExams);
    recordHistory(updatedExams);
    saveExam(newExam);
    setSelectedExamId(newExam.id);
    showToast(
      lang === 'en'
        ? `Exam #${String(newExam.examNumber).padStart(2, '0')} generated successfully!`
        : `Übungssatz #${String(newExam.examNumber).padStart(2, '0')} erfolgreich generiert!`
    );
  };

  // Reset to default 10 exams
  const handleResetExams = async () => {
    const confirmMsg = lang === 'en'
      ? 'Do you want to reset all exams to default state? All custom edits will be discarded.'
      : 'Möchten Sie alle Prüfungen auf den Originalzustand zurücksetzen? Alle Änderungen gehen verloren.';
    if (window.confirm(confirmMsg)) {
      const fresh = await resetToDefaultExams();
      setExams(fresh);
      recordHistory(fresh);
      setSelectedExamId(fresh[0].id);
      showToast(lang === 'en' ? 'All 10 exams reset to factory defaults.' : 'Alle 10 Prüfungen wurden auf Werkszustand zurückgesetzt.');
    }
  };

  // Global Style Propagation
  const handleApplyStyleToAll = () => {
    const targetStyle = currentExam.styleConfig;
    const updated = exams.map((e) => ({
      ...e,
      styleConfig: { ...targetStyle },
    }));
    setExams(updated);
    recordHistory(updated);
    saveAllExams(updated);
    showToast(lang === 'en' ? 'Styles applied to all 10 exams!' : 'Stil wurde auf alle Prüfungen übertragen!');
  };

  // Reliable Offscreen Multi-page PDF Generator for any exam
  const generatePdfForExam = async (exam: ExamModel, type: 'paper' | 'solutions', filename: string): Promise<Blob> => {
    setOffscreenRender({ exam, type });
    // Allow DOM ref to mount and styles to calculate
    await new Promise((r) => setTimeout(r, 220));
    if (!offscreenRef.current) {
      setOffscreenRender(null);
      throw new Error('Offscreen container not mounted');
    }
    const blob = await generatePdfFromHtmlElement(offscreenRef.current, filename);
    setOffscreenRender(null);
    return blob;
  };

  // Download Candidate Paper PDF for any exam
  const handleDownloadSingleExamCandidatePdf = async (exam: ExamModel) => {
    const num = String(exam.examNumber).padStart(2, '0');
    showToast(lang === 'en' ? `Generating PDF for Exam ${num}...` : `Erstelle PDF für Prüfung ${num}...`);
    try {
      const blob = await generatePdfForExam(exam, 'paper', `b1_lesen_exam_${num}.pdf`);
      downloadBlob(blob, `b1_lesen_exam_${num}.pdf`);
      showToast(lang === 'en' ? `b1_lesen_exam_${num}.pdf downloaded!` : `b1_lesen_exam_${num}.pdf heruntergeladen!`);
    } catch (err) {
      console.error(err);
      showToast(lang === 'en' ? 'PDF generation error, please use Print dialog.' : 'Fehler bei PDF-Erstellung, bitte Druckdialog nutzen.');
    }
  };

  // Download Candidate Paper DOCX for any exam
  const handleDownloadSingleExamCandidateDocx = async (exam: ExamModel) => {
    const num = String(exam.examNumber).padStart(2, '0');
    showToast(lang === 'en' ? `Generating DOCX for Exam ${num}...` : `Erstelle DOCX für Prüfung ${num}...`);
    try {
      const blob = await exportExamToDocx(exam);
      downloadBlob(blob, `b1_lesen_exam_${num}.docx`);
      showToast(lang === 'en' ? `b1_lesen_exam_${num}.docx downloaded!` : `b1_lesen_exam_${num}.docx heruntergeladen!`);
    } catch (err) {
      console.error(err);
      showToast(lang === 'en' ? 'Error generating DOCX.' : 'Fehler bei DOCX-Erstellung.');
    }
  };

  // Download Solutions PDF for any exam
  const handleDownloadSingleExamSolutionsPdf = async (exam: ExamModel) => {
    const num = String(exam.examNumber).padStart(2, '0');
    showToast(lang === 'en' ? `Generating Answer Key PDF for Exam ${num}...` : `Erstelle Lösungen-PDF für Prüfung ${num}...`);
    try {
      const blob = await generatePdfForExam(exam, 'solutions', `b1_lesen_exam_${num}_loesungen.pdf`);
      downloadBlob(blob, `b1_lesen_exam_${num}_loesungen.pdf`);
      showToast(lang === 'en' ? `b1_lesen_exam_${num}_loesungen.pdf downloaded!` : `b1_lesen_exam_${num}_loesungen.pdf heruntergeladen!`);
    } catch (err) {
      console.error(err);
      showToast(lang === 'en' ? 'Error generating Answer Key PDF.' : 'Fehler bei Lösungen-PDF.');
    }
  };

  // Download Solutions DOCX for any exam
  const handleDownloadSingleExamSolutionsDocx = async (exam: ExamModel) => {
    const num = String(exam.examNumber).padStart(2, '0');
    showToast(lang === 'en' ? `Generating Answer Key DOCX for Exam ${num}...` : `Erstelle Lösungen-DOCX für Prüfung ${num}...`);
    try {
      const blob = await exportAnswerKeyToDocx(exam);
      downloadBlob(blob, `b1_lesen_exam_${num}_loesungen.docx`);
      showToast(lang === 'en' ? `b1_lesen_exam_${num}_loesungen.docx downloaded!` : `b1_lesen_exam_${num}_loesungen.docx heruntergeladen!`);
    } catch (err) {
      console.error(err);
      showToast(lang === 'en' ? 'Error generating Answer Key DOCX.' : 'Fehler bei Lösungen-DOCX.');
    }
  };

  // Download Complete Single Exam ZIP package
  const handleDownloadSingleExamZip = async (exam: ExamModel) => {
    const num = String(exam.examNumber).padStart(2, '0');
    showToast(lang === 'en' ? `Building complete ZIP package for Exam ${num}...` : `Erstelle komplettes ZIP-Paket für Prüfung ${num}...`);
    try {
      const zipBlob = await exportSingleExamZip(exam, null, null, (_pct, statusText) => {
        showToast(statusText);
      });
      downloadBlob(zipBlob, `Goethe_B1_Lesen_Satz_${num}_Komplettpaket.zip`);
      showToast(lang === 'en' ? `Exam ${num} package downloaded!` : `Prüfung ${num} Paket heruntergeladen!`);
    } catch (err) {
      console.error(err);
      showToast(lang === 'en' ? 'Error generating ZIP package.' : 'Fehler beim Erstellen des ZIP-Pakets.');
    }
  };

  // Download Plain Text & Solutions for any exam
  const handleDownloadTxt = (exam: ExamModel) => {
    const num = String(exam.examNumber).padStart(2, '0');
    const text = generateExamSummaryText(exam);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `b1_lesen_exam_${num}_uebersicht.txt`);
    showToast(lang === 'en' ? `Exam ${num} summary text downloaded!` : `Prüfung ${num} Textübersicht heruntergeladen!`);
  };

  // Download JSON schema for any exam
  const handleDownloadJson = (exam: ExamModel) => {
    const num = String(exam.examNumber).padStart(2, '0');
    const jsonStr = JSON.stringify(exam, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    downloadBlob(blob, `b1_lesen_exam_${num}_daten.json`);
    showToast(lang === 'en' ? `Exam ${num} JSON data downloaded!` : `Prüfung ${num} JSON-Daten heruntergeladen!`);
  };

  // Quick handlers for currently active exam in Header
  const handleExportPdf = () => handleDownloadSingleExamCandidatePdf(currentExam);
  const handleExportDocx = () => handleDownloadSingleExamCandidateDocx(currentExam);
  const handleExportSolutionsPdf = () => handleDownloadSingleExamSolutionsPdf(currentExam);
  const handleExportSolutionsDocx = () => handleDownloadSingleExamSolutionsDocx(currentExam);

  // Bulk ZIP Export (All 10 Exams)
  const handleBulkZip = async () => {
    showToast(lang === 'en' ? 'Creating ZIP package for all 10 exams...' : 'Erstelle ZIP-Paket für alle 10 Prüfungen...');
    try {
      await exportAllExamsZip(exams, (curr, total, statusText) => {
        showToast(`${statusText} (${curr}/${total})`);
      });
      showToast(lang === 'en' ? 'ZIP archive successfully downloaded!' : 'ZIP-Archiv erfolgreich heruntergeladen!');
    } catch (err) {
      console.error(err);
      showToast(lang === 'en' ? 'Error creating ZIP archive.' : 'Fehler beim Erstellen des ZIP-Archivs.');
    }
  };

  // Native Browser Print
  const handlePrint = () => {
    window.print();
  };

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S / Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveExam(currentExam);
        showToast('Prüfung manuell gespeichert (Ctrl+S)');
      }
      // Ctrl+P / Cmd+P
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrint();
      }
      // Ctrl+E / Cmd+E
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        handleExportPdf();
      }
      // Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      }
      // Ctrl+Y or Ctrl+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        handleRedo();
      }
      // Ctrl+D
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleDuplicateExam(selectedExamId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentExam, selectedExamId, historyIndex, history]);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs border border-amber-400 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Minimal, Clean Studio Brand Header (Zero Top Clutter) */}
      <Header
        selectedExamTitle={currentExam.title}
        currentExamNumber={currentExam.examNumber}
        lang={lang}
        isSaving={isSaving}
        themeConfig={currentAppTheme}
        darkMode={darkMode}
        onNavigateHome={() => setViewMode('dashboard')}
      />

      {/* Sub-Header Toolbar when viewing Solutions or Editor */}
      {(viewMode === 'solutions' || viewMode === 'editor') && (
        <div className="no-print bg-slate-850 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Exam Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">{t.activeSet}</span>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white font-bold rounded-lg px-2.5 py-1 text-xs outline-none focus:border-amber-400"
            >
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  #{String(ex.examNumber).padStart(2, '0')}: {ex.title}
                </option>
              ))}
            </select>
          </div>

          {/* Controls: Undo, Redo, Download, Print */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Undo / Redo */}
            <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 p-0.5">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                title={t.undo}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                title={t.redo}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded cursor-pointer"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Style Drawer Toggle */}
            <button
              onClick={() => setShowStylePanel(!showStylePanel)}
              className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                showStylePanel ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>{t.designStyles}</span>
            </button>

            {/* Single Exam Download Button */}
            <button
              onClick={() => setDownloadModalExam(currentExam)}
              title={t.downloadExamPackage}
              className="px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 rounded-lg border border-amber-500/40 flex items-center gap-1.5 font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">
                {lang === 'en'
                  ? `Download Set #${String(currentExam.examNumber).padStart(2, '0')}`
                  : `Satz #${String(currentExam.examNumber).padStart(2, '0')} laden`}
              </span>
              <span className="md:hidden">{t.downloadBtn}</span>
            </button>

            {/* Print Dialog Button */}
            <button
              onClick={handlePrint}
              title={`${t.print} (Ctrl+P)`}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-750 text-slate-300 rounded-lg border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.print}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 p-4 md:p-8 pb-36 sm:pb-40 overflow-x-hidden">
        {/* VIEW: DASHBOARD */}
        {viewMode === 'dashboard' && (
          <Dashboard
            exams={exams}
            selectedExamId={selectedExamId}
            onSelectExam={(id) => setSelectedExamId(id)}
            onOpenExamView={(id, mode) => {
              setSelectedExamId(id);
              setViewMode(mode);
            }}
            onDuplicateExam={handleDuplicateExam}
            onResetExams={handleResetExams}
            onBulkZip={handleBulkZip}
            onOpenDownloadModal={(exam) => setDownloadModalExam(exam)}
            onOpenAiGenerator={() => setShowAiGeneratorModal(true)}
            lang={lang}
            currentThemeId={themeId}
            onChangeTheme={handleThemeChange}
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
            themeConfig={currentAppTheme}
            onUpdateExam={handleUpdateExam}
            onDownloadPdf={handleDownloadSingleExamCandidatePdf}
            onDownloadDocx={handleDownloadSingleExamCandidateDocx}
            onDownloadSolutionsPdf={handleDownloadSingleExamSolutionsPdf}
            onDownloadSolutionsDocx={handleDownloadSingleExamSolutionsDocx}
            onApplyStyleToAll={handleApplyStyleToAll}
          />
        )}

        {/* VIEW: CANDIDATE EXAM PAPER PREVIEW */}
        {viewMode === 'paper' && (
          <div className="space-y-4 max-w-6xl mx-auto">
            {/* STREAMLINED PREVIEW CONTROLLER BAR */}
            <StreamlinedPreviewBar
              currentExam={currentExam}
              exams={exams}
              selectedExamId={selectedExamId}
              onSelectExamId={(id) => setSelectedExamId(id)}
              previewUiMode={previewUiMode}
              onChangePreviewUiMode={handleSetPreviewUiMode}
              pageFilter={pageFilter}
              onChangePageFilter={(p) => setPageFilter(p)}
              zoomLevel={zoomLevel}
              onZoomIn={() => setZoomLevel((z) => Math.min(150, z + 10))}
              onZoomOut={() => setZoomLevel((z) => Math.max(60, z - 10))}
              showStylePanel={showStylePanel}
              onToggleStylePanel={() => setShowStylePanel(!showStylePanel)}
              onDownloadModal={() => setDownloadModalExam(currentExam)}
              onPrint={handlePrint}
              lang={lang}
            />

            {/* CONDITIONAL PREVIEW RENDERER ACCORDING TO SELECTED UI ALTERNATIVE */}
            {previewUiMode === 'official-booklet' && (
              <div className="flex justify-center items-start gap-6">
                <div
                  ref={paperRef}
                  style={{
                    transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
                    transformOrigin: 'top center',
                  }}
                  className="transition-transform duration-200"
                >
                  <OfficialExamPaper
                    exam={currentExam}
                    isEditable={false}
                    currentPageFilter={pageFilter}
                    lang={lang}
                  />
                </div>

                {/* Style Panel Drawer */}
                {showStylePanel && (
                  <div className="no-print w-80 flex-shrink-0 sticky top-28">
                    <StylePanel
                      styleConfig={currentExam.styleConfig}
                      onChangeStyle={(newSt) => {
                        const cloned = { ...currentExam, styleConfig: newSt };
                        handleUpdateExam(cloned);
                      }}
                      onApplyToAll={handleApplyStyleToAll}
                      lang={lang}
                    />
                  </div>
                )}
              </div>
            )}

            {previewUiMode === 'split-screen' && (
              <SplitScreenPreview exam={currentExam} lang={lang} />
            )}

            {previewUiMode === 'digital-exam' && (
              <DigitalExamPreview exam={currentExam} lang={lang} />
            )}

            {previewUiMode === 'accessible-reader' && (
              <AccessibleReaderPreview exam={currentExam} lang={lang} />
            )}
          </div>
        )}

        {/* VIEW: ANSWER KEY & SCAN-SHEET */}
        {viewMode === 'solutions' && (
          <div className="flex justify-center items-start gap-6">
            <div ref={solutionsRef} className="w-full max-w-4xl">
              <AnswerKeyPaper exam={currentExam} lang={lang} />
            </div>

            {showStylePanel && (
              <div className="no-print w-80 flex-shrink-0 sticky top-28">
                <StylePanel
                  styleConfig={currentExam.styleConfig}
                  onChangeStyle={(newSt) => {
                    const cloned = { ...currentExam, styleConfig: newSt };
                    handleUpdateExam(cloned);
                  }}
                  onApplyToAll={handleApplyStyleToAll}
                  lang={lang}
                />
              </div>
            )}
          </div>
        )}

        {/* VIEW: FULL INLINE EDITOR */}
        {viewMode === 'editor' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {lang === 'en' ? 'Question Paper Editor' : 'Prüfungsbogen-Editor'}
                </h2>
                <p className="text-xs text-slate-400">
                  {lang === 'en'
                    ? 'Changes are automatically saved live and instantly updated in the candidate sheet and solution sheet.'
                    : 'Änderungen werden live gespeichert und sofort im Kandidatenblatt sowie im Lösungsbogen aktualisiert.'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('paper')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 text-slate-200 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  {t.paper}
                </button>
              </div>
            </div>

            <ExamEditor exam={currentExam} onUpdateExam={handleUpdateExam} lang={lang} />
          </div>
        )}

        {/* VIEW: INTERACTIVE SIMULATION TEST */}
        {viewMode === 'interactive' && (
          <InteractiveTestMode
            exam={currentExam}
            onExit={() => setViewMode('paper')}
            lang={lang}
          />
        )}
      </main>

      {/* Validation Modal */}
      {showValidationModal && (
        <ValidationModal
          exam={currentExam}
          onClose={() => setShowValidationModal(false)}
          lang={lang}
        />
      )}

      {/* Single Exam Download Modal */}
      {downloadModalExam && (
        <ExamDownloadModal
          exam={downloadModalExam}
          onClose={() => setDownloadModalExam(null)}
          lang={lang}
          onDownloadZip={handleDownloadSingleExamZip}
          onDownloadCandidatePdf={handleDownloadSingleExamCandidatePdf}
          onDownloadCandidateDocx={handleDownloadSingleExamCandidateDocx}
          onDownloadSolutionsPdf={handleDownloadSingleExamSolutionsPdf}
          onDownloadSolutionsDocx={handleDownloadSingleExamSolutionsDocx}
          onDownloadTxt={handleDownloadTxt}
          onDownloadJson={handleDownloadJson}
          onUpdateExam={handleUpdateExam}
        />
      )}

      {/* AI Test Generator Wizard Modal */}
      {showAiGeneratorModal && (
        <AiTestGeneratorModal
          nextExamNumber={Math.max(...exams.map((e) => e.examNumber), 0) + 1}
          onClose={() => setShowAiGeneratorModal(false)}
          onExamCreated={handleExamCreated}
          onOpenExamView={(examId, mode) => {
            setSelectedExamId(examId);
            setViewMode(mode);
            setShowAiGeneratorModal(false);
          }}
          onDownloadZip={handleDownloadSingleExamZip}
          onDownloadCandidatePdf={handleDownloadSingleExamCandidatePdf}
          onDownloadCandidateDocx={handleDownloadSingleExamCandidateDocx}
          onDownloadSolutionsPdf={handleDownloadSingleExamSolutionsPdf}
          lang={lang}
        />
      )}

      {/* Offscreen Container for Reliable Full-Exam Multi-Page PDF Generation */}
      <div
        className="fixed -left-[99999px] top-0 w-[800px] pointer-events-none opacity-0 z-[-9999]"
        aria-hidden="true"
      >
        {offscreenRender && (
          <div ref={offscreenRef}>
            {offscreenRender.type === 'paper' ? (
              <OfficialExamPaper
                exam={offscreenRender.exam}
                currentPageFilter="all"
                lang={lang}
              />
            ) : (
              <AnswerKeyPaper
                exam={offscreenRender.exam}
                lang={lang}
              />
            )}
          </div>
        )}
      </div>

      {/* PERSISTENT SLEEK BOTTOM NAVIGATION BAR & COMBINED SETTINGS SECTION */}
      <BottomNavBar
        viewMode={viewMode}
        onChangeViewMode={(mode) => setViewMode(mode)}
        previewUiMode={previewUiMode}
        onChangePreviewUiMode={handleSetPreviewUiMode}
        lang={lang}
        onToggleLang={handleToggleLang}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        showStylePanel={showStylePanel}
        onToggleStylePanel={() => setShowStylePanel(!showStylePanel)}
        onOpenDownloadModal={() => setDownloadModalExam(currentExam)}
        onOpenValidation={() => setShowValidationModal(true)}
        onOpenAiGenerator={() => setShowAiGeneratorModal(true)}
        onPrint={handlePrint}
        onExportPdf={handleExportPdf}
        onExportDocx={handleExportDocx}
        onExportSolutionsPdf={handleExportSolutionsPdf}
        onExportSolutionsDocx={handleExportSolutionsDocx}
        onExportCurrentExamZip={() => handleDownloadSingleExamZip(currentExam)}
        onBulkZip={handleBulkZip}
        onInspectExam={() => {
          setViewMode('dashboard');
          setTimeout(() => {
            document.getElementById('pre-download-inspector')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        currentExamNumber={currentExam.examNumber}
      />
    </div>
  );
}
