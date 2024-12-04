import Masonry from '@mui/lab/Masonry';
import { Box, Grid2 as Grid } from '@mui/material';
import { FIELDS_SPACING } from '../../../constants/Spacing';
import BasicInfoBlock, { BasicInfo } from './BasicInfoBlock/BasicInfoBlock';
import CertificationsPanel from './CertificationsPanel/CertificationsPanel';
import EducationPanel from './EducationPanel/EducationPanel';
import ExperiencePanel from './ExperiencePanel/ExperiencePanel';
import LanguagesPanel from './LanguagesPanel/LanguagesPanel';
import ProjectsPanel from './ProjectsPanel/ProjectsPanel';
import SkillsPanel from './SkillsPanel/SkillsPanel';
import useCandidateProfileStore from './store';
import SummaryPanel from './SummaryPanel/SummaryPanel';

const CandidateProfile = () => {
  const { user, candidateProfile } = useCandidateProfileStore();
  const basicInfo: BasicInfo = {
    ...user!,
    bio: candidateProfile?.bio,
    jobTitle: candidateProfile?.jobTitle!,
    resumeUrl: candidateProfile?.resumeUrl,
    websites: candidateProfile?.websites,
  };

  return (
    <Box>
      <Grid container spacing={FIELDS_SPACING}>
        <Grid size={{ sm: 12, md: 4 }}>
          <Grid container spacing={FIELDS_SPACING}>
            <Grid size={12}>
              <BasicInfoBlock basicInfo={basicInfo} />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ sm: 12, md: 8 }}>
          <Grid container size={{ sm: 12 }} spacing={FIELDS_SPACING}>
            <Grid size={12}>
              <SummaryPanel summary={candidateProfile?.summary} />
            </Grid>
            <Grid size={12}>
              <ExperiencePanel experience={candidateProfile?.experience} />
            </Grid>
            <Grid size={12}>
              <Masonry
                columns={2}
                spacing={FIELDS_SPACING}
                sx={{ width: 'unset' }}
              >
                <EducationPanel education={candidateProfile?.education} />
                <SkillsPanel skills={candidateProfile?.skills} />
                <ProjectsPanel projects={candidateProfile?.projects} />
                <CertificationsPanel
                  certifications={candidateProfile?.certifications}
                />
                <LanguagesPanel languages={candidateProfile?.languages} />
              </Masonry>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CandidateProfile;
