export type GameMode = 
  | 'HUB'
  | 'SCENE_INSPECTOR'
  | 'TRUE_FALSE'
  | 'FACT_MYTH'
  | 'CASE_QUIZ'
  | 'UV_INDEX_LAB'
  | 'DOSSIER';

export const MISSION_SEQUENCE: GameMode[] = [
  'TRUE_FALSE',
  'FACT_MYTH',
  'CASE_QUIZ',
  'UV_INDEX_LAB'
];

export interface MissionMeta {
  mode: GameMode;
  number: number;
  title: string;
  shortTitle: string;
  unlockCriteria: string;
}

export const MISSION_DETAILS: Record<string, MissionMeta> = {
  TRUE_FALSE: {
    mode: 'TRUE_FALSE',
    number: 1,
    title: '1. Küldetés · Gyanús Állítások',
    shortTitle: '1. Igaz vagy Hamis',
    unlockCriteria: '1. Kezdő küldetés (Nyitva)'
  },
  FACT_MYTH: {
    mode: 'FACT_MYTH',
    number: 2,
    title: '2. Küldetés · Tény vagy Tévhit',
    shortTitle: '2. Tény vagy Tévhit',
    unlockCriteria: 'Teljesítsd az 1. Küldetést (Gyanús Állítások) a feloldáshoz!'
  },
  CASE_QUIZ: {
    mode: 'CASE_QUIZ',
    number: 3,
    title: '3. Küldetés · Esetvizsgálat',
    shortTitle: '3. Esetek',
    unlockCriteria: 'Teljesítsd a 2. Küldetést (Tény vagy Tévhit) a feloldáshoz!'
  },
  UV_INDEX_LAB: {
    mode: 'UV_INDEX_LAB',
    number: 4,
    title: '4. Küldetés · UV-Index Labor',
    shortTitle: '4. UV-Labor',
    unlockCriteria: 'Teljesítsd a 3. Küldetést (Rejtélyes esetek megoldása) a feloldáshoz!'
  }
};

export interface Hotspot {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  radius: number; // percentage
  title: string;
  hazardType: 'REFLEXIÓ' | 'HIÁNYOS_VÉDELEM' | 'CSÚCSIDŐ' | 'UVA_VESZÉLY' | 'LEJÁRT_TERMÉK';
  severity: 'MAGAS' | 'EXTRÉM' | 'KRITIKUS';
  description: string;
  forensicNote: string;
  preventionTip: string;
}

export interface InspectionScene {
  id: string;
  title: string;
  location: string;
  timeOfDay: string;
  temperature: string;
  uvIndexRecorded: number;
  image: string;
  briefing: string;
  hotspots: Hotspot[];
}

export interface TrueFalseStatement {
  id: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
  category: 'KÖRNYEZET' | 'BŐRVÉDELEM' | 'EGÉSZSÉGÜGY' | 'FIZIKA';
}

export interface FactOrMythItem {
  id: string;
  statement: string;
  isFact: boolean;
  revealText: string;
  scientificSource: string;
}

export interface CaseQuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface DetectiveCase {
  id: string;
  caseNumber: string;
  title: string;
  victimProfile: string;
  incidentLocation: string;
  reportBrief: string;
  mysteryQuestion: string;
  options: CaseQuizOption[];
  investigationTakeaway: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
}

export interface PlayerStats {
  name: string;
  xp: number;
  completedMissions: GameMode[];
  scenesCompleted: string[];
  hotspotsFoundCount: number;
  trueFalseCorrectCount: number;
  factMythCorrectCount: number;
  casesSolvedCount: number;
  uvLabCompleted: boolean;
  unlockedBadgeIds: string[];
}
