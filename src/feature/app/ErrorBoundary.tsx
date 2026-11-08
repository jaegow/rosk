import { Component, type ErrorInfo, type ReactNode } from 'react'

import { useCopy } from '@/feature/copy/useCopy'

type ErrorFallbackProps = {
  onRetry: () => void
}

type ErrorBoundaryProps = {
  children: ReactNode
  onError?: (error: unknown, info: ErrorInfo) => void
}

type ErrorBoundaryState = {
  failed: boolean
}

const ErrorFallback = ({ onRetry }: ErrorFallbackProps) => {
  const { t } = useCopy()

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 p-gutter text-center"
    >
      <h1 className="text-h4 text-stress">{t('common.error.title')}</h1>
      <p className="text-body2 text-stress-xxl">{t('common.error.message')}</p>
      <button
        type="button"
        className="rounded-md bg-brand px-4 py-2 text-subtitle2 text-base focus-visible:focus-ring"
        onClick={onRetry}
      >
        {t('common.actions.retry')}
      </button>
    </div>
  )
}

ErrorFallback.displayName = 'ErrorFallback'

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static displayName = 'ErrorBoundary'

  override state: ErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true }
  }

  override componentDidCatch(error: unknown, info: ErrorInfo): void {
    this.props.onError?.(error, info)
  }

  retry = (): void => {
    this.setState({ failed: false })
  }

  override render(): ReactNode {
    if (this.state.failed) return <ErrorFallback onRetry={this.retry} />
    return this.props.children
  }
}

export { ErrorBoundary, ErrorFallback }
export type { ErrorBoundaryProps, ErrorFallbackProps }
