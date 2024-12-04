import { useQuery } from '@tanstack/react-query';
import { CANDIDATE_RESOURCE_PATH } from '../rest/resources';
import { Candidate } from '../models/Candidate';
import halClient, { HalResponse } from '../rest/halClient';

interface Config {
  userId: string;
}

const useFetchCandidate = ({ userId }: Config) => {
  const path = `${CANDIDATE_RESOURCE_PATH}/search/findByUserId?userId=${userId}`;
  return useQuery<Candidate & HalResponse<Candidate>>({
    queryKey: [path],
    queryFn: () => halClient.fetchSingleResource<Candidate>(path),
  });
};

export default useFetchCandidate;
