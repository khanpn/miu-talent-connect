import * as y from 'yup';

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const ResetPasswordSchema = y.object({
  token: y.string(),
  password: y
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(245, 'Password is too long')
    .test(
      'password',
      'Password must contain at least one lowercase letter, one uppercase letter, and one special character.',
      (value) => passwordPattern.test(value || '')
    )
    .required('Password is required'),
  retypePassword: y
    .string()
    .test({
      name: 'retypeNewPassword',
      message: 'Retype password must be matched with new password',
      test: (value, { parent: { password } }) => value === password,
    })
    .required('Retype password is required'),
});

export type ResetPasswordType = y.InferType<typeof ResetPasswordSchema>;
