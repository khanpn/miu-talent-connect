export interface Certification {
  certificationId?: string;
  name: string;
  issuedBy: string;
  dateIssued: Date;
  expirationDate?: Date;
  url?: string;
}
