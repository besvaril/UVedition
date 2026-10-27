import React, { useState } from 'react';
import { playSound } from '../utils/audio';
import { 
  Sun, 
  Shield, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { GameMode } from '../types/game';

interface UVIndexLabProps {
  onAwardXP: (amount: number, reason: string) => void;
  onCompleteLab: () => void;
  onMissionComplete: (mode: GameMode) => void;
  onNavigateNext: (nextMode: GameMode) => void;
}

type SkinType = 1 | 2 | 3 | 4 | 5 | 6;

interface SkinProfile {
  type: SkinType;
  name: string;
  description: string;
  baseBurnMinutes: number; // At UV Index 10
}

const SKIN_PROFILES: SkinProfile[] = [
  {
    type: 1,
    name: 'I. Típus (Nagyon Világos)',
    description: 'Fehér/szeplős bőr, vörös vagy szőke haj, kék szem. Mindig leég, sosem barnul.',
    baseBurnMinutes: 10
  },
  {
    type: 2,
    name: 'II. Típus (Világos)',
    description: 'Világos bőr, szőke/világosbarna haj. Gyakran leég, nehezen és lassan barnul.',
    baseBurnMinutes: 15
  },
  {
    type: 3,
    name: 'III. Típus (Közép-Európai)',
    description: 'Bézs/világosbarna bőr, sötétszőke/barna haj. Enyhén ég le, fokozatosan barnul.',
    baseBurnMinutes: 20
  },
  {
    type: 4,
    name: 'IV. Típus (Mediterrán)',
    description: 'Olíva/barna bőr, sötétbarna haj, barna szem. Ritkán ég le, gyorsan és mélyen barnul.',
    baseBurnMinutes: 30
  },
  {
    type: 5,
    name: 'V. Típus (Sötétbarna)',
    description: 'Közel-keleti, dél-ázsiai sötét bőr. Nagyon ritkán ég le, azonnal mélyen barnul.',
    baseBurnMinutes: 45
  },
  {
    type: 6,
    name: 'VI. Típus (Mélybarna / Fekete)',
    description: 'Afrikai típusú pigmentált bőr. Soha nem ég le láthatóan, de a mély DNS-károsodás őket is érinti.',
    baseBurnMinutes: 60
  }
];

const SURFACES = [
  { id: 'grass', name: 'Zöld Fű / Talaj', reflectionBonus: 0.03, description: 'Alacsony visszaverődés (+3%)' },
  { id: 'asphalt', name: 'Városi Aszfalt & Beton', reflectionBonus: 0.10, description: 'Mérsékelt reflexió (+10%)' },
  { id: 'sand', name: 'Strandhomok', reflectionBonus: 0.18, description: 'Észrevehető tükrözés (+18%)' },
  { id: 'water', name: 'Nyílt Vízfelszín', reflectionBonus: 0.25, description: 'Erős víztükör (+25%)' },
  { id: 'snow', name: 'Friss Hótakaró', reflectionBonus: 0.85, description: 'Extrém reflexió (+85%)' }
];

const MONTHS = [
  { name: 'Január', baseUv: 1.2 },
  { name: 'Február', baseUv: 2.1 },
  { name: 'Március', baseUv: 3.8 },
  { name: 'Április', baseUv: 5.4 },
  { name: 'Május', baseUv: 6.9 },
  { name: 'Június', baseUv: 8.2 },
  { name: 'Július', baseUv: 8.7 },
  { name: 'Augusztus', baseUv: 7.6 },
  { name: 'Szeptember', baseUv: 5.2 },
  { name: 'Október', baseUv: 3.1 },
  { name: 'November', baseUv: 1.5 },
  { name: 'December', baseUv: 0.9 }
];

export const UVIndexLab: React.FC<UVIndexLabProps> = ({ 
  onAwardXP, 
  onCompleteLab,
  onMissionComplete,
  onNavigateNext
}) => {
  // Simulator State
  const [selectedSkinType, setSelectedSkinType] = useState<SkinType>(2);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(6); // July
  const [timeHour, setTimeHour] = useState(13); // 13:00
  const [altitudeMeters, setAltitudeMeters] = useState(100);
  const [selectedSurfaceId, setSelectedSurfaceId] = useState('water');
  
  // Protective gear
  const [hasSunscreen50, setHasSunscreen50] = useState(false);
  const [hasSunscreen30, setHasSunscreen30] = useState(false);
  const [hasHat, setHasHat] = useState(false);
  const [hasShade, setHasShade] = useState(false);
  const [hasSunglasses, setHasSunglasses] = useState(false);

  // Lab Challenge Mini-Quiz
  const [activeTab, setActiveTab] = useState<'SIMULATOR' | 'CHALLENGE'>('SIMULATOR');
  const [challengeAnswers, setChallengeAnswers] = useState<Record<number, number>>({});
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);

  // Calculate Base Solar Angle UV
  const currentMonth = MONTHS[selectedMonthIdx];
  const hourDiffFromNoon = Math.abs(timeHour - 13);
  const diurnalFactor = Math.max(0.1, 1 - (hourDiffFromNoon * hourDiffFromNoon) / 36);
  
  const baseSolarUv = currentMonth.baseUv * diurnalFactor;
  const altitudeFactor = 1 + (altitudeMeters / 1000) * 0.11; // +11% per 1000m
  const currentSurface = SURFACES.find(s => s.id === selectedSurfaceId)!;
  const surfaceReflectionFactor = 1 + currentSurface.reflectionBonus;

  // Effective Environmental UV Index
  const rawCalculatedUv = baseSolarUv * altitudeFactor * surfaceReflectionFactor;
  const effectiveUv = Math.min(14, Math.max(0.2, Number(rawCalculatedUv.toFixed(1))));

  // Burn time calculations (MED - Minimal Erythema Dose)
  const currentProfile = SKIN_PROFILES.find(p => p.type === selectedSkinType)!;
  const safeMinutesUnprotected = Math.max(3, Math.round((currentProfile.baseBurnMinutes * 10) / effectiveUv));

  // Protection multiplier
  let protectionMultiplier = 1;
  if (hasSunscreen50) protectionMultiplier *= 15;
  else if (hasSunscreen30) protectionMultiplier *= 10;
  if (hasHat) protectionMultiplier *= 1.4;
  if (hasShade) protectionMultiplier *= 2.0;

  const safeMinutesProtected = Math.min(480, Math.round(safeMinutesUnprotected * protectionMultiplier));

  // UV Categories WHO
  const getUvCategory = (val: number) => {
    if (val < 3) return { label: 'Alacsony', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', barBg: 'bg-emerald-500' };
    if (val < 6) return { label: 'Mérsékelt', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', barBg: 'bg-yellow-500' };
    if (val < 8) return { label: 'Magas', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/30', barBg: 'bg-amber-500' };
    if (val < 11) return { label: 'Nagyon Magas', color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/30', barBg: 'bg-rose-500' };
    return { label: 'Extrém Veszélyes', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30', barBg: 'bg-purple-500' };
  };

  const uvCategory = getUvCategory(effectiveUv);

  // Challenge Quiz Data
  const challengeQuestions = [
    {
      id: 1,
      q: 'Egy nagyon világos (I. típusú) bőrű ember UV-index 9-nél mennyi idő alatt szerezhet napégést fényvédelem nélkül?',
      options: ['10-15 perc alatt', 'Körülbelül 2 óra alatt', 'Soha, ha fúj a szél'],
      correct: 0,
      note: 'I. típusú bőrnél UV 9-10 mellett a minimális leégési idő (MED) alig 10-12 perc!'
    },
    {
      id: 2,
      q: 'Milyen UV-index értéktől írja elő a WHO a szigorú védekezést (fényvédő krém, napszemüveg, sapka)?',
      options: ['UV-index 1 felett', 'UV-index 3-tól felfelé', 'Csak UV-index 8 felett'],
      correct: 1,
      note: 'A WHO ajánlása szerint az UV-index 3 (mérsékelt) felett már kötelező az aktív védekezés.'
    },
    {
      id: 3,
      q: 'A felsorolt felületek közül melyik veri vissza a legtöbb UV-sugarat (akár 80-85%-ot)?',
      options: ['Tengerparti homok', 'Zöld pázsit', 'Friss hótakaró'],
      correct: 2,
      note: 'A friss hó reflexiója extrém (80-85%), ami szinte megduplázza a testet érő sugárterhelést.'
    },
    {
      id: 4,
      q: 'Hogyan változik az UV-sugárzás a tengerszint feletti magasság emelkedésével?',
      options: ['Minden 1000 méteren kb. 10-12%-kal nő', 'A magasban csökken, mert ott hidegebb van', 'Nem változik, független a magasságtól'],
      correct: 0,
      note: 'A vékonyabb légköri réteg miatt az UV sugárzás minden 1000 méteren 10-12%-kal intenzívebb.'
    }
  ];

  const handleSubmitChallenge = () => {
    let correct = 0;
    challengeQuestions.forEach(q => {
      if (challengeAnswers[q.id] === q.correct) correct++;
    });

    setChallengeSubmitted(true);
    if (correct >= 3) {
      playSound('SUCCESS');
      onAwardXP(80, 'UV-Index Elemzési Kihívás teljesítve');
      onCompleteLab();
      onMissionComplete('UV_INDEX_LAB');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      playSound('ERROR');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
            4. Küldetés · UV-Index Laboratórium
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-1">
            UV-Index Kalkulátor & Értelmező
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Kísérletezz a napszakkal, a tengerszint feletti magassággal, a környezeti visszaverődéssel és a bőrtípusokkal! Értsd meg az UV-index tudományos jelentését!
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => { playSound('CLICK'); setActiveTab('SIMULATOR'); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'SIMULATOR'
                ? 'bg-amber-400 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Interaktív Szimulátor
          </button>
          <button
            onClick={() => { playSound('CLICK'); setActiveTab('CHALLENGE'); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'CHALLENGE'
                ? 'bg-amber-400 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Detektív Teszt
          </button>
        </div>
      </div>

      {activeTab === 'SIMULATOR' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 space-y-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            {/* 1. Month & Time */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                1. Dátum & Napszak Beállítása
              </label>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Hónap:</span>
                  <select
                    value={selectedMonthIdx}
                    onChange={(e) => setSelectedMonthIdx(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-400 focus:outline-none"
                  >
                    {MONTHS.map((m, i) => (
                      <option key={m.name} value={i}>
                        {m.name} (Alap UV: {m.baseUv})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">
                    Időpont: <strong className="text-white font-dossier">{timeHour}:00 óra</strong>
                  </span>
                  <input
                    type="range"
                    min="8"
                    max="18"
                    step="1"
                    value={timeHour}
                    onChange={(e) => setTimeHour(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-dossier">
                    <span>08:00</span>
                    <span className="text-amber-400 font-semibold">13:00 (Csúcs)</span>
                    <span>18:00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Skin Type Selection */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                2. Fitzpatrick Bőrtípus
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SKIN_PROFILES.map((profile) => (
                  <button
                    key={profile.type}
                    onClick={() => { playSound('CLICK'); setSelectedSkinType(profile.type); }}
                    className={`p-2.5 rounded-lg text-left border transition-all text-xs ${
                      selectedSkinType === profile.type
                        ? 'bg-amber-400/20 border-amber-400 text-amber-200 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-semibold block">{profile.name.split(' ')[0]} {profile.name.split(' ')[1]}</span>
                    <span className="text-[10px] opacity-80 block truncate">{profile.name.split('(')[1]?.replace(')', '')}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800/80">
                {currentProfile.description}
              </p>
            </div>

            {/* 3. Surface & Altitude */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                3. Környezet & Tengerszint Feletti Magasság
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Talajfelület / Reflexió:</span>
                  <select
                    value={selectedSurfaceId}
                    onChange={(e) => setSelectedSurfaceId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-400 focus:outline-none"
                  >
                    {SURFACES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.description})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">
                    Magasság: <strong className="text-white font-dossier">{altitudeMeters} méter</strong>
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="3000"
                    step="100"
                    value={altitudeMeters}
                    onChange={(e) => setAltitudeMeters(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-dossier">
                    <span>0 m (Tenger)</span>
                    <span>1500 m</span>
                    <span>3000 m (Alpok)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Protective Gear Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                4. Alkalmazott Védelmi Intézkedések
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => { playSound('CLICK'); setHasSunscreen50(!hasSunscreen50); if (!hasSunscreen50) setHasSunscreen30(false); }}
                  className={`p-2 rounded-lg text-xs font-medium border text-left transition-colors flex items-center gap-2 ${
                    hasSunscreen50 ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>SPF 50+ Naptej</span>
                </button>

                <button
                  onClick={() => { playSound('CLICK'); setHasSunscreen30(!hasSunscreen30); if (!hasSunscreen30) setHasSunscreen50(false); }}
                  className={`p-2 rounded-lg text-xs font-medium border text-left transition-colors flex items-center gap-2 ${
                    hasSunscreen30 ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>SPF 30 Naptej</span>
                </button>

                <button
                  onClick={() => { playSound('CLICK'); setHasHat(!hasHat); }}
                  className={`p-2 rounded-lg text-xs font-medium border text-left transition-colors flex items-center gap-2 ${
                    hasHat ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Széles Kalap</span>
                </button>

                <button
                  onClick={() => { playSound('CLICK'); setHasShade(!hasShade); }}
                  className={`p-2 rounded-lg text-xs font-medium border text-left transition-colors flex items-center gap-2 ${
                    hasShade ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Fedett Árnyék</span>
                </button>

                <button
                  onClick={() => { playSound('CLICK'); setHasSunglasses(!hasSunglasses); }}
                  className={`p-2 rounded-lg text-xs font-medium border text-left transition-colors flex items-center gap-2 ${
                    hasSunglasses ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>UV400 Szemüveg</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Big UV Index Gauge Card */}
            <div className={`p-6 rounded-2xl border ${uvCategory.bg} space-y-4 shadow-xl`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-dossier uppercase tracking-wider text-slate-400">
                  EFFEKTÍV UV-INDEX ÉRTÉK
                </span>
                <span className={`text-xs font-bold uppercase ${uvCategory.color}`}>
                  {uvCategory.label}
                </span>
              </div>

              {/* Huge Number */}
              <div className="flex items-baseline gap-3">
                <span className={`text-5xl md:text-6xl font-extrabold font-dossier ${uvCategory.color}`}>
                  {effectiveUv}
                </span>
                <span className="text-sm text-slate-400">
                  / 12+ Nemzetközi Skála
                </span>
              </div>

              {/* Progress Scale Bar */}
              <div className="space-y-1">
                <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full ${uvCategory.barBg} transition-all duration-300`}
                    style={{ width: `${Math.min(100, (effectiveUv / 12) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-dossier">
                  <span>0 (Zöld)</span>
                  <span>3 (Sárga)</span>
                  <span>6 (Narancs)</span>
                  <span>8 (Piros)</span>
                  <span>11+ (Lila)</span>
                </div>
              </div>
            </div>

            {/* Exposure Time Comparison Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <span className="text-xs font-dossier uppercase tracking-wider text-slate-400 block">
                Számított Leégési Idő (MED Elemzés)
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-rose-400 uppercase font-semibold block mb-0.5">
                    Védelem Nélkül:
                  </span>
                  <span className="text-2xl font-bold text-white font-dossier">
                    ~{safeMinutesUnprotected} perc
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Ennyi idő után kezdődik a sejt-DNS égése
                  </span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-emerald-400 uppercase font-semibold block mb-0.5">
                    Alkalmazott Védelemmel:
                  </span>
                  <span className="text-2xl font-bold text-emerald-400 font-dossier">
                    {safeMinutesProtected >= 480 ? 'Egész nap' : `~${safeMinutesProtected} perc`}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    (2 óránkénti újrakrémezéssel)
                  </span>
                </div>
              </div>

              {/* Detective Warning / Protocol */}
              <div className="pt-2 border-t border-slate-800 text-xs space-y-2">
                <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Detektív Védelmi Protokoll erre a szintre:</span>
                </span>
                <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {effectiveUv >= 8 ? (
                    'Extrém UV kockázat! 11:00 és 15:00 között maradj fedett épületben. Kültéren azonnal kötelező az SPF 50+, UV400 polarizált napszemüveg és tarkót védő fejfedő viselése.'
                  ) : effectiveUv >= 6 ? (
                    'Magas sugárzás! Déli órákban kerüld a közvetlen napot. Fényvédő használata 2 óránként elengedhetetlen, árnyékban is ér a szórt sugárzás.'
                  ) : effectiveUv >= 3 ? (
                    'Mérsékelt UV-szint. Délidőben viselj kalapot és napszemüveget, érzékeny bőr esetén SPF 30 krém javasolt.'
                  ) : (
                    'Alacsony kockázat. A normál szabadtéri tartózkodás biztonságos, de havas hegycsúcson vagy közvetlen víztükörnél ilyenkor is védd a szemed!'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Detektív UV-Index Elemzési Kihívás Mini-Quiz */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">UV-Index Elemzési Vizsga</h2>
            <p className="text-xs text-slate-400">
              Válaszolj a 4 szakmai kérdésre az UV-index és a sugárzási összefüggések alapján a rangod megerősítéséhez!
            </p>
          </div>

          <div className="space-y-6 pt-2">
            {challengeQuestions.map((q, qIdx) => (
              <div key={q.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-dossier text-amber-400 font-semibold block">
                  KÉRDÉS 0{qIdx + 1} / 04
                </span>
                <h3 className="text-sm font-semibold text-white leading-relaxed">
                  {q.q}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = challengeAnswers[q.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        disabled={challengeSubmitted}
                        onClick={() => {
                          playSound('CLICK');
                          setChallengeAnswers({ ...challengeAnswers, [q.id]: optIdx });
                        }}
                        className={`p-3 rounded-lg text-xs text-left border transition-all ${
                          isSelected
                            ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {challengeSubmitted && (
                  <div className={`p-2.5 rounded text-xs flex items-center gap-2 ${
                    challengeAnswers[q.id] === q.correct
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/50'
                      : 'bg-rose-950/40 text-rose-300 border border-rose-900/50'
                  }`}>
                    {challengeAnswers[q.id] === q.correct ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{q.note}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!challengeSubmitted ? (
            <button
              onClick={handleSubmitChallenge}
              disabled={Object.keys(challengeAnswers).length < challengeQuestions.length}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                Object.keys(challengeAnswers).length === challengeQuestions.length
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer shadow-lg shadow-amber-950/50'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Válaszok Értékelése és Ellenőrzés</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      4. Küldetés Sikeresen Teljesítve!
                    </h4>
                    <p className="text-xs text-emerald-200/90">
                      Mind a 4 vizsgálati állomást teljesítettél. Kiérdemelted a Hivatalos UV-Detektív Oklevelet!
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateNext('DOSSIER')}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Oklevél Átvétele</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                <span>A teszt lezárult. Sikeres vizsga esetén az XP jóváírásra került!</span>
                <button
                  onClick={() => {
                    setChallengeSubmitted(false);
                    setChallengeAnswers({});
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer"
                >
                  Teszt Újrapróbálása
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
