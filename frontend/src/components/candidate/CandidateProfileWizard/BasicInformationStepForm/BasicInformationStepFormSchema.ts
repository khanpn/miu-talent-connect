import * as y from 'yup';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const BasicInformationStepFormSchema = y.object({
  firstName: y
    .string()
    .max(255, 'First name is too long')
    .required('First name is required'),
  middleName: y.string().max(255, 'Middle name is too long').nullable(),
  lastName: y
    .string()
    .max(255, 'Last name is too long')
    .required('Last name is required'),
  jobTitle: y
    .string()
    .max(255, 'Job title is too long')
    .required('Job title is required'),
  pronoun: y.string().max(255, 'Pronoun is too long').required(),
  bio: y.string().max(1000, 'Bio is too long').nullable(),
  phoneNumber: y
    .string()
    .required('Phone Number is required')
    .test('invalid', 'Phone Number is invalid', (value) =>
      isValidPhoneNumber(value)
    ),
  email: y
    .string()
    .email('Email is invalid')
    .max(255, 'Email is too long')
    .required('Email is required'),
  summary: y.string().max(1000, 'Email is too long').nullable(),
  profilePictureUrl: y.string().nullable(),
  address: y.object({
    street: y.string().max(255, 'Street is too long').nullable(),
    apt: y.string().max(255, 'Apt is too long').nullable(),
    city: y.string().max(255, 'City is too long').nullable(),
    state: y.string().max(255, 'State is too long').nullable(),
    countryCode: y
      .string()
      .max(3, 'Country code is too long')
      .required('Country is required'),
    zipCode: y
      .string()
      .max(10, 'Zip code is too long')
      .required('Zip Code is required'),
  }),
  languages: y.array().of(
    y.object({
      name: y
        .string()
        .max(255, 'Language name is too long')
        .required('Language name is required'),
      readingLevel: y
        .string()
        .max(255, 'Reading level is too long')
        .required('Reading level is required'),
      speakingLevel: y
        .string()
        .max(255, 'Speaking level is too long')
        .required('Speaking level is required'),
      listeningLevel: y
        .string()
        .max(255, 'Listening level is too long')
        .required('Listening level is required'),
      writingLevel: y
        .string()
        .max(255, 'Writing level is too long')
        .required('Writing level is required'),
    })
  ),
  resumeUrl: y.string().nullable(),
  websites: y.array().of(
    y.object({
      name: y
        .string()
        .max(255, 'Website name is too long')
        .required('Website name is required'),
      url: y.string().max(255, 'Website url is too long').nullable(),
    })
  ),
});

export type BasicInformationStepFormType = y.InferType<
  typeof BasicInformationStepFormSchema
>;
