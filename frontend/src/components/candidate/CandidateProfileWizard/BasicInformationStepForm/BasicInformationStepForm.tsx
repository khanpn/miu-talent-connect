import { yupResolver } from '@hookform/resolvers/yup';
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
  Typography,
} from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { FIELDS_SPACING } from '../../../../constants/Spacing';
import { LanguageProficiencyLevel } from '../../../../models/LangaugeProficiencyLevel';
import { Pronoun } from '../../../../models/Pronoun';
import { optionsFromEnum } from '../../../../utils/SelectOptionsUtils';
import CountrySelect from '../../../common/CountrySelect/CountrySelect';
import Panel from '../../../common/Panel/Panel';
import ResumeManagement from '../../../common/ResumeManagement/ResumeManagement';
import BaseStepForm, { BaseStepFormProps } from '../BaseStepForm/BaseStepForm';
import useCandidateProfileWizardStore from '../store';
import {
  BasicInformationStepFormSchema,
  BasicInformationStepFormType,
} from './BasicInformationStepFormSchema';
import MyAvatar from './MyAvatar/MyAvatar';

const BasicInformationStepForm = (props: BaseStepFormProps) => {
  const basicInformationStepForm = useCandidateProfileWizardStore(
    (state) => state.basicInformationStepForm
  );
  const updateBasicInformationStepForm = useCandidateProfileWizardStore(
    (state) => state.updateBasicInformationStepForm
  );

  const {
    register,
    control,
    getValues,
    formState: { errors },
    trigger,
  } = useForm<BasicInformationStepFormType>({
    resolver: yupResolver(BasicInformationStepFormSchema),
    defaultValues: basicInformationStepForm,
  });

  const languagesFieldArray = useFieldArray({
    control,
    name: 'languages',
  });

  const websitesFieldArray = useFieldArray({
    control,
    name: 'websites',
  });

  const onNext = async () => {
    const valid = await trigger();
    updateBasicInformationStepForm(getValues());
    valid && props.onNext();
  };

  const onAddLanguage = () => {
    languagesFieldArray.append({
      name: '',
      readingLevel: '',
      speakingLevel: '',
      listeningLevel: '',
      writingLevel: '',
    });
  };

  return (
    <Box>
      <BaseStepForm {...props} onNext={onNext} hasBack={false}>
        <Panel title="Basic Information">
          <Grid container spacing={FIELDS_SPACING}>
            <Grid size={{ sm: 12 }}>
              <Controller
                name="profilePictureUrl"
                control={control}
                render={({ field }) => (
                  <MyAvatar
                    src={field.value}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
            </Grid>
            <Grid size={{ sm: 12 }}>
              <TextField
                id="bio"
                label="Bio"
                variant="outlined"
                multiline
                rows={2}
                fullWidth
                {...register('bio')}
                error={!!errors?.bio?.message}
                helperText={errors?.bio?.message}
              />
            </Grid>
            <Grid size={{ sm: 12, md: 12 }}>
              <TextField
                required
                id="jobTitle"
                label="Job Title"
                variant="outlined"
                fullWidth
                {...register('jobTitle')}
                error={!!errors.jobTitle?.message}
                helperText={errors.jobTitle?.message}
              />
            </Grid>
            <Grid size={{ sm: 12, md: 4 }}>
              <TextField
                required
                id="firstName"
                label="First Name"
                variant="outlined"
                fullWidth
                {...register('firstName')}
                error={!!errors.firstName?.message}
                helperText={errors.firstName?.message}
              />
            </Grid>
            <Grid size={{ sm: 12, md: 4 }}>
              <TextField
                id="middleName"
                label="Middle Name"
                variant="outlined"
                fullWidth
                {...register('middleName')}
                error={!!errors.middleName?.message}
                helperText={errors.middleName?.message}
              />
            </Grid>
            <Grid size={{ sm: 12, md: 4 }}>
              <TextField
                required
                id="lastName"
                label="Last Name"
                variant="outlined"
                fullWidth
                {...register('lastName')}
                error={!!errors.lastName?.message}
                helperText={errors.lastName?.message}
              />
            </Grid>
            <Grid container size={{ sm: 12 }}>
              <Grid size={{ sm: 12, md: 4 }}>
                <FormControl error={!!errors.pronoun} fullWidth>
                  <InputLabel id="pronoun-select-label">Pronoun</InputLabel>
                  <Controller
                    name="pronoun"
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
                  {errors.pronoun?.message && (
                    <FormHelperText error={true}>
                      {errors.pronoun?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <Grid size={{ sm: 12 }}>
              <Grid container spacing={FIELDS_SPACING}>
                <Grid size={{ sm: 8 }}>
                  <TextField
                    id="street"
                    label="Street"
                    variant="outlined"
                    fullWidth
                    {...register('address.street')}
                    error={!!errors?.address?.street}
                    helperText={errors?.address?.street?.message}
                  />
                </Grid>
                <Grid size={{ sm: 4 }}>
                  <TextField
                    id="apt"
                    label="Apt"
                    variant="outlined"
                    fullWidth
                    {...register('address.apt')}
                    error={!!errors?.address?.apt}
                    helperText={errors?.address?.apt?.message}
                  />
                </Grid>
                <Grid size={{ sm: 4 }}>
                  <TextField
                    id="city"
                    label="City"
                    variant="outlined"
                    fullWidth
                    {...register('address.city')}
                    error={!!errors?.address?.city}
                    helperText={errors?.address?.city?.message}
                  />
                </Grid>
                <Grid size={{ sm: 4 }}>
                  <TextField
                    id="state"
                    label="State"
                    variant="outlined"
                    fullWidth
                    {...register('address.state')}
                    error={!!errors?.address?.state}
                    helperText={errors?.address?.state?.message}
                  />
                </Grid>
                <Grid size={{ sm: 4 }}>
                  <Controller
                    name={'address.countryCode'}
                    control={control}
                    render={({ field }) => (
                      <CountrySelect
                        value={field.value}
                        onChange={field.onChange}
                        renderInput={(params) => (
                          <TextField
                            required
                            {...params}
                            fullWidth
                            label="Choose Country"
                            error={!!errors?.address?.countryCode}
                            helperText={errors?.address?.countryCode?.message}
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
                <Grid size={{ sm: 4 }}>
                  <TextField
                    required
                    id="zipCode"
                    label="Zip Code"
                    variant="outlined"
                    type="number"
                    fullWidth
                    {...register('address.zipCode')}
                    error={!!errors?.address?.zipCode}
                    helperText={errors?.address?.zipCode?.message}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid container size={{ sm: 12 }}>
              <Grid size={{ sm: 12, md: 4 }}>
                <Controller
                  name={`phoneNumber`}
                  control={control}
                  render={({ field }) => (
                    <MuiTelInput
                      required
                      fullWidth
                      label="Phone Number"
                      defaultCountry="US"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      error={!!errors?.phoneNumber?.message}
                      helperText={errors?.phoneNumber?.message}
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
                  {...register('email')}
                  error={!!errors.email?.message}
                  helperText={errors.email?.message}
                />
              </Grid>
            </Grid>
            <Grid size={{ sm: 12 }}>
              <TextField
                id="summary"
                label="Summary"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                {...register('summary')}
                error={!!errors?.summary?.message}
                helperText={errors?.summary?.message}
              />
            </Grid>
            <Grid size={{ sm: 12 }}>
              <Typography variant="h5" gutterBottom>
                Languages
              </Typography>
              {languagesFieldArray.fields.map((language, index) => (
                <Grid
                  container
                  key={language.id}
                  size={{ sm: 12 }}
                  spacing={FIELDS_SPACING}
                >
                  <Grid container size={{ sm: 12 }}>
                    <Grid size={{ sm: 4 }}>
                      <TextField
                        required
                        id="name"
                        label="Name"
                        variant="outlined"
                        fullWidth
                        {...register(`languages.${index}.name`)}
                        error={!!errors?.languages?.[index]?.name}
                        helperText={errors?.languages?.[index]?.name?.message}
                      />
                    </Grid>
                  </Grid>
                  <Grid size={{ sm: 12, md: 4 }}>
                    <FormControl
                      required
                      error={!!errors?.languages?.[index]?.readingLevel}
                      fullWidth
                    >
                      <InputLabel id="language-reading-level-select-label">
                        Reading Level
                      </InputLabel>
                      <Controller
                        name={`languages.${index}.readingLevel`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="language-reading-level-select-label"
                            label="Select Level"
                          >
                            {optionsFromEnum(LanguageProficiencyLevel).map(
                              (option) => (
                                <MenuItem key={option.key} value={option.key}>
                                  {option.value}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        )}
                      />
                      {errors.languages?.[index]?.readingLevel && (
                        <FormHelperText error={true}>
                          {errors.languages?.[index]?.readingLevel?.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid size={{ sm: 12, md: 4 }}>
                    <FormControl
                      required
                      error={!!errors?.languages?.[index]?.speakingLevel}
                      fullWidth
                    >
                      <InputLabel id="language-speaking-level-select-label">
                        Speaking Level
                      </InputLabel>
                      <Controller
                        name={`languages.${index}.speakingLevel`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="language-speaking-level-select-label"
                            label="Select Level"
                          >
                            {optionsFromEnum(LanguageProficiencyLevel).map(
                              (option) => (
                                <MenuItem key={option.key} value={option.key}>
                                  {option.value}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        )}
                      />
                      {errors.languages?.[index]?.speakingLevel && (
                        <FormHelperText error={true}>
                          {errors.languages?.[index]?.speakingLevel?.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid size={{ sm: 12, md: 4 }}>
                    <FormControl
                      error={!!errors?.languages?.[index]?.listeningLevel}
                      fullWidth
                    >
                      <InputLabel
                        required
                        id="language-listening-level-select-label"
                      >
                        Listening Level
                      </InputLabel>
                      <Controller
                        name={`languages.${index}.listeningLevel`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="language-listening-level-select-label"
                            label="Select Level"
                          >
                            {optionsFromEnum(LanguageProficiencyLevel).map(
                              (option) => (
                                <MenuItem key={option.key} value={option.key}>
                                  {option.value}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        )}
                      />
                      {errors.languages?.[index]?.listeningLevel && (
                        <FormHelperText error={true}>
                          {errors.languages?.[index]?.listeningLevel?.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid size={{ sm: 12, md: 4 }}>
                    <FormControl
                      required
                      error={!!errors?.languages?.[index]?.writingLevel}
                      fullWidth
                    >
                      <InputLabel id="language-writing-level-select-label">
                        Writing Level
                      </InputLabel>
                      <Controller
                        name={`languages.${index}.writingLevel`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="language-writing-level-select-label"
                            label="Select Level"
                          >
                            {optionsFromEnum(LanguageProficiencyLevel).map(
                              (option) => (
                                <MenuItem key={option.key} value={option.key}>
                                  {option.value}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        )}
                      />
                      {errors.languages?.[index]?.writingLevel && (
                        <FormHelperText error={true}>
                          {errors.languages?.[index]?.writingLevel?.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid
                    size={{ sm: 12 }}
                    display="flex"
                    justifyContent="flex-end"
                  >
                    <Button
                      onClick={() => languagesFieldArray.remove(index)}
                      startIcon={<RemoveIcon />}
                      style={{ textTransform: 'none' }}
                    >
                      Remove language
                    </Button>
                  </Grid>
                </Grid>
              ))}
              <Box>
                <Button
                  onClick={onAddLanguage}
                  startIcon={<AddIcon />}
                  style={{ textTransform: 'none' }}
                >
                  Add language
                </Button>
              </Box>
            </Grid>
            <Grid size={{ sm: 12 }}>
              <Controller
                name="resumeUrl"
                control={control}
                render={({ field }) => (
                  <ResumeManagement
                    resumeUrl={field.value || undefined}
                    onChange={field.onChange}
                  />
                )}
              />
            </Grid>
            <Grid size={{ sm: 12 }}>
              <Typography variant="h5" gutterBottom>
                Websites
              </Typography>
              {websitesFieldArray.fields.map((website, index) => (
                <Grid
                  container
                  key={website.id}
                  size={{ sm: 12 }}
                  my={FIELDS_SPACING}
                >
                  <Grid size={{ sm: 4 }} alignContent="center">
                    <Typography>{website.name}</Typography>
                  </Grid>
                  <Grid size={{ sm: 6 }}>
                    <TextField
                      id="websiteUrl"
                      label="Website URL"
                      variant="outlined"
                      fullWidth
                      {...register(`websites.${index}.url`)}
                      error={!!errors?.websites?.[index]?.url}
                      helperText={errors?.websites?.[index]?.url?.message}
                    />
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Panel>
      </BaseStepForm>
    </Box>
  );
};

export default BasicInformationStepForm;
