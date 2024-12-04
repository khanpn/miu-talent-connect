import {
  Box,
  Container,
  Grid2 as Grid,
  Link,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { CONTENT_PADDING } from '../../../constants/Spacing';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const StyledBoxDarker = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
}));

function Footer() {
  return (
    <StyledBox>
      <Stack>
        <Container>
          <Grid container>
            <Grid size={{ sm: 12, md: 6 }}>
              <Box color="primary.contrastText" py={CONTENT_PADDING}>
                <Typography
                  variant="h6"
                  gutterBottom
                  fontWeight="700"
                  textTransform="uppercase"
                >
                  Contact Info
                </Typography>
                <Typography>MIU Computer Science Dept.</Typography>
                <Typography>1000 North Fourth St.</Typography>
                <Typography gutterBottom>Fairfield, Iowa 52557 USA</Typography>
                <Link color="secondary.dark" href="mailto:csadmissions@mum.edu">
                  Email Us
                </Link>
              </Box>
            </Grid>
            <Grid
              display="flex"
              size={{ sm: 12, md: 6 }}
              justifyItems="center"
              alignItems="center"
            >
              <Stack direction="row" alignItems="baseline" spacing={1}>
                <Typography color="primary.contrastText" variant="h6">
                  Experienced IT Professionals.
                </Typography>
                <Typography color="secondary.dark" variant="h6">
                  <strong>ZERO FEES</strong>
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Container>
        <StyledBoxDarker>
          <Container>
            <Typography py={1} variant="subtitle2" color="primary.contrastText">
              © Copyright {new Date().getFullYear()}, MIU Talent Connect. All
              rights reserved.
            </Typography>
          </Container>
        </StyledBoxDarker>
      </Stack>
    </StyledBox>
  );
}

export default Footer;
