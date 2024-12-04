import { Address } from './Address';

export interface WorkExperience {
  company: string;
  jobTitle: string;
  location?: Address;
  startDate: Date;
  endDate?: Date;
  responsibilities?: string;
}
