import * as y from 'yup';

export const ResetPasswordTokenRequestSchema = y.object({
  username: y.string().min(4).max(256).required('Username is required'),
});

export type ResetPasswordTokenRequestType = y.InferType<
  typeof ResetPasswordTokenRequestSchema
>;
