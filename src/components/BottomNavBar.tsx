import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  CheckCircle2,
  Edit3,
  Play,
  Settings,
  Languages,
  Moon,
  Sun,
  Palette,
  Download,
  Sparkles,
  FileCheck,
  Printer,
  X,
  Columns,
  Monitor,
  BookOpen,
  Eye,
  Archive,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Language } from '../utils/i18n';
import { PreviewUiAlternative } from '../App';

interface Props {
  viewMode: 'dashboard' | 'paper' | 'solutions' | 'editor' | 'interactive';
  onChangeViewMode: (mode: 'dashboard' | 'paper' | 'solutions' | 'editor' | 'interactive') => void;
  previewUiMode: PreviewUiAlternative;
  onChangePreviewUiMode: (mode: PreviewUiAlternative) => void;
  lang: Language;
  onToggleLang: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  showStylePanel: boolean;
  onToggleStylePanel: () => void;
  onOpenDownloadModal: () => void;
  onOpenValidation: () => void;
  onOpenAiGenerator: () => void;
  onPrint: () => void;
  onExportPdf: () => void;
  onExportDocx: () => void;
  onExportSolutionsPdf: () => void;
  onExportSolutionsDocx: () => void;
  onExportCurrentExamZip?: () => void;
  onBulkZip: () => void;
  onInspectExam?: () => void;
  currentExamNumber?: number;
}

