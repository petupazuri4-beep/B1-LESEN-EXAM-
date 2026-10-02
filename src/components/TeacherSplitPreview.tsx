import React, { useState } from 'react';
import { ExamModel } from '../types/exam';
import { Language } from '../utils/i18n';
import { LineNumberedText } from '../utils/lineNumbering';
import { GermanTtsPlayer } from './GermanTtsPlayer';
import {
  Columns,
  BookOpen,
  CheckCircle2,
  FileSearch,
  Eye,
  EyeOff,
  Sparkles,
  HelpCircle,
  Hash,
} from 'lucide-react';

interface Props {
  exam: ExamModel;
  lang?: Language;
  darkMode?: boolean;
}

export const TeacherSplitPreview: React.FC<Props> = ({
  exam,
  lang = 'de',
  darkMode = true,
}) => {
  const [activeTeil, setActiveTeil] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [revealSolutions, setRevealSolutions] = useState<boolean>(true);
  const [showEvidence, setShowEvidence] = useState<boolean>(true);

  const { styleConfig } = exam;
  const showLineNumbers = styleConfig.spaceLines?.showLineNumbers ?? true;
  const interval = styleConfig.spaceLines?.lineNumbersInterval || 5;

  return (
    <div className="w-full max-w-6xl mx-auto rounded-2xl border border-slate-700 bg-white text-slate-900 shadow-2xl overflow-hidden font-sans">
      {/* Top Teacher Toolbar */}
      <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
            <Columns className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                {lang === 'en' ? 'Alternative 2: Teacher Split-Screen' : 'Alternative 2: Lehrer-Korrekturansicht'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                Dual-Column Mode
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">
              {exam.title} • {lang === 'en' ? 'Side-by-Side Reading & Evidence Citations' : 'Synoptische Gegenüberstellung von Text & Textbelegen'}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setRevealSolutions(!revealSolutions)}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            {revealSolutions ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{revealSolutions ? 'Lösungen verbergen' : 'Lösungen aufdecken'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowEvidence(!showEvidence)}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <FileSearch className="w-3.5 h-3.5 text-orange-400" />
            <span>{showEvidence ? 'Textbelege ein' : 'Textbelege aus'}</span>
          </button>
        </div>
      </div>

      {/* Teil Tabs Navigation */}
      <div className="bg-slate-100 border-b border-slate-300 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-neutral-500 font-bold uppercase tracking-wider text-[11px] mr-1">
          Prüfungsteil:
        </span>
        {[
          { num: 1, label: 'Teil 1 (E-Mail • 1–6)', points: '6 Pkt.' },
          { num: 2, label: 'Teil 2 (Presse • 7–12)', points: '6 Pkt.' },
          { num: 3, label: 'Teil 3 (Anzeigen • 13–19)', points: '7 Pkt.' },
          { num: 4, label: 'Teil 4 (Leserbriefe • 20–26)', points: '7 Pkt.' },
          { num: 5, label: 'Teil 5 (Hausordnung • 27–30)', points: '4 Pkt.' },
        ].map((t) => (
          <button
            key={t.num}
            onClick={() => setActiveTeil(t.num as any)}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTeil === t.num
                ? 'bg-orange-600 text-white shadow'
                : 'bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300'
            }`}
          >
            <span>{t.label}</span>
            <span className={`text-[10px] px-1 rounded ${activeTeil === t.num ? 'bg-orange-700 text-white' : 'bg-neutral-100 text-neutral-500'}`}>
              {t.points}
            </span>
          </button>
        ))}
      </div>

      {/* Split Dual-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* LEFT COLUMN: Reading Stimulus Passage (7 Cols) */}
        <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-slate-300 bg-neutral-50/60 overflow-y-auto max-h-[720px] space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-300 pb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-orange-600" />
              <h4 className="font-black text-xs uppercase tracking-wider text-neutral-800">
                Lesetext & Stimulus (Originaltext)
              </h4>
            </div>
            {/* Audio Read-Aloud Player */}
            {activeTeil === 1 && <GermanTtsPlayer text={exam.teil1.emailBody} label="Vorlesen" />}
            {activeTeil === 2 && <GermanTtsPlayer text={exam.teil2.textA.bodyParagraphs.join(' ')} label="Text A vorlesen" />}
            {activeTeil === 5 && <GermanTtsPlayer text={exam.teil5.sections.map(s => `${s.title}: ${s.content}`).join(' ')} label="Vorlesen" />}
          </div>

          {/* TEIL 1 STIMULUS */}
          {activeTeil === 1 && (
            <div className="space-y-4">
              <div className="p-3 bg-white rounded-lg border border-neutral-300 shadow-sm text-xs">
                <div className="text-[11px] font-mono text-neutral-500 pb-1 border-b border-neutral-200 flex justify-between">
                  <span>Betreff: {exam.title}</span>
                  <span>E-Mail / Blog</span>
                </div>
                <div className="pt-2 font-bold">{exam.teil1.emailGreeting}</div>
                <LineNumberedText
                  text={exam.teil1.emailBody}
                  showLineNumbers={showLineNumbers}
                  interval={interval}
                  className="mt-2 text-xs text-neutral-800"
                />
                <div className="pt-2 font-bold whitespace-pre-line">{exam.teil1.emailSignoff}</div>
              </div>
            </div>
          )}

          {/* TEIL 2 STIMULUS */}
          {activeTeil === 2 && (
            <div className="space-y-6">
              {/* Text A */}
              <div className="p-4 bg-white rounded-lg border border-neutral-300 shadow-sm space-y-2">
                <div className="flex justify-between items-baseline border-b border-neutral-200 pb-1">
                  <h5 className="font-black text-xs uppercase text-orange-600">Text A (Aufgaben 7–9)</h5>
                  <span className="text-[10px] text-neutral-500 italic">{exam.teil2.textA.source}</span>
                </div>
                <h4 className="font-bold text-sm text-neutral-900">{exam.teil2.textA.title}</h4>
                <p className="text-[11px] italic text-neutral-600">{exam.teil2.textA.kicker}</p>
                <LineNumberedText
                  text={exam.teil2.textA.bodyParagraphs.join('\n\n')}
                  showLineNumbers={showLineNumbers}
                  interval={interval}
                  className="text-xs text-neutral-800"
                />
              </div>

              {/* Text B */}
              <div className="p-4 bg-white rounded-lg border border-neutral-300 shadow-sm space-y-2">
                <div className="flex justify-between items-baseline border-b border-neutral-200 pb-1">
                  <h5 className="font-black text-xs uppercase text-orange-600">Text B (Aufgaben 10–12)</h5>
                  <span className="text-[10px] text-neutral-500 italic">{exam.teil2.textB.source}</span>
                </div>
                <h4 className="font-bold text-sm text-neutral-900">{exam.teil2.textB.title}</h4>
                <p className="text-[11px] italic text-neutral-600">{exam.teil2.textB.kicker}</p>
                <LineNumberedText
                  text={exam.teil2.textB.bodyParagraphs.join('\n\n')}
                  showLineNumbers={showLineNumbers}
                  interval={interval}
                  className="text-xs text-neutral-800"
                />
              </div>
            </div>
          )}

          {/* TEIL 3 STIMULUS */}
          {activeTeil === 3 && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-neutral-700 block">
                10 Anzeigen aus deutschsprachigen Medien (A bis J):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {exam.teil3.advertisements.map((ad) => (
                  <div key={ad.id} className="p-2.5 bg-white rounded border border-neutral-300 space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="w-5 h-5 rounded bg-orange-600 text-white font-mono text-xs flex items-center justify-center">
                        {ad.letter.toUpperCase()}
                      </span>
                      <span className="text-[11px] truncate max-w-[160px]">{ad.title}</span>
                    </div>
                    <p className="text-[11px] text-neutral-700 leading-snug line-clamp-3">{ad.body}</p>
                    <div className="text-[9px] text-neutral-500 font-mono truncate">{ad.contact}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEIL 4 STIMULUS */}
          {activeTeil === 4 && (
            <div className="space-y-3">
              <div className="p-3 bg-white rounded border border-neutral-300">
                <span className="text-[10px] font-bold uppercase text-neutral-500 block">Diskussionsthema:</span>
                <div className="font-black text-sm text-neutral-900">{exam.teil4.contextTopic}</div>
                <div className="text-xs text-neutral-600 mt-1">{exam.teil4.questionFraming}</div>
              </div>

              <div className="space-y-2">
                {exam.teil4.leserbriefe.map((lb) => (
                  <div key={lb.id} className="p-2.5 bg-white rounded border border-neutral-200 text-xs space-y-0.5">
                    <div className="font-bold text-neutral-900 flex justify-between">
                      <span>{lb.number}. {lb.author} ({lb.age} Jahre, {lb.city})</span>
                      <span className="text-[10px] font-mono text-neutral-400">{lb.text.split(/\s+/).length} Wörter</span>
                    </div>
                    <p className="text-neutral-700 italic pl-2 border-l-2 border-orange-400">
                      „{lb.text}“
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEIL 5 STIMULUS */}
          {activeTeil === 5 && (
            <div className="p-4 bg-white rounded-lg border border-neutral-300 shadow-sm space-y-3">
              <div className="border-b border-neutral-200 pb-2">
                <h4 className="font-black text-sm text-neutral-900">{exam.teil5.sheetTitle}</h4>
                <p className="text-xs text-neutral-600 italic">{exam.teil5.contextSituation}</p>
              </div>
              <div className="space-y-3 text-xs">
                {exam.teil5.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <h5 className="font-extrabold text-neutral-900">{sec.title}:</h5>
                    <LineNumberedText
                      text={sec.content}
                      showLineNumbers={showLineNumbers}
                      interval={interval}
                      className="text-xs text-neutral-800"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Questions, Answer Keys & Teacher Evidence (5 Cols) */}
        <div className="lg:col-span-5 p-6 bg-white overflow-y-auto max-h-[720px] space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-300 pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h4 className="font-black text-xs uppercase tracking-wider text-neutral-800">
                Aufgaben & Prüfer-Textbelege
              </h4>
            </div>
            <span className="text-[11px] font-mono font-bold text-orange-600">
              1 Punkt pro Aufgabe
            </span>
          </div>

          {/* TEIL 1 QUESTIONS */}
          {activeTeil === 1 && (
            <div className="space-y-3">
              {exam.teil1.items.map((it) => (
                <div key={it.id} className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/70 space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-neutral-900 text-white font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {it.number}
                      </span>
                      <span className="font-semibold text-neutral-900 leading-snug">{it.statement}</span>
                    </div>

                    {revealSolutions && (
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold text-xs flex-shrink-0 ${
                          it.correctAnswer === 'Richtig'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {it.correctAnswer}
                      </span>
                    )}
                  </div>

                  {showEvidence && (
                    <div className="p-2 bg-white rounded border border-neutral-200 space-y-0.5 text-[11px]">
                      <div className="flex items-center gap-1 font-bold text-orange-700">
                        <FileSearch className="w-3 h-3" />
                        <span>Textbeleg: {it.textReference || `E-Mail Abschnitt ${Math.ceil(it.number / 2)}`}</span>
                      </div>
                      <p className="text-neutral-600 italic">
                        {it.justification || (it.correctAnswer === 'Richtig' ? 'Wird im Text genau so geschildert.' : 'Widerspricht den tatsächlichen Angaben im Text.')}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TEIL 2 QUESTIONS */}
          {activeTeil === 2 && (
            <div className="space-y-3">
              {[...exam.teil2.textA.items, ...exam.teil2.textB.items].map((it) => (
                <div key={it.id} className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/70 space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-neutral-900 text-white font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {it.number}
                      </span>
                      <span className="font-semibold text-neutral-900 leading-snug">{it.question}</span>
                    </div>
                    {revealSolutions && (
                      <span className="px-2 py-0.5 rounded font-mono font-black text-xs bg-orange-100 text-orange-800 border border-orange-300 flex-shrink-0">
                        [{it.correctAnswer.toUpperCase()}]
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 pl-7 text-[11px]">
                    {(['a', 'b', 'c'] as const).map((opt) => (
                      <div
                        key={opt}
                        className={`p-1 rounded flex items-center gap-2 ${
                          revealSolutions && it.correctAnswer === opt
                            ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-300'
                            : 'text-neutral-700'
                        }`}
                      >
                        <span className="font-mono uppercase font-bold">[{opt}]</span>
                        <span>{it.options[opt]}</span>
                      </div>
                    ))}
                  </div>

                  {showEvidence && (
                    <div className="p-2 bg-white rounded border border-neutral-200 space-y-0.5 text-[11px] ml-7">
                      <div className="flex items-center gap-1 font-bold text-orange-700">
                        <FileSearch className="w-3 h-3" />
                        <span>Textbeleg: {it.textReference || (it.number <= 9 ? 'Text A' : 'Text B')}</span>
                      </div>
                      <p className="text-neutral-600 italic">
                        {it.justification || `Option [${it.correctAnswer.toUpperCase()}] ist im Text belegt; andere Optionen sind falsch oder nicht genannt.`}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TEIL 3 QUESTIONS */}
          {activeTeil === 3 && (
            <div className="space-y-3">
              {exam.teil3.situations.map((sit) => {
                const matchAd = exam.teil3.advertisements.find(
                  (a) => a.letter.toLowerCase() === sit.correctAnswer.toLowerCase()
                );

                return (
                  <div key={sit.id} className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/70 space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-neutral-900 text-white font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          {sit.number}
                        </span>
                        <span className="font-semibold text-neutral-900 leading-snug">{sit.situation}</span>
                      </div>
                      {revealSolutions && (
                        <span className="px-2 py-0.5 rounded font-mono font-black text-xs bg-orange-100 text-orange-800 border border-orange-300 flex-shrink-0">
                          {sit.correctAnswer === '0' ? '0 (Keine)' : `Anzeige [${sit.correctAnswer.toUpperCase()}]`}
                        </span>
                      )}
                    </div>

                    {showEvidence && (
                      <div className="p-2 bg-white rounded border border-neutral-200 space-y-0.5 text-[11px] ml-7">
                        <div className="flex items-center gap-1 font-bold text-orange-700">
                          <FileSearch className="w-3 h-3" />
                          <span>
                            {sit.correctAnswer === '0'
                              ? 'Keine Anzeige passt zu allen Bedingungen'
                              : `Passend zu Anzeige ${sit.correctAnswer.toUpperCase()}: „${matchAd?.title || ''}“`}
                          </span>
                        </div>
                        <p className="text-neutral-600 italic">
                          {sit.justification || 'Schlüsselanforderungen der Person stimmen mit diesem Angebot überein.'}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TEIL 4 QUESTIONS */}
          {activeTeil === 4 && (
            <div className="space-y-3">
              {exam.teil4.leserbriefe.map((lb) => (
                <div key={lb.id} className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/70 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-neutral-900 text-white font-mono text-xs flex items-center justify-center flex-shrink-0">
                        {lb.number}
                      </span>
                      <span className="font-bold text-neutral-900">{lb.author} ({lb.city})</span>
                    </div>
                    {revealSolutions && (
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                          lb.correctAnswer === 'Ja'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {lb.correctAnswer}
                      </span>
                    )}
                  </div>

                  {showEvidence && (
                    <div className="p-2 bg-white rounded border border-neutral-200 space-y-0.5 text-[11px] ml-7">
                      <div className="flex items-center gap-1 font-bold text-orange-700">
                        <FileSearch className="w-3 h-3" />
                        <span>Haltung: {lb.correctAnswer === 'Ja' ? 'Befürwortet die Maßnahme' : 'Lehnt die Maßnahme ab'}</span>
                      </div>
                      <p className="text-neutral-600 italic">
                        {lb.justification || (lb.correctAnswer === 'Ja' ? 'Spricht sich klar für den Vorschlag aus.' : 'Äußert deutliche Skepsis oder Gegenargumente.')}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TEIL 5 QUESTIONS */}
          {activeTeil === 5 && (
            <div className="space-y-3">
              {exam.teil5.items.map((it) => (
                <div key={it.id} className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/70 space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-neutral-900 text-white font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {it.number}
                      </span>
                      <span className="font-semibold text-neutral-900 leading-snug">{it.question}</span>
                    </div>
                    {revealSolutions && (
                      <span className="px-2 py-0.5 rounded font-mono font-black text-xs bg-orange-100 text-orange-800 border border-orange-300 flex-shrink-0">
                        [{it.correctAnswer.toUpperCase()}]
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 pl-7 text-[11px]">
                    {(['a', 'b', 'c'] as const).map((opt) => (
                      <div
                        key={opt}
                        className={`p-1 rounded flex items-center gap-2 ${
                          revealSolutions && it.correctAnswer === opt
                            ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-300'
                            : 'text-neutral-700'
                        }`}
                      >
                        <span className="font-mono uppercase font-bold">[{opt}]</span>
                        <span>{it.options[opt]}</span>
                      </div>
                    ))}
                  </div>

                  {showEvidence && (
                    <div className="p-2 bg-white rounded border border-neutral-200 space-y-0.5 text-[11px] ml-7">
                      <div className="flex items-center gap-1 font-bold text-orange-700">
                        <FileSearch className="w-3 h-3" />
                        <span>Textbeleg: {it.textReference || 'Hausordnung'}</span>
                      </div>
                      <p className="text-neutral-600 italic">
                        {it.justification || `Vorschrift deckt Option [${it.correctAnswer.toUpperCase()}] ab.`}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
