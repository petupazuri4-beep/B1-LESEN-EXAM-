import React, { useState, useEffect } from 'react';
import { ExamModel } from '../../types/exam';
import { Language } from '../../utils/i18n';
import {
  Maximize2,
  Minimize2,
  BookOpen,
  Play,
  Pause,
} from 'lucide-react';

interface Props {
  exam: ExamModel;
  lang?: Language;
}

export const AccessibleReaderPreview: React.FC<Props> = ({ exam, lang = 'de' }) => {
  const [activeTeil, setActiveTeil] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [fontSize, setFontSize] = useState<number>(18);
  const [lineHeight] = useState<'normal' | 'relaxed' | 'double'>('relaxed');
  const [colorMode, setColorMode] = useState<'sepia' | 'white' | 'dark' | 'yellow-black'>('sepia');
  const [fontFamily] = useState<'sans' | 'dyslexic' | 'serif'>('sans');
  const [readingRulerEnabled, setReadingRulerEnabled] = useState<boolean>(true);
  const [rulerTop, setRulerTop] = useState<number>(150);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  const isEn = lang === 'en';

  // Audio TTS State
  const [isPlayingTts, setIsPlayingTts] = useState<boolean>(false);
  const [speechRate] = useState<number>(0.9);

  // Handle Reading Ruler following mouse
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!readingRulerEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    setRulerTop(relativeY);
  };

  // TTS Speech Synthesis
  const handleToggleTts = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingTts) {
      window.speechSynthesis.cancel();
      setIsPlayingTts(false);
      return;
    }

    let textToRead = '';
    if (activeTeil === 1) {
      textToRead = `${exam.teil1.emailGreeting}. ${exam.teil1.emailBody}. ${exam.teil1.emailSignoff}`;
    } else if (activeTeil === 2) {
      textToRead = `${exam.teil2.textA.title}. ${exam.teil2.textA.bodyParagraphs.join(' ')}. ${exam.teil2.textB.title}. ${exam.teil2.textB.bodyParagraphs.join(' ')}`;
    } else if (activeTeil === 3) {
      textToRead = exam.teil3.advertisements.map((a) => `Anzeige ${a.letter}: ${a.title}. ${a.body}`).join('. ');
    } else if (activeTeil === 4) {
      textToRead = `Thema: ${exam.teil4.questionFraming}. ${exam.teil4.leserbriefe.map((i) => `${i.author} aus ${i.city} meint: ${i.text}`).join('. ')}`;
    } else {
      textToRead = `${exam.teil5.sheetTitle}. ${exam.teil5.sections.map((s) => `${s.title}: ${s.content}`).join('. ')}`;
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'de-DE';
    utterance.rate = speechRate;
    utterance.onend = () => setIsPlayingTts(false);
    utterance.onerror = () => setIsPlayingTts(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingTts(true);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeTeil]);

  // Color scheme classes
  const colorTheme = {
    sepia: {
      bg: 'bg-[#fbf0d9] text-[#2b2519] border-[#e2d4b7]',
      card: 'bg-[#f5e5c4] border-[#dfceaa] text-[#241f14]',
      border: 'border-[#dfceaa]',
      accent: 'text-[#8b4513]',
    },
    white: {
      bg: 'bg-white text-neutral-900 border-neutral-300',
      card: 'bg-neutral-50 border-neutral-200 text-neutral-900',
      border: 'border-neutral-300',
      accent: 'text-indigo-600',
    },
    dark: {
      bg: 'bg-slate-900 text-slate-100 border-slate-700',
      card: 'bg-slate-800 border-slate-700 text-slate-100',
      border: 'border-slate-700',
      accent: 'text-amber-400',
    },
    'yellow-black': {
      bg: 'bg-black text-yellow-300 border-yellow-500',
      card: 'bg-neutral-950 border-yellow-600 text-yellow-300',
      border: 'border-yellow-500',
      accent: 'text-yellow-400',
    },
  }[colorMode];

  const fontClass = {
    sans: 'font-sans',
    serif: 'font-serif',
    dyslexic: 'font-mono tracking-wide',
  }[fontFamily];

  const leadingClass = {
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    double: 'leading-[2.2]',
  }[lineHeight];

  return (
    <div className={`w-full max-w-5xl mx-auto rounded-2xl border shadow-2xl p-6 sm:p-8 transition-colors ${colorTheme.bg} ${fontClass}`}>
      {/* ACCESSIBILITY TOOLBAR */}
      {!isFocusMode && (
        <div className={`border-b pb-5 mb-6 space-y-4 ${colorTheme.border}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
                <BookOpen className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-extrabold text-base flex items-center gap-2">
                  {isEn ? 'Accessible Large Print & Reading Focus' : 'Barrierefreier Großdruck & Lesefokus'}
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                    Alternative 4
                  </span>
                </h3>
                <p className="text-xs opacity-75">
                  {isEn
                    ? 'Designed for maximum legibility, exam preparation and accessibility needs.'
                    : 'Für maximale Lesbarkeit, Prüfungsvorbereitung und Teilnehmende mit erhöhtem Lesekomfortbedarf.'}
                </p>
              </div>
            </div>

            {/* Focus Mode & Audio TTS */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleTts}
                className="px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all shadow-sm cursor-pointer bg-amber-500 text-slate-950 hover:bg-amber-400"
              >
                {isPlayingTts ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlayingTts ? (isEn ? 'Stop Audio' : 'Audio stoppen') : (isEn ? 'Listen to German Text (TTS)' : 'Deutschen Text vorlesen (TTS)')}</span>
              </button>

              <button
                onClick={() => setIsFocusMode(true)}
                title={isEn ? 'Activate Focus Mode' : 'Fokus-Modus aktivieren'}
                className="p-2 rounded-xl border opacity-80 hover:opacity-100 cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Customization Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs pt-2">
            {/* Color Palette */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold opacity-75 text-[11px]">{isEn ? 'Color Contrast:' : 'Farbkontrast:'}</span>
              <button
                onClick={() => setColorMode('sepia')}
                className={`px-2.5 py-1 rounded-lg border font-semibold cursor-pointer ${
                  colorMode === 'sepia' ? 'ring-2 ring-amber-600 font-bold' : 'opacity-70'
                } bg-[#fbf0d9] text-[#2b2519] border-[#dfceaa]`}
              >
                {isEn ? 'Parchment' : 'Pergament'}
              </button>
              <button
                onClick={() => setColorMode('white')}
                className={`px-2.5 py-1 rounded-lg border font-semibold cursor-pointer ${
                  colorMode === 'white' ? 'ring-2 ring-indigo-600 font-bold' : 'opacity-70'
                } bg-white text-neutral-900 border-neutral-300`}
              >
                {isEn ? 'Pure White' : 'Klarweiß'}
              </button>
              <button
                onClick={() => setColorMode('dark')}
                className={`px-2.5 py-1 rounded-lg border font-semibold cursor-pointer ${
                  colorMode === 'dark' ? 'ring-2 ring-amber-400 font-bold' : 'opacity-70'
                } bg-slate-900 text-white border-slate-700`}
              >
                {isEn ? 'Dark Slate' : 'Dunkel'}
              </button>
              <button
                onClick={() => setColorMode('yellow-black')}
                className={`px-2.5 py-1 rounded-lg border font-semibold cursor-pointer ${
                  colorMode === 'yellow-black' ? 'ring-2 ring-yellow-400 font-bold' : 'opacity-70'
                } bg-black text-yellow-300 border-yellow-500`}
              >
                {isEn ? 'Yellow/Black' : 'Gelb / Schwarz'}
              </button>
            </div>

            {/* Font Size & Line Height */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="font-bold opacity-75 text-[11px]">{isEn ? 'Font Size:' : 'Schriftgröße:'}</span>
                {[14, 16, 18, 20, 22].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={`px-2 py-0.5 rounded text-xs font-mono font-bold border cursor-pointer ${
                      fontSize === sz ? 'bg-amber-500 text-slate-950 font-black' : 'opacity-70'
                    }`}
                  >
                    {sz}pt
                  </button>
                ))}
              </div>

              {/* Reading Ruler Toggle */}
              <button
                onClick={() => setReadingRulerEnabled(!readingRulerEnabled)}
                className={`px-2.5 py-1 rounded-lg border font-semibold cursor-pointer transition-colors ${
                  readingRulerEnabled
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/50'
                    : 'opacity-70'
                }`}
              >
                {isEn ? `Reading Ruler: ${readingRulerEnabled ? 'ON' : 'OFF'}` : `Lese-Lineal ${readingRulerEnabled ? 'an' : 'aus'}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Focus Mode Exit Bar */}
      {isFocusMode && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-current opacity-80 text-xs">
          <span>{isEn ? 'Focus Mode Active • Distraction-free reading' : 'Fokus-Modus aktiv • Ablenkungsfreies Lesen'}</span>
          <button
            onClick={() => setIsFocusMode(false)}
            className="px-2.5 py-1 rounded border flex items-center gap-1 cursor-pointer font-bold"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>{isEn ? 'Exit Focus' : 'Fokus beenden'}</span>
          </button>
        </div>
      )}

      {/* Teil Navigation Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {([1, 2, 3, 4, 5] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTeil(t)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTeil === t
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'opacity-70 hover:opacity-100 border border-current'
            }`}
          >
            {isEn ? `Part ${t}` : `Teil ${t}`}
          </button>
        ))}
      </div>

      {/* READING STIMULUS CONTAINER (WITH READING RULER INTERACTION) */}
      <div
        onMouseMove={handleMouseMove}
        className={`relative rounded-xl p-6 sm:p-8 border shadow-inner ${colorTheme.card} ${leadingClass}`}
        style={{ fontSize: `${fontSize}px` }}
      >
        {/* Dynamic Reading Ruler Guideline */}
        {readingRulerEnabled && (
          <div
            className="absolute left-0 right-0 pointer-events-none transition-all duration-75 border-y-2 border-amber-400/60 bg-amber-400/10 z-10"
            style={{
              top: `${Math.max(20, rulerTop - 25)}px`,
              height: '52px',
            }}
          />
        )}

        {/* TEIL 1 */}
        {activeTeil === 1 && (
          <article className="space-y-4">
            <div className="font-extrabold text-sm opacity-75 uppercase tracking-wider">
              {isEn ? 'Part 1: Email / Blog Stimulus' : 'Teil 1: E-Mail / Blogbeitrag'}
            </div>
            <div className="font-bold border-b pb-2">{exam.teil1.emailGreeting}</div>
            <div className="space-y-4">
              {exam.teil1.emailBody.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-justify indent-4">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="font-bold pt-4">{exam.teil1.emailSignoff}</div>
          </article>
        )}

        {/* TEIL 2 */}
        {activeTeil === 2 && (
          <article className="space-y-8">
            {/* Text A */}
            <div className="space-y-3 pb-6 border-b border-current">
              <span className="font-mono font-bold text-xs uppercase px-2 py-0.5 rounded bg-black/10 dark:bg-white/10">
                Text A
              </span>
              <h3 className="font-black text-xl">{exam.teil2.textA.title}</h3>
              {exam.teil2.textA.kicker && (
                <p className="font-semibold text-sm italic opacity-80">{exam.teil2.textA.kicker}</p>
              )}
              <div className="space-y-3 pt-2">
                {exam.teil2.textA.bodyParagraphs.map((p, i) => (
                  <p key={i} className="text-justify indent-4">
                    {p}
                  </p>
                ))}
              </div>
              <div className="text-xs opacity-70 italic text-right">
                {isEn ? 'Source:' : 'Quelle:'} {exam.teil2.textA.source}
              </div>
            </div>

            {/* Text B */}
            <div className="space-y-3">
              <span className="font-mono font-bold text-xs uppercase px-2 py-0.5 rounded bg-black/10 dark:bg-white/10">
                Text B
              </span>
              <h3 className="font-black text-xl">{exam.teil2.textB.title}</h3>
              {exam.teil2.textB.kicker && (
                <p className="font-semibold text-sm italic opacity-80">{exam.teil2.textB.kicker}</p>
              )}
              <div className="space-y-3 pt-2">
                {exam.teil2.textB.bodyParagraphs.map((p, i) => (
                  <p key={i} className="text-justify indent-4">
                    {p}
                  </p>
                ))}
              </div>
              <div className="text-xs opacity-70 italic text-right">
                {isEn ? 'Source:' : 'Quelle:'} {exam.teil2.textB.source}
              </div>
            </div>
          </article>
        )}

        {/* TEIL 3 */}
        {activeTeil === 3 && (
          <article className="space-y-6">
            <div className="font-extrabold text-sm opacity-75 uppercase tracking-wider">
              {isEn ? 'Part 3: 10 Classified Advertisements (a to j)' : 'Teil 3: 10 Anzeigen (a bis j)'}
            </div>
            <div className="space-y-4">
              {exam.teil3.advertisements.map((ad) => (
                <div key={ad.id || ad.letter} className="p-4 rounded-xl border border-current space-y-2">
                  <div className="flex items-center gap-3 font-black text-base border-b border-current pb-1.5">
                    <span className="w-8 h-8 rounded-full border border-current flex items-center justify-center font-mono uppercase">
                      {ad.letter}
                    </span>
                    <span>{ad.title}</span>
                  </div>
                  <p className="text-justify">{ad.body}</p>
                  <div className="font-mono text-xs opacity-75 pt-1">{ad.contact}</div>
                </div>
              ))}
            </div>
          </article>
        )}

        {/* TEIL 4 */}
        {activeTeil === 4 && (
          <article className="space-y-6">
            <div className="p-4 rounded-xl border border-current space-y-1">
              <div className="text-xs uppercase font-extrabold tracking-wider opacity-75">
                {isEn ? 'Discussion Topic' : 'Diskussionsthema'}
              </div>
              <h3 className="font-black text-lg">„{exam.teil4.questionFraming}“</h3>
            </div>
            <div className="space-y-4">
              {exam.teil4.leserbriefe.map((lb) => (
                <div key={lb.id} className="p-4 rounded-xl border border-current space-y-2">
                  <div className="font-bold text-sm flex items-center justify-between border-b border-current pb-1">
                    <span>
                      {lb.author} ({lb.age}), {lb.city}
                    </span>
                    <span className="font-mono text-xs opacity-75">
                      {isEn ? `Item ${lb.number}` : `Aufgabe ${lb.number}`}
                    </span>
                  </div>
                  <p className="italic text-justify">„{lb.text}“</p>
                </div>
              ))}
            </div>
          </article>
        )}

        {/* TEIL 5 */}
        {activeTeil === 5 && (
          <article className="space-y-6">
            <div className="border-b-2 border-current pb-2">
              <h3 className="font-black text-xl uppercase">{exam.teil5.sheetTitle}</h3>
              {exam.teil5.sheetSubtitle && (
                <p className="font-semibold text-sm italic opacity-80">{exam.teil5.sheetSubtitle}</p>
              )}
            </div>
            <div className="space-y-5">
              {exam.teil5.sections.map((sec, i) => (
                <div key={i} className="space-y-1.5">
                  <h4 className="font-bold text-base border-l-4 border-amber-500 pl-3">{sec.title}</h4>
                  <p className="text-justify indent-3">{sec.content}</p>
                </div>
              ))}
            </div>
          </article>
        )}
      </div>
    </div>
  );
};
