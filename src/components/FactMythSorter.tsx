import React, { useState } from 'react';
import { GameMode, FactOrMythItem } from '../types/game';
import { playSound } from '../utils/audio';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FactMythSorterProps {
  items: FactOrMythItem[];
  onCorrectSort: () => void;
  onAwardXP: (amount: number, reason: string) => void;
  onMissionComplete: (mode: GameMode) => void;
  onNavigateNext: (nextMode: GameMode) => void;
}

export const FactMythSorter: React.FC<FactMythSorterProps> = ({
  items,
  onCorrectSort,
  onAwardXP,
  onMissionComplete,
  onNavigateNext
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSort, setSelectedSort] = useState<'FACT' | 'MYTH' | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentCard = items[currentIndex];

  const handleSort = (sortChoice: 'FACT' | 'MYTH') => {
    if (selectedSort !== null) return;

    setSelectedSort(sortChoice);
    const isCorrect = (sortChoice === 'FACT' && currentCard.isFact) || (sortChoice === 'MYTH' && !currentCard.isFact);

    if (isCorrect) {
      playSound('SUCCESS');
      setCorrectCount(prev => prev + 1);
      onCorrectSort();
      onAwardXP(30, `Helyesen szortírozva: ${sortChoice === 'FACT' ? 'Tény' : 'Tévhit'}`);
    } else {
      playSound('ERROR');
    }
  };

  const handleNextCard = () => {
    playSound('CLICK');
    if (currentIndex + 1 < items.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedSort(null);
    } else {
      setIsFinished(true);
      playSound('BADGE');
      onMissionComplete('FACT_MYTH');
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestart = () => {
    playSound('CLICK');
    setCurrentIndex(0);
    setSelectedSort(null);
    setCorrectCount(0);
    setIsFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-1.5 pb-4 border-b border-slate-800">
        <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
          2. Küldetés · Tény vagy Tévhit
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Bizonyíték-Szortírozó Asztal
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Számos veszélyes tévhit kering a napozásról, ami évente ezrek leégéséhez és daganatos megbetegedéséhez vezet. Válogasd szét a valós tényeket és a veszélyes mítoszokat!
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2">
        <span>
          Vizsgált kártya: <strong className="text-white font-dossier">{currentIndex + 1} / {items.length}</strong>
        </span>
        <span>
          Sikeres szortírozás: <strong className="text-emerald-400 font-dossier">{correctCount} helyes</strong>
        </span>
      </div>

      {!isFinished ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl relative">
          {/* Card Frame */}
          <div className="bg-slate-950 p-6 md:p-8 rounded-xl border border-slate-800/80 text-center space-y-4">
            <span className="text-xs font-dossier uppercase text-slate-500 tracking-wider">
              ÁLLÍTÁS DOSSZIÉ #0{currentIndex + 1}
            </span>
            <p className="text-lg md:text-xl font-medium text-slate-100 leading-relaxed italic">
              {currentCard.statement}
            </p>
          </div>

          {/* Sorter Action Buttons */}
          {selectedSort === null ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => handleSort('FACT')}
                className="py-4 px-6 rounded-xl font-bold text-sm bg-slate-950 border-2 border-emerald-500/50 hover:border-emerald-400 hover:bg-emerald-950/20 text-emerald-300 transition-all flex items-center justify-center gap-3 shadow-lg cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>TÉNY (Orvosi Valóság)</span>
              </button>

              <button
                onClick={() => handleSort('MYTH')}
                className="py-4 px-6 rounded-xl font-bold text-sm bg-slate-950 border-2 border-amber-500/50 hover:border-amber-400 hover:bg-amber-950/20 text-amber-300 transition-all flex items-center justify-center gap-3 shadow-lg cursor-pointer"
              >
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>TÉVHIT (Veszélyes Mítosz)</span>
              </button>
            </div>
          ) : (
            /* Reveal Feedback */
            <div className="space-y-4 pt-2 animate-in fade-in duration-200">
              <div
                className={`p-5 rounded-xl border space-y-3 ${
                  (selectedSort === 'FACT' && currentCard.isFact) || (selectedSort === 'MYTH' && !currentCard.isFact)
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2.5 font-bold text-sm">
                  {(selectedSort === 'FACT' && currentCard.isFact) || (selectedSort === 'MYTH' && !currentCard.isFact) ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Helyes szortírozás!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span>Téves kategória!</span>
                    </>
                  )}
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-white ml-auto">
                    Helyes besorolás: {currentCard.isFact ? 'TÉNY' : 'TÉVHIT'}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">
                  {currentCard.revealText}
                </p>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hiteles Forrás: <strong className="text-slate-300">{currentCard.scientificSource}</strong></span>
                </div>
              </div>

              <button
                onClick={handleNextCard}
                className="w-full py-3 px-6 rounded-xl font-semibold text-xs tracking-wider uppercase bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Következő Bizonyíték</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Finished Screen */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-dossier tracking-wider text-emerald-400 font-bold">
              2. KÜLDETÉS TELJESÍTVE!
            </span>
            <h2 className="text-2xl font-bold text-white">A 3. Küldetés Feloldva!</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Sikeresen átvizsgáltad a leggyakoribb UV-mítoszokat és tényeket. Megnyílt az Esetvizsgálat bűnügyi aktaarchívum!
            </p>
          </div>

          <div className="max-w-xs mx-auto bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Helyes Eredmény</span>
            <span className="text-2xl font-bold text-emerald-400 font-dossier">
              {correctCount} / {items.length} ({Math.round((correctCount / items.length) * 100)}%)
            </span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigateNext('CASE_QUIZ')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors inline-flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 cursor-pointer"
            >
              <span>Tovább a 3. Küldetésre (Esetvizsgálat)</span>
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
