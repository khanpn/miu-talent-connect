import { Box, Button } from '@mui/material';
import { ReactNode, useState } from 'react';

interface Props {
  limit?: number;
  children: ReactNode;
}

const ExpandableText = ({ children, limit = 200 }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const text = children?.toString() || '';

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const displayText = isExpanded
    ? text
    : `${text.slice(0, limit)}${text.length > limit ? '...' : ''}`;

  return (
    <Box>
      {displayText}
      {text.length > limit && (
        <Button
          variant="text"
          onClick={toggleExpand}
          style={{ textTransform: 'none' }}
        >
          {isExpanded ? 'Read less' : 'Read more'}
        </Button>
      )}
    </Box>
  );
};

export default ExpandableText;
