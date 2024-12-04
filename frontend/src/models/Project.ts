export interface Project {
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  technologiesUsed?: string;
  url?: string;
}
