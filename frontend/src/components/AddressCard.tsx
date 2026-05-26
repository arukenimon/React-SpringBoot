import { Box, Card, CardActions, CardContent, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { Address } from '@/types';

interface Props {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
}

export function AddressCard({ address, onEdit, onDelete }: Props) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Chip label={address.label} size="small" color="primary" variant="outlined" />
        </Stack>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {address.line1}
        </Typography>
        {address.line2 && (
          <Typography variant="body2" color="text.secondary">
            {address.line2}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {[address.city, address.state, address.postalCode].filter(Boolean).join(', ')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {address.country}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
        <Box>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={onEdit} aria-label="Edit address">
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={onDelete} aria-label="Delete address">
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
}
