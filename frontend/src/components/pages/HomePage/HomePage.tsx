import {
  Box,
  Button,
  Container,
  Divider,
  Grid2 as Grid,
  styled,
} from '@mui/material';
import CandidateList from '../../candidate/CandidateList/CandidateList';
import CandidateFilters from '../../common/CandidateFilters/CandidateFilters';
import StandardLayout from '../../layouts/StandardLayout/StandardLayout';
import { CONTENT_PADDING } from '../../../constants/Spacing';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: '1px',
  borderRight: `1px solid ${theme.palette.secondary.main}`,
  borderLeft: `1px solid ${theme.palette.secondary.main}`,
  borderColor: theme.palette.secondary.main,
  backgroundColor: theme.palette.secondary.main,
  display: 'flex',
  justifyContent: 'space-between',
  height: '56px',
}));

const StyledLeftPanel = styled(Box)(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  height: '100%',
  backgroundColor: '#f6f6f7',
}));

function HomePage() {
  return (
    <StandardLayout>
      <StyledContainer>
        <Button fullWidth>Home</Button>
        <Divider flexItem orientation="vertical" variant="middle" />
        <Button fullWidth>How To Hire</Button>
        <Divider flexItem orientation="vertical" variant="middle" />
        <Button fullWidth>Employee Forms</Button>
        <Divider flexItem orientation="vertical" variant="middle" />
        <Button fullWidth>FAQ</Button>
        <Divider flexItem orientation="vertical" variant="middle" />
        <Button fullWidth>Contact US</Button>
      </StyledContainer>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          p: CONTENT_PADDING,
        }}
      >
        <Grid container sx={{ flexGrow: 1 }} spacing={CONTENT_PADDING}>
          <Grid size={{ sm: 12, md: 3 }}>
            <StyledLeftPanel>
              <CandidateFilters />
            </StyledLeftPanel>
          </Grid>
          <Grid size={{ sm: 12, md: 9 }}>
            <Container disableGutters>
              <CandidateList />
            </Container>
          </Grid>
        </Grid>
      </Box>
    </StandardLayout>
  );
}

export default HomePage;
