import { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Grid2 as Grid,
  Link,
  Paper,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useUser } from '@/api/users';
import { useAddresses, useDeleteAddress } from '@/api/addresses';
import { ProfileForm } from '@/components/ProfileForm';
import { AddressCard } from '@/components/AddressCard';
import { AddressFormDialog } from '@/components/AddressFormDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import type { Address } from '@/types';

type Toast = { severity: 'success' | 'error'; message: string };

export function UserDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const userQuery = useUser(id);
  const addressesQuery = useAddresses(id);
  const deleteAddress = useDeleteAddress(id);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Address | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (address: Address) => {
    setEditing(address);
    setDialogOpen(true);
  };
  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteAddress.mutateAsync(pendingDelete.id);
      setToast({ severity: 'success', message: 'Address deleted.' });
    } catch {
      setToast({ severity: 'error', message: 'Could not delete address.' });
    } finally {
      setPendingDelete(null);
    }
  };

  if (userQuery.isError) {
    return (
      <Stack spacing={2}>
        <Button component={RouterLink} to="/users" startIcon={<ArrowBackIcon />}>
          Back to users
        </Button>
        <Alert severity="error">Could not load this user.</Alert>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Breadcrumbs sx={{ mb: 1 }}>
          <Link component={RouterLink} to="/users" underline="hover" color="inherit">
            Users
          </Link>
          <Typography color="text.primary">
            {userQuery.data
              ? `${userQuery.data.firstName} ${userQuery.data.lastName}`
              : 'Loading…'}
          </Typography>
        </Breadcrumbs>
        <Typography variant="h4">
          {userQuery.data
            ? `${userQuery.data.firstName} ${userQuery.data.lastName}`
            : <Skeleton width={260} />}
        </Typography>
        <Typography color="text.secondary">
          {userQuery.data?.email ?? <Skeleton width={200} />}
        </Typography>
      </Box>

      {userQuery.isLoading || !userQuery.data ? (
        <Paper sx={{ p: 3 }}>
          <Skeleton height={48} />
          <Skeleton height={48} />
          <Skeleton height={48} />
        </Paper>
      ) : (
        <ProfileForm
          user={userQuery.data}
          onSaved={() => setToast({ severity: 'success', message: 'Profile saved.' })}
        />
      )}

      <Paper sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h6">Addresses</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
            disabled={!userQuery.data}
          >
            Add address
          </Button>
        </Stack>

        {addressesQuery.isLoading ? (
          <Grid container spacing={2}>
            {Array.from({ length: 2 }).map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rounded" height={170} />
              </Grid>
            ))}
          </Grid>
        ) : (addressesQuery.data?.length ?? 0) === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No addresses yet — add the first one.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {addressesQuery.data!.map((address) => (
              <Grid key={address.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <AddressCard
                  address={address}
                  onEdit={() => openEdit(address)}
                  onDelete={() => setPendingDelete(address)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {userQuery.data && (
        <AddressFormDialog
          open={dialogOpen}
          userId={userQuery.data.id}
          address={editing}
          onClose={closeDialog}
          onSaved={(mode) =>
            setToast({
              severity: 'success',
              message: mode === 'edit' ? 'Address updated.' : 'Address added.',
            })
          }
        />
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete address?"
        message={
          pendingDelete
            ? `Remove "${pendingDelete.label}" at ${pendingDelete.line1}? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {toast ? (
          <Alert severity={toast.severity} onClose={() => setToast(null)} variant="filled">
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Stack>
  );
}
