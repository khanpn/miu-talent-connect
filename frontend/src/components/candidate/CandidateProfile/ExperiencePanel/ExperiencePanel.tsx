import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { WorkExperience } from '../../../../models/WorkExperience';
import { getAddressAsString } from '../../../../utils/AddressUtils';
import dayjs from 'dayjs';
import Panel from '../../../common/Panel/Panel';

interface Props {
  experience?: WorkExperience[];
}

const ExperiencePanel = ({ experience }: Props) => {
  return (
    <Panel title="Experience">
      {experience && experience.length > 0
        ? experience?.map((e, index) => (
            <Accordion key={index} variant="outlined">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="experience-panel-content"
                id="experience-panel-header"
              >
                <Typography>
                  {e.jobTitle}
                  {', '}
                  {e.company}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {e.location && (
                  <Typography gutterBottom>
                    {getAddressAsString(e.location)}
                  </Typography>
                )}
                <Typography gutterBottom>
                  <em>
                    {e.startDate
                      ? dayjs(e.startDate)?.toDate().toLocaleDateString()
                      : 'N/A'}
                    {' - '}
                    {e.endDate
                      ? dayjs(e.endDate)?.toDate().toLocaleDateString()
                      : 'N/A'}
                  </em>
                </Typography>
                <Typography>
                  <strong>Responsibilities:</strong>
                </Typography>
                {e.responsibilities?.split('\n')?.map((r, idx2) => (
                  <List key={idx2}>
                    <ListItem>
                      <ListItemText>{r}</ListItemText>
                    </ListItem>
                  </List>
                ))}
              </AccordionDetails>
            </Accordion>
          ))
        : 'N/A'}
    </Panel>
  );
};

export default ExperiencePanel;
