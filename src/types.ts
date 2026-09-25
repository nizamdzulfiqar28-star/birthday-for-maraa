export interface AppConfig {
  girlfriendName: string;
  birthdayDate: string;
  heroPhoto: string;
  photo1: string;
  photo2: string;
  photo3: string;
  music: string;
  kadoMusic?: string;
  suratMusic?: string;
}

export type AudioTrackType = 'default' | 'kado' | 'surat';

export interface MemoryCard {
  id: number;
  pairId: number;
  emoji: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export type ScreenId = 
  | 'screen1_landing'
  | 'screen2_cake'
  | 'screen3_game'
  | 'screen4_calendar'
  | 'screen5_photos'
  | 'screen6_menu';

export type MenuModalType = 'none' | 'kado' | 'surat' | 'memories';
