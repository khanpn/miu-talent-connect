import { Home } from '@mui/icons-material';
import SyncIcon from '@mui/icons-material/Sync';
import { Box, Container } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONTENT_PADDING } from '../../../constants/Spacing';
import { useAuth } from '../../../hooks/useAuth';
import Breadcrumbs, {
  BreadcrumbItem,
} from '../../common/Breadcrumbs/Breadcrumbs';
import StandardLayout from '../../layouts/StandardLayout/StandardLayout';
import SearchDataManagement from '../../management/SearchDataManagement/SearchDataManagement';

const BREADSCRUM_ITEMS: BreadcrumbItem[] = [
  {
    label: 'Home',
    icon: Home,
    path: '/',
  },
  {
    label: 'Search Data Management',
    icon: SyncIcon,
    isActive: true,
  },
];

const SearchDataManagementPage = () => {
  const navigate = useNavigate();
  const { authenticated, hasAdminRole } = useAuth();

  useEffect(() => {
    if (!authenticated || !hasAdminRole()) {
      navigate('/');
    }
  }, [authenticated]);

  return (
    <StandardLayout>
      <Breadcrumbs items={BREADSCRUM_ITEMS} />
      <Box mt="16px" />
      <Container disableGutters>
        <SearchDataManagement />
      </Container>
      <Box mb={CONTENT_PADDING} />
    </StandardLayout>
  );
};

export default SearchDataManagementPage;
