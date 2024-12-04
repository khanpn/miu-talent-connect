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
import { ADMINISTRATOR_RESOURCE_PATH } from '../../../../rest/resources';
import restClient, { extractErrorMessage } from '../../../../rest/restClient';
import PageLoading from '../../../common/PageLoading/PageLoading';
import {
  NewAdministratorSchema,
  NewAdministratorType,
} from './NewAdministratorSchema';

interface NewEmployerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (values: any) => void;
}

const NewAdministratorModal: React.FC<NewEmployerModalProps> = ({
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
    resolver: yupResolver(NewAdministratorSchema),
  });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const onSubmit = async (data: NewAdministratorType) => {
    setSubmitting(true);
    try {
      const newAdministrator = await restClient.post<NewAdministratorType>(
        ADMINISTRATOR_RESOURCE_PATH + '/quick-create',
        data
      );
      onSuccess(newAdministrator);
      onClose();
    } catch (error) {
      extractErrorMessage(error, setServerError);
    }
    setSubmitting(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Admin User</DialogTitle>
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
              label="Department"
              id="department"
              {...register('department')}
              error={!!errors.department}
              helperText={errors.department?.message}
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

export default NewAdministratorModal;
