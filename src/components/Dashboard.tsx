import React, { useState } from 'react';
import { ExamModel } from '../types/exam';
import { translations, Language } from '../utils/i18n';
import { AppThemeId, AppThemeConfig } from '../utils/theme';
import { AppSettingsSection } from './AppSettingsSection';
import { ExamPreDownloadInspector } from './ExamPreDownloadInspector';
import {
  Search,
  SlidersHorizontal,
  Copy,
  FileText,
  CheckCircle,
  Clock,
  Sparkles,
  Download,
  Play,
  RotateCcw,
  BookOpen,
  Settings,
  Eye,
  Layers,
} from 'lucide-react';

interface Props {
  exams: ExamModel[];
  selectedExamId: string;
  onSelectExam: (id: string) => void;
  onOpenExamView: (id: string, mode: 'paper' | 'solutions' | 'editor' | 'interactive') => void;
  onDuplicateExam: (id: string) => void;
  onResetExams: () => void;
  onBulkZip: () => void;
  onOpenDownloadModal?: (exam: ExamModel) => void;
  onOpenAiGenerator?: () => void;
  lang: Language;
  // Theme & Settings
  currentThemeId: AppThemeId;
  onChangeTheme: (themeId: AppThemeId) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  themeConfig: AppThemeConfig;
  // Inspector & Editor features
  onUpdateExam: (updated: ExamModel) => void;
  onDownloadPdf: (exam: ExamModel) => Promise<void>;
  onDownloadDocx: (exam: ExamModel) => Promise<void>;
  onDownloadSolutionsPdf: (exam: ExamModel) => Promise<void>;
  onDownloadSolutionsDocx: (exam: ExamModel) => Promise<void>;
  onApplyStyleToAll?: () => void;
}

