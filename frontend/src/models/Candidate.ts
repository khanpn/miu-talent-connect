import { CandidateProfileStatus } from './CandidateProfileStatus';
import { UserStatus } from './UserStatus';

interface ReadOnlyProps {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  profilePictureUrl?: string;
  status: UserStatus;
  profileStatus: CandidateProfileStatus;
  userId: string;
  profileId: string;
}

export interface Candidate extends ReadOnlyProps {
  id: string;
}
