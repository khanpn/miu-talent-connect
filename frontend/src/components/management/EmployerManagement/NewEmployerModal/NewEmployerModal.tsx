import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Stack,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { EMPLOYER_RESOURCE_PATH } from '../../../../rest/resources';
import restClient, { extractErrorMessage } from '../../../../rest/restClient';
import PageLoading from '../../../common/PageLoading/PageLoading';
import { NewEmployerSchema, NewEmployerType } from './NewEmployerSchema';

interface NewEmployerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (values: any) => void;
}

const NewEmployerModal: React.FC<NewEmployerModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(NewEmployerSchema),
  });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const onSubmit = async (data: NewEmployerType) => {
    setSubmitting(true);
    try {
      const newEmployer = await restClient.post<NewEmployerType>(
        EMPLOYER_RESOURCE_PATH + '/quick-create',
        data
      );
      onSuccess(newEmployer);
      onClose();
    } catch (error) {
      extractErrorMessage(error, setServerError);
    }
    setSubmitting(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Employer</DialogTitle>
        <DialogContent>
          <Stack sx={{ mt: 2 }} spacing={2}>
            <TextField
              fullWidth
              required
              label="Username"
              id="username"
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              fullWidth
              required
              label="Company"
              id="company"
              {...register('company')}
              error={!!errors.company}
              helperText={errors.company?.message}
            />
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
              {serverError && <FormHelperText>{serverError}</FormHelperText>}
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="info">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            type="submit"
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <PageLoading open={submitting} />
    </>
  );
};

export default NewEmployerModal;
