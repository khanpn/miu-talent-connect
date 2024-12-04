import { Home, Person } from '@mui/icons-material';
import { Box, Skeleton } from '@mui/material';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CONTENT_PADDING } from '../../../constants/Spacing';
import useFetchCandidate from '../../../hooks/useFetchCandidate';
import { CandidateProfile as CandidateProfileModel } from '../../../models/CandidateProfile';
import { User } from '../../../models/User';
import halClient from '../../../rest/halClient';
import CandidateProfile from '../../candidate/CandidateProfile/CandidateProfile';
import useCandidateProfileStore from '../../candidate/CandidateProfile/store';
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
    label: 'Profile',
    icon: Person,
    isActive: true,
  },
];

const PageSkeleton = () => {
  return (
    <>
      <StandardLayout>
        <Breadcrumbs items={BREADSCRUM_ITEMS} />
        <Box sx={{ p: CONTENT_PADDING }}>
          <Skeleton sx={{ height: 500 }} />
        </Box>
      </StandardLayout>
      <PageLoading open={true} />
    </>
  );
};

const CandidateProfilePage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  if (_.isNil(userId)) {
    navigate('/');
  }
  const [loading, setLoading] = useState(false);

  const { data, isError, isLoading, error } = useFetchCandidate({
    userId: userId!,
  });
  const setCandidateProfileState = useCandidateProfileStore(
    (state) => state.setState
  );

  if (isError) throw error;

  useEffect(() => {
    if (data?._links) {
      setLoading(true);
      const userAwait = halClient.followLinkOfSigleResource<User>(
        data._links,
        'user'
      );
      const candidateProfileAwait =
        halClient.followLinkOfSigleResource<CandidateProfileModel>(
          data._links,
          'profile'
        );
      Promise.all([userAwait, candidateProfileAwait]).then((values) => {
        setLoading(false);
        const user = values[0];
        const candidateProfile = values[1];
        setCandidateProfileState({ user, candidateProfile });
      });
    }
  }, [data]);

  if (isLoading || loading) return <PageSkeleton />;

  return (
    <StandardLayout>
      <Breadcrumbs items={BREADSCRUM_ITEMS} />
      <Box sx={{ p: CONTENT_PADDING }}>
        <CandidateProfile />
      </Box>
    </StandardLayout>
  );
};

export default CandidateProfilePage;
