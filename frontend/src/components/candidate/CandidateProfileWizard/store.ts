import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { BasicInformationStepFormType } from './BasicInformationStepForm/BasicInformationStepFormSchema';
import { ProfessionalExperienceStepFormType } from './ProfessionalExperienceStepForm/ProfessionalExperienceStepFormSchema';
import { EducationStepFormType } from './EducationStepForm/EducationStepFormSchema';
import { ReferencesStepFormType } from './ReferencesStepForm/ReferencesStepFormSchema';
import { User } from '../../../models/User';
import { CandidateProfile } from '../../../models/CandidateProfile';
import _ from 'lodash';
import dayjs from 'dayjs';

export type CandidateProfileWizardState = {
  userId: string;
  candidateProfileId: string;
  basicInformationStepForm: BasicInformationStepFormType;
  professionalExperienceStepForm: ProfessionalExperienceStepFormType;
  educationStepForm: EducationStepFormType;
  referencesStepForm: ReferencesStepFormType;
};

type Action = {
  updateBasicInformationStepForm: (
    value: CandidateProfileWizardState['basicInformationStepForm']
  ) => void;
  updateProfessionalExperienceStepForm: (
    value: CandidateProfileWizardState['professionalExperienceStepForm']
  ) => void;
  updateEducationStepForm: (
    value: CandidateProfileWizardState['educationStepForm']
  ) => void;
  updateReferencesStepForm: (
    value: CandidateProfileWizardState['referencesStepForm']
  ) => void;
  setState: (state: CandidateProfileWizardState) => void;
};

export const mapRestModelsToState = (
  user: User,
  candidateProfile: CandidateProfile
): CandidateProfileWizardState => {
  return {
    userId: user.id!,
    candidateProfileId: candidateProfile.id!,
    basicInformationStepForm: {
      jobTitle: candidateProfile.jobTitle,
      profilePictureUrl: user.profilePictureUrl,
      bio: candidateProfile.bio,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      address: {
        street: candidateProfile.address?.street,
        apt: candidateProfile.address?.apt,
        city: candidateProfile.address?.city,
        state: candidateProfile.address?.state,
        countryCode: candidateProfile.address?.countryCode,
        zipCode: candidateProfile.address?.zipCode || '',
      },
      pronoun: user.pronoun || '',
      email: user.email,
      phoneNumber: user.phoneNumber,
      summary: candidateProfile.summary,
      languages: candidateProfile.languages,
      resumeUrl: candidateProfile.resumeUrl,
      websites: !_.isEmpty(candidateProfile.websites)
        ? candidateProfile.websites
        : [
            {
              name: 'LinkedIn',
              url: '',
            },
            {
              name: 'GitHub',
              url: '',
            },
            {
              name: 'Portfolio',
              url: '',
            },
          ],
    },
    professionalExperienceStepForm: {
      experience: candidateProfile.experience?.map((e) => ({
        ...e,
        startDate: dayjs(e.startDate),
        endDate: dayjs(e.endDate),
        location: { ...e.location, countryCode: e.location?.countryCode || '' },
      })),
      primaryTechnologies: candidateProfile.primaryTechnologies,
      skills: candidateProfile.skills,
      projects: candidateProfile.projects?.map((e) => ({
        ...e,
        startDate: dayjs(e.startDate),
        endDate: dayjs(e.endDate),
      })),
      certifications: candidateProfile.certifications?.map((e) => ({
        ...e,
        dateIssued: dayjs(e.dateIssued),
        expirationDate: dayjs(e.expirationDate),
      })),
    },
    educationStepForm: {
      education: candidateProfile.education?.map((e) => ({
        ...e,
        degreeStatus: e.degreeStatus || '',
        startDate: dayjs(e.startDate),
        endDate: dayjs(e.endDate),
        institution: {
          ...e.institution,
        },
      })),
    },
    referencesStepForm: {
      references: candidateProfile.references,
    },
  };
};

const useCandidateProfileWizardStore = create<
  CandidateProfileWizardState & Action
>()(
  devtools(
    persist(
      (set) => ({
        userId: '',
        candidateProfileId: '',
        basicInformationStepForm: {
          firstName: '',
          lastName: '',
          jobTitle: '',
          address: {
            countryCode: '',
            zipCode: '',
          },
          pronoun: 'OTHER',
          email: '',
          phoneNumber: '',
          languages: [],
          websites: [
            {
              name: 'LinkedIn',
              url: '',
            },
            {
              name: 'GitHub',
              url: '',
            },
            {
              name: 'Portfolio',
              url: '',
            },
          ],
        },
        professionalExperienceStepForm: {
          experience: [
            {
              company: '',
              jobTitle: '',
              location: {
                countryCode: '',
              },
            },
          ],
          skills: [],
        },
        educationStepForm: {
          education: [
            {
              degreeType: '',
              fieldOfStudy: '',
              institution: {
                name: '',
                location: {
                  countryCode: '',
                },
              },
              degreeStatus: '',
            },
          ],
        },
        referencesStepForm: {
          references: [],
        },
        updateBasicInformationStepForm: (basicInformationStepForm) =>
          set(() => ({ basicInformationStepForm: basicInformationStepForm })),
        updateProfessionalExperienceStepForm: (
          professionalExperienceStepForm
        ) =>
          set(() => ({
            professionalExperienceStepForm,
          })),
        updateEducationStepForm: (educationStepForm) =>
          set(() => ({ educationStepForm })),
        updateReferencesStepForm: (referencesStepForm) =>
          set(() => ({ referencesStepForm })),
        setState: (state) =>
          set(() => ({
            ...state,
          })),
      }),
      {
        name: 'candidate-profile-wizard-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useCandidateProfileWizardStore;
