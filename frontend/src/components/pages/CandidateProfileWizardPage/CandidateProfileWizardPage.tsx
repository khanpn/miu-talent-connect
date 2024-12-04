import { AutoFixHigh, Home } from '@mui/icons-material';
import DoneIcon from '@mui/icons-material/Done';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import { Box, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CONTENT_PADDING } from '../../../constants/Spacing';
import { useAuth } from '../../../hooks/useAuth';
import useFetchCandidate from '../../../hooks/useFetchCandidate';
import { CandidateProfile } from '../../../models/CandidateProfile';
import { User } from '../../../models/User';
import halClient from '../../../rest/halClient';
import BasicInformationStepForm from '../../candidate/CandidateProfileWizard/BasicInformationStepForm/BasicInformationStepForm';
import CandidateProfileWizard, {
  Step,
} from '../../candidate/CandidateProfileWizard/CandidateProfileWizard';
import EducationStepForm from '../../candidate/CandidateProfileWizard/EducationStepForm/EducationStepForm';
import ProfessionalExperienceStepForm from '../../candidate/CandidateProfileWizard/ProfessionalExperienceStepForm/ProfessionalExperienceStepForm';
import ReferencesStepForm from '../../candidate/CandidateProfileWizard/ReferencesStepForm/ReferencesStepForm';
import useCandidateProfileWizardStore, {
  mapRestModelsToState,
} from '../../candidate/CandidateProfileWizard/store';
import SubmissionStepForm from '../../candidate/CandidateProfileWizard/SubmissionStepForm/SubmissionStepForm';
import Breadcrumbs, {
  BreadcrumbItem,
} from '../../common/Breadcrumbs/Breadcrumbs';
import PageLoading from '../../common/PageLoading/PageLoading';
import StandardLayout from '../../layouts/StandardLayout/StandardLayout';

const BREADSCRUM_ITEMS: BreadcrumbItem[] = [
  {
    label: 'Home',
    icon: Home,
    path: '/',
  },
  {
    label: 'Profile Wizard',
    icon: AutoFixHigh,
    isActive: true,
  },
];

const PageSkeleton = () => {
  return (
    <>
      <StandardLayout>
        <Breadcrumbs items={BREADSCRUM_ITEMS} />
        <Box p={CONTENT_PADDING}>
          <Skeleton sx={{ height: 500 }} />
        </Box>
      </StandardLayout>
      <PageLoading open={true} />
    </>
  );
};

const steps: Step[] = [
  {
    name: 'Basic Information',
    Component: BasicInformationStepForm,
    icon: PersonIcon,
  },
  {
    name: 'Professional Experience',
    Component: ProfessionalExperienceStepForm,
    icon: WorkIcon,
  },
  {
    name: 'Education',
    Component: EducationStepForm,
    optional: true,
    icon: SchoolIcon,
  },
  {
    name: 'References',
    Component: ReferencesStepForm,
    optional: true,
    icon: GroupsIcon,
  },
  {
    name: 'Submission',
    Component: SubmissionStepForm,
    icon: DoneIcon,
  },
];

const CandidateProfileWizardPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { authenticated, user } = useAuth();

  useEffect(() => {
    if (!authenticated || !userId || user?.id !== userId) {
      navigate('/');
    }
  }, [authenticated, userId]);

  const [loading, setLoading] = useState(false);
  const setCandidateProfileWizardState = useCandidateProfileWizardStore(
    (state) => state.setState
  );

  const { data, isError, isLoading, error } = useFetchCandidate({
    userId: userId!,
  });

  if (isError) throw error;

  useEffect(() => {
    if (data?._links) {
      setLoading(true);
      const userAwait = halClient.followLinkOfSigleResource<User>(
        data._links,
        'user'
      );
      const candidateProfileAwait =
        halClient.followLinkOfSigleResource<CandidateProfile>(
          data._links,
          'profile'
        );
      Promise.all([userAwait, candidateProfileAwait]).then((values) => {
        setLoading(false);
        const userData = values[0];
        const candidateProfile = values[1];
        const state = mapRestModelsToState(userData, candidateProfile);
        setCandidateProfileWizardState(state);
      });
    }
  }, [data]);

  if (isLoading || loading) return <PageSkeleton />;

  return (
    <>
      <StandardLayout>
        <Breadcrumbs items={BREADSCRUM_ITEMS} />
        <Box p={CONTENT_PADDING}>
          <CandidateProfileWizard steps={steps} />
        </Box>
      </StandardLayout>
    </>
  );
};

export default CandidateProfileWizardPage;
