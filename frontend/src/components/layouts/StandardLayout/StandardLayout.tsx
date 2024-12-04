import { Box } from '@mui/material';
import { ReactNode } from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';

interface Props {
  children: ReactNode;
  hideProfileMenu?: boolean;
}

const StandardLayout = ({ children, hideProfileMenu }: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header hideProfileMenu={hideProfileMenu} />
      <Box display="flex" flexGrow={1} flexDirection="column">
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default StandardLayout;
