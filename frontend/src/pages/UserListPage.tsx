import { Alert, Box, Chip, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { DataGrid, type GridColDef, type GridRowParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '@/api/users';
import type { UserSummary } from '@/types';

const columns: GridColDef<UserSummary>[] = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    minWidth: 180,
    valueGetter: (_value, row) => `${row.firstName} ${row.lastName}`,
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1.2,
    minWidth: 220,
  },
  {
    field: 'addressCount',
    headerName: 'Addresses',
    width: 130,
    align: 'left',
    headerAlign: 'left',
    renderCell: ({ value }) => (
      <Chip
        size="small"
        label={value}
        color={value > 0 ? 'primary' : 'default'}
        variant={value > 0 ? 'filled' : 'outlined'}
      />
    ),
  },
];

export function UserListPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useUsers();

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Users</Typography>
        <Typography color="text.secondary">
          Click a user to manage their profile and addresses.
        </Typography>
      </Box>

      {isError && <Alert severity="error">Failed to load users. Is the backend running on :8080?</Alert>}

      <Paper sx={{ p: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <Box sx={{ p: 2 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height={48} sx={{ my: 0.5 }} />
            ))}
          </Box>
        ) : (
          <DataGrid<UserSummary>
            rows={data ?? []}
            columns={columns}
            getRowId={(row) => row.id}
            onRowClick={(params: GridRowParams<UserSummary>) => navigate(`/users/${params.row.id}`)}
            disableRowSelectionOnClick
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            pageSizeOptions={[10, 25]}
            autoHeight
            sx={{
              border: 0,
              '& .MuiDataGrid-row': { cursor: 'pointer' },
              '& .MuiDataGrid-columnHeaders': { bgcolor: 'rgba(0,0,0,0.02)' },
            }}
          />
        )}
      </Paper>
    </Stack>
  );
}
