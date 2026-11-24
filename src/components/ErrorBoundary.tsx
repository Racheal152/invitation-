import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Application ErrorBoundary caught:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, message: '' });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF3F4] flex items-center justify-center px-6 py-12">
          <div className="max-w-md w-full rounded-2xl bg-[#FDFBF9] border border-[#EFE0E3] shadow-[0_12px_36px_rgba(155,98,110,0.1)] p-8 text-center">
            <p className="text-[11px] tracking-[0.26em] uppercase text-[#C47483]">
              Racheal Kache · 2026
            </p>
            <h1 className="mt-2 font-serif-editorial text-2xl text-[#352E2D]">
              Something went gently awry
            </h1>
            <p className="mt-3 text-sm text-[#6E6260] leading-relaxed">
              We hit a brief hiccup loading this part of the invitation. Please refresh to
              continue.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#C96476] hover:bg-[#B85466] px-5 py-2.5 text-xs font-medium tracking-wider uppercase text-white transition-colors cursor-pointer"
            >
              Reload Invitation
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
