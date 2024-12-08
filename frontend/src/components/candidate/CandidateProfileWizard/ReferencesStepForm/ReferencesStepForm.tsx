import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid2 as Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { FIELDS_SPACING } from '../../../../constants/Spacing';
import { Pronoun } from '../../../../models/Pronoun';
import { optionsFromEnum } from '../../../../utils/SelectOptionsUtils';
import Panel from '../../../common/Panel/Panel';
import BaseStepForm, { BaseStepFormProps } from '../BaseStepForm/BaseStepForm';
import useCandidateProfileWizardStore from '../store';
import {
  ReferencesStepFormSchema,
  ReferencesStepFormType,
} from './ReferencesStepFormSchema';

const ReferencesStepForm = (props: BaseStepFormProps) => {
  const referencesStepForm = useCandidateProfileWizardStore(
    (state) => state.referencesStepForm
  );
  const updateReferencesStepForm = useCandidateProfileWizardStore(
    (state) => state.updateReferencesStepForm
  );

  const {
    register,
    control,
    getValues,
    reset,
    formState: { errors },
    trigger,
  } = useForm<ReferencesStepFormType>({
    resolver: yupResolver(ReferencesStepFormSchema),
    defaultValues: referencesStepForm,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'references',
  });

  const onNext = async () => {
    const valid = await trigger();
    updateReferencesStepForm(getValues());
    valid && props.onNext();
  };

  const onBack = async () => {
    await trigger();
    updateReferencesStepForm(getValues());
    props.onBack && props.onBack();
  };

  const onSkip = () => {
    reset();
    updateReferencesStepForm(getValues());
    props.onSkip && props.onSkip();
  };

  const onAddRelationship = () => {
    append({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      pronoun: '',
      relationship: '',
    });
  };

  return (
    <Box>
      <BaseStepForm {...props} onNext={onNext} onBack={onBack} onSkip={onSkip}>
        <Panel title="References">
          <Box>
            {fields.map((item, index) => (
              <Box key={item.id}>
                {index > 0 && <Box py={3} />}
                <Grid container spacing={FIELDS_SPACING}>
                  <Grid size={{ sm: 12, md: 4 }}>
                    <TextField
                      required
                      id="firstName"
                      label="First Name"
                      variant="outlined"
                      fullWidth
                      {...register(`references.${index}.firstName`)}
                      error={!!errors?.references?.[index]?.firstName?.message}
                      helperText={
                        errors?.references?.[index]?.firstName?.message
                      }
                    />
                  </Grid>
                  <Grid size={{ sm: 12, md: 4 }}>
                    <TextField
                      id="middleName"
                      label="Middle Name"
                      variant="outlined"
                      fullWidth
                      {...register(`references.${index}.middleName`)}
                      error={!!errors?.references?.[index]?.middleName?.message}
                      helperText={
                        errors?.references?.[index]?.middleName?.message
                      }
                    />
                  </Grid>
                  <Grid size={{ sm: 12, md: 4 }}>
                    <TextField
                      required
                      id="lastName"
                      label="Last Name"
                      variant="outlined"
                      fullWidth
                      {...register(`references.${index}.lastName`)}
                      error={!!errors?.references?.[index]?.lastName?.message}
                      helperText={
                        errors?.references?.[index]?.lastName?.message
                      }
                    />
                  </Grid>
                  <Grid size={{ sm: 12, md: 4 }}>
                    <FormControl
                      error={!!errors?.references?.[index]?.pronoun}
                      fullWidth
                    >
                      <InputLabel id="pronoun-select-label">Pronoun</InputLabel>
                      <Controller
                        name={`references.${index}.pronoun`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="pronoun-select-label"
                            label="Select Pronoun"
                          >
                            {optionsFromEnum(Pronoun).map((option) => (
                              <MenuItem key={option.key} value={option.key}>
                                {option.value}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors?.references?.[index]?.pronoun?.message && (
                        <FormHelperText error={true}>
                          {errors?.references?.[index]?.pronoun?.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid container size={{ sm: 12 }}>
                    <Grid size={{ sm: 12, md: 4 }}>
                      <Controller
                        name={`references.${index}.phoneNumber`}
                        control={control}
                        render={({ field }) => (
                          <MuiTelInput
                            required
                            fullWidth
                            label="Phone Number"
                            defaultCountry="US"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            error={
                              !!errors?.references?.[index]?.phoneNumber
                                ?.message
                            }
                            helperText={
                              errors?.references?.[index]?.phoneNumber?.message
                            }
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

                  <Grid container size={{ sm: 12 }}>
                    <Grid size={{ sm: 12, md: 4 }}>
                      <TextField
                        required
                        id="email"
                        label="Email"
                        variant="outlined"
                        fullWidth
                        {...register(`references.${index}.email`)}
                        error={!!errors?.references?.[index]?.email?.message}
                        helperText={errors?.references?.[index]?.email?.message}
                      />
                    </Grid>
                  </Grid>
                  <Grid container size={{ sm: 12 }}>
                    <Grid size={{ sm: 12, md: 4 }}>
                      <TextField
                        required
                        id="relationship"
                        label="Relationship"
                        variant="outlined"
                        fullWidth
                        {...register(`references.${index}.relationship`)}
                        error={
                          !!errors?.references?.[index]?.relationship?.message
                        }
                        helperText={
                          errors?.references?.[index]?.relationship?.message
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    onClick={() => remove(index)}
                    startIcon={<RemoveIcon />}
                    style={{ textTransform: 'none' }}
                  >
                    Remove reference
                  </Button>
                </Box>
              </Box>
            ))}
            <Box>
              <Button
                onClick={onAddRelationship}
                startIcon={<AddIcon />}
                style={{ textTransform: 'none' }}
              >
                Add reference
              </Button>
            </Box>
          </Box>
        </Panel>
      </BaseStepForm>
    </Box>
  );
};

export default ReferencesStepForm;
