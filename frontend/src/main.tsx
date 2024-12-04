import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import PageRouter from './PageRouter.tsx';
import { BrowserRouter } from 'react-router-dom';
import { theme } from './theme.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './providers/AuthProvider.tsx';
import HistoryProvider from './providers/HistoryProvider.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
      refetchOnWindowFocus: false, // Disable refetch on window focus
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <HistoryProvider>
            <AuthProvider>
              <PageRouter />
            </AuthProvider>
          </HistoryProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
