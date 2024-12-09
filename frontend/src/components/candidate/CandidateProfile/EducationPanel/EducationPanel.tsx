import { Education } from '../../../../models/Education';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getAddressAsString } from '../../../../utils/AddressUtils';
import dayjs from 'dayjs';
import Panel from '../../../common/Panel/Panel';
import { DegreeType } from '../../../../models/DegreeType';
import { DegreeStatus } from '../../../../models/DegreeStatus';

interface Props {
  education?: Education[];
}

const EducationPanel = ({ education }: Props) => {
  return (
    <Panel title="Education">
      {education && education?.length > 0
        ? education?.map((e, index) => (
            <Accordion key={index} variant="outlined">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="education-panel-content"
                id="education-panel-header"
              >
                <Typography>{e.institution.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography gutterBottom>
                  <strong>Degree type:</strong>{' '}
                  {e.degreeType
                    ? DegreeType[e.degreeType as keyof typeof DegreeType]
                    : 'N/A'}
                </Typography>
                <Typography gutterBottom>
                  <strong>Degree status:</strong>{' '}
                  {e.degreeStatus
                    ? DegreeStatus[e.degreeStatus as keyof typeof DegreeStatus]
                    : 'N/A'}
                </Typography>
                <Typography gutterBottom>
                  <strong>Field of study:</strong> {e.fieldOfStudy}
                </Typography>
                <Typography gutterBottom>
                  <strong>Location:</strong>{' '}
                  {getAddressAsString(e.institution.location) || 'N/A'}
                </Typography>
                <Typography gutterBottom>
                  <strong>GPA:</strong> {e.gpa || 'N/A'}
                </Typography>
                <Typography>
                  <strong>Period:</strong>{' '}
                  {(e.startDate
                    ? dayjs(e.startDate).toDate().toLocaleDateString()
                    : 'N/A') +
                    ' - ' +
                    (e.endDate
                      ? dayjs(e.endDate).toDate().toLocaleDateString()
                      : 'N/A')}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        : 'N/A'}
    </Panel>
  );
};

export default EducationPanel;
