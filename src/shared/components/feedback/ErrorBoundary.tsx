// ============================================================
// ERROR BOUNDARY
// src/shared/components/feedback/ErrorBoundary.tsx
// ============================================================

import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
    // TODO: Send to Sentry when integrated
    // Sentry.captureException(error, { extra: info });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <ErrorFallback
          error={this.state.error}
          onReset={this.handleReset}
        />
      );
    }
    return this.props.children;
  }
}

// ─── Error Fallback UI ───────────────────────────────────────
interface FallbackProps {
  error: Error | null;
  onReset?: () => void;
}

export function ErrorFallback({ error, onReset }: FallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="h-20 w-20 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
          <span className="text-4xl">⚠️</span>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Something went wrong
          </h1>
          <p className="text-muted-foreground text-sm">
            An unexpected error occurred. Please try again or contact support.
          </p>
        </div>

        {/* Error Details (dev only) */}
        {import.meta.env.DEV && error && (
          <div className="text-left bg-muted rounded-lg p-4 overflow-auto max-h-40">
            <p className="text-xs font-mono text-destructive break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          {onReset && (
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          )}
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page Level Error (smaller) ──────────────────────────────
interface PageErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function PageError({
  message = 'Failed to load data.',
  onRetry,
}: PageErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
        <span className="text-2xl">❌</span>
      </div>
      <div className="text-center">
        <p className="font-medium text-foreground">{message}</p>
        <p className="text-sm text-muted-foreground mt-1">
          Please try again or refresh the page.
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────
interface EmptyStateProps {
  title:       string;
  description?: string;
  icon?:        string;
  action?:      ReactNode;
}

export function EmptyState({
  title,
  description,
  icon = '📭',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
        <span className="text-3xl">{icon}</span>
      </div>
      <div className="text-center">
        <p className="font-semibold text-foreground">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {description}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
