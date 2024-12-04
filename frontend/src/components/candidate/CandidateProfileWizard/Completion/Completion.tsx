import Panel from '../../../common/Panel/Panel';
import { Box, Typography } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';

const Completion = () => {
  return (
    <Panel title="Congratulations">
      <Box py={6} display="flex" flexDirection="column" alignItems="center">
        <DoneIcon color="primary" sx={{ fontSize: 56 }} />

        <Typography pt={6} fontSize={18}>
          You have completed updating your profile!
        </Typography>
      </Box>
    </Panel>
  );
};

export default Completion;
