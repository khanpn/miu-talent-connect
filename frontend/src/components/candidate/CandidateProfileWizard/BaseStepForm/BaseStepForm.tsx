import { Box, Button } from '@mui/material';
import { ReactNode } from 'react';

export interface BaseStepFormProps {
  onNext: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  optional?: boolean;
  backLabel?: string;
  nextLabel?: string;
  skipLabel?: string;
  hasBack?: boolean;
  hasSkip?: boolean;
}

interface Props extends BaseStepFormProps {
  children: ReactNode;
}

const BaseStepForm = ({
  children,
  onBack,
  onNext,
  onSkip,
  optional,
  backLabel = 'Back',
  nextLabel = 'Next',
  skipLabel = 'Skip',
  hasBack = true,
  hasSkip = true,
}: Props) => {
  return (
    <Box>
      {children}
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        {hasBack && onBack && (
          <Button onClick={onBack} sx={{ mr: 1 }}>
            {backLabel}
          </Button>
        )}
        <Box sx={{ flex: '1 1 auto' }} />
        {optional && hasSkip && (
          <Button onClick={onSkip} sx={{ mr: 1 }}>
            {skipLabel}
          </Button>
        )}
        <Button variant="contained" onClick={onNext}>
          {nextLabel}
        </Button>
      </Box>
    </Box>
  );
};

export default BaseStepForm;
