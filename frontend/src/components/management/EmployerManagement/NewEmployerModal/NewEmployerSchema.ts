import * as y from 'yup';
import { UsernameRegex } from '../../../../constants/RegExp';

export const NewEmployerSchema = y.object({
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
  company: y.string().max(256).required(),
  firstName: y.string().max(256).required(),
  lastName: y.string().max(256).required(),
  email: y
    .string()
    .email('Email must be a well-formed email address')
    .max(256)
    .required('Email is required'),
});

export type NewEmployerType = y.InferType<typeof NewEmployerSchema>;
