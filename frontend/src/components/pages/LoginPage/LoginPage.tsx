import { yupResolver } from '@hookform/resolvers/yup';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
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
import { useHistory } from '../../../hooks/useHistory';
import { GenerateTokenResponse } from '../../../models/GenerateTokenResponse';
import { User } from '../../../models/User';
import halClient from '../../../rest/halClient';
import {
  TOKEN_RESOURCE_PATH,
  USER_RESOURCE_PATH,
} from '../../../rest/resources';
import restClient, { extractErrorMessage } from '../../../rest/restClient';
import useAuthStore from '../../../stores/AuthStore';
import useTokenStore from '../../../stores/TokenStore';
import PageLoading from '../../common/PageLoading/PageLoading';
import StandardLayout from '../../layouts/StandardLayout/StandardLayout';
import { LoginSchema, LoginType } from './LoginSchema';
import { useAuth } from '../../../hooks/useAuth';
import Breadcrumbs, {
  BreadcrumbItem,
} from '../../common/Breadcrumbs/Breadcrumbs';
import { Home } from '@mui/icons-material';

const BREADSCRUM_ITEMS: BreadcrumbItem[] = [
  {
    label: 'Home',
    icon: Home,
    path: '/',
  },
  {
    label: 'Sign In',
    icon: LockOutlinedIcon,
    isActive: true,
  },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const { authenticated } = useAuth();
  const accessToken = useTokenStore((state) => state.accessToken);
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const setRefreshToken = useTokenStore((state) => state.setRefreshToken);
  const { setUser } = useAuthStore();
  const [validating, setValidating] = useState(false);
  const [serverError, setServerError] = useState('');
  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(LoginSchema),
  });

  useEffect(() => {
    if (accessToken) {
      const decodedToken = jwtDecode<JwtPayload>(accessToken);
      const username = decodedToken.sub;
      halClient
        .fetchSingleResource<User>(
          `${USER_RESOURCE_PATH}/search/findUserByUsername?username=${username}`
        )
        .then((response) => setUser(response))
        .catch((error) => extractErrorMessage(error, setServerError));
    }
  }, [accessToken]);

  useEffect(() => {
    if (!authenticated) {
      return;
    }
    if (
      history.length < 2 ||
      history[history.length - 2] === '/login' ||
      history[history.length - 2] === '/signup' ||
      history[history.length - 2] === '/change-password' ||
      history[history.length - 2] === '/reset-password'
    ) {
      navigate('/');
      return;
    }
    navigate(-1);
  }, [authenticated]);

  const onLogin = async (data: LoginType) => {
    try {
      setValidating(true);
      const resposne = await restClient.post<GenerateTokenResponse>(
        `${TOKEN_RESOURCE_PATH}/generate`,
        data,
        { withCredentials: false }
      );
      const { accessToken, refreshToken } = resposne.data;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
    } catch (error) {
      extractErrorMessage(error, setServerError);
    }
    setValidating(false);
  };

  return (
    <>
      <StandardLayout hideProfileMenu>
        <Breadcrumbs items={BREADSCRUM_ITEMS} />
        <Container
          sx={{
            display: 'flex',
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <form onSubmit={handleSubmit(onLogin)}>
            <Paper elevation={10} sx={{ my: 6 }}>
              <Container>
                <Stack p={CONTENT_PADDING} spacing={FIELDS_SPACING}>
                  <Stack alignItems="center">
                    <LockOutlinedIcon
                      color="primary"
                      sx={{ width: 40, height: 40 }}
                    />
                    <Typography py={1} variant="h6">
                      Sign In
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

                  <TextField
                    id="password"
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    {...register('password')}
                    error={!!errors?.password}
                    helperText={errors?.password?.message}
                  />
                  <FormControl error={!!serverError} fullWidth>
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
                    Sign in
                  </Button>
                  <Box>
                    <Typography>
                      <Link href="/reset-password-token-request">
                        Forgot password?
                      </Link>
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
        </Container>
      </StandardLayout>
      <PageLoading open={validating} />
    </>
  );
};

export default LoginPage;
