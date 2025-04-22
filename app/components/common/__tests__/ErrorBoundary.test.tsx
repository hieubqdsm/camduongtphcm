import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';

describe('ErrorBoundary', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  beforeEach(() => {
    // Prevent console.error from cluttering test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error message when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/test error/i)).toBeInTheDocument();
  });

  it('renders retry button when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('resets error state when retry button is clicked', () => {
    const handleReset = jest.fn();
    render(
      <ErrorBoundary onReset={handleReset}>
        <ThrowError />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(handleReset).toHaveBeenCalled();
  });

  it('renders custom error message if provided', () => {
    const customError = 'Custom error message';
    render(
      <ErrorBoundary customErrorMessage={customError}>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText(customError)).toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const handleError = jest.fn();
    render(
      <ErrorBoundary onError={handleError}>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(handleError).toHaveBeenCalledWith(expect.any(Error));
  });

  it('renders custom fallback component if provided', () => {
    const CustomFallback = () => <div>Custom error view</div>;
    render(
      <ErrorBoundary fallback={<CustomFallback />}>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText('Custom error view')).toBeInTheDocument();
  });
});
