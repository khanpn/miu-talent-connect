import * as y from 'yup';

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const ChangePasswordSchema = y.object({
  username: y.string().max(256).required(),
  oldPassword: y.string().required('Old password must be provided'),
  newPassword: y
    .string()
    .min(8, 'New password must be at least 8 characters')
    .max(245, 'New password is too long')
    .test(
      'newPassword',
      'Password must contain at least one lowercase letter, one uppercase letter, one special character, and least one special character from the set @$!%*?&.',
      (value) => passwordPattern.test(value || '')
    )
    .test({
      name: 'newPassword',
      message: 'New password must not equal to old password.',
      test: (value, { parent: { oldPassword } }) =>
        oldPassword !== value && passwordPattern.test(value || ''),
    })
    .required('New password is a required field'),
  retypeNewPassword: y
    .string()
    .test({
      name: 'retypeNewPassword',
      message: 'Retype password must be matched with new password',
      test: (value, { parent: { newPassword } }) => value === newPassword,
    })
    .required('Retype password is a required field'),
});

export type ChangePasswordType = y.InferType<typeof ChangePasswordSchema>;
