import { Box, Container, styled } from '@mui/material';
import { ReactNode } from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';

const BorderedBox = styled(Box)(({ theme }) => ({
  borderRight: '1px solid',
  borderLeft: '1px solid',
  borderColor: theme.palette.divider,
}));

interface Props {
  children: ReactNode;
  hideProfileMenu?: boolean;
}

const StandardLayout = ({ children, hideProfileMenu }: Props) => {
  return (
    <Container
      disableGutters
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header hideProfileMenu={hideProfileMenu} />
      <BorderedBox display="flex" flexGrow={1} flexDirection="column">
        {children}
      </BorderedBox>
      <Footer />
    </Container>
  );
};

export default StandardLayout;
