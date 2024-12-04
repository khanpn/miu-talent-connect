import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export const STORAGE_NAME = 'auth-token-storage';

type TokenState = {
  accessToken?: string;
  refreshToken?: string;
};

type Action = {
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  clearTokens: () => void;
  hasAccessToken: () => void;
};

const useTokenStore = create<TokenState & Action>()(
  devtools(
    persist(
      (set, get) => ({
        setAccessToken: (accessToken) => set({ accessToken }),
        setRefreshToken: (refreshToken: string) => set({ refreshToken }),
        clearTokens: () =>
          set({ accessToken: undefined, refreshToken: undefined }),
        hasAccessToken: () => !!get().accessToken,
      }),
      {
        name: STORAGE_NAME,
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

export const getAccessTokenWithoutObservingChange = () => {
  const tokenStoreState = localStorage.getItem(STORAGE_NAME);
  if (tokenStoreState) {
    return JSON.parse(tokenStoreState).state?.accessToken;
  }
};

export const setAccessTokenWithoutNotifyingChange = (accessToken: string) => {
  const tokenStoreState = localStorage.getItem(STORAGE_NAME);
  if (tokenStoreState) {
    const storage = JSON.parse(tokenStoreState);
    storage.state.accessToken = accessToken;
    localStorage.setItem(STORAGE_NAME, JSON.stringify(storage));
  }
};

export const getRefreshTokenWithoutObservingChange = () => {
  const tokenStoreState = localStorage.getItem(STORAGE_NAME);
  if (tokenStoreState) {
    return JSON.parse(tokenStoreState).state?.refreshToken;
  }
};

export const setRefreshTokenWithoutNotifyingChange = (refreshToken: string) => {
  const tokenStoreState = localStorage.getItem(STORAGE_NAME);
  if (tokenStoreState) {
    const storage = JSON.parse(tokenStoreState);
    storage.state.refreshToken = refreshToken;
    localStorage.setItem(STORAGE_NAME, JSON.stringify(storage));
  }
};

export const clearTokensWithoutNotifyingChange = () => {
  setAccessTokenWithoutNotifyingChange('');
  setRefreshTokenWithoutNotifyingChange('');
};

export default useTokenStore;
