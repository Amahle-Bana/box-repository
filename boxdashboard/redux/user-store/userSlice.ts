import { createSlice, PayloadAction } from '@reduxjs/toolkit';


// User Slice Types - matching backend User model exactly
interface UserState {
  // Core user fields (matching Django User model)
  id: number | null;
  username: string;
  email: string;
  fullName: string | null;
  password?: string; // Optional since it's not typically exposed to frontend
  
  // Profile fields
  profilePicture: string | null;
  bio: string | null;
  privacySettings: string | null; // Public/Private choices
  
  // Social media fields
  userFacebook: string | null;
  userInstagram: string | null;
  userXTwitter: string | null;
  userThreads: string | null;
  userYouTube: string | null;
  userLinkedIn: string | null;
  userTikTok: string | null;
  
  // System fields (matching Django model timestamps)
  createdAt: string | null;
  updatedAt: string | null;
}

// User Slice Initial Values
const initialState: UserState = {
  // Core user fields
  id: null,
  username: '',
  email: '',
  fullName: null,
  
  // Profile fields
  profilePicture: null,
  bio: null,
  privacySettings: null,
  
  // Social media fields
  userFacebook: null,
  userInstagram: null,
  userXTwitter: null,
  userThreads: null,
  userYouTube: null,
  userLinkedIn: null,
  userTikTok: null,
  
  // System fields
  createdAt: null,
  updatedAt: null,
};

// User Slice Functions
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    clearUser: (state) => {
      return initialState;
    },
    updateUserField: <K extends keyof UserState>(
      state: UserState,
      action: PayloadAction<{ field: K; value: UserState[K] }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
  },
});

// Exporting Functions
export const { setUser, clearUser, updateUserField } = userSlice.actions;
export default userSlice.reducer; 