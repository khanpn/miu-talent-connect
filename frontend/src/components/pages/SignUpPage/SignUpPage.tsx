import { yupResolver } from '@hookform/resolvers/yup';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Link,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CONTENT_PADDING, FIELDS_SPACING } from '../../../constants/Spacing';
import {
  CANDIDATE_RESOURCE_PATH,
  EMPLOYER_RESOURCE_PATH,
} from '../../../rest/resources';
import restClient, { extractErrorMessage } from '../../../rest/restClient';
import PageLoading from '../../common/PageLoading/PageLoading';
import StandardLayout from '../../layouts/StandardLayout/StandardLayout';
import { SignUpSchema, SignUpType } from './SignUpSchema';
import Breadcrumbs, {
  BreadcrumbItem,
} from '../../common/Breadcrumbs/Breadcrumbs';
import { Home } from '@mui/icons-material';

const SuccessAlert = () => {
  return (
    <Alert severity="success">
      <AlertTitle>Success</AlertTitle>
      You have successfull registered for a new account. You can{' '}
      <Link href="/login">login</Link> into your account now.
    </Alert>
  );
};

const BREADSCRUM_ITEMS: BreadcrumbItem[] = [
  {
    label: 'Home',
    icon: Home,
    path: '/',
  },
  {
    label: 'Sign Up',
    icon: PersonAddIcon,
    isActive: true,
  },
];

const SignUpPage = () => {
  const [validating, setValidating] = useState(false);
  const [serverError, setServerError] = useState('');
  const [userType, setUserType] = useState('CANDIDATE');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(SignUpSchema),
    defaultValues: { userType },
  });

  const onSubmit = async (data: SignUpType) => {
    try {
      setValidating(true);
      if (userType === 'CANDIDATE') {
        await restClient.post<SignUpType>(
          `${CANDIDATE_RESOURCE_PATH}/quick-create`,
          data
        );
      } else if (userType === 'EMPLOYER') {
        await restClient.post<SignUpType>(
          `${EMPLOYER_RESOURCE_PATH}/quick-create`,
          data
        );
      }
      setSuccess(true);
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
          {success ? (
            <SuccessAlert />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Paper elevation={10} sx={{ my: 6 }}>
                <Container>
                  <Stack p={CONTENT_PADDING} spacing={FIELDS_SPACING}>
                    <Stack alignItems="center" justifyContent="center">
                      <PersonAddIcon
                        color="primary"
                        sx={{ width: 40, height: 40 }}
                      />
                      <Typography py={1} variant="h6">
                        New Account
                      </Typography>
                    </Stack>
                    <FormControl error={!!errors?.userType}>
                      <Controller
                        name="userType"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            row
                            aria-labelledby="userType-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value.target.value);
                              setUserType(value.target.value);
                            }}
                          >
                            <FormControlLabel
                              value="CANDIDATE"
                              control={<Radio />}
                              label="Candidate"
                            />
                            <FormControlLabel
                              value="EMPLOYER"
                              control={<Radio />}
                              label="Employer"
                            />
                          </RadioGroup>
                        )}
                      />
                      {errors?.userType && (
                        <FormHelperText error={true}>
                          {errors.userType.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <TextField
                      fullWidth
                      required
                      label="Username"
                      id="username"
                      {...register('username')}
                      error={!!errors.username}
                      helperText={errors.username?.message}
                    />
                    {control._formValues.userType === 'CANDIDATE' && (
                      <TextField
                        fullWidth
                        required
                        label="Job Title"
                        id="jobTitle"
                        {...register('jobTitle')}
                        error={!!errors.jobTitle}
                        helperText={errors.jobTitle?.message}
                      />
                    )}
                    {control._formValues.userType === 'EMPLOYER' && (
                      <TextField
                        fullWidth
                        required
                        label="Company"
                        id="company"
                        {...register('company')}
                        error={!!errors.company}
                        helperText={errors.company?.message}
                      />
                    )}
                    <TextField
                      fullWidth
                      required
                      label="First Name"
                      id="firstName"
                      {...register('firstName')}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                    <TextField
                      fullWidth
                      required
                      label="Last Name"
                      id="lastName"
                      {...register('lastName')}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                    <TextField
                      fullWidth
                      required
                      label="Email"
                      id="email"
                      {...register('email')}
                      error={!!errors.email}
                      helperText={errors.email?.message}
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
                      Sign Up
                    </Button>
                    <Box>
                      <Typography>
                        You already had an account?{' '}
                        <Link href="/login">Login</Link>
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

export default SignUpPage;
