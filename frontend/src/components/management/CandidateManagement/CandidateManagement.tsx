import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import {
  Avatar,
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridPaginationModel,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridSlots,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import { useEffect, useReducer, useState } from 'react';
import { CandidateProfile } from '../../../models/CandidateProfile';
import { CandidateProfileStatus } from '../../../models/CandidateProfileStatus';
import halClient from '../../../rest/halClient';
import {
  CANDIDATE_PROFILE_RESOURCE_PATH,
  CANDIDATE_RESOURCE_PATH,
  USER_RESOURCE_PATH,
} from '../../../rest/resources';
import restClient, { extractErrorMessage } from '../../../rest/restClient';
import { optionsFromEnum } from '../../../utils/SelectOptionsUtils';
import NewCandidateModal from './NewCandidateModal/NewCandidateModal';
import { Candidate } from '../../../models/Candidate';
import { UserStatus } from '../../../models/UserStatus';
import { User } from '../../../models/User';

export const userStatusColorMappings: {
  [key: string]:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
} = {
  [UserStatus.PENDING]: 'warning',
  [UserStatus.ACTIVE]: 'success',
  [UserStatus.INACTIVE]: 'warning',
  [UserStatus.DELETED]: 'error',
  [UserStatus.ARCHIVED]: 'info',
  [UserStatus.LOCKED]: 'error',
  [UserStatus.BANNED]: 'error',
  [UserStatus.SUSPENDED]: 'info',
};

const profileStatusColorMappings: {
  [key: string]:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
} = {
  [CandidateProfileStatus.PENDING]: 'warning',
  [CandidateProfileStatus.VERIFIED]: 'success',
  [CandidateProfileStatus.DELETED]: 'error',
  [CandidateProfileStatus.ARCHIVED]: 'info',
  [CandidateProfileStatus.LOCKED]: 'error',
  [CandidateProfileStatus.BANNED]: 'error',
  [CandidateProfileStatus.UNVERIFIED]: 'info',
};

const EditToolbar = (onCreatedRecord: () => void) => () => {
  const [openNewCandidateModal, setOpenNewCandidateModal] = useState(false);
  return (
    <GridToolbarContainer
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography variant="h5" p={1}>
        Candidate Management
      </Typography>
      <Button
        sx={{ textTransform: 'none' }}
        color="primary"
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => {
          setOpenNewCandidateModal(true);
        }}
      >
        Add Candidate
      </Button>
      <NewCandidateModal
        open={openNewCandidateModal}
        onClose={() => setOpenNewCandidateModal(false)}
        onSuccess={() => onCreatedRecord()}
      />
    </GridToolbarContainer>
  );
};

const CandidateManagement = () => {
  const [rows, setRows] = useState<Candidate[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });
  const [refreshData, reloadDataReducer] = useReducer((state) => !state, false);

  const columns: GridColDef[] = [
    {
      field: 'profilePictureUrl',
      headerName: 'Avatar',
      display: 'flex',
      minWidth: 40,
      renderCell: ({ value }) => (
        <Avatar sx={{ width: 40, height: 40 }} src={value} />
      ),
    },
    { field: 'jobTitle', headerName: 'Job Title', minWidth: 190 },
    { field: 'firstName', headerName: 'First name', minWidth: 130 },
    { field: 'lastName', headerName: 'Last name', minWidth: 130 },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 160,
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone Number',
      sortable: false,
      minWidth: 160,
    },
    {
      field: 'status',
      headerName: 'User Status',
      editable: true,
      renderCell: ({ value }) => (
        <Chip
          label={UserStatus[value as keyof typeof UserStatus]}
          color={
            userStatusColorMappings[
              UserStatus[value as keyof typeof UserStatus]
            ]
          }
        />
      ),
      renderEditCell: (params) => (
        <Select
          fullWidth
          size="small"
          labelId="user-status-select-label"
          label="User Status"
          value={params.value}
          onChange={(evt) => {
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: evt.target.value,
            });
          }}
        >
          {optionsFromEnum(UserStatus).map((option) => (
            <MenuItem key={option.key} value={option.key}>
              {option.value}
            </MenuItem>
          ))}
        </Select>
      ),
      minWidth: 130,
    },
    {
      field: 'profileStatus',
      headerName: 'Profile Status',
      editable: true,
      renderCell: ({ value }) => (
        <Chip
          label={
            CandidateProfileStatus[value as keyof typeof CandidateProfileStatus]
          }
          color={
            profileStatusColorMappings[
              CandidateProfileStatus[
                value as keyof typeof CandidateProfileStatus
              ]
            ]
          }
        />
      ),
      renderEditCell: (params) => (
        <Select
          fullWidth
          size="small"
          labelId="profile-status-select-label"
          label="Profile Status"
          value={params.value}
          onChange={(evt) => {
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: evt.target.value,
            });
          }}
        >
          {optionsFromEnum(CandidateProfileStatus).map((option) => (
            <MenuItem key={option.key} value={option.key}>
              {option.value}
            </MenuItem>
          ))}
        </Select>
      ),
      minWidth: 130,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    setPaginationModel(newModel);
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = async (newRow: Candidate) => {
    try {
      const profileUpdate = restClient.patch<CandidateProfile>(
        `${CANDIDATE_PROFILE_RESOURCE_PATH}/${newRow.profileId}`,
        { status: newRow.profileStatus }
      );
      const userUpdate = restClient.patch<User>(
        `${USER_RESOURCE_PATH}/${newRow.userId}`,
        { status: newRow.status }
      );
      await Promise.all([profileUpdate, userUpdate]);
    } catch (error) {
      extractErrorMessage(error, (message) => {
        alert(message);
        reloadDataReducer();
      });
    }
    return newRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const fetchData = async (page: number, pageSize: number) => {
    setIsLoading(true);
    try {
      const response = await halClient.fetchResource<Candidate>(
        CANDIDATE_RESOURCE_PATH,
        { params: { page, size: pageSize } }
      );
      setRows(response._embedded?.candidates || []);
      setRowCount(Number(response.page?.totalElements));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel, refreshData]);

  return (
    <Box>
      <Paper sx={{ width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          processRowUpdate={processRowUpdate}
          initialState={{ pagination: { paginationModel } }}
          slots={{
            toolbar: EditToolbar(reloadDataReducer) as GridSlots['toolbar'],
          }}
          rowCount={rowCount}
          loading={isLoading}
          paginationMode="server"
          pageSizeOptions={[5, 10, 20]}
          onPaginationModelChange={handlePaginationModelChange}
        />
      </Paper>
    </Box>
  );
};

export default CandidateManagement;
