import { UserRole } from './UserRole';

export interface User {
  id?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  pronoun?: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl?: string;
  roles?: UserRole[];
  status?: string;
}
