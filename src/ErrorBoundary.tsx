import HelperPages from './components/pages/helperPages'
import { Component, ErrorInfo, ReactNode } from 'react'
import t from './utils/translator'

// ErrorBoundary component
type ErrorBoundaryProps = {
  children: ReactNode
}
type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Update state with the error details
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo,
    })

    // Log the error to an error reporting service (e.g., Sentry, Bugsnag, etc.)
    // You can also log errors to the console or send them to a server API
    // console.error(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Render the fallback UI when an error occurs
      return (
        <div>
          <HelperPages
            statusCode="Error"
            title={t`Something went wrong`}
            message={this.state.error ? this.state.error.toString() : ''}
          />
          {/* <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre> */}
        </div>
      )
    }

    // Render the wrapped components if no error occurred
    return this.props.children
  }
}

export default ErrorBoundary
