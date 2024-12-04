import { useQuery } from '@tanstack/react-query';
import halClient, { HalResponse } from '../rest/halClient';
import { CANDIDATE_RESOURCE_PATH } from '../rest/resources';
import { Candidate } from '../models/Candidate';

const useFetchCandidates = () => {
  return useQuery<HalResponse<Candidate>>({
    queryKey: [CANDIDATE_RESOURCE_PATH],
    queryFn: () => halClient.fetchResource<Candidate>(CANDIDATE_RESOURCE_PATH),
  });
};

export default useFetchCandidates;
