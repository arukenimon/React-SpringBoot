import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Alert, Box, Button, Grid2 as Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { useUpdateUser } from '@/api/users';
import type { User } from '@/types';

const schema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  firstName: z.string().trim().min(1, 'Required').max(80),
  lastName: z.string().trim().min(1, 'Required').max(80),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  user: User;
  onSaved?: () => void;
}

export function ProfileForm({ user, onSaved }: Props) {
  const updateUser = useUpdateUser(user.id);

  const defaults: FormValues = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  useEffect(() => {
    reset(defaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const onSubmit = handleSubmit(async (values) => {
    await updateUser.mutateAsync(values);
    reset(values);
    onSaved?.();
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Profile</Typography>
        <Box component="form" noValidate onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="First name"
                {...register('firstName')}
                error={Boolean(errors.firstName)}
                helperText={errors.firstName?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Last name"
                {...register('lastName')}
                error={Boolean(errors.lastName)}
                helperText={errors.lastName?.message}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                {...register('email')}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
            </Grid>
            {updateUser.isError && (
              <Grid size={12}>
                <Alert severity="error">Could not save profile changes.</Alert>
              </Grid>
            )}
            <Grid size={12}>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                  type="button"
                  onClick={() => reset(defaults)}
                  disabled={!isDirty || isSubmitting}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!isDirty || isSubmitting}
                >
                  Save profile
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Paper>
  );
}
