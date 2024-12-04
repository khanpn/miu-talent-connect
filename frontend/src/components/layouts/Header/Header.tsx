import {
  Avatar,
  Box,
  Container,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import logo from '../../../assets/images/logo.svg';
import UserProfileMenu from '../../common/UserProfileMenu/UserProfileMenu';
import { Link } from 'react-router-dom';

const StyledBox = styled(Box)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.primary.main}`,
  borderLeft: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.primary.main,
}));

interface Props {
  hideProfileMenu?: boolean;
}

const Header = ({ hideProfileMenu }: Props) => {
  return (
    <StyledBox>
      <Container>
        <Stack direction="row" justifyContent="space-between">
          <Stack
            py={3}
            direction="row"
            spacing={1}
            display="flex"
            alignItems="center"
          >
            <Link to="/">
              <Avatar src={logo} sx={{ width: 90, height: 90 }} />
            </Link>
            <Box>
              <Typography
                variant="h5"
                color="primary.contrastText"
                fontWeight="500"
                textTransform="uppercase"
                pb="5px"
              >
                MIU Talent Connect
              </Typography>
              <Stack direction="row" alignItems="baseline" spacing={1}>
                <Typography color="primary.contrastText" variant="h6">
                  Experienced IT Professionals.
                </Typography>
                <Typography color="secondary.dark" variant="h6">
                  <strong>ZERO FEES</strong>
                </Typography>
              </Stack>
            </Box>
          </Stack>
          {!hideProfileMenu && <UserProfileMenu />}
        </Stack>
      </Container>
    </StyledBox>
  );
};

export default Header;
