import { render, screen } from '@testing-library/react';
import Loading from '../Loading';

describe('Loading', () => {
  it('renders loading spinner', () => {
    render(<Loading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders with custom message if provided', () => {
    const customMessage = 'Please wait...';
    render(<Loading message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('applies custom className if provided', () => {
    const customClass = 'test-class';
    render(<Loading className={customClass} />);
    expect(screen.getByTestId('loading-container')).toHaveClass(customClass);
  });

  it('renders in overlay mode if specified', () => {
    render(<Loading overlay />);
    expect(screen.getByTestId('loading-container')).toHaveClass('fixed');
  });
});
