import { EducationalInstitution } from './EducationalInstitution';

export interface Education {
  degreeType: string;
  degreeStatus?: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  gpa?: string;
  institution: EducationalInstitution;
}
