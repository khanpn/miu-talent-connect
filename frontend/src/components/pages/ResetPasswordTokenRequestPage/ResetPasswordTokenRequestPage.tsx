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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CONTENT_PADDING, FIELDS_SPACING } from '../../../constants/Spacing';
import { ACCOUNT_RESOURCE_PATH } from '../../../rest/resources';
import restClient, { extractErrorMessage } from '../../../rest/restClient';
import PageLoading from '../../common/PageLoading/PageLoading';
import StandardLayout from '../../layouts/StandardLayout/StandardLayout';
import {
  ResetPasswordTokenRequestSchema,
  ResetPasswordTokenRequestType,
} from './ResetPasswordTokenRequestSchema';

const SuccessAlert = () => {
  return (
    <Alert severity="success">
      <AlertTitle>Success</AlertTitle>
      You have successfull requested reseting your password. An email with
      instruction will be sent out to your registered email.
    </Alert>
  );
};

const ResetPasswordTokenRequestPage = () => {
  const [validating, setValidating] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(ResetPasswordTokenRequestSchema),
  });

  const onSubmit = async (data: ResetPasswordTokenRequestType) => {
    try {
      setValidating(true);
      await restClient.post<ResetPasswordTokenRequestType>(
        `${ACCOUNT_RESOURCE_PATH}/reset-password-token-request`,
        data,
        { withCredentials: false }
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
            <Paper elevation={10} sx={{ my: 6 }}>
              <Container>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack p={CONTENT_PADDING} spacing={FIELDS_SPACING}>
                    <Stack alignItems="center">
                      <LockResetIcon
                        color="primary"
                        sx={{ width: 40, height: 40 }}
                      />
                      <Typography py={1} variant="h6">
                        Reset Password Request
                      </Typography>
                    </Stack>

                    <TextField
                      id="username"
                      label="Username"
                      variant="outlined"
                      fullWidth
                      {...register('username')}
                      error={!!errors?.username}
                      helperText={errors?.username?.message}
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
                      Submit
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
                </form>
              </Container>
            </Paper>
          )}
        </Container>
      </StandardLayout>
      <PageLoading open={validating} />
    </>
  );
};

export default ResetPasswordTokenRequestPage;
