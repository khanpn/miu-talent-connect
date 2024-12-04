import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid2 as Grid,
  TextField,
  Typography,
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
  ProfessionalExperienceStepFormType,
  ProfessionalExperienceStepFormSchema,
} from './ProfessionalExperienceStepFormSchema';
import useCandidateProfileWizardStore from '../store';
import CountrySelect from '../../../common/CountrySelect/CountrySelect';
import PrimaryTechnologiesSelector from './PrimaryTechnologiesSelector/PrimaryTechnologiesSelector';
import { CONTENT_PADDING, FIELDS_SPACING } from '../../../../constants/Spacing';

const ProfessionalExperienceStepForm = (props: BaseStepFormProps) => {
  const professionalExperienceStepForm = useCandidateProfileWizardStore(
    (state) => state.professionalExperienceStepForm
  );
  const updateProfessionalExperienceStepForm = useCandidateProfileWizardStore(
    (state) => state.updateProfessionalExperienceStepForm
  );

  const {
    register,
    control,
    getValues,
    reset,
    formState: { errors },
    trigger,
  } = useForm<ProfessionalExperienceStepFormType>({
    resolver: yupResolver(ProfessionalExperienceStepFormSchema),
    defaultValues: professionalExperienceStepForm,
  });

  const experienceFieldArray = useFieldArray({
    control,
    name: 'experience',
  });

  const skillsFieldArray = useFieldArray({
    control,
    name: 'skills',
  });

  const projectsFieldArray = useFieldArray({
    control,
    name: 'projects',
  });

  const certificationsFieldArray = useFieldArray({
    control,
    name: 'certifications',
  });

  const onNext = async () => {
    const valid = await trigger();
    console.log(errors);
    updateProfessionalExperienceStepForm(getValues());
    valid && props.onNext();
  };

  const onBack = async () => {
    await trigger();
    updateProfessionalExperienceStepForm(getValues());
    props.onBack && props.onBack();
  };

  const onSkip = () => {
    reset();
    updateProfessionalExperienceStepForm(getValues());
    props.onSkip && props.onSkip();
  };

  const onAddExperience = () => {
    experienceFieldArray.append({
      company: '',
      location: {
        countryCode: '',
      },
      jobTitle: '',
      startDate: null,
      endDate: null,
      responsibilities: '',
    });
  };

  const onAddSkill = () => {
    skillsFieldArray.append({
      name: '',
      yearOfExperience: 0,
    });
  };

  const onAddProject = () => {
    projectsFieldArray.append({
      name: '',
      description: '',
      startDate: null,
      endDate: null,
      url: '',
    });
  };

  const onAddCertification = () => {
    certificationsFieldArray.append({
      name: '',
      credentialId: '',
      issuedBy: '',
      dateIssued: null,
      expirationDate: null,
      url: '',
    });
  };

  return (
    <Box>
      <BaseStepForm onNext={onNext} onBack={onBack} onSkip={onSkip}>
        <Panel title="Professional Experience">
          <Box p={CONTENT_PADDING}>
            <Typography variant="h5" pb={3}>
              Work Experience
            </Typography>
            {experienceFieldArray.fields.map((item, index) => (
              <Box key={item.id}>
                <Grid container spacing={FIELDS_SPACING}>
                  <Grid size={{ sm: 12, md: 4 }}>
                    <TextField
                      required
                      id="company"
                      label="Company"
                      variant="outlined"
                      fullWidth
                      {...register(`experience.${index}.company`)}
                      error={!!errors?.experience?.[index]?.company?.message}
                      helperText={errors?.experience?.[index]?.company?.message}
                    />
                  </Grid>
                  <Grid size={{ sm: 12, md: 8 }}>
                    <Grid container spacing={FIELDS_SPACING}>
                      <Grid size={{ sm: 4, md: 4 }}>
                        <TextField
                          id="city"
                          label="city"
                          variant="outlined"
                          fullWidth
                          {...register(`experience.${index}.location.city`)}
                          error={
                            !!errors?.experience?.[index]?.location?.city
                              ?.message
                          }
                          helperText={
                            errors?.experience?.[index]?.location?.city?.message
                          }
                        />
                      </Grid>
                      <Grid size={{ sm: 4, md: 4 }}>
                        <TextField
                          id="state"
                          label="State"
                          variant="outlined"
                          fullWidth
                          {...register(`experience.${index}.location.state`)}
                          error={
                            !!errors?.experience?.[index]?.location?.state
                              ?.message
                          }
                          helperText={
                            errors?.experience?.[index]?.location?.state
                              ?.message
                          }
                        />
                      </Grid>
                      <Grid size={{ sm: 4, md: 4 }}>
                        <Controller
                          name={`experience.${index}.location.countryCode`}
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
                                    !!errors?.experience?.[index]?.location
                                      ?.countryCode
                                  }
                                  helperText={
                                    errors?.experience?.[index]?.location
                                      ?.countryCode?.message
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
                    <TextField
                      required
                      id="jobTitle"
                      label="Job Title"
                      variant="outlined"
                      fullWidth
                      {...register(`experience.${index}.jobTitle`)}
                      error={!!errors?.experience?.[index]?.jobTitle?.message}
                      helperText={
                        errors?.experience?.[index]?.jobTitle?.message
                      }
                    />
                  </Grid>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid size={{ sm: 12, md: 4 }}>
                      <Controller
                        name={`experience.${index}.startDate`}
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
                                error: !!errors?.experience?.[index]?.startDate,
                                helperText:
                                  errors?.experience?.[index]?.startDate
                                    ?.message,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ sm: 12, md: 4 }}>
                      <Controller
                        name={`experience.${index}.endDate`}
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
                                error: !!errors?.experience?.[index]?.endDate,
                                helperText:
                                  errors?.experience?.[index]?.endDate?.message,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </LocalizationProvider>
                  <Grid size={{ sm: 12, md: 12 }}>
                    <TextField
                      id="responsibilities"
                      label="Responsibilities"
                      variant="outlined"
                      multiline
                      rows={4}
                      fullWidth
                      {...register(`experience.${index}.responsibilities`)}
                      error={
                        !!errors?.experience?.[index]?.responsibilities?.message
                      }
                      helperText={
                        errors?.experience?.[index]?.responsibilities?.message
                      }
                    />
                  </Grid>
                </Grid>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    onClick={() => experienceFieldArray.remove(index)}
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
                onClick={onAddExperience}
                startIcon={<AddIcon />}
                style={{ textTransform: 'none' }}
              >
                Add experience
              </Button>
            </Box>
            <Box my={3} />
            <Divider />
            <Typography variant="h5" py={3}>
              Primary Technologies
            </Typography>
            <FormControl error={!!errors.primaryTechnologies} fullWidth>
              <Controller
                name={'primaryTechnologies'}
                control={control}
                render={({ field }) => (
                  <PrimaryTechnologiesSelector
                    value={field.value || []}
                    onChange={field.onChange}
                    error={!!errors.primaryTechnologies}
                  />
                )}
              />
              {errors.primaryTechnologies && (
                <FormHelperText error={true}>
                  {errors.primaryTechnologies?.message}
                </FormHelperText>
              )}
            </FormControl>
            <Box my={3} />
            <Divider />
            <Typography variant="h5" py={3}>
              Professional Skills
            </Typography>
            {skillsFieldArray.fields.map((item, index) => (
              <Box key={item.id}>
                <Grid key={item.id} container spacing={FIELDS_SPACING}>
                  <Grid size={{ sm: 12, md: 6 }}>
                    <TextField
                      required
                      id="skillName"
                      label="Skill Name"
                      variant="outlined"
                      fullWidth
                      {...register(`skills.${index}.name`)}
                      error={!!errors?.skills?.[index]?.name?.message}
                      helperText={errors?.skills?.[index]?.name?.message}
                    />
                  </Grid>
                  <Grid size={{ sm: 12, md: 6 }}>
                    <TextField
                      id="skillYearOfExperience"
                      type="number"
                      label="Year Of Experience"
                      variant="outlined"
                      fullWidth
                      {...register(`skills.${index}.yearOfExperience`)}
                      error={
                        !!errors?.skills?.[index]?.yearOfExperience?.message
                      }
                      helperText={
                        errors?.skills?.[index]?.yearOfExperience?.message
                      }
                    />
                  </Grid>
                </Grid>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    onClick={() => skillsFieldArray.remove(index)}
                    startIcon={<RemoveIcon />}
                    style={{ textTransform: 'none' }}
                  >
                    Remove skill
                  </Button>
                </Box>
              </Box>
            ))}
            <Box>
              <Button
                onClick={onAddSkill}
                startIcon={<AddIcon />}
                style={{ textTransform: 'none' }}
              >
                Add skill
              </Button>
            </Box>
            <Box my={3} />
            <Divider />
            <Typography variant="h5" py={3}>
              Professional Projects
            </Typography>
            {projectsFieldArray.fields.map((item, index) => (
              <Box key={item.id}>
                <Grid key={item.id} container spacing={FIELDS_SPACING}>
                  <Grid size={{ sm: 12, md: 4 }}>
                    <TextField
                      required
                      id="projectName"
                      label="Project Name"
                      variant="outlined"
                      fullWidth
                      {...register(`projects.${index}.name`)}
                      error={!!errors?.projects?.[index]?.name?.message}
                      helperText={errors?.projects?.[index]?.name?.message}
                    />
                  </Grid>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid size={{ sm: 12, md: 4 }}>
                      <Controller
                        name={`projects.${index}.startDate`}
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
                                error: !!errors?.projects?.[index]?.startDate,
                                helperText:
                                  errors?.projects?.[index]?.startDate?.message,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ sm: 12, md: 4 }}>
                      <Controller
                        name={`projects.${index}.endDate`}
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
                                error: !!errors?.projects?.[index]?.endDate,
                                helperText:
                                  errors?.projects?.[index]?.endDate?.message,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </LocalizationProvider>
                  <Grid size={{ sm: 12 }}>
                    <TextField
                      id="projectDescription"
                      label="Description"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      {...register(`projects.${index}.description`)}
                      error={!!errors?.projects?.[index]?.description?.message}
                      helperText={
                        errors?.projects?.[index]?.description?.message
                      }
                    />
                  </Grid>
                  <Grid size={{ sm: 12 }}>
                    <TextField
                      id="projectTechnologiesUsed"
                      label="Technologies Used"
                      variant="outlined"
                      fullWidth
                      {...register(`projects.${index}.technologiesUsed`)}
                      error={
                        !!errors?.projects?.[index]?.technologiesUsed?.message
                      }
                      helperText={
                        errors?.projects?.[index]?.technologiesUsed?.message
                      }
                    />
                  </Grid>
                  <Grid size={{ sm: 12 }}>
                    <TextField
                      id="projectUrl"
                      label="Project URL"
                      variant="outlined"
                      fullWidth
                      {...register(`projects.${index}.url`)}
                      error={!!errors?.projects?.[index]?.url?.message}
                      helperText={errors?.projects?.[index]?.url?.message}
                    />
                  </Grid>
                </Grid>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    onClick={() => projectsFieldArray.remove(index)}
                    startIcon={<RemoveIcon />}
                    style={{ textTransform: 'none' }}
                  >
                    Remove project
                  </Button>
                </Box>
              </Box>
            ))}
            <Box>
              <Button
                onClick={onAddProject}
                startIcon={<AddIcon />}
                style={{ textTransform: 'none' }}
              >
                Add project
              </Button>
            </Box>
            <Box my={3} />
            <Divider />
            <Typography variant="h5" py={3}>
              Certifications
            </Typography>
            {certificationsFieldArray.fields.map((item, index) => (
              <Box key={item.id}>
                <Grid key={item.id} container spacing={FIELDS_SPACING}>
                  <Grid size={{ sm: 12, md: 8 }}>
                    <TextField
                      required
                      id="certificationName"
                      label="Certification Name"
                      variant="outlined"
                      fullWidth
                      {...register(`certifications.${index}.name`)}
                      error={!!errors?.certifications?.[index]?.name?.message}
                      helperText={
                        errors?.certifications?.[index]?.name?.message
                      }
                    />
                  </Grid>
                  <Grid size={{ sm: 12 }}>
                    <TextField
                      id="certificationUssuedBy"
                      label="Certification Issued By"
                      variant="outlined"
                      fullWidth
                      {...register(`certifications.${index}.issuedBy`)}
                      error={
                        !!errors?.certifications?.[index]?.issuedBy?.message
                      }
                      helperText={
                        errors?.certifications?.[index]?.issuedBy?.message
                      }
                    />
                  </Grid>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid size={{ sm: 12, md: 4 }}>
                      <Controller
                        name={`certifications.${index}.dateIssued`}
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <DatePicker
                            label="Date Issued"
                            value={dayjs(field.value)}
                            onChange={(date) => field.onChange(date)}
                            maxDate={dayjs()}
                            slotProps={{
                              textField: {
                                required: true,
                                variant: 'outlined',
                                fullWidth: true,
                                error:
                                  !!errors?.certifications?.[index]?.dateIssued,
                                helperText:
                                  errors?.certifications?.[index]?.dateIssued
                                    ?.message,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ sm: 12, md: 4 }}>
                      <Controller
                        name={`certifications.${index}.expirationDate`}
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <DatePicker
                            label="Expiration Date"
                            value={dayjs(field.value)}
                            onChange={(date) => field.onChange(date)}
                            slotProps={{
                              textField: {
                                variant: 'outlined',
                                fullWidth: true,
                                error:
                                  !!errors?.certifications?.[index]
                                    ?.expirationDate,
                                helperText:
                                  errors?.certifications?.[index]
                                    ?.expirationDate?.message,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </LocalizationProvider>
                  <Grid size={{ sm: 12 }}>
                    <TextField
                      id="certificationUrl"
                      label="Certification URL"
                      variant="outlined"
                      fullWidth
                      {...register(`certifications.${index}.url`)}
                      error={!!errors?.certifications?.[index]?.url?.message}
                      helperText={errors?.certifications?.[index]?.url?.message}
                    />
                  </Grid>
                </Grid>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    onClick={() => certificationsFieldArray.remove(index)}
                    startIcon={<RemoveIcon />}
                    style={{ textTransform: 'none' }}
                  >
                    Remove certification
                  </Button>
                </Box>
              </Box>
            ))}
            <Box>
              <Button
                onClick={onAddCertification}
                startIcon={<AddIcon />}
                style={{ textTransform: 'none' }}
              >
                Add certification
              </Button>
            </Box>
          </Box>
        </Panel>
      </BaseStepForm>
    </Box>
  );
};

export default ProfessionalExperienceStepForm;
