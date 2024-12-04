import { Address } from '../models/Address';

export const getAddressAsString = (address: Address): string => {
  const slices: string[] = [
    address.apt || '',
    address.street || '',
    address.city || '',
    address.state || '',
    (address.countryCode || '', address.zipCode || ''),
  ];
  return slices.filter((s) => !!s).join(', ');
};
