import type { ReactNode } from 'react';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="inherit">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/users"
            sx={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}
          >
            User Admin
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
        {children}
      </Container>
    </Box>
  );
}
