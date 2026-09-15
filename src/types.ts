export type ScreenType = 
  | 'login'
  | 'register'
  | 'forgot_password'
  | 'home'
  | 'calendar'
  | 'closet'
  | 'camera'
  | 'stylist'
  | 'profile';

export type CategoryKey = 'all' | 'ust' | 'alt' | 'dis' | 'ayakkabi' | 'aksesuar';

export interface ClothingItem {
  id: string;
  name: string;
  brand: string;
  colorName: string;
  colorHex: string;
  category: 'ust' | 'alt' | 'dis' | 'ayakkabi' | 'aksesuar';
  season: 'Yazlık' | 'Kışlık' | 'Sonbahar' | 'İlkbahar / Sonbahar' | 'İlkbahar / Yaz' | 'Sonbahar / Kış' | '4 Mevsim';
  styleSegment: string;
  wearCount: number;
  lastWorn: string;
  image: string;
  isFavorite: boolean;
  matchNote?: string;
}

export interface AccessoryItem {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  image: string;
}

export interface OutfitGarment {
  id: string;
  name: string;
  category: 'ust' | 'alt' | 'dis' | 'ayakkabi' | 'aksesuar';
  brand: string;
  colorName: string;
  colorHex: string;
  image: string;
}

export interface Outfit {
  id: string;
  title: string;
  contextLocation: string;
  temperature: string;
  weatherCondition: string;
  matchPercentage: number;
  image: string;
  mannequinImage?: string;
  garments?: OutfitGarment[];
  items: {
    name: string;
    color: string;
    dotColor: string;
    category?: string;
    image?: string;
    brand?: string;
  }[];
  rationaleTitle: string;
  rationaleText: string;
  styleTip: string;
  isLiked: boolean;
  isWorn: boolean;
}

export interface CalendarEvent {
  id: string;
  dayIndex: number; // 0 for 27, 4 for 31 (Bugün), etc.
  dateString: string;
  title: string;
  tag: string;
  tagClass: string;
  timeRange: string;
  temperature: string;
  stylistNote: string;
  reminderLabel: string;
  isReminderOn: boolean;
  isConfirmed: boolean;
  statusTag?: string;
  garments: {
    name: string;
    image: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'stylist' | 'user';
  text: string;
  timestamp: string;
  suggestedItem?: {
    name: string;
    brandColor: string;
    colorHex: string;
    image: string;
    added?: boolean;
  };
  comparisons?: {
    title: string;
    subtitle: string;
    match: string;
    icon: string;
    recommended?: boolean;
  }[];
}

export interface UserProfile {
  name: string;
  handle: string;
  email: string;
  avatar: string;
  styleBadge: string;
  itemsCount: number;
  outfitsCount: string;
  capsuleScore: number;
  isPremium: boolean;
  topSize: string;
  bottomSize: string;
  favoriteTones: { name: string; hex: string }[];
  notificationsEnabled: boolean;
  language: string;
}
