import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { User } from '../../../models/User';
import { CandidateProfile } from '../../../models/CandidateProfile';
import _ from 'lodash';

export type CandidateProfileState = {
  user?: User;
  candidateProfile?: CandidateProfile;
};

type Action = {
  setState: (state: CandidateProfileState) => void;
};

const useCandidateProfileStore = create<CandidateProfileState & Action>()(
  devtools(
    persist(
      (set) => ({
        setState: (state) =>
          set(() => ({
            ...state,
          })),
      }),
      {
        name: 'candidate-profile-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useCandidateProfileStore;
