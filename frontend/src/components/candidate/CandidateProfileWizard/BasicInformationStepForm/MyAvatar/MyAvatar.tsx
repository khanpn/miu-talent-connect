import React, { useCallback, useState } from 'react';
import { Avatar, Button, Box } from '@mui/material';
import restClient from '../../../../../rest/restClient';
import PageLoading from '../../../../common/PageLoading/PageLoading';

const RESOURCE_URL = '/files/avatars';

interface Props {
  src?: string | null;
  onChange: (value: string) => void;
}

const MyAvatar = ({ src, onChange }: Props) => {
  const [uploading, setUploading] = useState(false);

  const handleAvatarChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
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

          console.log('Upload avatar successful:', response.data);
          onChange && onChange(response.data);
        } catch (error) {
          console.error('Error uploading avatar file:', error);
        }
        setUploading(false);
      }
    },
    []
  );

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Avatar
          src={src || ''}
          alt="User Avatar"
          sx={{
            width: 150,
            height: 150,
            bgcolor: 'actions.disabled',
            fontSize: '2rem',
          }}
        />
        <Button
          variant="contained"
          component="label"
          color="primary"
          style={{ textTransform: 'none' }}
        >
          Change Avatar
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleAvatarChange}
          />
        </Button>
      </Box>
      <PageLoading open={uploading} />
    </>
  );
};

export default MyAvatar;
