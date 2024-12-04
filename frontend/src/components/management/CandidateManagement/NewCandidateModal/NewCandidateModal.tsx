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
import { CANDIDATE_RESOURCE_PATH } from '../../../../rest/resources';
import restClient, { extractErrorMessage } from '../../../../rest/restClient';
import PageLoading from '../../../common/PageLoading/PageLoading';
import { NewCandidateSchema, NewCandidateType } from './NewCandidateSchema';

interface NewCandidateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (values: any) => void;
}

const NewCandidateModal: React.FC<NewCandidateModalProps> = ({
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
    resolver: yupResolver(NewCandidateSchema),
  });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const onSubmit = async (data: NewCandidateType) => {
    setSubmitting(true);
    try {
      const newCandidate = await restClient.post<NewCandidateType>(
        CANDIDATE_RESOURCE_PATH + '/quick-create',
        data
      );
      onSuccess(newCandidate);
      onClose();
    } catch (error) {
      extractErrorMessage(error, setServerError);
    }
    setSubmitting(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Candidate</DialogTitle>
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
              label="Job Title"
              id="jobTitle"
              {...register('jobTitle')}
              error={!!errors.jobTitle}
              helperText={errors.jobTitle?.message}
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

export default NewCandidateModal;
