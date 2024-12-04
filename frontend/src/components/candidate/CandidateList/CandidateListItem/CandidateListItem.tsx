import AnalyticsIcon from '@mui/icons-material/AnalyticsOutlined';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CONTENT_PADDING, FIELDS_SPACING } from '../../../../constants/Spacing';
import { CandidateProfileStatus } from '../../../../models/CandidateProfileStatus';
import { CandidateSearch } from '../../../../models/CandidateSearch';
import Skill from '../../../../models/Skill';
import DocumentModal from '../../../common/DocumentModal/DocumentModal';
import ExpandableText from '../../../common/ExpandableText/ExpandableText';
import FileDownload from '../../../common/FileDownload/FileDownload';

const StyledBox = styled(Box)(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
}));

const SkillsTable = ({ skills }: { skills: Skill[] }) => {
  return (
    <TableContainer component={StyledBox}>
      <Table sx={{ minWidth: 450 }} aria-label="Skills Matrix table">
        <TableHead>
          <TableRow>
            <TableCell>Skill Name</TableCell>
            <TableCell align="right">Year Of Experiance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {skills?.map((skill, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {skill.name}
              </TableCell>
              <TableCell align="right">{skill.yearOfExperience}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

interface Props {
  profile: CandidateSearch;
  index: number;
  showSkillsMetrix?: boolean;
}

const CandidateListItem = ({
  profile: {
    firstName,
    lastName,
    jobTitle,
    summary,
    primaryTechnologies,
    profilePictureUrl,
    skills,
    resumeUrl,
    profileStatus,
    userId,
  },
  showSkillsMetrix,
}: Props) => {
  const [skillsMextrixDialogOpen, setSkillsMextrixDialogOpen] = useState(false);

  const handleCloseSkillsMextrixDialog = () =>
    setSkillsMextrixDialogOpen(false);

  const descriptionElementRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (skillsMextrixDialogOpen) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [skillsMextrixDialogOpen]);

  return (
    <StyledBox>
      <Stack direction="column" spacing={FIELDS_SPACING} p={CONTENT_PADDING}>
        <Stack direction="row" spacing={FIELDS_SPACING} alignItems="center">
          <Link target="_blank" to={`/candidate-profile/${userId}`}>
            <Avatar
              src={profilePictureUrl}
              variant="circular"
              sx={{ width: 75, height: 75 }}
            />
          </Link>
          <Stack direction="column" spacing={1}>
            <Typography variant="h6" color="primary">
              {`${firstName} ${lastName}`}
              {' - '}
              {jobTitle}{' '}
              {CandidateProfileStatus[
                `${profileStatus}` as keyof typeof CandidateProfileStatus
              ] === CandidateProfileStatus.VERIFIED && <VerifiedUserIcon />}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="flex-start">
              {!showSkillsMetrix && (
                <Button
                  onClick={() => setSkillsMextrixDialogOpen(true)}
                  variant="contained"
                  startIcon={<AnalyticsIcon />}
                  size="small"
                  style={{ textTransform: 'none' }}
                >
                  Skills Metrix
                </Button>
              )}
              <FileDownload btnLabel="Resume" fileUrl={resumeUrl} />
              <DocumentModal
                disabled={!resumeUrl}
                btnLabel="Resume"
                docs={[{ uri: resumeUrl! }]}
              />
            </Stack>
          </Stack>
        </Stack>
        <Divider />
        <ExpandableText>{summary}</ExpandableText>
        <Stack direction="row" spacing={1}>
          <Typography>
            <strong>Primary Technologies:</strong>
          </Typography>
          {primaryTechnologies?.map((skill, index) => (
            <Chip key={index} label={skill} size="small" />
          ))}
        </Stack>
        {showSkillsMetrix && (
          <Box>
            <Typography gutterBottom>
              <strong>Skills Metrix</strong>
            </Typography>
            <SkillsTable skills={skills!} />
          </Box>
        )}
      </Stack>

      {!showSkillsMetrix && (
        <Dialog
          open={skillsMextrixDialogOpen}
          onClose={handleCloseSkillsMextrixDialog}
          scroll="paper"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">
            Skills Matrix - {`${firstName} ${lastName}`}
          </DialogTitle>
          <DialogContent dividers={true}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 450 }} aria-label="Skills Matrix table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Skill Name</TableCell>
                      <TableCell align="right">Year Of Experiance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {skills?.map((skill, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {skill.name}
                        </TableCell>
                        <TableCell align="right">
                          {skill.yearOfExperience}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSkillsMextrixDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </StyledBox>
  );
};

export default CandidateListItem;
