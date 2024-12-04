import { Home } from '@mui/icons-material';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { Box, Container } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONTENT_PADDING } from '../../../constants/Spacing';
import { useAuth } from '../../../hooks/useAuth';
import Breadcrumbs, {
  BreadcrumbItem,
} from '../../common/Breadcrumbs/Breadcrumbs';
import StandardLayout from '../../layouts/StandardLayout/StandardLayout';
import EmployerManagement from '../../management/EmployerManagement/EmployerManagement';

const BREADSCRUM_ITEMS: BreadcrumbItem[] = [
  {
    label: 'Home',
    icon: Home,
    path: '/',
  },
  {
    label: 'Employer Management',
    icon: SupervisorAccountIcon,
    isActive: true,
  },
];

const EmployerManagementPage = () => {
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
        <EmployerManagement />
      </Container>
      <Box mb={CONTENT_PADDING} />
    </StandardLayout>
  );
};

export default EmployerManagementPage;
