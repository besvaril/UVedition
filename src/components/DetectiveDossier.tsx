import React, { useState } from 'react';
import { PlayerStats, Badge } from '../types/game';
import { playSound } from '../utils/audio';
import { 
  Award, 
  ShieldCheck, 
  Search, 
  Zap, 
  Gauge, 
  Sparkles, 
  Printer, 
  User, 
  CheckCircle2, 
  Lock,
  Calendar,
  Shield
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DetectiveDossierProps {
  stats: PlayerStats;
  badges: Badge[];
  rankTitle: string;
  onUpdateName: (newName: string) => void;
}

export const DetectiveDossier: React.FC<DetectiveDossierProps> = ({
  stats,
  badges,
  rankTitle,
  onUpdateName
}) => {
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(stats.name);
  const [showCertificate, setShowCertificate] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateName(tempName.trim());
      setEditingName(false);
      playSound('SUCCESS');
    }
  };

  const handleOpenCertificate = () => {
    playSound('BADGE');
    setShowCertificate(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search': return <Search className="w-5 h-5 text-amber-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'Award': return <Award className="w-5 h-5 text-cyan-400" />;
      case 'Gauge': return <Gauge className="w-5 h-5 text-purple-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-rose-400" />;
      default: return <Award className="w-5 h-5 text-amber-400" />;
    }
  };

  const todayFormatted = new Intl.DateTimeFormat('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Dossier Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
            Központi Nyilvántartás · Ügyiratok
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-1">
            UV-Nyomozói Dosszié
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mt-1">
            Kövesd nyomon nyomozói előmeneteledet, megszerzett érdemrendjeidet és vizsgáld meg a hivatalos detektív okleveledet!
          </p>
        </div>

        {/* Certificate Button */}
        <button
          onClick={handleOpenCertificate}
          className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-amber-950/40 shrink-0"
        >
          <Award className="w-4 h-4 text-slate-950" />
          <span>Hivatalos Oklevél Megtekintése</span>
        </button>
      </div>

      {/* Detective Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0">
              <Shield className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              {editingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    maxLength={30}
                    className="bg-slate-950 border border-slate-700 text-white text-base rounded px-2.5 py-1 focus:border-amber-400 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-semibold rounded hover:bg-amber-300"
                  >
                    Mentés
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    {stats.name}
                  </h2>
                  <button
                    onClick={() => { playSound('CLICK'); setEditingName(true); }}
                    className="text-xs text-slate-400 hover:text-amber-400 underline ml-1"
                  >
                    (Név módosítása)
                  </button>
                </div>
              )}

              <p className="text-xs font-semibold text-amber-400 flex items-center gap-2">
                <span>Nyomozói Rang:</span>
                <span className="text-white font-dossier bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {rankTitle}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-right shrink-0">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">
              Összegyűjtött Tapasztalat
            </span>
            <span className="text-2xl font-bold text-amber-400 font-dossier">
              {stats.xp} XP
            </span>
          </div>
        </div>

        {/* Investigation Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Teljesített Küldetések</span>
            <span className="text-lg font-bold text-amber-400 font-dossier">{stats.completedMissions.length} / 4 kész</span>
          </div>
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Igaz/Hamis Eredmény</span>
            <span className="text-lg font-bold text-white font-dossier">{stats.trueFalseCorrectCount} helyes</span>
          </div>
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Szortírozott Tények</span>
            <span className="text-lg font-bold text-white font-dossier">{stats.factMythCorrectCount} tény</span>
          </div>
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Lezárt Ügyek</span>
            <span className="text-lg font-bold text-white font-dossier">{stats.casesSolvedCount} akták</span>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Megszerezhető Érdemrendek & Jelvények</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const isUnlocked = stats.unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-slate-900 border-amber-400/40 text-slate-200 shadow-md'
                    : 'bg-slate-950/50 border-slate-800/80 text-slate-500 opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                    isUnlocked
                      ? 'bg-amber-400/10 border-amber-400/30'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}
                >
                  {isUnlocked ? getBadgeIcon(badge.iconName) : <Lock className="w-4 h-4 text-slate-600" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                      {badge.title}
                    </h4>
                    {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-950 border-2 border-amber-500/60 rounded-2xl max-w-2xl w-full p-6 md:p-10 shadow-2xl relative space-y-6 text-center">
            {/* Close button */}
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs font-semibold px-2.5 py-1 rounded bg-slate-900 border border-slate-800"
            >
              Bezárás
            </button>

            {/* Certificate Border Decor */}
            <div className="border border-amber-500/30 p-6 md:p-8 rounded-xl bg-slate-900/60 relative space-y-5">
              <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/50 flex items-center justify-center mx-auto shadow-lg shadow-amber-400/20">
                <Shield className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-dossier uppercase tracking-[0.25em] text-amber-400 block">
                  ORSZÁGOS UV-BŰNMEGELŐZÉSI HIVATAL · 2026
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide uppercase">
                  Detektív Tanúsítvány
                </h2>
                <p className="text-xs text-slate-400">
                  Ezennel igazoljuk, hogy az alábbi felügyelő kiemelkedő elméleti és gyakorlati ismereteket szerzett:
                </p>
              </div>

              <div className="py-2 border-y border-amber-500/20">
                <span className="text-2xl md:text-3xl font-extrabold text-amber-400 tracking-tight font-dossier block">
                  {stats.name}
                </span>
                <span className="text-xs font-semibold text-slate-300 block mt-1">
                  Kinevezett Rang: <strong className="text-white">{rankTitle}</strong> ({stats.xp} XP)
                </span>
              </div>

              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed italic">
                A nyomozó sikeresen azonosította a reflexiók, a szórt sugárzás, az UV-A mélyhatás és a csúcsidőszaki napsugárzás rejtett kockázatait, és felkészült a leégések megelőzésére.
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-[11px] text-slate-400">
                <div className="text-left">
                  <span>Kiadás Dátuma:</span>
                  <span className="text-slate-200 font-dossier block">{todayFormatted}</span>
                </div>
                <div className="text-center">
                  <span>Készítette:</span>
                  <span className="text-amber-400 font-semibold block">Mítoszirtók: UV edition</span>
                </div>
                <div className="text-right">
                  <span>Iktatószám:</span>
                  <span className="text-slate-200 font-dossier block">UV-CERT-{stats.xp}X</span>
                </div>
              </div>
            </div>

            {/* Print Action */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Oklevél Nyomtatása / PDF Mentése</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
