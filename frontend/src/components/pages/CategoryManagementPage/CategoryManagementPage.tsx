import { Home } from '@mui/icons-material';
import CategoryIcon from '@mui/icons-material/Category';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONTENT_PADDING } from '../../../constants/Spacing';
import { useAuth } from '../../../hooks/useAuth';
import Breadcrumbs, {
  BreadcrumbItem,
} from '../../common/Breadcrumbs/Breadcrumbs';
import StandardLayout from '../../layouts/StandardLayout/StandardLayout';
import CategoryManagement from '../../management/CategoryManagement/CategoryManagement';

const BREADSCRUM_ITEMS: BreadcrumbItem[] = [
  {
    label: 'Home',
    icon: Home,
    path: '/',
  },
  {
    label: 'Category Management',
    icon: CategoryIcon,
    isActive: true,
  },
];

const CategoryManagementPage = () => {
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
      <Box p={CONTENT_PADDING}>
        <CategoryManagement />
      </Box>
    </StandardLayout>
  );
};

export default CategoryManagementPage;
