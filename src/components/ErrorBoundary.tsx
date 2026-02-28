"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import { RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg-deepest px-6">
            <h1 className="text-2xl font-black text-text-primary">
              Something went wrong
            </h1>
            <p className="max-w-md text-center text-sm text-text-secondary">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="mt-4 flex items-center gap-2 rounded-full bg-accent-amber px-6 py-3 text-sm font-bold text-bg-deepest transition-opacity hover:opacity-90"
            >
              <RefreshCw size={14} />
              Refresh Page
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
