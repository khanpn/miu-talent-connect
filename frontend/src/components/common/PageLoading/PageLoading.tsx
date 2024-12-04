import { Backdrop, CircularProgress } from '@mui/material';

interface Props {
  open?: boolean;
}

const PageLoading = ({ open = true }: Props) => {
  return (
    <Backdrop
      sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.modal + 1 })}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default PageLoading;
