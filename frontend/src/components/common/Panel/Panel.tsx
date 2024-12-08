import { Box, Divider, Paper, styled, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { CONTENT_PADDING } from '../../../constants/Spacing';

const StyledHeader = styled(Box)(
  ({
    theme: {
      palette: { primary },
    },
  }) => ({
    backgroundColor: primary.main,
    color: primary.contrastText,
  })
);

interface Props {
  title: string;
  children: ReactNode;
}

const Panel = ({ title, children }: Props) => {
  return (
    <Box>
      <Paper variant="outlined">
        <StyledHeader px={CONTENT_PADDING} py={1}>
          <Typography variant="h5">{title}</Typography>
        </StyledHeader>
        <Divider />
        <Box p={CONTENT_PADDING}>{children}</Box>
      </Paper>
    </Box>
  );
};

export default Panel;
