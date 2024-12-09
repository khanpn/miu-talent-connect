export interface Certification {
  credentialID?: string;
  name: string;
  issuedBy: string;
  dateIssued: Date;
  expirationDate?: Date;
  url?: string;
}
