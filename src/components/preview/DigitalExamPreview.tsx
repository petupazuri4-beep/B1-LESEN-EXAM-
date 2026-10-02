import React, { useState, useEffect } from 'react';
import { ExamModel } from '../../types/exam';
import { Language } from '../../utils/i18n';
import {
  Monitor,
  Clock,
  Flag,
  ZoomIn,
  ZoomOut,
  Highlighter,
  Sun,
  Moon,
  Contrast,
} from 'lucide-react';

interface Props {
  exam: ExamModel;
  lang?: Language;
}

export const DigitalExamPreview: React.FC<Props> = ({ exam, lang = 'de' }) => {
  const [activeTeil, setActiveTeil] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [flaggedItems, setFlaggedItems] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number>(65 * 60); // 65 minutes
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0);
  const [digitalTheme, setDigitalTheme] = useState<'light' | 'dark' | 'high-contrast'>('light');
  const [highlighterActive, setHighlighterActive] = useState<boolean>(false);

  const isEn = lang === 'en';

  // Timer countdown
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(userAnswers).length;

  const handleSelectAnswer = (itemNumber: number, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [itemNumber]: answer,
    }));
  };

  const toggleFlag = (itemNumber: number) => {
    setFlaggedItems((prev) => ({
      ...prev,
      [itemNumber]: !prev[itemNumber],
    }));
  };

  const getItemTeil = (itemNum: number): 1 | 2 | 3 | 4 | 5 => {
    if (itemNum <= 6) return 1;
    if (itemNum <= 12) return 2;
    if (itemNum <= 19) return 3;
    if (itemNum <= 26) return 4;
    return 5;
  };

  // Theme styles for Digital Terminal
  const themeClasses = {
    light: 'bg-slate-100 text-slate-900 border-slate-300',
    dark: 'bg-slate-950 text-slate-100 border-slate-800',
    'high-contrast': 'bg-black text-yellow-300 border-yellow-500',
  }[digitalTheme];

  const contentBgClass = {
    light: 'bg-white text-slate-900 border-slate-200 shadow-sm',
    dark: 'bg-slate-900 text-slate-100 border-slate-800 shadow-sm',
    'high-contrast': 'bg-black text-yellow-300 border-yellow-500',
  }[digitalTheme];

  return (
    <div className={`w-full max-w-6xl mx-auto rounded-xl border shadow-2xl overflow-hidden transition-colors ${themeClasses}`}>
      {/* DIGITAL EXAM TERMINAL TOP BAR */}
      <header className="px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 bg-slate-900 text-white">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-sky-500/20 text-sky-400 rounded-lg border border-sky-500/30">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-wide">
                GOETHE-ZERTIFIKAT B1 DIGITAL
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-sky-950 text-sky-300 border border-sky-700 rounded-full font-bold">
                Alternative 3
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              {isEn ? 'Candidate Terminal' : 'Kandidaten-Terminal'} • {isEn ? `Set #${String(exam.examNumber).padStart(2, '0')}` : `Satz #${String(exam.examNumber).padStart(2, '0')}`} • {isEn ? 'Module READING (65 Min.)' : 'Modul LESEN (65 Min.)'}
            </div>
          </div>
        </div>

        {/* Center: Live Exam Timer */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <Clock className={`w-4 h-4 ${timeLeft < 600 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">
              {isEn ? 'Time Remaining' : 'Verbleibende Zeit'}
            </div>
            <div className={`font-mono text-base font-black ${timeLeft < 600 ? 'text-rose-400' : 'text-white'}`}>
              {formatTimer(timeLeft)}
            </div>
          </div>
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            title={isTimerRunning ? (isEn ? 'Pause Timer' : 'Timer anhalten') : (isEn ? 'Resume Timer' : 'Timer fortsetzen')}
            className="text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 ml-1 cursor-pointer"
          >
            {isTimerRunning ? (isEn ? 'Pause' : 'Pause') : (isEn ? 'Resume' : 'Start')}
          </button>
        </div>

        {/* Right Tools: Font Resize, Themes, Highlighter */}
        <div className="flex items-center gap-2">
          {/* Text Size */}
          <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 p-0.5">
            <button
              onClick={() => setFontSizeOffset((prev) => Math.max(-2, prev - 1))}
              title={isEn ? 'Decrease Font' : 'Schrift verkleinern'}
              className="p-1 text-slate-300 hover:text-white cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1.5 text-slate-300">
              {fontSizeOffset === 0 ? '100%' : `${100 + fontSizeOffset * 10}%`}
            </span>
            <button
              onClick={() => setFontSizeOffset((prev) => Math.min(4, prev + 1))}
              title={isEn ? 'Increase Font' : 'Schrift vergrößern'}
              className="p-1 text-slate-300 hover:text-white cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Highlighter Toggle */}
          <button
            onClick={() => setHighlighterActive(!highlighterActive)}
            title={isEn ? 'Text Highlighter Tool' : 'Textmarker Werkzeug'}
            className={`px-2.5 py-1 text-xs rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
              highlighterActive
                ? 'bg-yellow-400 text-slate-950 font-bold border-yellow-300 shadow'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Highlighter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isEn ? 'Highlighter' : 'Textmarker'}</span>
          </button>

          {/* Theme Selector */}
          <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 p-0.5">
            <button
              onClick={() => setDigitalTheme('light')}
              title={isEn ? 'Standard Light' : 'Standard Hell'}
              className={`p-1.5 rounded cursor-pointer ${digitalTheme === 'light' ? 'bg-slate-700 text-amber-400' : 'text-slate-400'}`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDigitalTheme('dark')}
              title={isEn ? 'Dark Mode' : 'Dunkelmodus'}
              className={`p-1.5 rounded cursor-pointer ${digitalTheme === 'dark' ? 'bg-slate-700 text-sky-400' : 'text-slate-400'}`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDigitalTheme('high-contrast')}
              title={isEn ? 'High Contrast (Yellow on Black)' : 'Hoher Kontrast (Gelb auf Schwarz)'}
              className={`p-1.5 rounded cursor-pointer ${digitalTheme === 'high-contrast' ? 'bg-yellow-500 text-black' : 'text-slate-400'}`}
            >
              <Contrast className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* TEIL SELECTOR HEADER */}
      <div className="px-5 py-2.5 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center gap-1">
          {([1, 2, 3, 4, 5] as const).map((teilNum) => {
            const teilCount = teilNum === 1 ? 6 : teilNum === 2 ? 6 : teilNum === 3 ? 7 : teilNum === 4 ? 7 : 4;
            const startNum = teilNum === 1 ? 1 : teilNum === 2 ? 7 : teilNum === 3 ? 13 : teilNum === 4 ? 20 : 27;
            const endNum = startNum + teilCount - 1;
            const teilAnswered = Array.from({ length: teilCount }, (_, i) => startNum + i).filter(
              (n) => userAnswers[n] !== undefined
            ).length;

            return (
              <button
                key={teilNum}
                onClick={() => setActiveTeil(teilNum)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTeil === teilNum
                    ? 'bg-sky-600 text-white shadow'
                    : 'text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                <span>{isEn ? `Part ${teilNum}` : `Teil ${teilNum}`}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    activeTeil === teilNum ? 'bg-sky-800 text-sky-100' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {teilAnswered}/{teilCount}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
          <span>{isEn ? 'Overall Progress:' : 'Gesamtfortschritt:'}</span>
          <span className="font-mono text-amber-400 font-bold">{answeredCount} / 30 {isEn ? 'solved' : 'gelöst'}</span>
          <span className="text-[10px] text-slate-400">({isEn ? 'Pass mark: 18' : 'Bestehensgrenze: 18'})</span>
        </div>
      </div>

      {/* MAIN TWO-PANE EXAM DISPLAY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
        {/* LEFT PANE: READING STIMULUS (6 cols) */}
        <div
          className={`lg:col-span-6 p-6 overflow-y-auto max-h-[620px] border-b lg:border-b-0 lg:border-r border-slate-300/40 ${
            fontSizeOffset === -2 ? 'text-xs' : fontSizeOffset === -1 ? 'text-[13px]' : fontSizeOffset === 1 ? 'text-base' : fontSizeOffset >= 2 ? 'text-lg' : 'text-sm'
          } ${highlighterActive ? 'cursor-text select-text selection:bg-yellow-300 selection:text-black' : ''}`}
        >
          {activeTeil === 1 && (
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {isEn ? 'Exam Instructions:' : 'Arbeitsanweisung:'}
              </div>
              <p className="italic text-xs text-slate-600 dark:text-slate-300">
                {exam.teil1.instruction}
              </p>
              <div className={`p-5 rounded-lg border ${contentBgClass} space-y-3`}>
                <div className="font-bold">{exam.teil1.emailGreeting}</div>
                {exam.teil1.emailBody.split('\n\n').map((para, i) => (
                  <p key={i} className="leading-relaxed text-justify">
                    {para}
                  </p>
                ))}
                <div className="font-semibold pt-2">{exam.teil1.emailSignoff}</div>
              </div>
            </div>
          )}

          {activeTeil === 2 && (
            <div className="space-y-5">
              <p className="italic text-xs text-slate-600 dark:text-slate-300">
                {exam.teil2.instruction}
              </p>
              {/* Text A */}
              <div className={`p-4 rounded-lg border ${contentBgClass} space-y-2`}>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-600 dark:text-sky-400">
                  Text A
                </span>
                <h4 className="font-black text-base">{exam.teil2.textA.title}</h4>
                {exam.teil2.textA.kicker && (
                  <div className="text-xs italic text-slate-500">{exam.teil2.textA.kicker}</div>
                )}
                {exam.teil2.textA.bodyParagraphs.map((p, i) => (
                  <p key={i} className="text-xs leading-relaxed text-justify">
                    {p}
                  </p>
                ))}
              </div>
              {/* Text B */}
              <div className={`p-4 rounded-lg border ${contentBgClass} space-y-2`}>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-600 dark:text-sky-400">
                  Text B
                </span>
                <h4 className="font-black text-base">{exam.teil2.textB.title}</h4>
                {exam.teil2.textB.kicker && (
                  <div className="text-xs italic text-slate-500">{exam.teil2.textB.kicker}</div>
                )}
                {exam.teil2.textB.bodyParagraphs.map((p, i) => (
                  <p key={i} className="text-xs leading-relaxed text-justify">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          )}

          {activeTeil === 3 && (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {isEn ? '10 Classified Ads (a to j):' : '10 Kleinanzeigen (a bis j):'}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {exam.teil3.advertisements.map((ad) => (
                  <div key={ad.id || ad.letter} className={`p-3 rounded-lg border ${contentBgClass} space-y-1`}>
                    <div className="flex items-center justify-between border-b pb-1">
                      <span className="font-black font-mono text-sm uppercase px-1.5 py-0.5 bg-sky-500/20 rounded">
                        {ad.letter}
                      </span>
                      <span className="font-bold text-xs truncate max-w-[150px]">{ad.title}</span>
                    </div>
                    <p className="text-[11px] leading-snug">{ad.body}</p>
                    <div className="text-[10px] text-slate-400 font-mono pt-1">{ad.contact}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTeil === 4 && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="text-[10px] uppercase font-bold text-amber-500">
                  {isEn ? 'Discussion Topic' : 'Thema der Sendung'}
                </div>
                <div className="font-bold text-xs">„{exam.teil4.questionFraming}“</div>
              </div>
              <div className="space-y-2.5">
                {exam.teil4.leserbriefe.map((lb) => (
                  <div key={lb.id} className={`p-3 rounded-lg border ${contentBgClass} space-y-1`}>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                      <span>{lb.author} ({lb.age}), {lb.city}</span>
                      <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {isEn ? `No. ${lb.number}` : `Nr. ${lb.number}`}
                      </span>
                    </div>
                    <p className="text-xs italic leading-relaxed">„{lb.text}“</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTeil === 5 && (
            <div className="space-y-3">
              <div className="border-b pb-2">
                <h4 className="font-black text-sm uppercase">{exam.teil5.sheetTitle}</h4>
                {exam.teil5.sheetSubtitle && (
                  <div className="text-xs italic text-slate-500">{exam.teil5.sheetSubtitle}</div>
                )}
              </div>
              {exam.teil5.sections.map((sec, i) => (
                <div key={i} className={`p-3.5 rounded-lg border ${contentBgClass} space-y-1`}>
                  <h5 className="font-bold text-xs text-sky-600 dark:text-sky-400">{sec.title}</h5>
                  <p className="text-xs leading-relaxed text-justify">{sec.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT PANE: DIGITAL QUESTION CARDS (6 cols) */}
        <div className="lg:col-span-6 p-6 overflow-y-auto max-h-[620px] space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="font-black text-xs uppercase tracking-wider">
              {isEn ? `Questions for Part ${activeTeil}` : `Aufgaben für Teil ${activeTeil}`}
            </h4>
            <span className="text-[10px] text-slate-400">
              {isEn ? 'Click to select the desired option' : 'Klicken Sie zur Auswahl auf die gewünschte Option'}
            </span>
          </div>

          {/* TEIL 1 ITEMS */}
          {activeTeil === 1 &&
            exam.teil1.items.map((item) => {
              const selected = userAnswers[item.number];
              const isFlagged = flaggedItems[item.number];
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    selected ? 'border-sky-500/80 ring-1 ring-sky-500/20' : 'border-slate-300/60 dark:border-slate-800'
                  } ${contentBgClass}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 font-mono text-xs font-black flex items-center justify-center">
                      {item.number}
                    </span>
                    <p className="flex-1 text-xs font-semibold leading-relaxed">{item.statement}</p>
                    <button
                      onClick={() => toggleFlag(item.number)}
                      title={isEn ? 'Flag question for review' : 'Zur Überprüfung markieren'}
                      className={`p-1.5 rounded cursor-pointer transition-colors ${
                        isFlagged ? 'text-amber-500 bg-amber-500/20' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pl-9">
                    {(['Richtig', 'Falsch'] as const).map((choice) => (
                      <button
                        key={choice}
                        onClick={() => handleSelectAnswer(item.number, choice)}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer text-center ${
                          selected === choice
                            ? 'bg-sky-600 text-white border-sky-600 shadow'
                            : 'border-slate-300 dark:border-slate-700 hover:border-sky-400'
                        }`}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

          {/* TEIL 2 ITEMS */}
          {activeTeil === 2 && (
            <div className="space-y-4">
              <div className="text-[11px] font-bold uppercase text-slate-500">
                {isEn ? 'Text A (Questions 7–9)' : 'Text A (Aufgaben 7–9)'}
              </div>
              {exam.teil2.textA.items.map((item) => {
                const selected = userAnswers[item.number];
                const isFlagged = flaggedItems[item.number];
                return (
                  <div key={item.id} className={`p-4 rounded-xl border ${contentBgClass}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 font-mono text-xs font-black flex items-center justify-center">
                        {item.number}
                      </span>
                      <p className="flex-1 text-xs font-bold leading-relaxed">{item.question}</p>
                      <button
                        onClick={() => toggleFlag(item.number)}
                        className={`p-1 rounded cursor-pointer ${isFlagged ? 'text-amber-500 bg-amber-500/20' : 'text-slate-400'}`}
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="space-y-1.5 pl-8">
                      {(['a', 'b', 'c'] as const).map((key) => (
                        <button
                          key={key}
                          onClick={() => handleSelectAnswer(item.number, key)}
                          className={`w-full text-left p-2 rounded-lg text-xs border flex items-center gap-2 cursor-pointer transition-all ${
                            selected === key
                              ? 'bg-sky-600 text-white border-sky-600 font-bold'
                              : 'border-slate-300 dark:border-slate-700 hover:border-sky-400'
                          }`}
                        >
                          <span className="font-mono font-bold">{key})</span>
                          <span>{item.options[key]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

              <div className="text-[11px] font-bold uppercase text-slate-500 pt-2 border-t">
                {isEn ? 'Text B (Questions 10–12)' : 'Text B (Aufgaben 10–12)'}
              </div>
              {exam.teil2.textB.items.map((item) => {
                const selected = userAnswers[item.number];
                const isFlagged = flaggedItems[item.number];
                return (
                  <div key={item.id} className={`p-4 rounded-xl border ${contentBgClass}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 font-mono text-xs font-black flex items-center justify-center">
                        {item.number}
                      </span>
                      <p className="flex-1 text-xs font-bold leading-relaxed">{item.question}</p>
                      <button
                        onClick={() => toggleFlag(item.number)}
                        className={`p-1 rounded cursor-pointer ${isFlagged ? 'text-amber-500 bg-amber-500/20' : 'text-slate-400'}`}
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="space-y-1.5 pl-8">
                      {(['a', 'b', 'c'] as const).map((key) => (
                        <button
                          key={key}
                          onClick={() => handleSelectAnswer(item.number, key)}
                          className={`w-full text-left p-2 rounded-lg text-xs border flex items-center gap-2 cursor-pointer transition-all ${
                            selected === key
                              ? 'bg-sky-600 text-white border-sky-600 font-bold'
                              : 'border-slate-300 dark:border-slate-700 hover:border-sky-400'
                          }`}
                        >
                          <span className="font-mono font-bold">{key})</span>
                          <span>{item.options[key]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TEIL 3 ITEMS */}
          {activeTeil === 3 &&
            exam.teil3.situations.map((item) => {
              const selected = userAnswers[item.number];
              const isFlagged = flaggedItems[item.number];
              const options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', '0'];

              return (
                <div key={item.id} className={`p-4 rounded-xl border ${contentBgClass} space-y-2`}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 font-mono text-xs font-black flex items-center justify-center">
                      {item.number}
                    </span>
                    <p className="flex-1 text-xs leading-relaxed font-semibold">{item.situation}</p>
                    <button
                      onClick={() => toggleFlag(item.number)}
                      className={`p-1 rounded cursor-pointer ${isFlagged ? 'text-amber-500 bg-amber-500/20' : 'text-slate-400'}`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="pl-8 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-400 mr-1">{isEn ? 'Matching Ad:' : 'Passende Anzeige:'}</span>
                    {options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelectAnswer(item.number, opt)}
                        className={`w-7 h-7 rounded font-mono text-xs font-bold uppercase border cursor-pointer transition-all ${
                          selected === opt
                            ? opt === '0'
                              ? 'bg-rose-600 text-white border-rose-600 shadow'
                              : 'bg-sky-600 text-white border-sky-600 shadow'
                            : 'border-slate-300 dark:border-slate-700 hover:border-sky-400'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

          {/* TEIL 4 ITEMS */}
          {activeTeil === 4 &&
            exam.teil4.leserbriefe.map((item) => {
              const selected = userAnswers[item.number];
              const isFlagged = flaggedItems[item.number];
              return (
                <div key={item.id} className={`p-4 rounded-xl border ${contentBgClass}`}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 font-mono text-xs font-black flex items-center justify-center">
                        {item.number}
                      </span>
                      <span className="font-bold text-xs">{item.author}</span>
                    </div>
                    <button
                      onClick={() => toggleFlag(item.number)}
                      className={`p-1 rounded cursor-pointer ${isFlagged ? 'text-amber-500 bg-amber-500/20' : 'text-slate-400'}`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pl-8">
                    {(['Ja', 'Nein'] as const).map((choice) => (
                      <button
                        key={choice}
                        onClick={() => handleSelectAnswer(item.number, choice)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer text-center ${
                          selected === choice
                            ? 'bg-sky-600 text-white border-sky-600 shadow'
                            : 'border-slate-300 dark:border-slate-700 hover:border-sky-400'
                        }`}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

          {/* TEIL 5 ITEMS */}
          {activeTeil === 5 &&
            exam.teil5.items.map((item) => {
              const selected = userAnswers[item.number];
              const isFlagged = flaggedItems[item.number];
              return (
                <div key={item.id} className={`p-4 rounded-xl border ${contentBgClass}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 font-mono text-xs font-black flex items-center justify-center">
                      {item.number}
                    </span>
                    <p className="flex-1 text-xs font-bold leading-relaxed">{item.question}</p>
                    <button
                      onClick={() => toggleFlag(item.number)}
                      className={`p-1 rounded cursor-pointer ${isFlagged ? 'text-amber-500 bg-amber-500/20' : 'text-slate-400'}`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1.5 pl-8">
                    {(['a', 'b', 'c'] as const).map((key) => (
                      <button
                        key={key}
                        onClick={() => handleSelectAnswer(item.number, key)}
                        className={`w-full text-left p-2 rounded-lg text-xs border flex items-center gap-2 cursor-pointer transition-all ${
                          selected === key
                            ? 'bg-sky-600 text-white border-sky-600 font-bold'
                            : 'border-slate-300 dark:border-slate-700 hover:border-sky-400'
                        }`}
                      >
                        <span className="font-mono font-bold">{key})</span>
                        <span>{item.options[key]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* BOTTOM QUESTION NAVIGATOR DOCK (1 - 30 JUMP MATRIX) */}
      <footer className="p-4 bg-slate-900 border-t border-slate-800 text-slate-300">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <span>{isEn ? 'Question Navigator:' : 'Aufgaben-Navigator:'}</span>
            <span className="text-[10px] text-slate-400 font-normal">
              {isEn ? '(Click any question number to jump directly to it)' : '(Klicken Sie auf eine Aufgabennummer, um direkt dorthin zu springen)'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500" />
              <span>{isEn ? 'Answered' : 'Beantwortet'} ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500" />
              <span>{isEn ? 'Flagged' : 'Markiert'} ({Object.values(flaggedItems).filter(Boolean).length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-700" />
              <span>{isEn ? 'Unanswered' : 'Offen'} ({30 - answeredCount})</span>
            </div>
          </div>
        </div>

        {/* 1 to 30 Grid */}
        <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-30 gap-1.5 pt-1">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => {
            const isAnswered = userAnswers[num] !== undefined;
            const isFlagged = flaggedItems[num];
            return (
              <button
                key={num}
                onClick={() => {
                  const targetTeil = getItemTeil(num);
                  setActiveTeil(targetTeil);
                }}
                className={`h-7 rounded text-xs font-bold font-mono transition-all relative flex items-center justify-center cursor-pointer ${
                  isFlagged
                    ? 'bg-amber-500 text-slate-950 font-black shadow ring-1 ring-amber-300'
                    : isAnswered
                    ? 'bg-emerald-600 text-white font-black shadow'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {num}
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
};
