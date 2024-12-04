import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

type SearchCandidateQueryState = {
  categories?: string[];
  searchTerms?: string;
  pageNumber?: number;
  pageSize: number;
};

type Action = {
  setCategories: (categories: string[]) => void;
  setSearchTerms: (searchTerms: string) => void;
  setPageNumber: (pageNumber: number) => void;
  setPageSize: (pageSize: number) => void;
};

const useSearchCandidateQuery = create<SearchCandidateQueryState & Action>()(
  devtools(
    persist(
      (set) => ({
        pageNumber: 0,
        pageSize: 5,
        setCategories: (categories?: string[]) =>
          set({ categories: categories }),
        setSearchTerms: (searchTerms?: string) => set({ searchTerms }),
        setPageNumber: (pageNumber: number) => set({ pageNumber }),
        setPageSize: (pageSize: number) => set({ pageSize }),
      }),
      {
        name: 'search-candidate-query-state-storage',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useSearchCandidateQuery;
