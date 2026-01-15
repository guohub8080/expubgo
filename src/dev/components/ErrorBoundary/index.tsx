import React, { type ErrorInfo } from "react";
import { ErrorDisplay } from "./ErrorDisplay.tsx";
import { parseErrorStack } from "./utils.ts";
import { getLogs } from "@dev/store/useConsoleLogStore";
import type { ConsoleLogEntry } from "@dev/store/useConsoleLogStore";
import { logger } from "@dev/utils/logger";

interface ConsoleError {
  message: string;
  url: string;
  line: number;
  column: number;
  timestamp: number;
  level: 'log' | 'info' | 'warn' | 'error' | 'debug';
}

interface PreviewErrorBoundaryProps {
  children: React.ReactNode;
  errorTitle?: string;
}

interface PreviewErrorBoundaryState {
  hasError: boolean;
  error: (Error & {
    componentStack?: string;
    source?: string;
    line?: number;
    column?: number;
    consoleErrors?: ConsoleError[];
  }) | null;
}

class PreviewErrorBoundary extends React.Component<PreviewErrorBoundaryProps, PreviewErrorBoundaryState> {
  constructor(props: PreviewErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<PreviewErrorBoundaryState> {
    return {
      hasError: true,
      error: error as Error & { componentStack?: string },
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const stackInfo = parseErrorStack(error.stack || '');
    const allLogs = getLogs();

    // 发送到 LogRocket（如果配置了）
    logger.captureException(error, {
      componentStack: errorInfo.componentStack,
      source: stackInfo.source,
      line: stackInfo.line,
      column: stackInfo.column,
    });

    this.setState({
      error: {
        ...error,
        message: error.message,
        name: error.name,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        source: stackInfo.source,
        line: stackInfo.line,
        column: stackInfo.column,
        consoleErrors: allLogs,
      } as Error & {
        componentStack?: string;
        source?: string;
        line?: number;
        column?: number;
        consoleErrors?: ConsoleError[];
      }
    });
  }

  render() {
    const { hasError, error } = this.state;
    const { children, errorTitle } = this.props;

    if (hasError && error) {
      return <ErrorDisplay error={error} errorTitle={errorTitle} />;
    }

    return children as React.ReactElement;
  }
}

export default PreviewErrorBoundary;
