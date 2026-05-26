import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2 as Grid,
  TextField,
} from '@mui/material';
import { useAddAddress, useUpdateAddress } from '@/api/addresses';
import type { Address, AddressRequest } from '@/types';

const schema = z.object({
  label: z.string().trim().min(1, 'Required').max(40),
  line1: z.string().trim().min(1, 'Required').max(120),
  line2: z.string().trim().max(120).optional().or(z.literal('')),
  city: z.string().trim().min(1, 'Required').max(80),
  state: z.string().trim().max(80).optional().or(z.literal('')),
  postalCode: z.string().trim().min(1, 'Required').max(20),
  country: z.string().trim().min(1, 'Required').max(80),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  userId: string;
  address: Address | null;
  onClose: () => void;
  onSaved?: (mode: 'create' | 'edit') => void;
}

const emptyDefaults: FormValues = {
  label: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
};

export function AddressFormDialog({ open, userId, address, onClose, onSaved }: Props) {
  const isEdit = Boolean(address);
  const addAddress = useAddAddress(userId);
  const updateAddress = useUpdateAddress(userId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyDefaults,
  });

  useEffect(() => {
    if (!open) return;
    reset(
      address
        ? {
            label: address.label,
            line1: address.line1,
            line2: address.line2 ?? '',
            city: address.city,
            state: address.state ?? '',
            postalCode: address.postalCode,
            country: address.country,
          }
        : emptyDefaults,
    );
  }, [open, address, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const payload: AddressRequest = {
      label: values.label,
      line1: values.line1,
      line2: values.line2 || null,
      city: values.city,
      state: values.state || null,
      postalCode: values.postalCode,
      country: values.country,
    };
    if (isEdit && address) {
      await updateAddress.mutateAsync({ addressId: address.id, payload });
      onSaved?.('edit');
    } else {
      await addAddress.mutateAsync(payload);
      onSaved?.('create');
    }
    onClose();
  });

  const mutationError = addAddress.isError || updateAddress.isError;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={onSubmit} noValidate>
        <DialogTitle>{isEdit ? 'Edit address' : 'Add address'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Label"
                placeholder="Home, Work, …"
                {...register('label')}
                error={Boolean(errors.label)}
                helperText={errors.label?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                fullWidth
                label="Address line 1"
                {...register('line1')}
                error={Boolean(errors.line1)}
                helperText={errors.line1?.message}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Address line 2 (optional)"
                {...register('line2')}
                error={Boolean(errors.line2)}
                helperText={errors.line2?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="City"
                {...register('city')}
                error={Boolean(errors.city)}
                helperText={errors.city?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="State / Region (optional)"
                {...register('state')}
                error={Boolean(errors.state)}
                helperText={errors.state?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Postal code"
                {...register('postalCode')}
                error={Boolean(errors.postalCode)}
                helperText={errors.postalCode?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Country"
                {...register('country')}
                error={Boolean(errors.country)}
                helperText={errors.country?.message}
              />
            </Grid>
            {mutationError && (
              <Grid size={12}>
                <Alert severity="error">Could not save address. Try again.</Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isEdit ? 'Save changes' : 'Add address'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
