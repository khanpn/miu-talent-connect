import { Language } from '../../../../models/Languague';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LanguageProficiencyLevel } from '../../../../models/LangaugeProficiencyLevel';
import Panel from '../../../common/Panel/Panel';

interface Props {
  languages?: Language[];
}

const LanguagesPanel = ({ languages }: Props) => {
  return (
    <Panel title="Languages">
      {languages && languages.length > 0
        ? languages.map((l) => (
            <Accordion key={l.name} variant="outlined">
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {l.name}
              </AccordionSummary>
              <AccordionDetails>
                <Typography gutterBottom>
                  <strong>Reading Level: </strong>
                  {l.readingLevel
                    ? LanguageProficiencyLevel[
                        l.readingLevel as keyof typeof LanguageProficiencyLevel
                      ]
                    : 'N/A'}
                </Typography>
                <Typography gutterBottom>
                  <strong>Listening Level: </strong>
                  {l.listeningLevel
                    ? LanguageProficiencyLevel[
                        l.listeningLevel as keyof typeof LanguageProficiencyLevel
                      ]
                    : 'N/A'}
                </Typography>
                <Typography gutterBottom>
                  <strong>Specking Level: </strong>
                  {l.speakingLevel
                    ? LanguageProficiencyLevel[
                        l.speakingLevel as keyof typeof LanguageProficiencyLevel
                      ]
                    : 'N/A'}
                </Typography>
                <Typography gutterBottom>
                  <strong>Writing Level: </strong>
                  {l.writingLevel
                    ? LanguageProficiencyLevel[
                        l.writingLevel as keyof typeof LanguageProficiencyLevel
                      ]
                    : 'N/A'}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        : 'N/A'}
    </Panel>
  );
};

export default LanguagesPanel;
