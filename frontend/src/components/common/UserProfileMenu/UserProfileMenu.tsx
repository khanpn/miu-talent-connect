import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CategoryIcon from '@mui/icons-material/Category';
import GroupsIcon from '@mui/icons-material/Groups';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import SyncIcon from '@mui/icons-material/Sync';
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { MouseEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import useAuthStore from '../../../stores/AuthStore';
import useTokenStore from '../../../stores/TokenStore';

const UserProfileMenu = () => {
  const navigate = useNavigate();
  const {
    user,
    clearUser,
    hasAdminRole,
    hasSystemAdminRole,
    hasCandidateRole,
    hasEmployerRole,
  } = useAuthStore();
  const { clearTokens } = useTokenStore();
  const { authenticated } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    clearTokens();
    clearUser();
    handleMenuClose();
    navigate('/');
  };

  return (
    <Box pt={1}>
      {authenticated ? (
        <Box display="flex" flexDirection="row" alignItems="center">
          <Typography color="primary.contrastText">
            Hello, {user!.firstName}
          </Typography>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar
                src={user?.profilePictureUrl}
                alt={user?.firstName}
                sx={{ bgcolor: 'primary.light' }}
              >
                {!user?.profilePictureUrl &&
                  user?.firstName.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {hasCandidateRole() && (
              <MenuItem
                onClick={() => navigate(`/candidate-profile/${user?.id}`)}
              >
                <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography>Profile</Typography>
              </MenuItem>
            )}
            {hasAdminRole() && (
              <MenuItem onClick={() => navigate('/candidate-management')}>
                <GroupsIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography>Candidate Management</Typography>
              </MenuItem>
            )}
            {hasAdminRole() && (
              <MenuItem onClick={() => navigate('/employer-management')}>
                <GroupsIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography>Employer Management</Typography>
              </MenuItem>
            )}
            {hasSystemAdminRole() && (
              <MenuItem onClick={() => navigate('/administrator-management')}>
                <AdminPanelSettingsIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography>Admin User Management</Typography>
              </MenuItem>
            )}
            {hasAdminRole() && <Divider />}
            {hasAdminRole() && (
              <MenuItem onClick={() => navigate('/category-management')}>
                <CategoryIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography>Category Management</Typography>
              </MenuItem>
            )}
            {hasAdminRole() && (
              <MenuItem onClick={() => navigate('/search-data-management')}>
                <SyncIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography>Search Data Sync</Typography>
              </MenuItem>
            )}
            {hasAdminRole() && <Divider />}
            {hasEmployerRole() && (
              <MenuItem onClick={() => {}}>
                <GroupsIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography>Post Job</Typography>
              </MenuItem>
            )}
            <MenuItem onClick={() => navigate('/change-password')}>
              <LockIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography>Change Password</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography>Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      ) : (
        <Box>
          <Link to="/signup">
            <Button color="secondary" sx={{ textTransform: 'none' }}>
              Sign Up
            </Button>
          </Link>
          <Link to="/login">
            <Button color="secondary" sx={{ textTransform: 'none' }}>
              Sign In
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default UserProfileMenu;
