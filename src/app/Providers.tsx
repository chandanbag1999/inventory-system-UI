// ============================================================
// APP PROVIDERS - All providers in one place
// src/app/Providers.tsx
// ============================================================

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools }  from '@tanstack/react-query-devtools';
import type { ReactNode }      from 'react';
import { queryClient }         from './queryClient';
import { ErrorBoundary }       from '@/shared/components/feedback/ErrorBoundary';
import { TooltipProvider }     from '@/components/ui/tooltip';
import { Toaster }             from '@/components/ui/sonner';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={300}>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={4000}
            toastOptions={{
              classNames: {
                toast:       'font-sans text-sm',
                title:       'font-semibold',
                description: 'text-muted-foreground',
              },
            }}
          />
        </TooltipProvider>
        {import.meta.env.DEV && (
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
          />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
