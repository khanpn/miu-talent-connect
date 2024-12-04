import { Address } from './Address';
import { Certification } from './Certification';
import { Education } from './Education';
import { Language } from './Languague';
import { Project } from './Project';
import { Reference } from './Reference';
import Skill from './Skill';
import { Website } from './Website';
import { WorkExperience } from './WorkExperience';

export interface CandidateProfile {
  id?: string;
  jobTitle: string;
  bio?: string;
  summary?: string;
  address: Address;
  experience: WorkExperience[];
  primaryTechnologies?: string[];
  skills?: Skill[];
  projects?: Project[];
  certifications?: Certification[];
  education?: Education[];
  references?: Reference[];
  languages?: Language[];
  resumeUrl?: string;
  websites?: Website[];
}
