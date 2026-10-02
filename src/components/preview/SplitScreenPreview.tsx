import React, { useState } from 'react';
import { ExamModel } from '../../types/exam';
import { Language } from '../../utils/i18n';
import { LineNumberedText } from '../../utils/lineNumbering';
import { GermanTtsPlayer } from '../GermanTtsPlayer';
import {
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Bookmark,
  Layers,
} from 'lucide-react';

interface Props {
  exam: ExamModel;
  lang?: Language;
}

export const SplitScreenPreview: React.FC<Props> = ({ exam, lang = 'de' }) => {
  const [activeTeil, setActiveTeil] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [showAnswers, setShowAnswers] = useState<boolean>(true);
  const [showEvidence, setShowEvidence] = useState<boolean>(true);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);

  const isEn = lang === 'en';

  const teilTitles = {
    1: isEn ? 'Part 1: Email / Blog (Items 1–6)' : 'Teil 1: E-Mail / Blog (Aufgaben 1–6)',
    2: isEn ? 'Part 2: Two Press Articles (Items 7–12)' : 'Teil 2: Zwei Pressetexte (Aufgaben 7–12)',
    3: isEn ? 'Part 3: Classified Ads & Matching (Items 13–19)' : 'Teil 3: Anzeigen & Zuordnung (Aufgaben 13–19)',
    4: isEn ? 'Part 4: Reader Letters & Opinion (Items 20–26)' : 'Teil 4: Leserbriefe & Meinung (Aufgaben 20–26)',
    5: isEn ? 'Part 5: House Rules / Regulations (Items 27–30)' : 'Teil 5: Hausordnung / Regelwerk (Aufgaben 27–30)',
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Top Toolbar for Split-Screen Studio */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              {isEn ? 'Teacher Split-Screen Studio (Synchronized Text & Citations)' : 'Dozenten Split-Screen Lektor (Zweispaltiger Text- & Belegmodus)'}
              <span className="text-[10px] px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-700 rounded-full font-semibold">
                Alternative 2
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isEn
                ? 'Side-by-side synchronized view: Reading stimulus with line numbers on the left, tasks with solutions & text evidence citations on the right.'
                : 'Synchrone Ansicht: Lesetext mit Zeilennummern links, Aufgaben mit Musterlösung und Belegnachweis rechts.'}
            </p>
          </div>
        </div>

        {/* View Options */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
              showAnswers
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-semibold'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            {showAnswers ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>
              {showAnswers
                ? (isEn ? 'Solutions Shown' : 'Lösungen eingeblendet')
                : (isEn ? 'Solutions Hidden (Student Mode)' : 'Lösungen ausgeblendet (Schüler)')}
            </span>
          </button>

          <button
            onClick={() => setShowEvidence(!showEvidence)}
            disabled={!showAnswers}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 ${
              showEvidence && showAnswers
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isEn ? 'Text Citations (Proof)' : 'Textbelege (Zitate)'}</span>
          </button>

          <button
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
              showLineNumbers
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 font-semibold'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <span>{isEn ? 'Line Numbers (L. 5, 10...)' : 'Zeilennummer (Z. 5, 10...)'}</span>
          </button>
        </div>
      </div>

      {/* Teil Tabs Navigation */}
      <div className="flex items-center gap-1.5 bg-slate-800/90 p-1.5 rounded-xl border border-slate-700 overflow-x-auto">
        {([1, 2, 3, 4, 5] as const).map((teilNum) => (
          <button
            key={teilNum}
            onClick={() => setActiveTeil(teilNum)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTeil === teilNum
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
            }`}
          >
            <span>{isEn ? `Part ${teilNum}` : `Teil ${teilNum}`}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded ${
                activeTeil === teilNum ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-700 text-slate-400'
              }`}
            >
              {teilNum === 1
                ? (isEn ? '6 Pts' : '6 Pkt')
                : teilNum === 2
                ? (isEn ? '6 Pts' : '6 Pkt')
                : teilNum === 3
                ? (isEn ? '7 Pts' : '7 Pkt')
                : teilNum === 4
                ? (isEn ? '7 Pts' : '7 Pkt')
                : (isEn ? '4 Pts' : '4 Pkt')}
            </span>
          </button>
        ))}
      </div>

      {/* Two-Column Split Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: READING STIMULUS (7 cols on large screens) */}
        <div className="lg:col-span-7 bg-white rounded-xl shadow-md border border-neutral-300 overflow-hidden text-neutral-900">
          <div className="bg-neutral-100 border-b border-neutral-300 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800">
                {isEn ? 'Reading Stimulus / German Source Text' : 'Lesetext / Ausgangsmaterial'}
              </h4>
            </div>
            {/* German TTS Audio Player */}
            {activeTeil === 1 && (
              <GermanTtsPlayer text={`${exam.teil1.emailGreeting}\n${exam.teil1.emailBody}`} label={isEn ? 'Read aloud' : 'Vorlesen'} />
            )}
            {activeTeil === 2 && (
              <GermanTtsPlayer
                text={`${exam.teil2.textA.bodyParagraphs.join('\n')}\n${exam.teil2.textB.bodyParagraphs.join('\n')}`}
                label={isEn ? 'Read aloud' : 'Vorlesen'}
              />
            )}
            {activeTeil === 4 && (
              <GermanTtsPlayer
                text={exam.teil4.leserbriefe.map((lb) => `${lb.author}: ${lb.text}`).join('\n')}
                label={isEn ? 'Read aloud' : 'Vorlesen'}
              />
            )}
            {activeTeil === 5 && (
              <GermanTtsPlayer
                text={exam.teil5.sections.map((s) => `${s.title}: ${s.content}`).join('\n')}
                label={isEn ? 'Read aloud' : 'Vorlesen'}
              />
            )}
          </div>

          <div className="p-6 space-y-4">
            {/* TEIL 1 CONTENT */}
            {activeTeil === 1 && (
              <div className="space-y-4">
                <div className="border border-neutral-200 bg-neutral-50/70 p-3 rounded-lg text-xs space-y-1">
                  <div className="font-semibold text-neutral-600">{isEn ? 'Context & Instructions:' : 'Kontext:'}</div>
                  <div className="text-neutral-800 italic">{exam.teil1.instruction}</div>
                </div>

                <div className="border border-neutral-300 rounded-lg p-5 bg-white space-y-3 font-serif">
                  <div className="font-bold text-neutral-900 text-sm">{exam.teil1.emailGreeting}</div>
                  {showLineNumbers ? (
                    <LineNumberedText
                      text={exam.teil1.emailBody}
                      interval={5}
                      className="text-sm leading-relaxed text-neutral-800"
                    />
                  ) : (
                    exam.teil1.emailBody.split('\n\n').map((p, idx) => (
                      <p key={idx} className="text-sm leading-relaxed text-neutral-800 text-justify">
                        {p}
                      </p>
                    ))
                  )}
                  <div className="font-semibold text-neutral-800 text-sm pt-2">{exam.teil1.emailSignoff}</div>
                </div>
              </div>
            )}

            {/* TEIL 2 CONTENT */}
            {activeTeil === 2 && (
              <div className="space-y-6">
                <div className="border border-neutral-200 bg-neutral-50/70 p-3 rounded-lg text-xs space-y-1">
                  <div className="font-semibold text-neutral-600">{isEn ? 'Notice:' : 'Hinweis:'}</div>
                  <div className="text-neutral-800 italic">{exam.teil2.instruction}</div>
                </div>

                {/* Text A */}
                <div className="border border-neutral-300 rounded-lg p-5 bg-white space-y-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-neutral-200 rounded uppercase tracking-wider text-neutral-700">
                    Text A
                  </span>
                  <h3 className="font-black text-base text-neutral-900">{exam.teil2.textA.title}</h3>
                  {exam.teil2.textA.kicker && (
                    <h4 className="font-medium text-xs text-neutral-600 italic -mt-2">
                      {exam.teil2.textA.kicker}
                    </h4>
                  )}
                  {showLineNumbers ? (
                    <LineNumberedText
                      text={exam.teil2.textA.bodyParagraphs.join('\n\n')}
                      interval={5}
                      className="text-xs leading-relaxed text-neutral-800"
                    />
                  ) : (
                    exam.teil2.textA.bodyParagraphs.map((p, idx) => (
                      <p key={idx} className="text-xs leading-relaxed text-neutral-800 text-justify">
                        {p}
                      </p>
                    ))
                  )}
                  <div className="text-[10px] text-neutral-400 text-right italic pt-1">
                    {isEn ? 'Source:' : 'Quelle:'} {exam.teil2.textA.source}
                  </div>
                </div>

                {/* Text B */}
                <div className="border border-neutral-300 rounded-lg p-5 bg-white space-y-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-neutral-200 rounded uppercase tracking-wider text-neutral-700">
                    Text B
                  </span>
                  <h3 className="font-black text-base text-neutral-900">{exam.teil2.textB.title}</h3>
                  {exam.teil2.textB.kicker && (
                    <h4 className="font-medium text-xs text-neutral-600 italic -mt-2">
                      {exam.teil2.textB.kicker}
                    </h4>
                  )}
                  {showLineNumbers ? (
                    <LineNumberedText
                      text={exam.teil2.textB.bodyParagraphs.join('\n\n')}
                      interval={5}
                      className="text-xs leading-relaxed text-neutral-800"
                    />
                  ) : (
                    exam.teil2.textB.bodyParagraphs.map((p, idx) => (
                      <p key={idx} className="text-xs leading-relaxed text-neutral-800 text-justify">
                        {p}
                      </p>
                    ))
                  )}
                  <div className="text-[10px] text-neutral-400 text-right italic pt-1">
                    {isEn ? 'Source:' : 'Quelle:'} {exam.teil2.textB.source}
                  </div>
                </div>
              </div>
            )}

            {/* TEIL 3 CONTENT: 10 CLASSIFIED ADS */}
            {activeTeil === 3 && (
              <div className="space-y-4">
                <div className="border border-neutral-200 bg-neutral-50/70 p-3 rounded-lg text-xs space-y-1">
                  <div className="font-semibold text-neutral-600">{isEn ? 'Classified Ads Section:' : 'Anzeigenteil:'}</div>
                  <div className="text-neutral-800 italic">
                    {isEn
                      ? '10 authentic German advertisements (a to j). Exactly one advertisement remains unused.'
                      : '10 authentische Kleinanzeigen (a bis j). Genau eine Anzeige bleibt unverwendet.'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {exam.teil3.advertisements.map((ad) => (
                    <div
                      key={ad.id || ad.letter}
                      className="border border-neutral-300 rounded-lg p-3 bg-neutral-50/50 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5 mb-2">
                          <span className="font-black text-sm uppercase text-neutral-900 bg-neutral-200 w-6 h-6 rounded flex items-center justify-center font-mono">
                            {ad.letter}
                          </span>
                          <span className="font-bold text-xs text-neutral-800 line-clamp-1">{ad.title}</span>
                        </div>
                        <p className="text-xs text-neutral-700 leading-snug">{ad.body}</p>
                      </div>
                      <div className="text-[10px] text-neutral-500 border-t border-neutral-200 pt-1.5 mt-2 font-mono">
                        {ad.contact}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TEIL 4 CONTENT: LESERBRIEFE */}
            {activeTeil === 4 && (
              <div className="space-y-4">
                <div className="border border-amber-200 bg-amber-50/60 p-3.5 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-amber-950 uppercase tracking-wide">
                    {isEn ? 'Discussion Topic:' : 'Thema:'} {exam.teil4.contextTopic}
                  </div>
                  <div className="font-extrabold text-neutral-900 text-sm">
                    „{exam.teil4.questionFraming}“
                  </div>
                </div>

                <div className="space-y-3">
                  {exam.teil4.leserbriefe.map((lb) => (
                    <div
                      key={lb.id}
                      className="border border-neutral-200 rounded-lg p-3.5 bg-neutral-50/60 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                        <span className="font-bold text-neutral-900">
                          {lb.author} ({lb.age}), {lb.city}
                        </span>
                        <span className="text-[10px] bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded font-mono">
                          {isEn ? `Item ${lb.number}` : `Aufgabe ${lb.number}`}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-800 italic leading-relaxed">„{lb.text}“</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TEIL 5 CONTENT: HAUSORDNUNG */}
            {activeTeil === 5 && (
              <div className="space-y-4">
                <div className="border-b-2 border-neutral-900 pb-2">
                  <h3 className="font-black text-base text-neutral-900 uppercase">
                    {exam.teil5.sheetTitle}
                  </h3>
                  {exam.teil5.sheetSubtitle && (
                    <p className="text-xs font-semibold text-neutral-600 italic">
                      {exam.teil5.sheetSubtitle}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  {exam.teil5.sections.map((sec, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <h4 className="font-bold text-xs text-neutral-900 border-l-2 border-indigo-600 pl-2">
                        {sec.title}
                      </h4>
                      {showLineNumbers ? (
                        <LineNumberedText
                          text={sec.content}
                          interval={5}
                          className="text-xs leading-relaxed text-neutral-800"
                        />
                      ) : (
                        <p className="text-xs text-neutral-800 leading-relaxed text-justify">{sec.content}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: QUESTIONS & EVIDENCE CITATIONS (5 cols on large screens) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-700 rounded-xl shadow-md p-5 text-slate-100 space-y-4">
          <div className="border-b border-slate-700 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                {isEn ? 'Questions, Solutions & Proof Citations' : 'Aufgaben, Lösungen & Belege'}
              </h4>
            </div>
            <span className="text-[11px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
              {teilTitles[activeTeil].split(':')[0]}
            </span>
          </div>

          {/* TEIL 1 QUESTIONS (1-6) */}
          {activeTeil === 1 && (
            <div className="space-y-3.5">
              {/* Example */}
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                  <span>{isEn ? 'Worked Example 0' : 'Beispiel 0'}</span>
                  <span className="text-amber-400 font-bold">{exam.teil1.beispiel.answer}</span>
                </div>
                <div className="text-slate-200">{exam.teil1.beispiel.statement}</div>
              </div>

              {exam.teil1.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-lg bg-slate-800/90 border border-slate-700 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {item.number}
                    </span>
                    <span className="flex-1 text-slate-200 font-medium leading-snug">{item.statement}</span>
                    {showAnswers && (
                      <span
                        className={`px-2 py-0.5 rounded font-black text-xs uppercase ${
                          item.correctAnswer === 'Richtig'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {item.correctAnswer}
                      </span>
                    )}
                  </div>

                  {/* Text Evidence Citation */}
                  {showAnswers && showEvidence && (item.textReference || item.justification) && (
                    <div className="bg-slate-950/80 rounded p-2.5 border border-slate-700/60 text-[11px] space-y-1">
                      {item.textReference && (
                        <div className="text-amber-300/90 font-mono flex items-center gap-1.5">
                          <Bookmark className="w-3 h-3 text-amber-400" />
                          <span>{isEn ? 'Proof Citation:' : 'Beleg:'} {item.textReference}</span>
                        </div>
                      )}
                      {item.justification && (
                        <div className="text-slate-300 italic">{item.justification}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TEIL 2 QUESTIONS (7-12) */}
          {activeTeil === 2 && (
            <div className="space-y-4">
              <div className="text-[11px] font-bold uppercase text-slate-400">
                {isEn ? 'Text A: Questions 7 to 9' : 'Text A: Aufgaben 7 bis 9'}
              </div>
              {exam.teil2.textA.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-lg bg-slate-800/90 border border-slate-700 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {item.number}
                    </span>
                    <span className="flex-1 text-slate-200 font-medium">{item.question}</span>
                  </div>
                  <div className="space-y-1 pl-6">
                    {(['a', 'b', 'c'] as const).map((key) => (
                      <div
                        key={key}
                        className={`p-1.5 rounded flex items-center gap-2 ${
                          showAnswers && key === item.correctAnswer
                            ? 'bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-500/30'
                            : 'text-slate-400'
                        }`}
                      >
                        <span className="font-mono font-bold">{key})</span>
                        <span>{item.options[key]}</span>
                      </div>
                    ))}
                  </div>
                  {showAnswers && showEvidence && (item.textReference || item.justification) && (
                    <div className="bg-slate-950/80 rounded p-2.5 border border-slate-700/60 text-[11px] space-y-1">
                      {item.textReference && (
                        <div className="text-amber-300/90 font-mono">{isEn ? 'Proof Citation:' : 'Beleg:'} {item.textReference}</div>
                      )}
                      {item.justification && (
                        <div className="text-slate-300 italic">{item.justification}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <div className="text-[11px] font-bold uppercase text-slate-400 pt-2 border-t border-slate-700">
                {isEn ? 'Text B: Questions 10 to 12' : 'Text B: Aufgaben 10 bis 12'}
              </div>
              {exam.teil2.textB.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-lg bg-slate-800/90 border border-slate-700 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {item.number}
                    </span>
                    <span className="flex-1 text-slate-200 font-medium">{item.question}</span>
                  </div>
                  <div className="space-y-1 pl-6">
                    {(['a', 'b', 'c'] as const).map((key) => (
                      <div
                        key={key}
                        className={`p-1.5 rounded flex items-center gap-2 ${
                          showAnswers && key === item.correctAnswer
                            ? 'bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-500/30'
                            : 'text-slate-400'
                        }`}
                      >
                        <span className="font-mono font-bold">{key})</span>
                        <span>{item.options[key]}</span>
                      </div>
                    ))}
                  </div>
                  {showAnswers && showEvidence && (item.textReference || item.justification) && (
                    <div className="bg-slate-950/80 rounded p-2.5 border border-slate-700/60 text-[11px] space-y-1">
                      {item.textReference && (
                        <div className="text-amber-300/90 font-mono">{isEn ? 'Proof Citation:' : 'Beleg:'} {item.textReference}</div>
                      )}
                      {item.justification && (
                        <div className="text-slate-300 italic">{item.justification}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TEIL 3 QUESTIONS (13-19) */}
          {activeTeil === 3 && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                  <span>{isEn ? 'Worked Example 0' : 'Beispiel 0'}</span>
                  <span className="text-amber-400 font-bold">
                    {isEn ? `Ad ${exam.teil3.beispiel.answer.toUpperCase()}` : `Anzeige ${exam.teil3.beispiel.answer.toUpperCase()}`}
                  </span>
                </div>
                <div className="text-slate-200">{exam.teil3.beispiel.situation}</div>
              </div>

              {exam.teil3.situations.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-lg bg-slate-800/90 border border-slate-700 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {item.number}
                    </span>
                    <span className="flex-1 text-slate-200 leading-snug">{item.situation}</span>
                    {showAnswers && (
                      <span
                        className={`font-mono font-black px-2.5 py-0.5 rounded text-xs ${
                          item.correctAnswer === '0'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {item.correctAnswer === '0'
                          ? (isEn ? 'None (0)' : 'Keine (0)')
                          : (isEn ? `Ad ${item.correctAnswer.toUpperCase()}` : `Anzeige ${item.correctAnswer.toUpperCase()}`)}
                      </span>
                    )}
                  </div>

                  {showAnswers && showEvidence && (item.textReference || item.justification) && (
                    <div className="bg-slate-950/80 rounded p-2.5 border border-slate-700/60 text-[11px] space-y-1">
                      {item.textReference && (
                        <div className="text-amber-300/90 font-mono">{isEn ? 'Proof Citation:' : 'Beleg:'} {item.textReference}</div>
                      )}
                      {item.justification && (
                        <div className="text-slate-300 italic">{item.justification}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TEIL 4 QUESTIONS (20-26) */}
          {activeTeil === 4 && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                  <span>{isEn ? 'Example 0' : 'Beispiel 0'}: {exam.teil4.beispiel.author}</span>
                  <span className="text-amber-400 font-bold">{exam.teil4.beispiel.answer}</span>
                </div>
                <div className="text-slate-300 italic line-clamp-1">„{exam.teil4.beispiel.text}“</div>
              </div>

              {exam.teil4.leserbriefe.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-lg bg-slate-800/90 border border-slate-700 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {item.number}
                    </span>
                    <span className="flex-1 text-slate-200 font-semibold">{item.author}</span>
                    {showAnswers && (
                      <span
                        className={`px-3 py-0.5 rounded font-black text-xs ${
                          item.correctAnswer === 'Ja'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {item.correctAnswer}
                      </span>
                    )}
                  </div>
                  {showAnswers && showEvidence && (item.textReference || item.justification) && (
                    <div className="bg-slate-950/80 rounded p-2.5 border border-slate-700/60 text-[11px] space-y-1">
                      {item.textReference && (
                        <div className="text-amber-300/90 font-mono">{isEn ? 'Proof Citation:' : 'Beleg:'} {item.textReference}</div>
                      )}
                      {item.justification && (
                        <div className="text-slate-300 italic">{item.justification}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TEIL 5 QUESTIONS (27-30) */}
          {activeTeil === 5 && (
            <div className="space-y-4">
              {exam.teil5.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-lg bg-slate-800/90 border border-slate-700 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {item.number}
                    </span>
                    <span className="flex-1 text-slate-200 font-medium">{item.question}</span>
                  </div>
                  <div className="space-y-1 pl-6">
                    {(['a', 'b', 'c'] as const).map((key) => (
                      <div
                        key={key}
                        className={`p-1.5 rounded flex items-center gap-2 ${
                          showAnswers && key === item.correctAnswer
                            ? 'bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-500/30'
                            : 'text-slate-400'
                        }`}
                      >
                        <span className="font-mono font-bold">{key})</span>
                        <span>{item.options[key]}</span>
                      </div>
                    ))}
                  </div>
                  {showAnswers && showEvidence && (item.textReference || item.justification) && (
                    <div className="bg-slate-950/80 rounded p-2.5 border border-slate-700/60 text-[11px] space-y-1">
                      {item.textReference && (
                        <div className="text-amber-300/90 font-mono">{isEn ? 'Proof Citation:' : 'Beleg:'} {item.textReference}</div>
                      )}
                      {item.justification && (
                        <div className="text-slate-300 italic">{item.justification}</div>
                      )}
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
