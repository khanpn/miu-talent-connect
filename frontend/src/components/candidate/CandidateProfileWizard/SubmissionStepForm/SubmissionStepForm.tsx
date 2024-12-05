import { Box, FormHelperText, Typography } from '@mui/material';
import BaseStepForm, { BaseStepFormProps } from '../BaseStepForm/BaseStepForm';
import Panel from '../../../common/Panel/Panel';
import useCandidateProfileWizardStore from '../store';
import restClient from '../../../../rest/restClient';
import dayjs from 'dayjs';
import _ from 'lodash';
import { User } from '../../../../models/User';
import { CandidateProfile } from '../../../../models/CandidateProfile';
import { WorkExperience } from '../../../../models/WorkExperience';
import { Project } from '../../../../models/Project';
import Skill from '../../../../models/Skill';
import { Certification } from '../../../../models/Certification';
import { Education } from '../../../../models/Education';
import { CONTENT_PADDING } from '../../../../constants/Spacing';
import PageLoading from '../../../common/PageLoading/PageLoading';
import { useEffect, useState } from 'react';

const USER_RESOURCE_PATH = '/users';

const CANDIDATE_PROFILE_RESOURCE_PATH = '/candidateProfiles';

const SubmissionStepForm = (props: BaseStepFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const {
    userId,
    candidateProfileId,
    basicInformationStepForm: basicInfo,
    professionalExperienceStepForm: {
      experience,
      projects,
      primaryTechnologies,
      skills,
      certifications,
    },
    educationStepForm: { education },
    referencesStepForm: { references },
  } = useCandidateProfileWizardStore();

  useEffect(() => {
    if (success) {
      props.onNext();
    }
  }, [success]);

  const onSubmit = async () => {
    try {
      const userData: User = {
        id: userId,
        firstName: basicInfo.firstName,
        middleName: basicInfo.middleName || undefined,
        lastName: basicInfo.lastName,
        pronoun: basicInfo.pronoun,
        phoneNumber: basicInfo.phoneNumber,
        email: basicInfo.email,
        profilePictureUrl: basicInfo.profilePictureUrl || undefined,
      };

      const experienceData = experience?.map<WorkExperience>((e) => ({
        ...e,
        startDate: dayjs(e.startDate).toDate(),
        endDate: dayjs(e.endDate).toDate(),
        location: {
          ...e.location,
          city: e.location?.city || undefined,
          state: e.location?.state || undefined,
          countryCode: e.location?.countryCode,
        },
        responsibilities: e.responsibilities || undefined,
      }));

      const projectsData = projects?.map<Project>((e) => ({
        ...e,
        startDate: dayjs(e.startDate).toDate(),
        endDate: dayjs(e.endDate).toDate(),
        url: e.url || undefined,
      }));

      const skillsData: Skill[] =
        skills?.map<Skill>((e) => ({
          ...e,
          yearOfExperience:
            e.yearOfExperience || e.yearOfExperience || undefined,
        })) || [];

      const certificationsData = certifications?.map<Certification>((e) => ({
        ...e,
        dateIssued: dayjs(e.dateIssued).toDate(),
        expirationDate: dayjs(e.expirationDate).toDate(),
        url: e.url || undefined,
      }));

      const educationData = education?.map<Education>((e) => ({
        ...e,
        startDate: dayjs(e.startDate).toDate(),
        endDate: dayjs(e.endDate).toDate(),
        gpa: e.gpa || undefined,
        institution: {
          ...e.institution,
          name: e.institution?.name,
          location: {
            ...e.institution?.location,
            city: e.institution?.location?.city || undefined,
            state: e.institution?.location?.state || undefined,
            countryCode: e.institution?.location?.countryCode,
          },
        },
      }));

      const candidateProfile: CandidateProfile = {
        id: candidateProfileId,
        bio: basicInfo.bio || undefined,
        jobTitle: basicInfo.jobTitle,
        summary: basicInfo.summary || undefined,
        address: {
          ...basicInfo.address,
          street: basicInfo.address?.street || undefined,
          apt: basicInfo.address?.apt || undefined,
          city: basicInfo.address?.city || undefined,
          state: basicInfo.address?.state || undefined,
        },
        languages: basicInfo.languages,
        websites: basicInfo.websites?.map((e) => ({
          ...e,
          url: e.url || undefined,
        })),
        resumeUrl: basicInfo.resumeUrl || undefined,
        experience: experienceData || [],
        projects: projectsData,
        primaryTechnologies,
        skills: skillsData,
        certifications: certificationsData,
        education: educationData,
        references: references?.map((e) => ({
          ...e,
          middleName: e.middleName || undefined,
        })),
      };

      setSubmitting(true);
      await restClient.patch<User>(
        `${USER_RESOURCE_PATH}/${userData.id}`,
        userData
      );
      await restClient.patch<CandidateProfile>(
        `${CANDIDATE_PROFILE_RESOURCE_PATH}/${candidateProfile.id}`,
        candidateProfile
      );
      setSuccess(true);
    } catch (error) {
      setServerError(
        'There is an error occurred while submitting your profile update. Please try again later!'
      );
    }
    setSubmitting(false);
  };

  const onNext = async () => {
    await onSubmit();
  };

  const onBack = async () => {
    props.onBack && props.onBack();
  };

  return (
    <>
      <Box>
        <BaseStepForm
          {...props}
          onNext={onNext}
          onBack={onBack}
          nextLabel="Submit"
        >
          <Panel title="Submission">
            <Box p={CONTENT_PADDING}>
              {serverError ? (
                <FormHelperText style={{ fontSize: 18 }} error>
                  {serverError}
                </FormHelperText>
              ) : (
                <Typography fontSize={18}>
                  You have completed the process. Ready for submit?
                </Typography>
              )}
            </Box>
          </Panel>
        </BaseStepForm>
      </Box>
      <PageLoading open={submitting} />
    </>
  );
};

export default SubmissionStepForm;
