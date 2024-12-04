import { isValidPhoneNumber } from 'libphonenumber-js';
import * as y from 'yup';

export const ReferencesStepFormSchema = y.object({
  references: y.array().of(
    y.object({
      firstName: y
        .string()
        .max(255, 'First name is too long')
        .required('First name is required'),
      middleName: y.string().max(255, 'Middle name is too long'),
      lastName: y
        .string()
        .max(255, 'Last name is too long')
        .required('Last name is required'),
      pronoun: y.string().max(255, 'Pronoun is too long'),
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
      relationship: y
        .string()
        .max(255, 'Relationship is too long')
        .required('Relationship is required'),
    })
  ),
});

export type ReferencesStepFormType = y.InferType<
  typeof ReferencesStepFormSchema
>;
