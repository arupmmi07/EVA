import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'Something went wrong.' };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          data-name="ErrorFallback"
          className="flex min-h-screen flex-col items-center justify-center gap-[16px] bg-[var(--ds-bg-secondary)] px-[24px] text-center"
          role="alert"
        >
          <h1 className="font-['Inter',sans-serif] text-[18px] font-semibold leading-[28px] text-[var(--ds-text-primary)]">
            This view could not be loaded
          </h1>
          <p className="max-w-[480px] font-['Inter',sans-serif] text-[14px] font-normal leading-[20px] text-[var(--ds-text-secondary)]">
            {this.state.message}
          </p>
          <button
            type="button"
            className="rounded-[var(--ds-radius-button)] bg-[var(--ds-primary-action)] px-[16px] py-[8px] font-['Inter',sans-serif] text-[14px] font-medium leading-[20px] text-white"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
