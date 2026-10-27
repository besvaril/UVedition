import React, { useState } from 'react';
import { GameMode, DetectiveCase, CaseQuizOption } from '../types/game';
import { playSound } from '../utils/audio';
import { 
  FileText, 
  User, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Award,
  Lightbulb,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CaseQuizProps {
  cases: DetectiveCase[];
  onSolveCase: (caseId: string) => void;
  onAwardXP: (amount: number, reason: string) => void;
  onMissionComplete: (mode: GameMode) => void;
  onNavigateNext: (nextMode: GameMode) => void;
}

export const CaseQuiz: React.FC<CaseQuizProps> = ({
  cases,
  onSolveCase,
  onAwardXP,
  onMissionComplete,
  onNavigateNext
}) => {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<CaseQuizOption | null>(null);
  const [solvedCaseIds, setSolvedCaseIds] = useState<string[]>([]);
  const [allFinished, setAllFinished] = useState(false);

  const activeCase = cases[currentCaseIndex];

  const handleSelectOption = (option: CaseQuizOption) => {
    if (selectedOption !== null) return;

    setSelectedOption(option);

    if (option.isCorrect) {
      playSound('SUCCESS');
      if (!solvedCaseIds.includes(activeCase.id)) {
        const nextSolved = [...solvedCaseIds, activeCase.id];
        setSolvedCaseIds(nextSolved);
        onSolveCase(activeCase.id);
        onAwardXP(60, `Ügy sikeresen felderítve: ${activeCase.title}`);
      }
    } else {
      playSound('ERROR');
    }
  };

  const handleNextCase = () => {
    playSound('CLICK');
    if (currentCaseIndex + 1 < cases.length) {
      setCurrentCaseIndex(currentCaseIndex + 1);
      setSelectedOption(null);
    } else {
      setAllFinished(true);
      playSound('BADGE');
      onMissionComplete('CASE_QUIZ');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleSwitchCase = (idx: number) => {
    playSound('CLICK');
    setCurrentCaseIndex(idx);
    setSelectedOption(null);
  };

  const handleRestart = () => {
    playSound('CLICK');
    setCurrentCaseIndex(0);
    setSelectedOption(null);
    setAllFinished(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Case Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
            3. Küldetés · Esetvizsgálat
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-1">
            Rejtélyes UV-Bűnesetek
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mt-1">
            Gyakori, megtévesztő helyzetek, ahol a gyanútlan emberek súlyos egészségkárosodást szenvedtek. Elemzed a körülményeket és válaszd ki a helyes diagnózist!
          </p>
        </div>

        {/* Case Dossier Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
          {cases.map((c, idx) => {
            const isSolved = solvedCaseIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => handleSwitchCase(idx)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                  currentCaseIndex === idx
                    ? 'bg-amber-400 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Ügy 0{idx + 1}</span>
                {isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {!allFinished ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
          {/* Case Header Details */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-dossier font-semibold">
              <FileText className="w-4 h-4" />
              <span>ÜGYIRATSZÁM: {activeCase.caseNumber}</span>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeCase.victimProfile}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeCase.incidentLocation}</span>
              </span>
            </div>
          </div>

          {/* Case Briefing */}
          <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {activeCase.title}
            </h2>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-sm leading-relaxed">
              <p>{activeCase.reportBrief}</p>
            </div>
          </div>

          {/* Detective Question */}
          <div className="p-3.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-200 text-sm font-semibold flex items-start gap-2.5">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <span>{activeCase.mysteryQuestion}</span>
          </div>

          {/* Multiple-Choice Options */}
          <div className="space-y-3 pt-1">
            {activeCase.options.map((option, idx) => {
              const isSelected = selectedOption?.id === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                    selectedOption === null
                      ? 'bg-slate-950/60 hover:bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200 cursor-pointer'
                      : isSelected && option.isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/30'
                      : isSelected && !option.isCorrect
                      ? 'bg-rose-950/40 border-rose-500 text-rose-100 ring-2 ring-rose-500/30'
                      : option.isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-950/30 border-slate-900 text-slate-500 opacity-60'
                  }`}
                >
                  <span className="w-6 h-6 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center font-dossier text-xs shrink-0 text-slate-300 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="space-y-1">
                    <span className="text-sm font-medium leading-relaxed block">
                      {option.text}
                    </span>
                    {selectedOption && isSelected && (
                      <p className={`text-xs mt-2 pt-2 border-t leading-relaxed ${
                        option.isCorrect ? 'border-emerald-800 text-emerald-200' : 'border-rose-800 text-rose-200'
                      }`}>
                        {option.feedback}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Case Solved Reveal / Next Button */}
          {selectedOption && (
            <div className="pt-4 border-t border-slate-800 space-y-4 animate-in fade-in duration-200">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-semibold text-amber-400 block">
                  Detektív Tanulság:
                </span>
                <p>{activeCase.investigationTakeaway}</p>
              </div>

              <button
                onClick={handleNextCase}
                className="w-full py-3 px-6 rounded-xl font-semibold text-xs tracking-wider uppercase bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Következő Esetvizsgálat</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Finished All Cases */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-dossier tracking-wider text-emerald-400 font-bold">
              3. KÜLDETÉS TELJESÍTVE!
            </span>
            <h2 className="text-2xl font-bold text-white">A 4. Küldetés Feloldva!</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Kiváló detektív logikával derítetted fel az összes rejtélyes UV-esetet. A végső vizsga: az UV-Index Laboratórium immár elérhető!
            </p>
          </div>

          <div className="max-w-xs mx-auto bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Megoldott Akták</span>
            <span className="text-2xl font-bold text-amber-400 font-dossier">
              {solvedCaseIds.length} / {cases.length}
            </span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigateNext('UV_INDEX_LAB')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors inline-flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 cursor-pointer"
            >
              <span>Tovább a 4. Küldetésre (UV-Labor)</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Újraolvasás</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
