import { Typography } from '@mui/material';
import Panel from '../Panel/Panel';

interface Props {
  summary?: string;
}

const SummaryPanel = ({ summary }: Props) => {
  return (
    <Panel title="Summary">
      <Typography>{summary ? summary : 'N/A'}</Typography>
    </Panel>
  );
};

export default SummaryPanel;
