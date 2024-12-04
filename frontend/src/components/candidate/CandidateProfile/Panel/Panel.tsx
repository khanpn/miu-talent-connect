import { Box, Divider, styled, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { CONTENT_PADDING, FIELDS_SPACING } from '../../../../constants/Spacing';

const StyledBox = styled(Box)(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
}));

const Panel = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <StyledBox p={CONTENT_PADDING}>
      <Box>
        <Typography variant="h5" color="primary" gutterBottom>
          {title}
        </Typography>
      </Box>
      <Divider />
      <Box pt={FIELDS_SPACING}>{children}</Box>
    </StyledBox>
  );
};

export default Panel;
