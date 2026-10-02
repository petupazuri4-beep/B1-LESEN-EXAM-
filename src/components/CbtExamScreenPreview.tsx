import React, { useState, useEffect } from 'react';
import { ExamModel } from '../types/exam';
import { Language } from '../utils/i18n';
import { GermanTtsPlayer } from './GermanTtsPlayer';
import {
  Monitor,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Volume2,
  Check,
  Type,
  HelpCircle,
} from 'lucide-react';

interface Props {
  exam: ExamModel;
  lang?: Language;
}

export const CbtExamScreenPreview: React.FC<Props> = ({ exam, lang = 'de' }) => {
  const [activeItemIndex, setActiveItemIndex] = useState<number>(1); // 1 to 30
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [flaggedItems, setFlaggedItems] = useState<Record<number, boolean>>({});
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0); // -1, 0, +1
  const [secondsRemaining, setSecondsRemaining] = useState<number>(65 * 60); // 65 min
  const [timerRunning, setTimerRunning] = useState<boolean>(true);

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((s) => Math.max(0, s - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsRemaining]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSelectAnswer = (itemNum: number, answerVal: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [itemNum]: answerVal,
    }));
  };

  const toggleFlag = (itemNum: number) => {
    setFlaggedItems((prev) => ({
      ...prev,
      [itemNum]: !prev[itemNum],
    }));
  };

  // Determine which Teil the active item belongs to:
  // 1-6 -> Teil 1
  // 7-12 -> Teil 2 (7-9 Text A, 10-12 Text B)
  // 13-19 -> Teil 3
  // 20-26 -> Teil 4
  // 27-30 -> Teil 5
  const currentTeil =
    activeItemIndex <= 6
      ? 1
      : activeItemIndex <= 12
      ? 2
      : activeItemIndex <= 19
      ? 3
      : activeItemIndex <= 26
      ? 4
      : 5;

  const answeredCount = Object.keys(userAnswers).length;

  const baseFontClass =
    fontSizeOffset === 1
      ? 'text-sm leading-relaxed'
      : fontSizeOffset === -1
      ? 'text-[11px] leading-normal'
      : 'text-xs leading-relaxed';

  return (
    <div className="w-full max-w-6xl mx-auto rounded-2xl border-2 border-slate-700 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden font-sans flex flex-col min-h-[700px]">
      {/* 1. Official CBT Top Status Bar */}
      <div className="bg-[#1e293b] border-b border-slate-700 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-orange-600 text-white font-black font-mono flex items-center justify-center text-xs">
              B1
            </span>
            <div>
              <span className="font-bold text-white uppercase tracking-wider block text-[11px]">
                Goethe-Zertifikat B1 • Modul LESEN (CBT)
              </span>
              <span className="text-[10px] text-slate-400">
                Prüfungssatz #{String(exam.examNumber).padStart(2, '0')}: {exam.title}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Timer Bar */}
        <div className="flex items-center gap-2 bg-slate-950/70 border border-slate-700/80 px-3 py-1.5 rounded-xl font-mono">
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="text-slate-400 text-[11px]">Verbleibend:</span>
          <span
            className={`font-black text-sm ${
              secondsRemaining < 600 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
            }`}
          >
            {formatTimer(secondsRemaining)}
          </span>
          <button
            type="button"
            onClick={() => setTimerRunning(!timerRunning)}
            className="p-1 hover:bg-slate-800 text-slate-300 rounded cursor-pointer"
            title={timerRunning ? 'Timer pausieren' : 'Timer fortsetzen'}
          >
            {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />}
          </button>
        </div>

        {/* Right: Candidate ID & Text Size */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="font-semibold text-slate-200 block text-[11px]">
              Mustermann, Anna
            </span>
            <span className="text-[10px] font-mono text-slate-400">PTN: 00482910</span>
          </div>

          {/* Font Resizer */}
          <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1">
            <button
              onClick={() => setFontSizeOffset((o) => Math.max(-1, o - 1))}
              className={`px-1.5 py-0.5 rounded font-bold text-[10px] cursor-pointer ${
                fontSizeOffset === -1 ? 'bg-orange-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSizeOffset(0)}
              className={`px-1.5 py-0.5 rounded font-bold text-[10px] cursor-pointer ${
                fontSizeOffset === 0 ? 'bg-orange-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              A
            </button>
            <button
              onClick={() => setFontSizeOffset((o) => Math.min(1, o + 1))}
              className={`px-1.5 py-0.5 rounded font-bold text-[10px] cursor-pointer ${
                fontSizeOffset === 1 ? 'bg-orange-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Test Arena (50/50 Screen Split) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 bg-slate-950 overflow-hidden">
        {/* LEFT PANE: Reading Stimulus */}
        <div className="p-6 overflow-y-auto max-h-[560px] space-y-4 bg-slate-900/60">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              {currentTeil === 1 && 'Teil 1 • E-Mail / Blogbeitrag'}
              {currentTeil === 2 && (activeItemIndex <= 9 ? 'Teil 2 • Zeitungstext A' : 'Teil 2 • Zeitungstext B')}
              {currentTeil === 3 && 'Teil 3 • 10 Anzeigen aus Medien'}
              {currentTeil === 4 && 'Teil 4 • 7 Leserbriefe'}
              {currentTeil === 5 && 'Teil 5 • Hausordnung / Regelwerk'}
            </span>
            {currentTeil === 1 && <GermanTtsPlayer text={exam.teil1.emailBody} label="Audio" />}
            {currentTeil === 2 && (
              <GermanTtsPlayer
                text={activeItemIndex <= 9 ? exam.teil2.textA.bodyParagraphs.join(' ') : exam.teil2.textB.bodyParagraphs.join(' ')}
                label="Audio"
              />
            )}
            {currentTeil === 5 && (
              <GermanTtsPlayer text={exam.teil5.sections.map(s => `${s.title}: ${s.content}`).join(' ')} label="Audio" />
            )}
          </div>

          {/* Render Active Stimulus */}
          <div className={baseFontClass}>
            {currentTeil === 1 && (
              <div className="bg-slate-850 p-4 rounded-xl border border-slate-750 space-y-3">
                <div className="text-[11px] font-mono text-slate-400 pb-1 border-b border-slate-750">
                  Betreff: {exam.title}
                </div>
                <div className="font-bold text-white">{exam.teil1.emailGreeting}</div>
                <div className="space-y-2.5 text-slate-200">
                  {exam.teil1.emailBody.split('\n\n').map((p, idx) => (
                    <p key={idx} className="indent-2 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
                <div className="pt-2 font-bold text-white whitespace-pre-line">{exam.teil1.emailSignoff}</div>
              </div>
            )}

            {currentTeil === 2 && activeItemIndex <= 9 && (
              <div className="bg-slate-850 p-4 rounded-xl border border-slate-750 space-y-3">
                <div className="border-b border-slate-700 pb-2">
                  <span className="text-[10px] uppercase font-bold text-orange-400">Zeitungstext A</span>
                  <h4 className="text-base font-black text-white">{exam.teil2.textA.title}</h4>
                  <p className="text-xs italic text-slate-400 mt-0.5">{exam.teil2.textA.kicker}</p>
                </div>
                <div className="space-y-2 text-slate-200">
                  {exam.teil2.textA.bodyParagraphs.map((p, idx) => (
                    <p key={idx} className="indent-2 leading-relaxed">{p}</p>
                  ))}
                </div>
                <div className="text-right text-[10px] text-slate-400 italic pt-2 border-t border-slate-800">
                  {exam.teil2.textA.source}
                </div>
              </div>
            )}

            {currentTeil === 2 && activeItemIndex > 9 && (
              <div className="bg-slate-850 p-4 rounded-xl border border-slate-750 space-y-3">
                <div className="border-b border-slate-700 pb-2">
                  <span className="text-[10px] uppercase font-bold text-orange-400">Zeitungstext B</span>
                  <h4 className="text-base font-black text-white">{exam.teil2.textB.title}</h4>
                  <p className="text-xs italic text-slate-400 mt-0.5">{exam.teil2.textB.kicker}</p>
                </div>
                <div className="space-y-2 text-slate-200">
                  {exam.teil2.textB.bodyParagraphs.map((p, idx) => (
                    <p key={idx} className="indent-2 leading-relaxed">{p}</p>
                  ))}
                </div>
                <div className="text-right text-[10px] text-slate-400 italic pt-2 border-t border-slate-800">
                  {exam.teil2.textB.source}
                </div>
              </div>
            )}

            {currentTeil === 3 && (
              <div className="space-y-2.5">
                <span className="text-[11px] text-slate-400 block font-semibold">10 Anzeigen (A–J):</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {exam.teil3.advertisements.map((ad) => (
                    <div key={ad.id} className="p-2.5 rounded-lg bg-slate-850 border border-slate-750 space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="w-5 h-5 rounded bg-orange-600 text-white font-mono flex items-center justify-center text-xs">
                          {ad.letter.toUpperCase()}
                        </span>
                        <span className="text-[11px] text-white truncate max-w-[150px]">{ad.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug line-clamp-3">{ad.body}</p>
                      <div className="text-[9px] text-slate-400 font-mono truncate">{ad.contact}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentTeil === 4 && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-850 rounded-lg border border-slate-750">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Thema:</span>
                  <div className="text-sm font-bold text-white">{exam.teil4.contextTopic}</div>
                </div>
                <div className="space-y-2">
                  {exam.teil4.leserbriefe.map((lb) => (
                    <div
                      key={lb.id}
                      className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                        activeItemIndex === lb.number
                          ? 'bg-slate-800 border-amber-500/80 shadow-md ring-1 ring-amber-500'
                          : 'bg-slate-850 border-slate-750'
                      }`}
                    >
                      <div className="flex justify-between font-bold text-white">
                        <span>{lb.number}. {lb.author} ({lb.age} Jahre, {lb.city})</span>
                      </div>
                      <p className="text-slate-300 italic">„{lb.text}“</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentTeil === 5 && (
              <div className="bg-slate-850 p-4 rounded-xl border border-slate-750 space-y-3">
                <div className="border-b border-slate-700 pb-2">
                  <h4 className="text-sm font-black text-white uppercase">{exam.teil5.sheetTitle}</h4>
                  <p className="text-xs italic text-slate-400">{exam.teil5.contextSituation}</p>
                </div>
                <div className="space-y-3">
                  {exam.teil5.sections.map((sec, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <h5 className="font-bold text-amber-400 text-xs">{sec.title}:</h5>
                      <p className="text-slate-300 leading-relaxed text-xs">{sec.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Interactive Question Card */}
        <div className="p-6 flex flex-col justify-between overflow-y-auto max-h-[560px] bg-slate-900">
          <div className="space-y-6">
            {/* Question Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-orange-600 text-white font-mono font-black flex items-center justify-center text-sm shadow">
                  {activeItemIndex}
                </span>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Aufgabe {activeItemIndex} von 30
                </span>
              </div>

              {/* Bookmark / Flag button */}
              <button
                type="button"
                onClick={() => toggleFlag(activeItemIndex)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  flaggedItems[activeItemIndex]
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
                <span>{flaggedItems[activeItemIndex] ? 'Markiert' : 'Merken'}</span>
              </button>
            </div>

            {/* Question Content & Interactive Inputs */}
            {/* Teil 1 Items (1 to 6: Richtig / Falsch) */}
            {activeItemIndex >= 1 && activeItemIndex <= 6 && (() => {
              const item = exam.teil1.items.find((i) => i.number === activeItemIndex);
              if (!item) return null;
              const selectedAns = userAnswers[activeItemIndex];

              return (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-850 border border-slate-750">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Aussage:</span>
                    <p className="text-sm font-semibold text-white leading-relaxed">{item.statement}</p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-400 block">Wählen Sie Ihre Antwort:</span>
                    {(['Richtig', 'Falsch'] as const).map((opt) => (
                      <label
                        key={opt}
                        onClick={() => handleSelectAnswer(activeItemIndex, opt)}
                        className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                          selectedAns === opt
                            ? 'bg-orange-600/20 border-orange-500 text-white ring-1 ring-orange-500 shadow-md'
                            : 'bg-slate-850 border-slate-750 text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                            selectedAns === opt ? 'border-orange-500 bg-orange-600 text-white' : 'border-slate-500'
                          }`}
                        >
                          {selectedAns === opt && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className="font-bold text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Teil 2 Items (7 to 12: MC a/b/c) */}
            {activeItemIndex >= 7 && activeItemIndex <= 12 && (() => {
              const allT2 = [...exam.teil2.textA.items, ...exam.teil2.textB.items];
              const item = allT2.find((i) => i.number === activeItemIndex);
              if (!item) return null;
              const selectedAns = userAnswers[activeItemIndex];

              return (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-850 border border-slate-750">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Frage:</span>
                    <p className="text-sm font-semibold text-white leading-relaxed">{item.question}</p>
                  </div>

                  <div className="space-y-2 pt-2">
                    {(['a', 'b', 'c'] as const).map((opt) => (
                      <label
                        key={opt}
                        onClick={() => handleSelectAnswer(activeItemIndex, opt)}
                        className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                          selectedAns === opt
                            ? 'bg-orange-600/20 border-orange-500 text-white ring-1 ring-orange-500 shadow-md'
                            : 'bg-slate-850 border-slate-750 text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg font-mono font-bold flex items-center justify-center text-xs uppercase flex-shrink-0 ${
                            selectedAns === opt ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {opt}
                        </span>
                        <span className="text-xs leading-relaxed pt-0.5">{item.options[opt]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Teil 3 Items (13 to 19: Zuordnung A–J or 0) */}
            {activeItemIndex >= 13 && activeItemIndex <= 19 && (() => {
              const item = exam.teil3.situations.find((s) => s.number === activeItemIndex);
              if (!item) return null;
              const selectedAns = userAnswers[activeItemIndex];

              return (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-850 border border-slate-750">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Person / Anliegen:</span>
                    <p className="text-sm font-semibold text-white leading-relaxed">{item.situation}</p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-400 block">
                      Wählen Sie die passende Anzeige (A–J) oder "0" (Keine):
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', '0'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSelectAnswer(activeItemIndex, opt)}
                          className={`py-2 px-3 rounded-lg border font-mono font-bold text-sm cursor-pointer transition-all ${
                            selectedAns?.toLowerCase() === opt.toLowerCase()
                              ? 'bg-orange-600 border-orange-500 text-white shadow'
                              : 'bg-slate-850 border-slate-750 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {opt.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Teil 4 Items (20 to 26: Ja / Nein) */}
            {activeItemIndex >= 20 && activeItemIndex <= 26 && (() => {
              const item = exam.teil4.leserbriefe.find((lb) => lb.number === activeItemIndex);
              if (!item) return null;
              const selectedAns = userAnswers[activeItemIndex];

              return (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      {item.author} ({item.age} Jahre, {item.city}):
                    </span>
                    <p className="text-sm font-semibold text-white italic">„{item.text}“</p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-400 block">
                      {exam.teil4.questionFraming || 'Befürwortet die Person das Vorhaben?'}
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {(['Ja', 'Nein'] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSelectAnswer(activeItemIndex, opt)}
                          className={`py-3 px-4 rounded-xl border font-bold text-sm cursor-pointer transition-all ${
                            selectedAns === opt
                              ? opt === 'Ja'
                                ? 'bg-emerald-600 border-emerald-500 text-white shadow'
                                : 'bg-rose-600 border-rose-500 text-white shadow'
                              : 'bg-slate-850 border-slate-750 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Teil 5 Items (27 to 30: MC a/b/c) */}
            {activeItemIndex >= 27 && activeItemIndex <= 30 && (() => {
              const item = exam.teil5.items.find((i) => i.number === activeItemIndex);
              if (!item) return null;
              const selectedAns = userAnswers[activeItemIndex];

              return (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-850 border border-slate-750">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Frage:</span>
                    <p className="text-sm font-semibold text-white leading-relaxed">{item.question}</p>
                  </div>

                  <div className="space-y-2 pt-2">
                    {(['a', 'b', 'c'] as const).map((opt) => (
                      <label
                        key={opt}
                        onClick={() => handleSelectAnswer(activeItemIndex, opt)}
                        className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                          selectedAns === opt
                            ? 'bg-orange-600/20 border-orange-500 text-white ring-1 ring-orange-500 shadow-md'
                            : 'bg-slate-850 border-slate-750 text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg font-mono font-bold flex items-center justify-center text-xs uppercase flex-shrink-0 ${
                            selectedAns === opt ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {opt}
                        </span>
                        <span className="text-xs leading-relaxed pt-0.5">{item.options[opt]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Prev / Next Buttons */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between mt-6">
            <button
              disabled={activeItemIndex <= 1}
              onClick={() => setActiveItemIndex((i) => Math.max(1, i - 1))}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Zurück</span>
            </button>

            <span className="text-xs text-slate-400 font-mono">
              Beantwortet: <strong className="text-emerald-400">{answeredCount}</strong> / 30
            </span>

            <button
              disabled={activeItemIndex >= 30}
              onClick={() => setActiveItemIndex((i) => Math.min(30, i + 1))}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-30 cursor-pointer shadow"
            >
              <span>Weiter</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Bottom 30-Item CBT Navigation Dock */}
      <div className="bg-slate-900 border-t border-slate-800 p-4 space-y-2 select-none">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <div className="flex items-center gap-4">
            <span className="font-bold text-white uppercase text-[11px]">Fragenübersicht:</span>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-orange-600 inline-block" />
                <span>Aktuell</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
                <span>Beantwortet</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
                <span>Markiert</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded border border-slate-600 inline-block" />
                <span>Offen</span>
              </span>
            </div>
          </div>
        </div>

        {/* 30 item grid */}
        <div className="flex flex-wrap items-center gap-1.5">
          {Array.from({ length: 30 }).map((_, idx) => {
            const num = idx + 1;
            const isCurrent = activeItemIndex === num;
            const isAnswered = !!userAnswers[num];
            const isFlagged = !!flaggedItems[num];

            return (
              <button
                key={num}
                type="button"
                onClick={() => setActiveItemIndex(num)}
                className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center transition-all cursor-pointer relative ${
                  isCurrent
                    ? 'bg-orange-600 text-white ring-2 ring-orange-400 shadow-lg scale-105 z-10'
                    : isFlagged
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : isAnswered
                    ? 'bg-emerald-700/80 text-white border border-emerald-500'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                {num}
                {isFlagged && !isCurrent && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
