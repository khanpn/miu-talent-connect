import Panel from '../../../common/Panel/Panel';
import ExpandableText from '../../../common/ExpandableText/ExpandableText';

interface Props {
  summary?: string;
}

const SummaryPanel = ({ summary }: Props) => {
  return (
    <Panel title="Summary">
      <ExpandableText limit={500}>{summary ? summary : 'N/A'}</ExpandableText>
    </Panel>
  );
};

export default SummaryPanel;
