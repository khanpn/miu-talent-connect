import { useState } from 'react';
import { Button, Dialog, DialogContent, DialogActions } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import '@cyntler/react-doc-viewer/dist/index.css';
import './DocumentModal.scss';
import _ from 'lodash';

interface Props {
  btnLabel?: string;
  height?: number;
  docs: {
    uri: string;
  }[];
  disabled?: boolean;
  fullWidth?: boolean;
}

const DocumentModal = ({
  docs,
  btnLabel = 'View Document',
  height = 500,
  disabled = false,
  fullWidth = false,
}: Props) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        fullWidth={fullWidth}
        startIcon={btnLabel && <VisibilityIcon />}
        onClick={handleOpen}
        style={{ textTransform: 'none' }}
        disabled={disabled || _.isNil(docs) || docs?.length === 0}
      >
        {btnLabel ? btnLabel : <VisibilityIcon />}
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent>
          <DocViewer
            documents={docs}
            pluginRenderers={DocViewerRenderers}
            style={{ height }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DocumentModal;