export const BottomNavBar: React.FC<Props> = ({
  viewMode,
  onChangeViewMode,
  previewUiMode,
  onChangePreviewUiMode,
  lang,
  onToggleLang,
  darkMode,
  onToggleDarkMode,
  showStylePanel,
  onToggleStylePanel,
  onOpenDownloadModal,
  onOpenValidation,
  onOpenAiGenerator,
  onPrint,
  onExportPdf,
  onExportDocx,
  onExportSolutionsPdf,
  onExportSolutionsDocx,
  onExportCurrentExamZip,
  onBulkZip,
  onInspectExam,
  currentExamNumber = 1,
}) => {
  const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);
  const [activeSettingsSection, setActiveSettingsSection] = useState<'all' | 'display' | 'tools' | 'downloads'>('all');

  const isEn = lang === 'en';

  const previewModes = [
    {
      id: 'official-booklet' as const,
      label: isEn ? '1. A4 Booklet' : '1. A4-Heft',
      longLabel: isEn ? 'Official DIN-A4 Exam Booklet' : 'Offizielles DIN-A4 Prüfungsheft',
      icon: FileText,
    },
    {
      id: 'split-screen' as const,
      label: isEn ? '2. Split Studio' : '2. Split Lektor',
      longLabel: isEn ? 'Split-Screen Text & Proof Citations' : 'Split-Screen Text & Belege',
      icon: Columns,
    },
    {
      id: 'digital-exam' as const,
      label: isEn ? '3. Digital CBT' : '3. Digital CBT',
      longLabel: isEn ? 'Goethe B1 Digital Exam Terminal' : 'Goethe B1 Digital Terminal',
      icon: Monitor,
    },
    {
      id: 'accessible-reader' as const,
      label: isEn ? '4. Large Print' : '4. Großdruck',
      longLabel: isEn ? 'Accessible Large Print & Audio' : 'Barrierefreier Großdruck & Audio',
      icon: BookOpen,
    },
  ];

  const handleTabClick = (mode: 'dashboard' | 'paper' | 'solutions' | 'editor' | 'interactive') => {
    onChangeViewMode(mode);
    setShowSettingsDrawer(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 no-print select-none">
      {/* EXPANDABLE COMBINED SETTINGS & CONTROLS DRAWER (To prevent top bar clutter) */}
      {showSettingsDrawer && (
        <div className="bg-slate-950/98 backdrop-blur-2xl border-t border-slate-800 shadow-[0_-10px_35px_rgba(0,0,0,0.7)] p-4 sm:p-6 text-white animate-in slide-in-from-bottom duration-200 max-h-[85vh] overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-white">
                    {isEn ? 'Settings & Control Panel' : 'Einstellungen & Prüfungszentrale'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isEn
                      ? 'Combined controls for language, theme, B1 tools & direct downloads'
                      : 'Zentraler Zugriff auf Sprache, Design, KI-Werkzeuge und Downloads'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSettingsDrawer(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Section Filter Chips */}
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setActiveSettingsSection('all')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeSettingsSection === 'all'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {isEn ? 'All Settings' : 'Alle Optionen'}
              </button>
              <button
                onClick={() => setActiveSettingsSection('display')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeSettingsSection === 'display'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {isEn ? '1. Language & Appearance' : '1. Sprache & Design'}
              </button>
              <button
                onClick={() => setActiveSettingsSection('tools')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeSettingsSection === 'tools'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {isEn ? '2. Exam Tools & AI' : '2. KI- & Prüf-Tools'}
              </button>
              <button
                onClick={() => setActiveSettingsSection('downloads')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeSettingsSection === 'downloads'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {isEn ? '3. Downloads & Print' : '3. Downloads & Druck'}
              </button>
            </div>

            {/* SECTION 1: LANGUAGE & APPEARANCE */}
            {(activeSettingsSection === 'all' || activeSettingsSection === 'display') && (
              <div className="space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isEn ? '1. Language & Display' : '1. Sprache & Darstellung'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {/* Language Toggle Control */}
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/90 flex flex-col justify-between gap-2">
                    <div>
                      <div className="font-bold text-white mb-0.5">{isEn ? 'Interface Language' : 'Benutzeroberfläche'}</div>
                      <div className="text-[11px] text-slate-400">
                        {isEn ? 'Exam remains in German' : 'Prüfungstexte bleiben Deutsch'}
                      </div>
                    </div>
                    <div className="flex items-center p-1 rounded-lg bg-slate-950 border border-slate-800">
                      <button
                        onClick={() => lang !== 'de' && onToggleLang()}
                        className={`flex-1 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          lang === 'de' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>🇩🇪</span>
                        <span>Deutsch</span>
                      </button>
                      <button
                        onClick={() => lang !== 'en' && onToggleLang()}
                        className={`flex-1 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          lang === 'en' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>🇬🇧</span>
                        <span>English</span>
                      </button>
                    </div>
                  </div>

                  {/* Dark / Light Mode */}
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/90 flex flex-col justify-between gap-2">
                    <div>
                      <div className="font-bold text-white mb-0.5">{isEn ? 'Theme Mode' : 'Farbschema'}</div>
                      <div className="text-[11px] text-slate-400">
                        {darkMode ? (isEn ? 'Dark mode active' : 'Dunkelmodus aktiv') : (isEn ? 'Light mode active' : 'Hellmodus aktiv')}
                      </div>
                    </div>
                    <button
                      onClick={onToggleDarkMode}
                      className="w-full py-1.5 px-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                      <span>{darkMode ? (isEn ? 'Switch to Light Mode' : 'Zu Hellmodus wechseln') : (isEn ? 'Switch to Dark Mode' : 'Zu Dunkelmodus wechseln')}</span>
                    </button>
                  </div>

                  {/* Style & Typography Panel */}
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/90 flex flex-col justify-between gap-2">
                    <div>
                      <div className="font-bold text-white mb-0.5">{isEn ? 'Typography & Layout' : 'Typografie & Ränder'}</div>
                      <div className="text-[11px] text-slate-400">{isEn ? 'Font size, note lines, layout' : 'Schriftart, Notizlinien, Layout'}</div>
                    </div>
                    <button
                      onClick={() => {
                        onToggleStylePanel();
                        if (viewMode !== 'paper') onChangeViewMode('paper');
                        setShowSettingsDrawer(false);
                      }}
                      className={`w-full py-1.5 px-3 rounded-lg border font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                        showStylePanel
                          ? 'bg-amber-500 text-slate-950 border-amber-500'
                          : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      <Palette className="w-4 h-4 text-amber-400" />
                      <span>{showStylePanel ? (isEn ? 'Hide Style Panel' : 'Stil-Panel schließen') : (isEn ? 'Open Style Panel' : 'Stil-Panel öffnen')}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: EXAM TOOLS & AI */}
            {(activeSettingsSection === 'all' || activeSettingsSection === 'tools') && (
              <div className="space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isEn ? '2. Exam Tools & AI Generation' : '2. KI- & Prüf-Tools'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {/* AI Generator */}
                  <button
                    onClick={() => {
                      onOpenAiGenerator();
                      setShowSettingsDrawer(false);
                    }}
                    className="p-3 rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-amber-600/20 hover:from-amber-500/20 hover:to-amber-600/30 flex flex-col justify-between gap-3 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-amber-300">{isEn ? 'AI Exam Generator' : 'KI-Prüfungsautor'}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-amber-400/60 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      {isEn ? 'Draft custom B1 mock exam sets with topics, full answer keys and citations.' : 'Neue Modellsätze automatisch nach offizieller Goethe-Norm erstellen.'}
                    </p>
                  </button>

                  {/* Norm Check / Validation */}
                  <button
                    onClick={() => {
                      onOpenValidation();
                      setShowSettingsDrawer(false);
                    }}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-900/90 hover:bg-slate-800 flex flex-col justify-between gap-3 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-slate-200">{isEn ? 'B1 Norm Validator' : 'Goethe B1-Prüfer'}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {isEn ? 'Run automated audit for items 1–30, word counts, and distractor rules.' : 'Prüft 1–30 Items, Wortgrenzen und Aufgabenverteilung auf Konformität.'}
                    </p>
                  </button>

                  {/* Pre-Download Inspector */}
                  <button
                    onClick={() => {
                      if (onInspectExam) onInspectExam();
                      else {
                        onChangeViewMode('dashboard');
                        setTimeout(() => {
                          document.getElementById('pre-download-inspector')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }
                      setShowSettingsDrawer(false);
                    }}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-900/90 hover:bg-slate-800 flex flex-col justify-between gap-3 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-rose-400" />
                        <span className="font-bold text-slate-200">{isEn ? 'Exam Inspector' : 'Prüfungsinspektor'}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {isEn ? 'Simulate multi-page DOCX and PDF layouts before exporting.' : 'Gesamtprüfung mit allen Teilen und Layouts vor dem Download einsehen.'}
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 3: DOWNLOADS & PRINT */}
            {(activeSettingsSection === 'all' || activeSettingsSection === 'downloads') && (
              <div className="space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span>{isEn ? '3. Downloads & Printing Center' : '3. Downloads & Druckzentrum'}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
                  {/* Download Package Modal */}
                  <button
                    onClick={() => {
                      onOpenDownloadModal();
                      setShowSettingsDrawer(false);
                    }}
                    className="p-2.5 rounded-xl border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-slate-200 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
                  >
                    <Download className="w-4 h-4 text-sky-400" />
                    <span className="font-bold text-[11px]">{isEn ? 'Download Menu' : 'Download-Menü'}</span>
                    <span className="text-[10px] text-slate-400">{isEn ? 'Format picker' : 'Formate wählen'}</span>
                  </button>

                  {/* Current Exam ZIP */}
                  {onExportCurrentExamZip && (
                    <button
                      onClick={() => {
                        onExportCurrentExamZip();
                        setShowSettingsDrawer(false);
                      }}
                      className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
                    >
                      <Archive className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-[11px]">{isEn ? `Set #${currentExamNumber} ZIP` : `Satz #${currentExamNumber} ZIP`}</span>
                      <span className="text-[10px] text-slate-400">{isEn ? 'All files' : 'Komplettpaket'}</span>
                    </button>
                  )}

                  {/* Candidate Paper PDF */}
                  <button
                    onClick={() => {
                      onExportPdf();
                      setShowSettingsDrawer(false);
                    }}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
                  >
                    <FileText className="w-4 h-4 text-rose-400" />
                    <span className="font-bold text-[11px]">{isEn ? 'Paper PDF' : 'Kandidat PDF'}</span>
                    <span className="text-[10px] text-slate-400">DIN A4</span>
                  </button>

                  {/* Candidate Paper DOCX */}
                  <button
                    onClick={() => {
                      onExportDocx();
                      setShowSettingsDrawer(false);
                    }}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
                  >
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-[11px]">{isEn ? 'Paper DOCX' : 'Kandidat DOCX'}</span>
                    <span className="text-[10px] text-slate-400">Word</span>
                  </button>

                  {/* Solutions PDF */}
                  <button
                    onClick={() => {
                      onExportSolutionsPdf();
                      setShowSettingsDrawer(false);
                    }}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-[11px]">{isEn ? 'Solutions PDF' : 'Lösungen PDF'}</span>
                    <span className="text-[10px] text-slate-400">Scan-Bogen</span>
                  </button>

                  {/* Solutions DOCX */}
                  <button
                    onClick={() => {
                      onExportSolutionsDocx();
                      setShowSettingsDrawer(false);
                    }}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-[11px]">{isEn ? 'Solutions DOCX' : 'Lösungen DOCX'}</span>
                    <span className="text-[10px] text-slate-400">Word</span>
                  </button>

                  {/* Bulk ZIP all 10 Exams */}
                  <button
                    onClick={() => {
                      onBulkZip();
                      setShowSettingsDrawer(false);
                    }}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
                  >
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-[11px]">{isEn ? '10 Exams ZIP' : 'Alle 10 Sätze'}</span>
                    <span className="text-[10px] text-slate-400">{isEn ? 'Bulk package' : 'Master-Archiv'}</span>
                  </button>

                  {/* Print */}
                  <button
                    onClick={() => {
                      onPrint();
                      setShowSettingsDrawer(false);
                    }}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
                  >
                    <Printer className="w-4 h-4 text-neutral-300" />
                    <span className="font-bold text-[11px]">{isEn ? 'Print Page' : 'Drucken'}</span>
                    <span className="text-[10px] text-slate-400">Strg + P</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MAIN BOTTOM NAVIGATION BAR (Matching User Screenshot style) */}
      <nav className="bg-black/95 backdrop-blur-xl border-t border-slate-800 px-2 sm:px-4 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-2xl mx-auto flex items-center justify-around gap-1">
          {/* 1. DASHBOARD TAB */}
          <button
            onClick={() => handleTabClick('dashboard')}
            className="flex-1 py-1 px-2 flex flex-col items-center justify-center relative group cursor-pointer transition-all"
          >
            {/* Active Top Bar Indicator */}
            {viewMode === 'dashboard' && (
              <span className="absolute -top-1.5 w-8 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            )}
            <LayoutDashboard
              className={`w-5 h-5 mb-1 transition-colors ${
                viewMode === 'dashboard' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            />
            <span
              className={`text-[10px] uppercase font-bold tracking-wider ${
                viewMode === 'dashboard' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            >
              {isEn ? 'Overview' : 'Übersicht'}
            </span>
          </button>

          {/* 2. VORSCHAU (4 UI MODES) TAB */}
          <button
            onClick={() => handleTabClick('paper')}
            className="flex-1 py-1 px-2 flex flex-col items-center justify-center relative group cursor-pointer transition-all"
          >
            {/* Active Top Bar Indicator */}
            {viewMode === 'paper' && (
              <span className="absolute -top-1.5 w-8 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            )}
            <FileText
              className={`w-5 h-5 mb-1 transition-colors ${
                viewMode === 'paper' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            />
            <span
              className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-0.5 ${
                viewMode === 'paper' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            >
              <span>{isEn ? 'Preview' : 'Vorschau'}</span>
              <span className="text-[9px] px-1 bg-amber-500/20 text-amber-400 rounded-sm">4</span>
            </span>
          </button>

          {/* 3. LÖSUNGEN TAB */}
          <button
            onClick={() => handleTabClick('solutions')}
            className="flex-1 py-1 px-2 flex flex-col items-center justify-center relative group cursor-pointer transition-all"
          >
            {viewMode === 'solutions' && (
              <span className="absolute -top-1.5 w-8 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            )}
            <CheckCircle2
              className={`w-5 h-5 mb-1 transition-colors ${
                viewMode === 'solutions' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            />
            <span
              className={`text-[10px] uppercase font-bold tracking-wider ${
                viewMode === 'solutions' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            >
              {isEn ? 'Solutions' : 'Lösungen'}
            </span>
          </button>

          {/* 4. EDITOR TAB */}
          <button
            onClick={() => handleTabClick('editor')}
            className="flex-1 py-1 px-2 flex flex-col items-center justify-center relative group cursor-pointer transition-all"
          >
            {viewMode === 'editor' && (
              <span className="absolute -top-1.5 w-8 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            )}
            <Edit3
              className={`w-5 h-5 mb-1 transition-colors ${
                viewMode === 'editor' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            />
            <span
              className={`text-[10px] uppercase font-bold tracking-wider ${
                viewMode === 'editor' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            >
              Editor
            </span>
          </button>

          {/* 5. TEST SIMULATION TAB */}
          <button
            onClick={() => handleTabClick('interactive')}
            className="flex-1 py-1 px-2 flex flex-col items-center justify-center relative group cursor-pointer transition-all"
          >
            {viewMode === 'interactive' && (
              <span className="absolute -top-1.5 w-8 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            )}
            <Play
              className={`w-5 h-5 mb-1 transition-colors ${
                viewMode === 'interactive' ? 'text-emerald-400 fill-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            />
            <span
              className={`text-[10px] uppercase font-bold tracking-wider ${
                viewMode === 'interactive' ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            >
              Test
            </span>
          </button>

          {/* 6. SETTINGS SECTION (COMBINES ALL CONTROLS TO PREVENT CLUTTER) */}
          <button
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            className={`flex-1 py-1 px-2 flex flex-col items-center justify-center relative group cursor-pointer transition-all ${
              showSettingsDrawer ? 'text-amber-400' : ''
            }`}
          >
            {showSettingsDrawer && (
              <span className="absolute -top-1.5 w-8 h-1 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            )}
            <Settings
              className={`w-5 h-5 mb-1 transition-colors ${
                showSettingsDrawer ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            />
            <span
              className={`text-[10px] uppercase font-bold tracking-wider ${
                showSettingsDrawer ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            >
              {isEn ? 'Settings' : 'Optionen'}
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
};
