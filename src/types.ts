export interface Country {
  id: number;
  countryName: string;
  code: string;
  flag: string | null;
  createdAt?: string;
}

export interface Holiday {
  id: number;
  countryId: number;
  holidayName: string;
  date: string; // YYYY-MM-DD
  month: string; // e.g. "January"
  year: number;
  day: string; // e.g. "Thursday"
  description: string;
  type: string; // e.g. "Public", "Religious", "National"
  isPublic: boolean;
  createdAt?: string;
  
  // Joined fields
  countryName?: string;
  countryCode?: string;
  countryFlag?: string | null;
}

export interface AdPosition {
  id: number;
  positionKey: string;
  displayName: string;
  isActive: boolean;
  adClient: string;
  adSlot: string;
  adFormat: string;
  updatedAt?: string;
}

export interface UserSession {
  uid: string;
  email: string;
  role: string; // 'admin' | 'user'
}
