import { Dayjs } from 'dayjs';
import * as y from 'yup';

export const EducationStepFormSchema = y.object({
  education: y.array().of(
    y.object({
      degreeType: y
        .string()
        .max(255, 'Degree type is too long')
        .nullable()
        .required('Degree type is required'),
      degreeStatus: y
        .string()
        .max(255, 'Degree status is too long')
        .required('Degree status is required'),
      institution: y.object({
        name: y
          .string()
          .max(255, 'Name is too long')
          .required('Institution name is required'),
        location: y.object({
          city: y.string().max(255, 'City is too long').nullable(),
          state: y.string().max(255, 'State is too long').nullable(),
          countryCode: y.string().required('Country is required'),
        }),
      }),
      fieldOfStudy: y
        .string()
        .max(255, 'Field of study is too long')
        .required('Field of study is required'),
      startDate: y
        .mixed<Dayjs>()
        .nullable()
        .test('required', 'Start date is required', (value) => !!value),
      endDate: y.mixed<Dayjs>().nullable(),
      gpa: y.string().max(10, 'GPA is too long').nullable(),
    })
  ),
});

export type EducationStepFormType = y.InferType<typeof EducationStepFormSchema>;
