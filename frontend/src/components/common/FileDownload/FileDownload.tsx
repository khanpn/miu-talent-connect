import { Button } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FilenameUtils from '../../../utils/FilenameUtils';

const downloadFile = (fileUrl: string) => {
  const link = document.createElement('a');
  link.href = fileUrl || '';
  link.target = '_blank';
  link.download = `${FilenameUtils.getFileNameFromUrl(fileUrl)}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

interface Props {
  btnLabel?: string;
  fileUrl?: string;
  fullWidth?: boolean;
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
}

const FileDownload = ({
  fileUrl,
  btnLabel = 'Download',
  color = 'info',
  fullWidth = false,
}: Props) => {
  return (
    <Button
      onClick={() => fileUrl && downloadFile(fileUrl)}
      disabled={!fileUrl}
      variant="contained"
      fullWidth={fullWidth}
      color={color}
      startIcon={btnLabel && <FileDownloadOutlinedIcon />}
      style={{ textTransform: 'none' }}
    >
      {btnLabel ? btnLabel : <FileDownloadOutlinedIcon />}
    </Button>
  );
};

export default FileDownload;
