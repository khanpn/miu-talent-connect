import { Project } from '../../../../models/Project';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs';
import Panel from '../../../common/Panel/Panel';

interface Props {
  projects?: Project[];
}

const ProjectsPanel = ({ projects }: Props) => {
  return (
    <Panel title="Projects">
      {projects && projects.length > 0
        ? projects.map((p, index) => (
            <Accordion key={index} variant="outlined">
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{p.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography gutterBottom>
                  <strong>Description: </strong>
                  {p.description}
                </Typography>
                <Typography gutterBottom>
                  <strong>Start Date: </strong>
                  {p.startDate
                    ? dayjs(p.startDate).toDate().toLocaleDateString()
                    : 'N/A'}
                </Typography>
                <Typography gutterBottom>
                  <strong>End Date: </strong>
                  {p.endDate
                    ? dayjs(p.endDate).toDate().toLocaleDateString()
                    : 'N/A'}
                </Typography>
                <Typography gutterBottom>
                  <strong>Technologies Used: </strong>
                  {p.technologiesUsed}
                </Typography>
                <Typography gutterBottom>
                  <strong>URL: </strong>
                  {p.url ? (
                    <a href={p.url} target="_blank">
                      {p.name}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        : 'N/A'}
    </Panel>
  );
};

export default ProjectsPanel;
