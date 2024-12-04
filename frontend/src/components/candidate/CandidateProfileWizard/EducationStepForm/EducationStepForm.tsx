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
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import BaseStepForm, { BaseStepFormProps } from '../BaseStepForm/BaseStepForm';
import Panel from '../../../common/Panel/Panel';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import {
  EducationStepFormType,
  EducationStepFormSchema,
} from './EducationStepFormSchema';
import useCandidateProfileWizardStore from '../store';
import CountrySelect from '../../../common/CountrySelect/CountrySelect';
import { DegreeType } from '../../../../models/DegreeType';
import { optionsFromEnum } from '../../../../utils/SelectOptionsUtils';
import { DegreeStatus } from '../../../../models/DegreeStatus';
import { CONTENT_PADDING, FIELDS_SPACING } from '../../../../constants/Spacing';

const EducationStepForm = (props: BaseStepFormProps) => {
  const educationStepForm = useCandidateProfileWizardStore(
    (state) => state.educationStepForm
  );
  const updateEducationStepForm = useCandidateProfileWizardStore(
    (state) => state.updateEducationStepForm
  );

  const {
    register,
    control,
    getValues,
    reset,
    formState: { errors },
    trigger,
  } = useForm<EducationStepFormType>({
    resolver: yupResolver(EducationStepFormSchema),
    defaultValues: educationStepForm,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  const onNext = async () => {
    const valid = await trigger();
    updateEducationStepForm(getValues());
    valid && props.onNext();
  };

  const onBack = async () => {
    await trigger();
    updateEducationStepForm(getValues());
    props.onBack && props.onBack();
  };

  const onSkip = () => {
    reset();
    updateEducationStepForm(getValues());
    props.onSkip && props.onSkip();
  };

  const onAddEducation = () => {
    append({
      degreeType: '',
      fieldOfStudy: '',
      degreeStatus: '',
      institution: {
        name: '',
        location: {
          countryCode: '',
        },
      },
      startDate: null,
      endDate: null,
      gpa: '',
    });
  };

  return (
    <Box>
      <BaseStepForm {...props} onNext={onNext} onBack={onBack} onSkip={onSkip}>
        <Panel title="Education">
          <Box p={CONTENT_PADDING}>
            {fields.map((item, index) => (
              <Box key={item.id}>
                <Grid container spacing={FIELDS_SPACING}>
                  <Grid size={{ sm: 12, md: 4 }}>
                    <TextField
                      required
                      id="institutionName"
                      label="Institution Name"
                      variant="outlined"
                      fullWidth
                      {...register(`education.${index}.institution.name`)}
                      error={
                        !!errors?.education?.[index]?.institution?.name?.message
                      }
                      helperText={
                        errors?.education?.[index]?.institution?.name?.message
                      }
                    />
                  </Grid>
                  <Grid size={{ sm: 12, md: 8 }}>
                    <Grid container spacing={FIELDS_SPACING}>
                      <Grid size={{ sm: 4, md: 4 }}>
                        <TextField
                          id="city"
                          label="City"
                          variant="outlined"
                          fullWidth
                          {...register(
                            `education.${index}.institution.location.city`
                          )}
                          error={
                            !!errors?.education?.[index]?.institution?.location
                              ?.city?.message
                          }
                          helperText={
                            errors?.education?.[index]?.institution?.location
                              ?.city?.message
                          }
                        />
                      </Grid>
                      <Grid size={{ sm: 4, md: 4 }}>
                        <TextField
                          id="state"
                          label="State"
                          variant="outlined"
                          fullWidth
                          {...register(
                            `education.${index}.institution.location.state`
                          )}
                          error={
                            !!errors?.education?.[index]?.institution?.location
                              ?.state?.message
                          }
                          helperText={
                            errors?.education?.[index]?.institution?.location
                              ?.state?.message
                          }
                        />
                      </Grid>
                      <Grid size={{ sm: 4, md: 4 }}>
                        <Controller
                          name={`education.${index}.institution.location.countryCode`}
                          control={control}
                          render={({ field }) => (
                            <CountrySelect
                              value={field.value}
                              onChange={field.onChange}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  label="Choose Country"
                                  error={
                                    !!errors?.education?.[index]?.institution
                                      ?.location?.countryCode
                                  }
                                  helperText={
                                    errors?.education?.[index]?.institution
                                      ?.location?.countryCode?.message
                                  }
                                  slotProps={{
                                    htmlInput: {
                                      ...params.inputProps,
                                      autoComplete: 'new-password',
                                    },
                                  }}
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid size={{ sm: 12, md: 4 }}>
                    <FormControl
                      error={!!errors.education?.[index]?.degreeType}
                      fullWidth
                    >
                      <InputLabel id="degree-type-select-label">
                        Degree Type
                      </InputLabel>
                      <Controller
                        name={`education.${index}.degreeType`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="degree-type-select-label"
                            label="Choose Degree Type"
                          >
                            {optionsFromEnum(DegreeType).map((option) => (
                              <MenuItem key={option.key} value={option.key}>
                                {option.value}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.education?.[index]?.degreeType?.message && (
                        <FormHelperText error={true}>
                          {errors.education?.[index]?.degreeType?.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid size={{ sm: 12, md: 4 }}>
                    <TextField
                      required
                      id="fieldOfStudy"
                      label="Field Of Study"
                      variant="outlined"
                      fullWidth
                      {...register(`education.${index}.fieldOfStudy`)}
                      error={
                        !!errors?.education?.[index]?.fieldOfStudy?.message
                      }
                      helperText={
                        errors?.education?.[index]?.fieldOfStudy?.message
                      }
                    />
                  </Grid>
                  <Grid size={{ sm: 12, md: 4 }}>
                    <FormControl
                      error={!!errors.education?.[index]?.degreeStatus}
                      fullWidth
                    >
                      <InputLabel id="degree-status-select-label">
                        Degree Status
                      </InputLabel>
                      <Controller
                        name={`education.${index}.degreeStatus`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="degree-status-select-label"
                            label="Choose Degree Status"
                          >
                            {optionsFromEnum(DegreeStatus).map((option) => (
                              <MenuItem key={option.key} value={option.key}>
                                {option.value}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.education?.[index]?.degreeStatus?.message && (
                        <FormHelperText error={true}>
                          {errors.education?.[index]?.degreeStatus?.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid size={{ sm: 12, md: 4 }}>
                      <Controller
                        name={`education.${index}.startDate`}
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <DatePicker
                            label="Start Date"
                            value={dayjs(field.value)}
                            onChange={(date) => field.onChange(date)}
                            maxDate={dayjs()}
                            slotProps={{
                              textField: {
                                required: true,
                                variant: 'outlined',
                                fullWidth: true,
                                error: !!errors?.education?.[index]?.startDate,
                                helperText:
                                  errors?.education?.[index]?.startDate
                                    ?.message,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ sm: 12, md: 4 }}>
                      <Controller
                        name={`education.${index}.endDate`}
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <DatePicker
                            label="End Date"
                            value={dayjs(field.value)}
                            onChange={(date) => field.onChange(date)}
                            maxDate={dayjs()}
                            slotProps={{
                              textField: {
                                variant: 'outlined',
                                fullWidth: true,
                                error: !!errors?.education?.[index]?.endDate,
                                helperText:
                                  errors?.education?.[index]?.endDate?.message,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </LocalizationProvider>
                  <Grid size={{ sm: 12, md: 12 }}>
                    <TextField
                      id="gpa"
                      label="GPA"
                      variant="outlined"
                      fullWidth
                      {...register(`education.${index}.gpa`)}
                      error={!!errors?.education?.[index]?.gpa?.message}
                      helperText={errors?.education?.[index]?.gpa?.message}
                    />
                  </Grid>
                </Grid>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    onClick={() => remove(index)}
                    startIcon={<RemoveIcon />}
                    style={{ textTransform: 'none' }}
                  >
                    Remove experience
                  </Button>
                </Box>
              </Box>
            ))}
            <Box>
              <Button
                onClick={onAddEducation}
                startIcon={<AddIcon />}
                style={{ textTransform: 'none' }}
              >
                Add education
              </Button>
            </Box>
          </Box>
        </Panel>
      </BaseStepForm>
    </Box>
  );
};

export default EducationStepForm;
