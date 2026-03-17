import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8 flex flex-col items-center justify-center">
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl max-w-2xl w-full">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong.</h1>
            <pre className="text-sm bg-slate-900 p-4 rounded-xl overflow-auto text-red-400">
              {this.state.error?.message}
              {'\n\n'}
              {this.state.error?.stack}
            </pre>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
