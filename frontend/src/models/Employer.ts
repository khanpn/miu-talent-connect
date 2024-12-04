import { UserStatus } from './UserStatus';

interface ReadOnlyProps {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl?: string;
  status: UserStatus;
  userId: string;
}

export interface Employer extends ReadOnlyProps {
  id: string;
  company: string;
}
