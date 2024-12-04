import * as y from 'yup';

export const LoginSchema = y.object({
  username: y.string().max(256).required('Username is required'),
  password: y.string().required('Password is required'),
});

export type LoginType = y.InferType<typeof LoginSchema>;
