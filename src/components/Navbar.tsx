import React from 'react';
import { GameMode, MISSION_DETAILS } from '../types/game';
import { Shield, Volume2, VolumeX, Award, Lock } from 'lucide-react';

interface NavbarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  xp: number;
  rankTitle: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  unlockedMissions: GameMode[];
  onLockedClick: (message: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  xp,
  rankTitle,
  soundEnabled,
  onToggleSound,
  unlockedMissions,
  onLockedClick
}) => {
  const navItems: { mode: GameMode; label: string }[] = [
    { mode: 'TRUE_FALSE', label: '1. Igaz vagy Hamis' },
    { mode: 'FACT_MYTH', label: '2. Tény vagy Tévhit' },
    { mode: 'CASE_QUIZ', label: '3. Esetek' },
    { mode: 'UV_INDEX_LAB', label: '4. UV-Labor' }
  ];

  const handleNavClick = (mode: GameMode) => {
    if (mode === 'HUB' || mode === 'DOSSIER' || unlockedMissions.includes(mode)) {
      onSelectMode(mode);
    } else {
      const meta = MISSION_DETAILS[mode];
      const prevMeta = Object.values(MISSION_DETAILS).find(m => m.number === meta.number - 1);
      onLockedClick(
        `A(z) ${meta.number}. Küldetés zárva van! Előbb teljesítsd a(z) ${prevMeta?.title || 'előző küldetést'}!`
      );
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Brand Wordmark (Single text element wordmark, no badges/subtitles) */}
        <button
          onClick={() => onSelectMode('HUB')}
          className="text-lg font-bold tracking-tight text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 text-left"
        >
          <Shield className="w-5 h-5 text-amber-400" />
          <span>UV-detective</span>
        </button>

        {/* Zone 2: Navigation Links (single line, clean hover underlines) */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectMode('HUB')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentMode === 'HUB' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Főhadiszállás
          </button>

          {navItems.map((item) => {
            const isUnlocked = unlockedMissions.includes(item.mode);
            const isActive = currentMode === item.mode;

            return (
              <button
                key={item.mode}
                onClick={() => handleNavClick(item.mode)}
                className={`whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'text-amber-400 font-semibold'
                    : isUnlocked
                    ? 'text-slate-300 hover:text-white'
                    : 'text-slate-500 hover:text-slate-400 cursor-not-allowed opacity-75'
                }`}
                title={isUnlocked ? item.label : `${item.label} (Zárolt - teljesítsd az előző küldetést!)`}
              >
                {!isUnlocked && <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + Audio Switch */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Hanghatások némítása' : 'Hanghatások bekapcsolása'}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-md transition-colors"
            title={soundEnabled ? 'Hanghatások bekapcsolva' : 'Hanghatások kikapcsolva'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={() => onSelectMode('DOSSIER')}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <Award className="w-4 h-4" />
            <span>{rankTitle} · <span className="font-dossier">{xp} XP</span></span>
          </button>
        </div>
      </div>
    </header>
  );
};
