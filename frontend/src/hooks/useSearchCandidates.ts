import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { CandidateSearch } from '../models/CandidateSearch';
import halClient, { HalResponse } from '../rest/halClient';
import { CANDIDATE_RESOURCE_PATH } from '../rest/resources';
import useSearchCandidateQuery from '../stores/SearchCandidateQueryStore';

const RESOURCE_PATH = `${CANDIDATE_RESOURCE_PATH}/search/findAllByCriteria`;

const useSearchCandidates = () => {
  const { categories, searchTerms, pageNumber, pageSize } =
    useSearchCandidateQuery();

  const params: any = { page: pageNumber, size: pageSize };
  if (!_.isNil(categories) && !_.isEmpty(categories)) {
    params.categories = categories.join(',');
  }
  if (!_.isNil(searchTerms) && !_.isEmpty(searchTerms)) {
    params.searchTerms = searchTerms;
  }
  return useQuery<HalResponse<CandidateSearch>>({
    queryKey: [RESOURCE_PATH, categories, searchTerms, pageNumber, pageSize],
    staleTime: 0,
    gcTime: 0,
    queryFn: () =>
      halClient.fetchResource<CandidateSearch>(RESOURCE_PATH, {
        params,
      }),
  });
};

export default useSearchCandidates;
