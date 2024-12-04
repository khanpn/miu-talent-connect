import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid2 as Grid,
  styled,
} from '@mui/material';
import DocumentModal from '../DocumentModal/DocumentModal';
import FilenameUtils from '../../../utils/FilenameUtils';
import FileDownload from '../FileDownload/FileDownload';
import restClient from '../../../rest/restClient';
import PageLoading from '../PageLoading/PageLoading';

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableHeaderRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
}));

const RESOURCE_URL = '/files/resumes';

interface Props {
  resumeUrl?: string;
  onChange: (value: string) => void;
}

const ResumeManagement = ({ resumeUrl, onChange }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
      }
    },
    []
  );

  const handleUpload = useCallback(async () => {
    if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await restClient.post(RESOURCE_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Upload resume successful:', response.data);
        onChange && onChange(response.data);
        setFile(null);
      } catch (error) {
        console.error('Error uploading resume file:', error);
      }
      setUploading(false);
    } else {
      alert('No resume selected. Please upload a file first.');
    }
  }, [file]);

  return (
    <>
      <Box>
        <Typography variant="h5" gutterBottom>
          Resume Management
        </Typography>

        <Grid container marginBottom={2} size={{ sm: 12 }}>
          <Grid size={{ sm: 12 }} mb={1}>
            <Button
              variant="outlined"
              component="label"
              color="primary"
              style={{ textTransform: 'none' }}
            >
              Choose File
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                hidden
                onChange={handleFileChange}
              />
            </Button>
          </Grid>
          <Grid size={{ sm: 12 }}>
            {file && (
              <Typography variant="body1" color="textSecondary" mb={1}>
                Selected File: {file.name}
              </Typography>
            )}
          </Grid>
          <Grid size={{ sm: 12 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={!file}
              style={{ textTransform: 'none' }}
            >
              Upload Resume
            </Button>
          </Grid>
        </Grid>

        {resumeUrl ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <StyledTableHeaderRow>
                  <TableCell>File Name</TableCell>
                  <TableCell>Actions</TableCell>
                </StyledTableHeaderRow>
              </TableHead>
              <TableBody>
                <StyledTableRow>
                  <TableCell>
                    {FilenameUtils.getFileNameFromUrl(resumeUrl)}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={2}>
                      <FileDownload fileUrl={resumeUrl} />
                      <DocumentModal
                        docs={[
                          {
                            uri: resumeUrl,
                          },
                        ]}
                        btnLabel="View"
                      />
                    </Box>
                  </TableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No resume uploaded yet.
          </Typography>
        )}
      </Box>
      <PageLoading open={uploading} />
    </>
  );
};

export default ResumeManagement;
