import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Captured by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center p-6">
          <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center space-y-4 shadow-2xl">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Interface Sync Exception</h3>
            <p className="text-xs text-rose-300 bg-rose-950/40 p-3 rounded-xl border border-rose-900/50 font-mono text-left overflow-x-auto">
              {this.state.error?.toString() || 'Unknown render exception'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-xs font-bold text-white transition-colors shadow-lg shadow-indigo-500/20"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reload Section</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
