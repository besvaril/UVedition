import React from 'react';
import { GameMode, PlayerStats, MISSION_DETAILS, MISSION_SEQUENCE } from '../types/game';
import { playSound } from '../utils/audio';
import { 
  Eye, 
  HelpCircle, 
  ShieldAlert, 
  FileText, 
  Gauge, 
  ArrowRight, 
  Award,
  SunMedium,
  CheckCircle2,
  Lock,
  Play
} from 'lucide-react';

interface HubViewProps {
  stats: PlayerStats;
  rankTitle: string;
  unlockedMissions: GameMode[];
  onSelectMode: (mode: GameMode) => void;
  onLockedClick: (message: string) => void;
}

export const HubView: React.FC<HubViewProps> = ({
  stats,
  rankTitle,
  unlockedMissions,
  onSelectMode,
  onLockedClick
}) => {
  // Find current active mission (first in sequence that is not completed)
  const currentActiveMission = MISSION_SEQUENCE.find(m => !stats.completedMissions.includes(m)) || MISSION_SEQUENCE[0];
  const allMissionsFinished = stats.completedMissions.length >= MISSION_SEQUENCE.length;

  const investigationModules = [
    {
      id: 'TRUE_FALSE' as GameMode,
      number: 1,
      title: 'Gyanús Állítások',
      subtitle: 'Igaz vagy Hamis gyors kihallgatás',
      desc: 'Tedd próbára az éberségedet: felismered, ha valaki veszélyes tévhiteket állít a leégésről és a felhőkről?',
      icon: <HelpCircle className="w-5 h-5 text-amber-400" />,
      unlockCondition: '1. Kezdő küldetés (Azonnal elérhető)',
      metric: `${stats.trueFalseCorrectCount} helyes döntés`,
    },
    {
      id: 'FACT_MYTH' as GameMode,
      number: 2,
      title: 'Tény vagy Tévhit',
      subtitle: 'Bizonyíték-szortírozó asztal',
      desc: 'Válaszd szét a tudományos orvosi tényeket a generációk óta öröklődő káros napozási hiedelmektől!',
      icon: <ShieldAlert className="w-5 h-5 text-emerald-400" />,
      unlockCondition: 'Oldd fel az 1. Küldetés sikeres teljesítésével!',
      metric: `${stats.factMythCorrectCount} szortírozva`,
    },
    {
      id: 'CASE_QUIZ' as GameMode,
      number: 3,
      title: 'Esetvizsgálat',
      subtitle: 'Feleletválasztós bűnügyi akták',
      desc: 'Rejtélyes leégések, aszimmetrikus ráncok és csalóka babakocsik: oldd meg a rejtvényeket és derítsd ki az igazságot!',
      icon: <FileText className="w-5 h-5 text-cyan-400" />,
      unlockCondition: 'Oldd fel a 2. Küldetés sikeres teljesítésével!',
      metric: `${stats.casesSolvedCount} ügy lezárva`,
    },
    {
      id: 'UV_INDEX_LAB' as GameMode,
      number: 4,
      title: 'UV-Index Labor',
      subtitle: 'Szimulátor & WHO Skála Értelmező',
      desc: 'Számold ki a leégési időt bőrtípus, napszak, tengerszint feletti magasság és talajreflexió (hó/víz) alapján!',
      icon: <Gauge className="w-5 h-5 text-rose-400" />,
      unlockCondition: 'Oldd fel a 3. Küldetés sikeres teljesítésével!',
      metric: stats.uvLabCompleted ? 'Vizsga letéve' : 'Záróvizsga',
    }
  ];

  const handleCardClick = (mode: GameMode, isUnlocked: boolean, num: number) => {
    if (isUnlocked) {
      playSound('CLICK');
      onSelectMode(mode);
    } else {
      const prevMission = investigationModules.find(m => m.number === num - 1);
      onLockedClick(
        `A(z) ${num}. Küldetés zárolva van! Előbb teljesítsd a(z) ${prevMission?.number}. Küldetést (${prevMission?.title})!`
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Welcome Card */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 md:p-10 shadow-2xl overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <SunMedium className="w-4 h-4" />
            <span>Központi Bűnmegelőzési Központ · Szekvenciális Nyomozás</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Üdvözlünk az UV-detective Irodában!
          </h1>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="text-amber-400 font-semibold uppercase tracking-wider text-[11px]">Készítette:</span>
            <span className="font-semibold text-white bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800">
              Mítoszirtók: UV edition
            </span>
          </div>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Az UV-nyomozói küldetések szigorú egymásutániságban nyílnak meg. Minden egyes sikeresen lezárt vizsgálat feloldja a következő, összetettebb feladatot, amíg el nem éred a legmagasabb szakmai rangot!
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {!allMissionsFinished ? (
              <button
                onClick={() => { playSound('CLICK'); onSelectMode(currentActiveMission); }}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-amber-950/50"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>
                  {MISSION_DETAILS[currentActiveMission]?.title || 'Küldetés Indítása'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => { playSound('CLICK'); onSelectMode('DOSSIER'); }}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 shadow-lg"
              >
                <Award className="w-4 h-4" />
                <span>Minden Küldetés Kész! Oklevél Megtekintése</span>
              </button>
            )}

            <button
              onClick={() => { playSound('CLICK'); onSelectMode('DOSSIER'); }}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Dosszié & Jelvények ({rankTitle})</span>
            </button>
          </div>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Sequential Mission Timeline Stepper */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Nyomozói Küldetésvonal (1-től 4-ig)
            </h2>
            <p className="text-xs text-slate-400">
              A küldetések lépésről lépésre oldódnak fel. Teljesíts egyet a következő megnyitásához!
            </p>
          </div>
          <span className="text-xs font-dossier text-amber-400">
            Haladás: {stats.completedMissions.length} / {MISSION_SEQUENCE.length} teljesítve
          </span>
        </div>

        {/* Linear Stepper Bar */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          {MISSION_SEQUENCE.map((m, idx) => {
            const isCompleted = stats.completedMissions.includes(m);
            const isCurrent = currentActiveMission === m && !isCompleted;
            const isUnlocked = unlockedMissions.includes(m);

            return (
              <div key={m} className="space-y-1.5">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500'
                      : isCurrent
                      ? 'bg-amber-400 animate-pulse'
                      : isUnlocked
                      ? 'bg-slate-700'
                      : 'bg-slate-800'
                  }`}
                />
                <div className="flex items-center gap-1 text-[11px] font-semibold">
                  <span className={isCompleted ? 'text-emerald-400' : isCurrent ? 'text-amber-400' : 'text-slate-500'}>
                    0{idx + 1}.
                  </span>
                  <span className="hidden md:inline text-slate-400 truncate">
                    {MISSION_DETAILS[m]?.shortTitle.replace(/^\d+\.\s*/, '')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Investigation Modules Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Küldetési Dossziék
          </h2>
          <span className="text-xs text-slate-400">
            Kattints a megnyitott küldetésre a nyomozás indításához
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {investigationModules.map((mod) => {
            const isUnlocked = unlockedMissions.includes(mod.id);
            const isCompleted = stats.completedMissions.includes(mod.id);
            const isCurrent = currentActiveMission === mod.id && !isCompleted;

            return (
              <div
                key={mod.id}
                onClick={() => handleCardClick(mod.id, isUnlocked, mod.number)}
                className={`p-6 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-4 relative group ${
                  isUnlocked
                    ? isCurrent
                      ? 'bg-slate-900 border-amber-400 shadow-xl shadow-amber-950/20 ring-1 ring-amber-400/50 cursor-pointer hover:-translate-y-1'
                      : isCompleted
                      ? 'bg-slate-900 border-emerald-500/30 hover:border-emerald-400 cursor-pointer hover:-translate-y-0.5'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 cursor-pointer hover:-translate-y-0.5'
                    : 'bg-slate-950/80 border-slate-800/60 opacity-65 cursor-not-allowed'
                }`}
              >
                <div className="space-y-3">
                  {/* Top line with Mission number badge and Lock/Check icon */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-dossier uppercase font-bold tracking-wider ${
                      isCompleted ? 'text-emerald-400' : isCurrent ? 'text-amber-400' : 'text-slate-400'
                    }`}>
                      {mod.number}. KÜLDETÉS
                    </span>

                    <div>
                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Teljesítve</span>
                        </span>
                      ) : isCurrent ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600/60 animate-pulse">
                          <Play className="w-3 h-3 fill-amber-300" />
                          <span>Következő feladat</span>
                        </span>
                      ) : !isUnlocked ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          <Lock className="w-3 h-3 text-slate-500" />
                          <span>Zárolva</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Megnyitva</span>
                      )}
                    </div>
                  </div>

                  {/* Title and Icon */}
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl border shrink-0 ${
                      isUnlocked ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-800'
                    }`}>
                      {mod.icon}
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold transition-colors ${
                        isUnlocked ? 'text-white group-hover:text-amber-400' : 'text-slate-400'
                      }`}>
                        {mod.title}
                      </h3>
                      <span className="text-xs text-slate-400 block">
                        {mod.subtitle}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>

                {/* Card Footer with requirements / launch button */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  {isUnlocked ? (
                    <>
                      <span className="font-semibold text-slate-300">{mod.metric}</span>
                      <span className="text-xs font-semibold text-amber-400 group-hover:underline flex items-center gap-1">
                        <span>{isCompleted ? 'Újrajátszás' : 'Indítás'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </>
                  ) : (
                    <div className="w-full text-[11px] text-slate-400 flex items-center gap-1.5 italic">
                      <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{mod.unlockCondition}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Forensic Fact Alert Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400 shrink-0 mt-0.5">
            <SunMedium className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-white">Detektív Aranyérvény: Az Árnyék-szabály</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              „Ha az árnyékod rövidebb, mint te magad, a nap magasan jár, és az UV-sugárzás a legveszélyesebb (11:00 és 15:00 között). Keress fedett helyet!”
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (unlockedMissions.includes('UV_INDEX_LAB')) {
              playSound('CLICK');
              onSelectMode('UV_INDEX_LAB');
            } else {
              onLockedClick('Az UV-Index Laboratórium a 4. Küldetés. Teljesítsd az 1-3. küldetéseket a megnyitásához!');
            }
          }}
          className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg whitespace-nowrap transition-colors shrink-0"
        >
          UV-Skála Tesztelése
        </button>
      </div>
    </div>
  );
};
