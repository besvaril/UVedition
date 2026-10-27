import React, { useState } from 'react';
import { GameMode, TrueFalseStatement } from '../types/game';
import { playSound } from '../utils/audio';
import { 
  Check, 
  X, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  ArrowRight,
  Flame,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TrueFalseGameProps {
  statements: TrueFalseStatement[];
  onCorrectAnswer: () => void;
  onAwardXP: (amount: number, reason: string) => void;
  onMissionComplete: (mode: GameMode) => void;
  onNavigateNext: (nextMode: GameMode) => void;
}

export const TrueFalseGame: React.FC<TrueFalseGameProps> = ({
  statements,
  onCorrectAnswer,
  onAwardXP,
  onMissionComplete,
  onNavigateNext
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentItem = statements[currentIndex];

  const handleAnswer = (answer: boolean) => {
    if (selectedAnswer !== null) return; // Prevent double click

    setSelectedAnswer(answer);
    const isCorrect = answer === currentItem.isTrue;

    if (isCorrect) {
      playSound('SUCCESS');
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      if (newStreak > maxStreak) {
        setMaxStreak(newStreak);
      }
      onCorrectAnswer();
      const streakBonus = newStreak >= 3 ? 15 : 0;
      onAwardXP(25 + streakBonus, 'Helyes válasz az Igaz/Hamis vizsgálaton');
    } else {
      playSound('ERROR');
      setStreak(0);
    }
  };

  const handleNext = () => {
    playSound('CLICK');
    if (currentIndex + 1 < statements.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    } else {
      setIsCompleted(true);
      playSound('BADGE');
      onMissionComplete('TRUE_FALSE');
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestart = () => {
    playSound('CLICK');
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setStreak(0);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-1.5 pb-4 border-b border-slate-800">
        <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
          1. Küldetés · Gyanús Állítások
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Igaz vagy Hamis Kihallgatás
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Döntsd el a gyanúsítottak és a köztudatban keringő állításokról, hogy megfelelnek-e a fizikai és orvostudományi tényeknek!
        </p>
      </div>

      {/* Progress & Stats Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2">
        <div className="flex items-center gap-3">
          <span>
            Kérdés: <strong className="text-white font-dossier">{currentIndex + 1} / {statements.length}</strong>
          </span>
          <span>·</span>
          <span>
            Kategória: <span className="text-amber-400 font-semibold">{currentItem.category}</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {streak >= 2 && (
            <span className="text-amber-400 font-semibold flex items-center gap-1 animate-pulse">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{streak} sorozatban!</span>
            </span>
          )}
          <span>
            Pontszám: <strong className="text-white font-dossier">{score} pont</strong>
          </span>
        </div>
      </div>

      {/* Main Question Card or Final Summary */}
      {!isCompleted ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
          {/* Subtle category banner */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-dossier text-slate-400 tracking-wider">
              ÜGYIRAT AZONOSÍTÓ: #{currentItem.id.toUpperCase()}
            </span>
            <HelpCircle className="w-4 h-4 text-slate-500" />
          </div>

          {/* Statement Text */}
          <div className="min-h-[100px] flex items-center justify-center text-center px-4">
            <h2 className="text-lg md:text-xl font-semibold text-white leading-relaxed">
              „{currentItem.statement}”
            </h2>
          </div>

          {/* Choice Buttons (IGAZ vs HAMIS) */}
          {selectedAnswer === null ? (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => handleAnswer(true)}
                className="py-4 px-6 rounded-xl font-bold text-sm tracking-wide bg-emerald-600 hover:bg-emerald-500 text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
              >
                <Check className="w-5 h-5" />
                <span>IGAZ (Valós tény)</span>
              </button>

              <button
                onClick={() => handleAnswer(false)}
                className="py-4 px-6 rounded-xl font-bold text-sm tracking-wide bg-rose-600 hover:bg-rose-500 text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 cursor-pointer"
              >
                <X className="w-5 h-5" />
                <span>HAMIS (Tévhit / Veszély)</span>
              </button>
            </div>
          ) : (
            /* Forensic Verdict Reveal */
            <div className="space-y-4 pt-2 animate-in fade-in duration-200">
              <div
                className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                  selectedAnswer === currentItem.isTrue
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                }`}
              >
                {selectedAnswer === currentItem.isTrue ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="font-bold text-sm">
                    {selectedAnswer === currentItem.isTrue
                      ? 'Kiváló detektív munka! Helyes ítélet.'
                      : 'Tévedés! A vizsgálat más eredményre jutott.'}
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {currentItem.explanation}
                  </p>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleNext}
                className="w-full py-3 px-6 rounded-xl font-semibold text-xs tracking-wider uppercase bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Következő Állítás</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Completion Card */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-dossier tracking-wider text-emerald-400 font-bold">
              1. KÜLDETÉS TELJESÍTVE!
            </span>
            <h2 className="text-2xl font-bold text-white">A 2. Küldetés Feloldva!</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Sikeresen végigértél az összes gyanús állításon. A Tény vagy Tévhit bizonyíték-szortírozó asztal immár nyitva áll!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Végső Pontszám</span>
              <span className="text-xl font-bold text-white font-dossier">{score} / {statements.length}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Leghosszabb Széria</span>
              <span className="text-xl font-bold text-amber-400 font-dossier">{maxStreak} helyes</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigateNext('FACT_MYTH')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors inline-flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 cursor-pointer"
            >
              <span>Tovább a 2. Küldetésre (Tény vagy Tévhit)</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Gyakorlás Újra</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
