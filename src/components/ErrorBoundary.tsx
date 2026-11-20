import React from 'react';

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'Unexpected error occurred.',
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Application boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B1530] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl bg-[#101E44] border border-white/10 p-6 space-y-4 text-center">
            <img
              src="/chez-moni-logo.png"
              alt="Chez Moni"
              className="w-16 h-16 rounded-full mx-auto object-cover"
              referrerPolicy="no-referrer"
            />
            <h2 className="font-display text-xl font-bold">
              Something went wrong
            </h2>
            <p className="text-sm text-slate-300 break-words">
              Please reload the page to restore the storefront.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-[#1E6BFF] text-white text-sm font-semibold hover:bg-[#1557D6] transition-colors cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
