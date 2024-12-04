import { yupResolver } from '@hookform/resolvers/yup';
import LockResetIcon from '@mui/icons-material/LockReset';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { CONTENT_PADDING, FIELDS_SPACING } from '../../../constants/Spacing';
import { useAuth } from '../../../hooks/useAuth';
import { ACCOUNT_RESOURCE_PATH } from '../../../rest/resources';
import restClient, { extractErrorMessage } from '../../../rest/restClient';
import { clearAuthUserWithoutNotifyingChange } from '../../../stores/AuthStore';
import { clearTokensWithoutNotifyingChange } from '../../../stores/TokenStore';
import PageLoading from '../../common/PageLoading/PageLoading';
import StandardLayout from '../../layouts/StandardLayout/StandardLayout';
import {
  ChangePasswordSchema,
  ChangePasswordType,
} from './ChangePasswordSchema';

const SuccessAlert = () => {
  return (
    <Alert severity="success">
      <AlertTitle>Success</AlertTitle>
      You have successfull changed your password. You can{' '}
      <Link href="/login">login</Link> into your account with new credentials.
    </Alert>
  );
};

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { authenticated, accessToken } = useAuth();
  const [validating, setValidating] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(ChangePasswordSchema),
  });

  useEffect(() => {
    if (!authenticated) {
      navigate('/');
      return;
    }
    try {
      const decodedToken = jwtDecode<JwtPayload>(accessToken!);
      setValue('username', decodedToken.sub!);
    } catch (error) {
      navigate('/');
    }
  }, [authenticated]);

  useEffect(() => {
    if (success) {
      clearTokensWithoutNotifyingChange();
      clearAuthUserWithoutNotifyingChange();
    }
  }, [success]);

  const onSubmit = async (data: ChangePasswordType) => {
    try {
      setValidating(true);
      await restClient.post<ChangePasswordType>(
        `${ACCOUNT_RESOURCE_PATH}/change-password`,
        data
      );
      setSuccess(true);
    } catch (error) {
      extractErrorMessage(error, setServerError);
    }
    setValidating(false);
  };

  return (
    <>
      <StandardLayout hideProfileMenu>
        <Container
          sx={{
            display: 'flex',
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {success ? (
            <SuccessAlert />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Paper elevation={10} sx={{ my: 6 }}>
                <Container>
                  <Stack p={CONTENT_PADDING} spacing={FIELDS_SPACING}>
                    <Stack alignItems="center">
                      <LockResetIcon
                        color="primary"
                        sx={{ width: 40, height: 40 }}
                      />
                      <Typography py={1} variant="h6">
                        Change Password
                      </Typography>
                    </Stack>
                    <TextField
                      id="username"
                      label="Username"
                      variant="outlined"
                      disabled
                      fullWidth
                      {...register('username')}
                      error={!!errors?.username}
                      helperText={errors?.username?.message}
                    />

                    <TextField
                      id="oldPassword"
                      label="Old Password"
                      variant="outlined"
                      type="password"
                      fullWidth
                      {...register('oldPassword')}
                      error={!!errors?.oldPassword}
                      helperText={errors?.oldPassword?.message}
                    />
                    <TextField
                      id="newPassword"
                      label="New Password"
                      variant="outlined"
                      type="password"
                      fullWidth
                      {...register('newPassword')}
                      error={!!errors?.newPassword}
                      helperText={errors?.newPassword?.message}
                    />
                    <TextField
                      id="retypeNewPassword"
                      label="Retype New Password"
                      variant="outlined"
                      type="password"
                      fullWidth
                      {...register('retypeNewPassword')}
                      error={!!errors?.retypeNewPassword}
                      helperText={errors?.retypeNewPassword?.message}
                    />
                    <FormControl error={!!serverError} fullWidth sx={{ my: 1 }}>
                      {serverError && (
                        <FormHelperText>{serverError}</FormHelperText>
                      )}
                    </FormControl>
                    <Button
                      type="submit"
                      color="primary"
                      variant="contained"
                      fullWidth
                      sx={{ my: 1 }}
                    >
                      Change Password
                    </Button>
                    <Box>
                      <Typography>
                        Cannot remember your password?{' '}
                        <Link href="/reset-password-token-request">Reset</Link>
                      </Typography>
                    </Box>
                  </Stack>
                </Container>
              </Paper>
            </form>
          )}
        </Container>
      </StandardLayout>
      <PageLoading open={validating} />
    </>
  );
};

export default ChangePasswordPage;
