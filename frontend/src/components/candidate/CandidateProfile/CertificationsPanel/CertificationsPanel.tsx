import { Certification } from '../../../../models/Certification';
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
  certifications?: Certification[];
}

const CertificationsPanel = ({ certifications }: Props) => {
  return (
    <Panel title="Certifications">
      {certifications && certifications?.length > 0
        ? certifications?.map((c, index) => (
            <Accordion key={index} variant="outlined">
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{c.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography gutterBottom>
                  <strong>Certification ID: </strong>
                  {c.credentialID}
                </Typography>
                <Typography gutterBottom>
                  <strong>Issued By: </strong>
                  {c.issuedBy}
                </Typography>
                <Typography gutterBottom>
                  <strong>Date Issued: </strong>
                  {dayjs(c.dateIssued)?.toDate().toLocaleDateString() || 'N/A'}
                </Typography>
                <Typography gutterBottom>
                  <strong>Date Expired: </strong>
                  {dayjs(c.expirationDate)?.toDate().toLocaleDateString() ||
                    'N/A'}
                </Typography>
                <Typography gutterBottom>
                  <strong>URL: </strong>
                  {c.url ? (
                    <a href={c.url} target="_blank">
                      {c.name}
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

export default CertificationsPanel;
