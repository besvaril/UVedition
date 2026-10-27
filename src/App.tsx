import React, { useState, useEffect } from 'react';
import { GameMode, PlayerStats, Badge, MISSION_SEQUENCE, MISSION_DETAILS } from './types/game';
import { 
  TRUE_FALSE_STATEMENTS, 
  FACT_MYTH_ITEMS, 
  DETECTIVE_CASES, 
  BADGES 
} from './data/cases';
import { Navbar } from './components/Navbar';
import { HubView } from './components/HubView';
import { TrueFalseGame } from './components/TrueFalseGame';
import { FactMythSorter } from './components/FactMythSorter';
import { CaseQuiz } from './components/CaseQuiz';
import { UVIndexLab } from './components/UVIndexLab';
import { DetectiveDossier } from './components/DetectiveDossier';
import { getSoundEnabled, setSoundEnabled, playSound } from './utils/audio';
import { Shield, Sparkles, X } from 'lucide-react';

const STORAGE_KEY = 'uv_detective_state_v3';

const getInitialStats = (): PlayerStats => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('uv_detective_state_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        completedMissions: (parsed.completedMissions || []).filter((m: string) => m !== 'SCENE_INSPECTOR')
      };
    }
  } catch {
    // ignore
  }

  return {
    name: 'Nyomozó Tisztviselő',
    xp: 0,
    completedMissions: [],
    scenesCompleted: [],
    hotspotsFoundCount: 0,
    trueFalseCorrectCount: 0,
    factMythCorrectCount: 0,
    casesSolvedCount: 0,
    uvLabCompleted: false,
    unlockedBadgeIds: []
  };
};

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('HUB');
  const [stats, setStats] = useState<PlayerStats>(getInitialStats);
  const [soundActive, setSoundActive] = useState<boolean>(getSoundEnabled);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync stats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  // Compute Unlocked Missions Sequentially
  const getUnlockedMissions = (completed: GameMode[]): GameMode[] => {
    const unlocked: GameMode[] = [MISSION_SEQUENCE[0]]; // 1. SCENE_INSPECTOR is always unlocked
    for (let i = 0; i < MISSION_SEQUENCE.length - 1; i++) {
      if (completed.includes(MISSION_SEQUENCE[i])) {
        unlocked.push(MISSION_SEQUENCE[i + 1]);
      }
    }
    return unlocked;
  };

  const unlockedMissions = getUnlockedMissions(stats.completedMissions || []);

  // Compute Rank Title
  const getRankTitle = (xp: number): string => {
    if (xp >= 1400) return 'UV-Bűnmegelőzési Mester';
    if (xp >= 900) return 'Főfelügyelő';
    if (xp >= 500) return 'Vezető Esetvizsgáló';
    if (xp >= 200) return 'Területi UV-Ügynök';
    return 'Kezdő Megfigyelő';
  };

  const rankTitle = getRankTitle(stats.xp);

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  // Award XP and check badge unlocks
  const handleAwardXP = (amount: number, reason: string) => {
    setStats(prev => {
      const nextXp = prev.xp + amount;
      showToast(`+${amount} XP · ${reason}`);
      return { ...prev, xp: nextXp };
    });
  };

  // Complete a mission in the sequence
  const handleMissionComplete = (mission: GameMode) => {
    setStats(prev => {
      const currentCompleted = prev.completedMissions || [];
      if (currentCompleted.includes(mission)) {
        return prev;
      }

      const nextCompleted = [...currentCompleted, mission];
      const currentIdx = MISSION_SEQUENCE.indexOf(mission);
      const nextMission = currentIdx + 1 < MISSION_SEQUENCE.length ? MISSION_SEQUENCE[currentIdx + 1] : null;

      if (nextMission) {
        const nextMeta = MISSION_DETAILS[nextMission];
        showToast(`Küldetés Teljesítve! Feloldva: ${nextMeta?.title || 'Következő Küldetés'}!`);
      } else {
        showToast('Minden küldetést teljesítettél! Gratulálunk a mesterdetektív ranghoz!');
      }

      return {
        ...prev,
        completedMissions: nextCompleted
      };
    });
  };

  // Handle Safe Navigation
  const handleSelectMode = (mode: GameMode) => {
    if (mode === 'HUB' || mode === 'DOSSIER' || unlockedMissions.includes(mode)) {
      playSound('CLICK');
      setCurrentMode(mode);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      playSound('ERROR');
      const meta = MISSION_DETAILS[mode];
      const prevMeta = Object.values(MISSION_DETAILS).find(m => m.number === (meta?.number || 2) - 1);
      showToast(
        `A(z) ${meta?.number || ''}. Küldetés zárolva van! Előbb teljesítsd a(z) ${prevMeta?.title || 'megelőző feladatot'}!`
      );
    }
  };

  const handleLockedClick = (message: string) => {
    playSound('ERROR');
    showToast(message);
  };

  // Check badges unlock
  useEffect(() => {
    const newBadgeIds = [...stats.unlockedBadgeIds];

    // Badge 1: First mission completed
    if (!newBadgeIds.includes('badge_first_mission') && stats.completedMissions.includes('TRUE_FALSE')) {
      newBadgeIds.push('badge_first_mission');
      playSound('BADGE');
      showToast('Új Érdemrend: Kezdő Felfedező!');
    }

    // Badge 2: Fact hunter
    if (!newBadgeIds.includes('badge_fact_hunter') && stats.factMythCorrectCount >= 6) {
      newBadgeIds.push('badge_fact_hunter');
      playSound('BADGE');
      showToast('Új Érdemrend: Tévhit-romboló!');
    }

    // Badge 3: Rapid analyst
    if (!newBadgeIds.includes('badge_rapid_analyst') && stats.trueFalseCorrectCount >= 7) {
      newBadgeIds.push('badge_rapid_analyst');
      playSound('BADGE');
      showToast('Új Érdemrend: Gyorsteszt Mester!');
    }

    // Badge 4: Case solver
    if (!newBadgeIds.includes('badge_case_solver') && stats.casesSolvedCount >= 3) {
      newBadgeIds.push('badge_case_solver');
      playSound('BADGE');
      showToast('Új Érdemrend: Főnyomozói Briliáns Elme!');
    }

    // Badge 5: UV scientist
    if (!newBadgeIds.includes('badge_uv_scientist') && stats.uvLabCompleted) {
      newBadgeIds.push('badge_uv_scientist');
      playSound('BADGE');
      showToast('Új Érdemrend: UV-Laboratórium Szakértő!');
    }

    // Badge 6: Master detective
    if (!newBadgeIds.includes('badge_master_detective') && (newBadgeIds.length >= 5 || stats.xp >= 1400)) {
      newBadgeIds.push('badge_master_detective');
      playSound('BADGE');
      showToast('Legmagasabb Rang Kiérdemelve: Arany Főfelügyelő!');
    }

    if (newBadgeIds.length !== stats.unlockedBadgeIds.length) {
      setStats(prev => ({ ...prev, unlockedBadgeIds: newBadgeIds }));
    }
  }, [stats.scenesCompleted, stats.factMythCorrectCount, stats.trueFalseCorrectCount, stats.casesSolvedCount, stats.uvLabCompleted, stats.xp]);

  const handleTrueFalseCorrect = () => {
    setStats(prev => ({
      ...prev,
      trueFalseCorrectCount: prev.trueFalseCorrectCount + 1
    }));
  };

  const handleFactMythCorrect = () => {
    setStats(prev => ({
      ...prev,
      factMythCorrectCount: prev.factMythCorrectCount + 1
    }));
  };

  const handleCaseSolved = (caseId: string) => {
    setStats(prev => ({
      ...prev,
      casesSolvedCount: prev.casesSolvedCount + 1
    }));
  };

  const handleCompleteLab = () => {
    setStats(prev => ({
      ...prev,
      uvLabCompleted: true
    }));
  };

  const handleUpdateName = (newName: string) => {
    setStats(prev => ({ ...prev, name: newName }));
    showToast('Nyomozói azonosító frissítve');
  };

  const handleToggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    setSoundEnabled(next);
    if (next) playSound('CLICK');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950">
      {/* Top Bar Contract Navigation */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
        xp={stats.xp}
        rankTitle={rankTitle}
        soundEnabled={soundActive}
        onToggleSound={handleToggleSound}
        unlockedMissions={unlockedMissions}
        onLockedClick={handleLockedClick}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentMode === 'HUB' && (
          <HubView
            stats={stats}
            rankTitle={rankTitle}
            unlockedMissions={unlockedMissions}
            onSelectMode={handleSelectMode}
            onLockedClick={handleLockedClick}
          />
        )}


        {currentMode === 'TRUE_FALSE' && (
          <TrueFalseGame
            statements={TRUE_FALSE_STATEMENTS}
            onCorrectAnswer={handleTrueFalseCorrect}
            onAwardXP={handleAwardXP}
            onMissionComplete={handleMissionComplete}
            onNavigateNext={handleSelectMode}
          />
        )}

        {currentMode === 'FACT_MYTH' && (
          <FactMythSorter
            items={FACT_MYTH_ITEMS}
            onCorrectSort={handleFactMythCorrect}
            onAwardXP={handleAwardXP}
            onMissionComplete={handleMissionComplete}
            onNavigateNext={handleSelectMode}
          />
        )}

        {currentMode === 'CASE_QUIZ' && (
          <CaseQuiz
            cases={DETECTIVE_CASES}
            onSolveCase={handleCaseSolved}
            onAwardXP={handleAwardXP}
            onMissionComplete={handleMissionComplete}
            onNavigateNext={handleSelectMode}
          />
        )}

        {currentMode === 'UV_INDEX_LAB' && (
          <UVIndexLab
            onAwardXP={handleAwardXP}
            onCompleteLab={handleCompleteLab}
            onMissionComplete={handleMissionComplete}
            onNavigateNext={handleSelectMode}
          />
        )}

        {currentMode === 'DOSSIER' && (
          <DetectiveDossier
            stats={stats}
            badges={BADGES}
            rankTitle={rankTitle}
            onUpdateName={handleUpdateName}
          />
        )}
      </main>

      {/* Floating XP / Badge Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 fade-in duration-200 max-w-sm">
          <div className="bg-slate-900 border border-amber-400/50 text-slate-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="leading-snug">{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white ml-auto p-0.5 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Clean Editorial Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-200">UV-detective</span>
            <span>·</span>
            <span>Interaktív Napvédelmi és Sugárzásbiztonsági Oktatójáték</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span>Készítette: <strong className="text-slate-200">Mítoszirtók: UV edition</strong></span>
            <span>·</span>
            <span>WHO & HungaroMet Orvosi Irányelvek Alapján</span>
            <span>·</span>
            <span>2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
