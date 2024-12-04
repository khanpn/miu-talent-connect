import { CandidateProfileStatus } from './CandidateProfileStatus';
import Skill from './Skill';

export interface CandidateSearch {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  profilePictureUrl?: string;
  summary: string;
  skills?: Skill[];
  primaryTechnologies?: string[];
  resumeUrl?: string;
  profileStatus: CandidateProfileStatus;
  userId: string;
  profileId: string;
}
