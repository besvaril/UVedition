import React, { useState } from 'react';
import { GameMode, InspectionScene, Hotspot } from '../types/game';
import { playSound } from '../utils/audio';
import { 
  Eye, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Thermometer, 
  Sun, 
  ChevronRight,
  Info
} from 'lucide-react';

interface SceneInspectorProps {
  scenes: InspectionScene[];
  discoveredHotspots: string[];
  onDiscoverHotspot: (hotspotId: string, sceneId: string) => void;
  onAwardXP: (amount: number, reason: string) => void;
  onMissionComplete: (mode: GameMode) => void;
  onNavigateNext: (nextMode: GameMode) => void;
}

export const SceneInspector: React.FC<SceneInspectorProps> = ({
  scenes,
  discoveredHotspots,
  onDiscoverHotspot,
  onAwardXP,
  onMissionComplete,
  onNavigateNext
}) => {
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [uvModeActive, setUvModeActive] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  const scene = scenes[selectedSceneIndex];
  const totalHotspots = scene.hotspots.length;
  const foundInScene = scene.hotspots.filter(h => discoveredHotspots.includes(h.id)).length;
  const isSceneFullySolved = foundInScene === totalHotspots;

  const handleSelectHotspot = (hotspot: Hotspot) => {
    setActiveHotspot(hotspot);
    const isNew = !discoveredHotspots.includes(hotspot.id);
    if (isNew) {
      playSound('CLUE');
      onDiscoverHotspot(hotspot.id, scene.id);
      onAwardXP(50, `Bűnjel azonosítva: ${hotspot.title}`);

      // If this was the last hotspot in the scene
      if (foundInScene + 1 === totalHotspots) {
        onMissionComplete('SCENE_INSPECTOR');
      }
    } else {
      playSound('CLICK');
    }
  };

  const handleToggleUv = () => {
    playSound('SCAN');
    setUvModeActive(!uvModeActive);
  };

  const handleChangeScene = (index: number) => {
    playSound('CLICK');
    setSelectedSceneIndex(index);
    setActiveHotspot(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Scene Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
            1. Vizsgálati Mód · Képes Helyszínelemzés
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-1">
            UV-Helyszínelő Laboratórium
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Kutasd át a fotókat gyanús sugárzási pontok, veszélyes visszaverődések és hibás védelmi eszközök után. Kapcsold be az UV-spektrum szűrőt a rejtett kockázatok kiemeléséhez!
          </p>
        </div>

        {/* Scene Tabs (Interactive segmented buttons) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
          {scenes.map((s, idx) => {
            const isCompleted = s.hotspots.every(h => discoveredHotspots.includes(h.id));
            return (
              <button
                key={s.id}
                onClick={() => handleChangeScene(idx)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedSceneIndex === idx
                    ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{s.title.replace(' A ', '').replace(' Eset', '')}</span>
                {isCompleted && (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${selectedSceneIndex === idx ? 'text-slate-950' : 'text-emerald-400'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sequential Mission Completion Callout */}
      {isSceneFullySolved && (
        <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                1. Küldetés Teljesítve! A 2. Küldetés megnyílt!
              </h4>
              <p className="text-xs text-emerald-200/90">
                Sikeresen felderítetted az összes bűnjelet. Továbbléphetsz a Gyanús Állítások (Igaz vagy Hamis) vizsgálatra!
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateNext('TRUE_FALSE')}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>Tovább a 2. Küldetésre</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Investigation Canvas + Sidebar Briefing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Image Frame (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-3">
          {/* View Controls Toolbar */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{scene.location}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{scene.timeOfDay}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-orange-400" />
                <span>Mért UV-index: <strong className="text-white font-dossier">{scene.uvIndexRecorded}</strong></span>
              </span>
            </div>

            {/* UV Filter Toggle Button */}
            <button
              onClick={handleToggleUv}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                uvModeActive
                  ? 'bg-purple-600/30 text-purple-200 border-purple-500 shadow-lg shadow-purple-500/20'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              <span>{uvModeActive ? 'UV Spektrum Lencse: BE' : 'UV Spektrum Lencse: KI'}</span>
            </button>
          </div>

          {/* Photographic Investigation Board */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl group select-none">
            {/* Visual Image with Fallback */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
              <img
                src={scene.image}
                alt={scene.title}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-all duration-300 ${
                  uvModeActive ? 'brightness-90 contrast-125 saturate-150 filter hue-rotate-260' : ''
                }`}
                onError={(e) => {
                  // Fallback container
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-8 text-center">
                        <svg class="w-12 h-12 text-amber-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        <h4 class="font-bold text-white mb-1">${scene.title}</h4>
                        <p class="text-xs max-w-sm">${scene.briefing}</p>
                      </div>
                    `;
                  }
                }}
              />

              {/* Overlay HUD Scanlines when UV filter is active */}
              {uvModeActive && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-purple-900/20 via-transparent to-purple-900/40 mix-blend-color-dodge">
                  <div className="w-full h-full opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
                  <div className="absolute top-3 left-3 text-[11px] font-dossier text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/50">
                    FORENSIC UV-SPECTRUM ACTIVE [315 - 400 nm]
                  </div>
                </div>
              )}

              {/* Hotspot Markers on Canvas */}
              {scene.hotspots.map((hotspot) => {
                const isFound = discoveredHotspots.includes(hotspot.id);
                const isSelected = activeHotspot?.id === hotspot.id;

                return (
                  <button
                    key={hotspot.id}
                    onClick={() => handleSelectHotspot(hotspot)}
                    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-950 scale-125 z-30'
                        : 'z-20 hover:scale-110'
                    }`}
                    title={hotspot.title}
                  >
                    {/* Visual Marker Pulse */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-colors ${
                        isFound
                          ? 'bg-emerald-500 text-white'
                          : uvModeActive
                          ? 'bg-amber-400 text-slate-950 animate-pulse ring-2 ring-purple-400'
                          : 'bg-amber-500/90 hover:bg-amber-400 text-slate-950'
                      }`}
                    >
                      {isFound ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        <span className="font-dossier">?</span>
                      )}
                    </div>

                    {/* Aura Wave on Unfound Hotspots in UV Mode */}
                    {uvModeActive && !isFound && (
                      <span className="absolute w-12 h-12 rounded-full border border-purple-400 animate-ping opacity-60 pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Image Footer: Found clues progress */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span>Feltárt UV-bűnjelek:</span>
                <strong className="text-white font-dossier font-semibold">
                  {foundInScene} / {totalHotspots}
                </strong>
              </span>

              <div className="flex items-center gap-2">
                {isSceneFullySolved ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Helyszínelés Lezárva!</span>
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-amber-400" />
                    <span>Kattints a gyanús pontokra a képen</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Evidence Dossier / Inspector Drawer (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Scene Briefing Dossier */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-dossier uppercase text-slate-400 tracking-wider">
                Helyszíni Jelentés
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                <span>{scene.temperature}</span>
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">{scene.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              {scene.briefing}
            </p>

            {/* Hotspots checklist in scene */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Nyomozói Nyomkereső Lista:
              </span>
              <div className="space-y-1">
                {scene.hotspots.map((h, i) => {
                  const isFound = discoveredHotspots.includes(h.id);
                  const isCur = activeHotspot?.id === h.id;
                  return (
                    <button
                      key={h.id}
                      onClick={() => handleSelectHotspot(h)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between transition-colors ${
                        isCur
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                          : isFound
                          ? 'bg-slate-950/40 text-slate-300 hover:bg-slate-800'
                          : 'bg-slate-950/20 text-slate-500 hover:text-slate-400'
                      }`}
                    >
                      <span className="truncate flex items-center gap-2">
                        <span className="font-dossier text-[10px] opacity-70">0{i + 1}.</span>
                        <span>{isFound ? h.title : 'Rejtett UV-veszélypont'}</span>
                      </span>
                      {isFound ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
                      ) : (
                        <span className="text-[10px] text-amber-400/80 font-dossier shrink-0">Keresd!</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Evidence Inspection Dossier */}
          {activeHotspot ? (
            <div className="bg-slate-900 border border-amber-400/40 rounded-xl p-5 space-y-3.5 shadow-xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-400 font-semibold font-dossier tracking-wider">
                  VESZÉLYFORRÁS #0{scene.hotspots.indexOf(activeHotspot) + 1}
                </span>
                <span className="text-xs text-rose-400 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Kockázat: {activeHotspot.severity}</span>
                </span>
              </div>

              <h4 className="text-base font-bold text-white">{activeHotspot.title}</h4>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Helyszíni Lelet:</span>
                  <p className="text-slate-200 leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-800">
                    {activeHotspot.description}
                  </p>
                </div>

                <div>
                  <span className="text-amber-300 font-semibold block mb-0.5">Tudományos Elemzés:</span>
                  <p className="text-slate-300 leading-relaxed bg-slate-950/80 p-2.5 rounded border border-slate-800">
                    {activeHotspot.forensicNote}
                  </p>
                </div>

                <div className="pt-1">
                  <span className="text-emerald-400 font-semibold block mb-0.5">Detektív Védelmi Protokoll:</span>
                  <p className="text-emerald-200 leading-relaxed bg-emerald-950/30 p-2.5 rounded border border-emerald-900/50">
                    {activeHotspot.preventionTip}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 border-dashed rounded-xl p-6 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
              <Sparkles className="w-6 h-6 text-slate-500 mb-1" />
              <p className="font-medium text-slate-300">Nincs kiválasztott bűnjel</p>
              <p className="text-slate-500 max-w-xs">
                Kattints a fényképen lévő gyanús pontokra, vagy kapcsold be az UV Spektrum Lencsét!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
