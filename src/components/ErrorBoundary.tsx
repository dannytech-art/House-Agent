import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  error: Error | null;
}
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };
  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }
  public render() {
    if (this.state.hasError) {
      return <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-danger" />
            </div>
            <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
              Something went wrong
            </h1>
            <p className="text-text-secondary mb-8">
              We apologize for the inconvenience. Please try refreshing the page
              or return home.
            </p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => window.location.reload()} className="px-6 py-3 bg-bg-secondary hover:bg-bg-tertiary border border-border-color text-text-primary rounded-xl font-medium transition-colors flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button onClick={() => window.location.href = '/'} className="px-6 py-3 bg-gradient-gold hover:opacity-90 text-black rounded-xl font-bold transition-all flex items-center gap-2 gold-glow">
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && <div className="mt-8 p-4 bg-bg-secondary rounded-lg text-left overflow-auto max-h-48">
                <p className="text-danger font-mono text-xs">
                  {this.state.error.toString()}
                </p>
              </div>}
          </div>
        </div>;
    }
    return this.props.children;
  }
}