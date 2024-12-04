import * as y from 'yup';
import { UsernameRegex } from '../../../constants/RegExp';

export const SignUpSchema = y.object({
  userType: y.string().required(),
  username: y
    .string()
    .min(4)
    .max(64)
    .required()
    .test(
      'username',
      'Username can only contain letters, digits, periods, underscores, and hyphens',
      (value) => UsernameRegex.test(value)
    ),
  company: y
    .string()
    .max(50)
    .test({
      name: 'company',
      message: 'Company is required',
      test: (value, { parent: { userType } }) =>
        userType === 'EMPLOYER' ? !!value : true,
    }),
  jobTitle: y
    .string()
    .max(256)
    .test({
      name: 'jobTitle',
      message: 'Job title is required',
      test: (value, { parent: { userType } }) =>
        userType === 'CANDIDATE' ? !!value : true,
    }),
  firstName: y.string().max(256).required(),
  lastName: y.string().max(256).required(),
  email: y
    .string()
    .email('Email must be a well-formed email address')
    .max(256)
    .required('Email is required'),
});

export type SignUpType = y.InferType<typeof SignUpSchema>;
