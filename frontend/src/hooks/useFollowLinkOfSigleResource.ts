import { useQuery } from '@tanstack/react-query';
import { User } from '../models/User';
import halClient, { HalLinks } from '../rest/halClient';

const useFollowLinkOfSigleResource = (links: HalLinks, rel: string) => {
  return useQuery<User>({
    queryKey: [links[rel]],
    queryFn: () => halClient.followLinkOfSigleResource<User>(links, rel),
  });
};

export default useFollowLinkOfSigleResource;
