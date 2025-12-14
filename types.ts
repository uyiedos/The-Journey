
import { LanguageCode } from './translations';

export enum AppView {
  AUTH = 'AUTH',
  LANDING = 'LANDING',
  GAME_LIBRARY = 'GAME_LIBRARY',
  MAP = 'MAP',
  GAME = 'GAME',
  VICTORY = 'VICTORY',
  JOURNAL = 'JOURNAL',
  DEVOTIONAL = 'DEVOTIONAL',
  PLANS = 'PLANS',
  TV = 'TV',
  BIBLE = 'BIBLE',
  LEADERBOARD = 'LEADERBOARD',
  WIKI = 'WIKI',
  TOKEN = 'TOKEN',
  PROFILE = 'PROFILE',
  SUPPORT = 'SUPPORT',
  ADMIN = 'ADMIN'
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface User {
  id: string; // Unique ID tied to account and avatar storage
  email: string;
  username: string;
  avatar: string;
  joinedDate: string;
  lastDailyClaim: number; // Timestamp
  badges: string[]; // Array of Badge IDs
  role?: 'user' | 'admin';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
}

export type GameModeId = 'pilgrim' | 'david' | 'paul';

export interface GameModeConfig {
  id: GameModeId;
  title: string;
  description: string;
  image: string;
  mapBackground: string;
  levels: LevelConfig[];
}

export enum MessageRole {
  GUIDE = 'model',
  USER = 'user',
  SYSTEM = 'system'
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  senderName?: string; // For multiplayer chat
  isScripture?: boolean;
}

export interface BibleContext {
  storyTitle: string;
  reference: string;
  character: string;
  narrativeIntro: string; // The specific situation the user steps into
  keyVerse: string; // The verse unlocked upon completion
  prayerFocus: string; // What the user should pray about
}

export interface LevelImages {
  landscape: string;
  character: string;
}

export interface LevelConfig {
  id: number;
  name: string;
  sin: string; // Or "Challenge" for other modes
  virtue: string;
  description: string;
  colorTheme: string; // Tailwind class for base block color
  accentColor: string;
  gridPattern: number[][]; // Simple 8x8 pixel art definition
  bibleContext: BibleContext;
  images: LevelImages;
}

export interface SupportMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: number;
}

export interface SupportTicket {
  id: string; // The unique token (e.g., #SUP-8821)
  subject: string;
  category: 'account' | 'bug' | 'spiritual' | 'billing' | 'other';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: number;
  lastUpdated: number;
  messages: SupportMessage[];
}

export interface BiblePlan {
  id: string;
  title: string;
  desc: string;
  category: 'Study' | 'Devotional' | 'Topical' | 'Custom';
  image: string;
  duration: number; // in days
  progress: number; // 0-100
  isActive: boolean;
  startDate?: string | null;
  endDate?: string | null;
  days?: { day: number; reading: string; topic: string; content?: string }[];
}

export interface GameState {
  user: User | null;
  totalPoints: number;
  activeGameId: GameModeId;
  progress: Record<GameModeId, number>; // Track unlocked level per game mode
  view: AppView;
  chatHistory: Record<string, Message[]>; // History key: gameId-levelId
  collectedVerses: string[]; // List of verses unlocked
  unlockedAchievements: string[]; // List of achievement IDs
  language: LanguageCode;
  supportTickets: SupportTicket[];
  plans: BiblePlan[]; // List of available and active plans
  rank: number; // Global leaderboard rank
}

export interface AIResponse {
  text: string;
  isSuccess: boolean;
  scriptureRef?: string;
}
