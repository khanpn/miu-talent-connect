import { Home } from '@mui/icons-material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Box, Container } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONTENT_PADDING } from '../../../constants/Spacing';
import { useAuth } from '../../../hooks/useAuth';
import Breadcrumbs, {
  BreadcrumbItem,
} from '../../common/Breadcrumbs/Breadcrumbs';
import StandardLayout from '../../layouts/StandardLayout/StandardLayout';
import AdministratorManagement from '../../management/AdministratorManagement/AdministratorManagement';

const BREADSCRUM_ITEMS: BreadcrumbItem[] = [
  {
    label: 'Home',
    icon: Home,
    path: '/',
  },
  {
    label: 'Administrator Management',
    icon: AdminPanelSettingsIcon,
    isActive: true,
  },
];

const AdministratorManagementPage = () => {
  const navigate = useNavigate();
  const { authenticated, hasSystemAdminRole } = useAuth();

  useEffect(() => {
    if (!authenticated || !hasSystemAdminRole()) {
      navigate('/');
    }
  }, [authenticated]);

  return (
    <StandardLayout>
      <Breadcrumbs items={BREADSCRUM_ITEMS} />
      <Box mt="16px" />
      <Container disableGutters>
        <AdministratorManagement />
      </Container>
      <Box mb={CONTENT_PADDING} />
    </StandardLayout>
  );
};

export default AdministratorManagementPage;
