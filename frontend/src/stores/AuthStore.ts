import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { User } from '../models/User';
import { getAccessTokenWithoutObservingChange } from './TokenStore';
import halClient from '../rest/halClient';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { USER_RESOURCE_PATH } from '../rest/resources';
import { UserRole } from '../models/UserRole';
import _ from 'lodash';

const STORAGE_NAME = 'auth-storage';

type AuthState = {
  user?: User;
};

type Action = {
  setUser: (user: User) => void;
  ensureUserLoaded: () => Promise<void>;
  clearUser: () => void;
  hasAdminRole: () => boolean;
  hasSystemAdminRole: () => boolean;
  hasEmployerRole: () => boolean;
  hasCandidateRole: () => boolean;
};

const hasRole = (user: User | undefined, role: UserRole) => {
  {
    return (
      !!user &&
      _.includes(
        user.roles?.map((role) => UserRole[`${role}` as keyof typeof UserRole]),
        role
      )
    );
  }
};

const useAuthStore = create<AuthState & Action>()(
  devtools(
    persist(
      (set, get) => ({
        setUser: (user) => set({ user }),
        ensureUserLoaded: () =>
          new Promise(async (resolve) => {
            if (get().user) {
              resolve();
              return;
            }
            const accessToken = getAccessTokenWithoutObservingChange();
            if (!accessToken) {
              resolve();
              return;
            }
            try {
              const { sub: username } = jwtDecode<JwtPayload>(accessToken!);
              const userResponse = await halClient.fetchSingleResource<User>(
                `${USER_RESOURCE_PATH}/search/findUserByUsername?username=${username}`
              );
              set({ user: userResponse });
            } catch (error) {
              console.log(error);
            }
            resolve();
          }),
        clearUser: () => set({ user: undefined }),
        hasAdminRole: () =>
          hasRole(get().user, UserRole.ADMIN) ||
          hasRole(get().user, UserRole.SYSTEM_ADMIN),
        hasSystemAdminRole: () => hasRole(get().user, UserRole.SYSTEM_ADMIN),
        hasCandidateRole: () => hasRole(get().user, UserRole.CANDIDATE),
        hasEmployerRole: () => hasRole(get().user, UserRole.EMPLOYER),
      }),
      {
        name: STORAGE_NAME,
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export const setUserWithoutNotifyingChange = (user?: User) => {
  const authStoreState = localStorage.getItem(STORAGE_NAME);
  if (authStoreState) {
    const storage = JSON.parse(authStoreState);
    storage.state.user = user;
    localStorage.setItem(STORAGE_NAME, JSON.stringify(storage));
  }
};

export const clearAuthUserWithoutNotifyingChange = () => {
  setUserWithoutNotifyingChange(undefined);
};

export default useAuthStore;
