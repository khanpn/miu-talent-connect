import { Dayjs } from 'dayjs';
import * as y from 'yup';

export const ProfessionalExperienceStepFormSchema = y.object({
  experience: y.array().of(
    y.object({
      company: y
        .string()
        .max(255, 'Company is too long')
        .required('Company is required'),
      jobTitle: y
        .string()
        .max(255, 'Job title is too long')
        .required('Job title is required'),
      location: y.object({
        city: y.string().max(255, 'City is too long').nullable(),
        state: y.string().max(255, 'State is too long').nullable(),
        countryCode: y.string().required('Country is required'),
      }),
      startDate: y
        .mixed<Dayjs>()
        .nullable()
        .test('required', 'Start date is required', (value) => !!value),
      endDate: y.mixed<Dayjs>().nullable(),
      responsibilities: y.string().max(2000, 'Responsibilities is too long'),
    })
  ),
  primaryTechnologies: y.array().of(y.string().required()),
  skills: y.array().of(
    y.object({
      name: y
        .string()
        .max(255, 'Skill name is too long')
        .required('Skill name is required'),
      yearOfExperience: y
        .number()
        .max(50, 'Year of experience is too large')
        .nullable(),
    })
  ),
  projects: y.array().of(
    y.object({
      name: y
        .string()
        .max(255, 'Project name is too long')
        .required('Project name is required'),
      description: y
        .string()
        .max(1000, 'Project description is too long')
        .required('Project description is required'),
      startDate: y
        .mixed<Dayjs>()
        .nullable()
        .test('required', 'Start date is required', (value) => !!value),
      endDate: y.mixed<Dayjs>().nullable(),
      technologiesUsed: y.string().max(1000, 'Technologies used is too long'),
      url: y.string().max(255, 'Project url is too long').nullable(),
    })
  ),
  certifications: y.array().of(
    y.object({
      name: y
        .string()
        .max(255, 'Certification name is too long')
        .required('Certification name is required'),
      issuedBy: y
        .string()
        .max(255, 'Certification issued by is too long')
        .required('Certification issued by is required'),
      credentialID: y
        .string()
        .max(255, 'Certification credential Id is too long')
        .nullable(),
      dateIssued: y
        .mixed<Dayjs>()
        .nullable()
        .test('required', 'Date issued is required', (value) => !!value),
      expirationDate: y.mixed<Dayjs>().nullable(),
      url: y.string().max(255, 'Certification url is too long').nullable(),
    })
  ),
});

export type ProfessionalExperienceStepFormType = y.InferType<
  typeof ProfessionalExperienceStepFormSchema
>;