export const Dashboard: React.FC<Props> = ({
  exams,
  selectedExamId,
  onSelectExam,
  onOpenExamView,
  onDuplicateExam,
  onResetExams,
  onBulkZip,
  onOpenDownloadModal,
  onOpenAiGenerator,
  lang,
  currentThemeId,
  onChangeTheme,
  darkMode,
  onToggleDarkMode,
  themeConfig,
  onUpdateExam,
  onDownloadPdf,
  onDownloadDocx,
  onDownloadSolutionsPdf,
  onDownloadSolutionsDocx,
  onApplyStyleToAll,
}) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Ready' | 'Draft' | 'Exported'>('all');
  const [sortBy, setSortBy] = useState<'number' | 'title' | 'updated'>('number');

  const filtered = exams
    .filter((e) => {
      const matchSearch =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.candidateInfo.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || e.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'number') return a.examNumber - b.examNumber;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const readyCount = exams.filter((e) => e.status === 'Ready' || e.status === 'Exported').length;
  const progressPercent = Math.round((readyCount / exams.length) * 100);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12 transition-colors duration-200 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
      {/* Hero Banner */}
      <div
        className={`border rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden ${
          darkMode
            ? 'bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 border-slate-700/80'
            : 'bg-gradient-to-br from-white via-slate-50 to-amber-50/30 border-slate-200 shadow-md text-slate-900'
        }`}
      >
        <div className="max-w-2xl space-y-3 z-10 relative">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider">
            <span className={themeConfig.accentText}>{t.heroBadge}</span>
          </div>
          <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-950'}`}>
            {t.heroTitle}
          </h1>
          <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {t.heroDescription}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {onOpenAiGenerator && (
              <button
                onClick={onOpenAiGenerator}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-slate-950 text-xs font-black rounded-lg shadow-xl flex items-center gap-2 transition-all cursor-pointer transform hover:scale-[1.02] border border-amber-300"
              >
                <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>{lang === 'en' ? 'AI Test Generator (New Exam)' : 'Neuer Modellsatz (KI-Autor)'}</span>
              </button>
            )}
            <button
              onClick={onBulkZip}
              className={`px-4 py-2 text-xs font-bold rounded-lg border shadow-lg flex items-center gap-2 transition-all cursor-pointer ${
                darkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
              }`}
            >
              <Download className={`w-4 h-4 ${themeConfig.accentText}`} />
              {t.downloadAllBtn}
            </button>
            <button
              onClick={() => scrollToSection('app-settings-section')}
              className={`px-3 py-2 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                darkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === 'en' ? 'Settings & Themes ↓' : 'Einstellungen & Themes ↓'}</span>
            </button>
            <button
              onClick={() => scrollToSection('pre-download-inspector')}
              className={`px-3 py-2 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                darkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-rose-500" />
              <span>{lang === 'en' ? 'Visual Inspector ↓' : 'Vorschau & DOCX/PDF ↓'}</span>
            </button>
            <button
              onClick={onResetExams}
              className={`px-3 py-2 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                darkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-300 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-700 border-slate-300'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t.resetAllBtn}
            </button>
          </div>
        </div>

        {/* Progress tracker pill */}
        <div
          className={`mt-6 md:mt-0 md:absolute md:right-8 md:top-8 border p-4 rounded-xl shadow-lg w-64 ${
            darkMode ? 'bg-slate-900/90 border-slate-700 text-slate-300' : 'bg-white/95 border-slate-200 text-slate-700'
          }`}
        >
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-xs font-bold">{t.readinessTitle}</span>
            <span className={`text-xs font-mono font-bold ${themeConfig.accentText}`}>
              {readyCount} / {exams.length} {t.readinessCount}
            </span>
          </div>
          <div className={`w-full h-2.5 rounded-full overflow-hidden border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'}`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ${themeConfig.accentBg}`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>{t.passMarkInfo}</span>
            <span className="font-mono font-bold">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className={`p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${
          darkMode ? 'bg-slate-850/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full border rounded-lg pl-9 pr-4 py-2 outline-none focus:border-amber-400 transition-colors ${
              darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-semibold">{lang === 'en' ? 'Status:' : 'Status:'}</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className={`border rounded-lg px-2.5 py-1.5 outline-none font-medium cursor-pointer ${
                darkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              <option value="all">{t.statusAll}</option>
              <option value="Ready">{t.statusReady}</option>
              <option value="Draft">{t.statusDraft}</option>
              <option value="Exported">{lang === 'en' ? 'Exported' : 'Exportiert'}</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">{lang === 'en' ? 'Sort by:' : 'Sortierung:'}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`border rounded-lg px-2.5 py-1.5 outline-none font-medium cursor-pointer ${
                darkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              <option value="number">{t.sortNumber}</option>
              <option value="title">{t.sortTitle}</option>
              <option value="updated">{t.sortUpdated}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of 10 Exam Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((exam) => {
          const isSelected = exam.id === selectedExamId;
          const numStr = String(exam.examNumber).padStart(2, '0');

          return (
            <div
              key={exam.id}
              onClick={() => onSelectExam(exam.id)}
              className={`border-2 rounded-2xl p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? `${themeConfig.accentBorder} ${
                      darkMode ? 'bg-slate-800/90 shadow-2xl ring-1 ring-amber-500/50' : 'bg-amber-50/40 shadow-xl ring-2 ring-amber-400'
                    }`
                  : darkMode
                  ? 'border-slate-800 bg-slate-850/60 hover:border-slate-700 hover:bg-slate-800/60 shadow-lg'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <div>
                {/* Card Top Row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-black px-2.5 py-1 rounded-lg border ${
                        isSelected
                          ? themeConfig.badgeBg
                          : darkMode
                          ? 'bg-slate-900 text-slate-300 border-slate-700'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      SATZ #{numStr}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        exam.status === 'Ready'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : exam.status === 'Exported'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {exam.status === 'Ready'
                        ? t.statusReady
                        : exam.status === 'Exported'
                        ? (lang === 'en' ? 'Exported' : 'Exportiert')
                        : t.statusDraft}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {onOpenDownloadModal && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDownloadModal(exam);
                        }}
                        title={t.downloadExamPackage}
                        className="p-1 rounded bg-slate-700/80 hover:bg-amber-500 text-slate-300 hover:text-slate-950 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Title & Theme */}
                <h3 className={`font-extrabold text-base tracking-tight line-clamp-1 mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {exam.title}
                </h3>
                <p className={`text-xs font-semibold mb-3 ${themeConfig.accentText}`}>
                  {exam.theme}
                </p>

                {/* Thumbnail of Teil 1 text */}
                <div
                  className={`border rounded-lg p-3 mb-4 text-[11px] line-clamp-3 leading-relaxed font-sans italic ${
                    darkMode ? 'bg-slate-900/80 border-slate-700/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  „{exam.teil1.emailBody.slice(0, 160)}...“
                </div>

                {/* Structure pills */}
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-4 font-mono">
                  <span>{t.items30}</span>
                  <span>•</span>
                  <span>5 {t.teil1.split(' ')[0]}</span>
                  <span>•</span>
                  <span>{t.min65}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`space-y-2 pt-3 border-t ${darkMode ? 'border-slate-700/80' : 'border-slate-200'}`}>
                <div className={`grid ${onOpenDownloadModal ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
                  <button
                    onClick={() => {
                      onSelectExam(exam.id);
                      onOpenExamView(exam.id, 'paper');
                    }}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                      darkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-500" />
                    <span className="truncate">{t.openExam}</span>
                  </button>
                  <button
                    onClick={() => {
                      onSelectExam(exam.id);
                      onOpenExamView(exam.id, 'solutions');
                    }}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                      darkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="truncate">{t.solutionsBtn}</span>
                  </button>
                  {onOpenDownloadModal && (
                    <button
                      onClick={() => onOpenDownloadModal(exam)}
                      className={`py-1.5 px-2 border text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer ${themeConfig.badgeBg}`}
                      title={t.downloadExamPackage}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t.downloadBtn}</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      onSelectExam(exam.id);
                      onOpenExamView(exam.id, 'editor');
                    }}
                    className={`py-1.5 px-2 text-[11px] rounded-lg border text-center cursor-pointer ${
                      darkMode ? 'bg-slate-900 hover:bg-slate-750 text-slate-300 border-slate-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {t.editBtn}
                  </button>
                  <button
                    onClick={() => {
                      onSelectExam(exam.id);
                      onOpenExamView(exam.id, 'interactive');
                    }}
                    className="py-1.5 px-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-[11px] font-semibold rounded-lg border border-emerald-500/30 text-center flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    {t.simulateBtn}
                  </button>
                  <button
                    onClick={() => onDuplicateExam(exam.id)}
                    title={t.duplicateBtn}
                    className={`py-1.5 px-2 text-[11px] rounded-lg border flex items-center justify-center gap-1 cursor-pointer ${
                      darkMode ? 'bg-slate-900 hover:bg-slate-750 text-slate-300 border-slate-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    <Copy className="w-3 h-3" />
                    {t.duplicateBtn}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION BELOW 1: Settings Section with 5 Color Themes and Dark Mode Toggle */}
      <AppSettingsSection
        currentThemeId={currentThemeId}
        onChangeTheme={onChangeTheme}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        lang={lang}
        onScrollToInspector={() => scrollToSection('pre-download-inspector')}
      />

      {/* SECTION BELOW 2: Pre-Download Full Exam Inspector & Simulator */}
      <ExamPreDownloadInspector
        exams={exams}
        selectedExamId={selectedExamId}
        onSelectExam={onSelectExam}
        onUpdateExam={onUpdateExam}
        onDownloadPdf={onDownloadPdf}
        onDownloadDocx={onDownloadDocx}
        onDownloadSolutionsPdf={onDownloadSolutionsPdf}
        onDownloadSolutionsDocx={onDownloadSolutionsDocx}
        onOpenDownloadModal={onOpenDownloadModal}
        onApplyToAll={onApplyStyleToAll}
        lang={lang}
        themeConfig={themeConfig}
        darkMode={darkMode}
      />
    </div>
  );
};
