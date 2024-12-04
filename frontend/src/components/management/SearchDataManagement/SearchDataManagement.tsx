import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { SEARCH_DATA_RESOURCE_PATH } from '../../../rest/resources';
import restClient, { extractErrorMessage } from '../../../rest/restClient';

const SearchDataManagement: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSyncData = async () => {
    setIsSyncing(true);
    setSyncSuccess(null);
    setErrorMessage(null);

    try {
      await restClient.post(`${SEARCH_DATA_RESOURCE_PATH}/sync`);
      setSyncSuccess(true);
    } catch (error) {
      setSyncSuccess(false);
      extractErrorMessage(error, setErrorMessage);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Search Data Synchronization
      </Typography>

      <Typography variant="body1" align="center" sx={{ mb: 3 }}>
        Use the button below to synchronize data from collections into the
        search index collection.
      </Typography>

      <Box display="flex" justifyContent="center" alignItems="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSyncData}
          disabled={isSyncing}
          startIcon={
            isSyncing ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isSyncing ? 'Syncing...' : 'Sync Data'}
        </Button>
      </Box>

      {/* Snackbar for Success */}
      <Snackbar
        open={syncSuccess === true}
        autoHideDuration={4000}
        onClose={() => setSyncSuccess(null)}
      >
        <Alert
          onClose={() => setSyncSuccess(null)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Data synchronized successfully!
        </Alert>
      </Snackbar>

      {/* Snackbar for Error */}
      <Snackbar
        open={syncSuccess === false}
        autoHideDuration={4000}
        onClose={() => setSyncSuccess(null)}
      >
        <Alert
          onClose={() => setSyncSuccess(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SearchDataManagement;
