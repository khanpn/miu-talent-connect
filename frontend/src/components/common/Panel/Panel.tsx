import { Box, Divider, Paper, styled, Typography } from '@mui/material';
import { ReactNode } from 'react';

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
        <StyledHeader p={1}>
          <Typography variant="h5">{title}</Typography>
        </StyledHeader>
        <Divider />
        <Box p={1}>{children}</Box>
      </Paper>
    </Box>
  );
};

export default Panel;
