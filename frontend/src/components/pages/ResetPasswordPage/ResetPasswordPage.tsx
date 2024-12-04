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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CONTENT_PADDING, FIELDS_SPACING } from '../../../constants/Spacing';
import { ACCOUNT_RESOURCE_PATH } from '../../../rest/resources';
import restClient, { extractErrorMessage } from '../../../rest/restClient';
import PageLoading from '../../common/PageLoading/PageLoading';
import StandardLayout from '../../layouts/StandardLayout/StandardLayout';
import { ResetPasswordSchema, ResetPasswordType } from './ResetPasswordSchema';

const SuccessAlert = () => {
  return (
    <Alert severity="success">
      <AlertTitle>Success</AlertTitle>
      You have successfull reset your password. You can{' '}
      <Link href="/login">login</Link> into your account with new credentials.
    </Alert>
  );
};

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [validating, setValidating] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!searchParams.get('token')) {
      navigate('/');
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: {
      token: searchParams.get('token')!,
    },
  });

  const onSubmit = async (data: ResetPasswordType) => {
    try {
      setValidating(true);
      await restClient.post<ResetPasswordType>(
        `${ACCOUNT_RESOURCE_PATH}/reset-password`,
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
                        Reset Password
                      </Typography>
                    </Stack>

                    <TextField
                      id="password"
                      label="New Password"
                      variant="outlined"
                      type="password"
                      fullWidth
                      {...register('password')}
                      error={!!errors?.password}
                      helperText={errors?.password?.message}
                    />
                    <TextField
                      id="retypePassword"
                      label="Retype New Password"
                      variant="outlined"
                      type="password"
                      fullWidth
                      {...register('retypePassword')}
                      error={!!errors?.retypePassword}
                      helperText={errors?.retypePassword?.message}
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
                      Reset Password
                    </Button>
                    <Box>
                      <Typography gutterBottom>
                        You already had an account?{' '}
                        <Link href="/login">Login</Link>
                      </Typography>
                      <Typography>
                        Do you have an account?{' '}
                        <Link href="/signup">Sign Up</Link>
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

export default ResetPasswordPage;
