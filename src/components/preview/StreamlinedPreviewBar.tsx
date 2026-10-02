import React from 'react';
import { ExamModel } from '../../types/exam';
import { Language, translations } from '../../utils/i18n';
import { PreviewUiAlternative } from '../../App';

export type PageFilter = 'all' | 1 | 2 | 3 | 4 | 5 | 6 | 7;

import {
  FileText,
  Columns,
  Monitor,
  BookOpen,
  ZoomIn,
  ZoomOut,
  Palette,
  Printer,
  Download,
  ChevronDown,
} from 'lucide-react';

interface Props {
  currentExam: ExamModel;
  exams: ExamModel[];
  selectedExamId: string;
  onSelectExamId: (id: string) => void;
  previewUiMode: PreviewUiAlternative;
  onChangePreviewUiMode: (mode: PreviewUiAlternative) => void;
  pageFilter: PageFilter;
  onChangePageFilter: (p: PageFilter) => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom?: () => void;
  showStylePanel: boolean;
  onToggleStylePanel: () => void;
  onDownloadModal: () => void;
  onPrint: () => void;
  lang: Language;
}

export const StreamlinedPreviewBar: React.FC<Props> = ({
  currentExam,
  exams,
  selectedExamId,
  onSelectExamId,
  previewUiMode,
  onChangePreviewUiMode,
  pageFilter,
  onChangePageFilter,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  showStylePanel,
  onToggleStylePanel,
  onDownloadModal,
  onPrint,
  lang,
}) => {
  const isEn = lang === 'en';
  const t = translations[lang];

  const previewModes = [
    {
      id: 'official-booklet' as const,
      label: isEn ? 'DIN-A4 Booklet' : 'DIN-A4 Heft',
      shortLabel: isEn ? 'Booklet' : 'Heft',
      icon: FileText,
      tooltip: isEn ? 'Authentic 7-page Goethe examination booklet' : 'Offizielles Prüfungsheft mit Deckblatt & Zeilen',
    },
    {
      id: 'split-screen' as const,
      label: isEn ? 'Split Studio' : 'Split Lektor',
      shortLabel: 'Split',
      icon: Columns,
      tooltip: isEn ? 'Side-by-side text & task evidence citations' : 'Zweispaltiger Lese- und Belegmodus',
    },
    {
      id: 'digital-exam' as const,
      label: isEn ? 'Digital CBT' : 'Digital CBT',
      shortLabel: 'Digital',
      icon: Monitor,
      tooltip: isEn ? 'Goethe B1 computer terminal simulation' : 'Computer-Terminal mit Timer & 1–30 Matrix',
    },
    {
      id: 'accessible-reader' as const,
      label: isEn ? 'Large Print' : 'Großdruck',
      shortLabel: isEn ? 'Large' : 'Groß',
      icon: BookOpen,
      tooltip: isEn ? 'Accessible large print, reading ruler & German audio' : 'Barrierefreier Großdruck, Lese-Lineal & Vorlesen',
    },
  ];

  return (
    <div className="no-print bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-xl p-2.5 sm:p-3 mb-6 backdrop-blur-md transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* LEFT: Exam Set Picker & 4-Mode Segmented Control */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Exam Set Selector */}
          <div className="relative flex items-center">
            <select
              value={selectedExamId}
              onChange={(e) => onSelectExamId(e.target.value)}
              className="appearance-none bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs py-1.5 pl-3 pr-7 rounded-xl border border-slate-700 outline-none focus:border-amber-400 cursor-pointer shadow-sm transition-colors"
            >
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  #{String(ex.examNumber).padStart(2, '0')}: {ex.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-5 w-px bg-slate-800" />

          {/* STREAMLINED 4-MODE SEGMENTED PILLS */}
          <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800 shadow-inner">
            {previewModes.map((mode) => {
              const Icon = mode.icon;
              const isSelected = previewUiMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => onChangePreviewUiMode(mode.id)}
                  title={mode.tooltip}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-1 ring-amber-300'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span className="hidden md:inline">{mode.label}</span>
                  <span className="md:hidden">{mode.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Contextual Controls (Zoom, Style, Download, Print) */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Zoom controls for Booklet */}
          {previewUiMode === 'official-booklet' && (
            <div className="hidden sm:flex items-center bg-slate-950/80 rounded-xl border border-slate-800 p-0.5 text-xs font-mono">
              <button
                onClick={onZoomOut}
                title={t.zoomOut}
                className="p-1.5 text-slate-400 hover:text-white rounded cursor-pointer transition-colors"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-slate-300 font-bold min-w-[42px] text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={onZoomIn}
                title={t.zoomIn}
                className="p-1.5 text-slate-400 hover:text-white rounded cursor-pointer transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Style & Layout Panel Toggle */}
          <button
            onClick={onToggleStylePanel}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              showStylePanel
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                : 'bg-slate-800/80 hover:bg-slate-750 text-slate-200 border-slate-700'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isEn ? 'Style' : 'Stil'}</span>
          </button>

          {/* Download Exam Package Modal Button */}
          <button
            onClick={onDownloadModal}
            className="px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{isEn ? 'Export' : 'Export'}</span>
          </button>

          {/* Print dialog */}
          <button
            onClick={onPrint}
            title={isEn ? 'Print Exam Booklet' : 'Prüfungsheft drucken'}
            className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-750 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">{isEn ? 'Print' : 'Drucken'}</span>
          </button>
        </div>
      </div>

      {/* SUB-ROW: BOOKLET PAGE TABS (Only shown in DIN-A4 Booklet mode) */}
      {previewUiMode === 'official-booklet' && (
        <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-semibold whitespace-nowrap pl-1">
            {isEn ? 'Booklet Pages:' : 'Heftseiten:'}
          </span>
          <div className="flex items-center gap-1">
            {(['all', 1, 2, 3, 4, 5, 6, 7] as const).map((p) => {
              const label =
                p === 'all'
                  ? isEn ? 'All Pages (7)' : 'Alle Seiten (7)'
                  : p === 1
                  ? isEn ? 'Cover' : 'Deckblatt'
                  : p === 2
                  ? 'Teil 1'
                  : p === 3
                  ? 'Teil 2a'
                  : p === 4
                  ? 'Teil 2b'
                  : p === 5
                  ? 'Teil 3'
                  : p === 6
                  ? 'Teil 4'
                  : 'Teil 5';
              const isSelected = pageFilter === p;
              return (
                <button
                  key={p}
                  onClick={() => onChangePageFilter(p)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
