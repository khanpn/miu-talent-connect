import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { User } from '../../../../models/User';
import FileDownload from '../../../common/FileDownload/FileDownload';
import DocumentModal from '../../../common/DocumentModal/DocumentModal';
import { Website } from '../../../../models/Website';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../../stores/AuthStore';
import { useMemo } from 'react';
import { CONTENT_PADDING } from '../../../../constants/Spacing';

const StyledContactInfo = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  borderRadius: theme.shape.borderRadius,
}));

export interface BasicInfo extends User {
  jobTitle: string;
  bio?: string;
  resumeUrl?: string;
  websites?: Website[];
}

interface Props {
  basicInfo: BasicInfo;
}

const BasicInfoBlock = ({ basicInfo }: Props) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const linkedInUrl = useMemo(
    () => basicInfo.websites?.find((w) => w.name === 'LinkedIn')?.url,
    [basicInfo?.websites]
  );

  const gitHubUrl = useMemo(
    () => basicInfo.websites?.find((w) => w.name === 'GitHub')?.url,
    [basicInfo?.websites]
  );

  const editProfile = () => {
    navigate(`/candidate-profile-wizard/${basicInfo.id}`);
  };
  return (
    <Box>
      <Paper variant="outlined">
        <Box padding={CONTENT_PADDING}>
          <Box display="flex" justifyContent="flex-end">
            {basicInfo.id === user?.id && (
              <Button
                onClick={editProfile}
                sx={{ textTransform: 'none' }}
                endIcon={<EditIcon />}
              >
                Edit Profile
              </Button>
            )}
          </Box>
          <Stack direction="column" alignItems="center">
            <Avatar
              src={basicInfo.profilePictureUrl}
              style={{ width: 160, height: 160 }}
            />
            <Stack pt={1} direction="row" spacing={1}>
              <IconButton
                color="primary"
                onClick={() => window.open(linkedInUrl, '_blank')}
                disabled={!linkedInUrl}
                aria-label="LinkedIn"
              >
                <LinkedInIcon color="inherit" fontSize="large" />
              </IconButton>
              <IconButton
                color="primary"
                onClick={() => window.open(gitHubUrl, '_blank')}
                disabled={!gitHubUrl}
                aria-label="GitHub"
              >
                <GitHubIcon fontSize="large" />
              </IconButton>
            </Stack>
            <Typography pt={1} variant="h4" gutterBottom>
              {`${basicInfo.firstName} ${basicInfo.lastName}`}
            </Typography>
            <Typography variant="h5">{basicInfo.jobTitle}</Typography>
            <Typography pt={2} pb={4} variant="subtitle1" gutterBottom>
              <FormatQuoteIcon />
              <em>{basicInfo.bio}</em>
            </Typography>
            <Stack sx={{ width: '100%' }} direction="row" spacing={1}>
              <FileDownload
                fullWidth
                color="info"
                btnLabel="Resume"
                fileUrl={basicInfo.resumeUrl}
              />
              <DocumentModal
                fullWidth
                btnLabel="Resume"
                docs={
                  basicInfo.resumeUrl ? [{ uri: basicInfo.resumeUrl! }] : []
                }
              />
            </Stack>
          </Stack>
          <StyledContactInfo mt={2}>
            <Stack p={2}>
              <Typography>
                <strong>Email: </strong>
                {basicInfo.email}
              </Typography>
              <Typography>
                <strong>Phone: </strong>
                {basicInfo.phoneNumber}
              </Typography>
            </Stack>
          </StyledContactInfo>
        </Box>
      </Paper>
    </Box>
  );
};

export default BasicInfoBlock;
