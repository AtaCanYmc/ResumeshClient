import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
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
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/30 dark:bg-red-900/10">
          <AlertOctagon className="mb-4 h-16 w-16 text-red-500" />
          <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-red-400">
            Bir Şeyler Yanlış Gitti
          </h2>
          <p className="max-w-md text-gray-600 dark:text-gray-400">
            Veriler yüklenirken veya işlenirken bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin
            veya daha sonra tekrar dönün.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-red-600 px-6 py-2 font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-900"
          >
            Sayfayı Yenile
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
