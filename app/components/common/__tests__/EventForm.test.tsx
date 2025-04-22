import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EventForm from '../EventForm';
import type { ClosureEvent } from '@/app/types/models';

describe('EventForm', () => {
  const mockEvent: ClosureEvent = {
    id: '1',
    street: 'Nguyen Hue',
    area: 'District 1',
    startTime: '2025-01-01T00:00:00Z',
    endTime: '2025-01-02T00:00:00Z',
    reason: 'Construction',
    latitude: 10.7769,
    longitude: 106.7009,
    lastUpdated: '2025-01-01T00:00:00Z',
  };

  const defaultProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with initial values when editing', () => {
    render(<EventForm {...defaultProps} event={mockEvent} />);
    expect(screen.getByLabelText(/street/i)).toHaveValue(mockEvent.street);
    expect(screen.getByLabelText(/area/i)).toHaveValue(mockEvent.area);
    expect(screen.getByLabelText(/reason/i)).toHaveValue(mockEvent.reason);
    expect(screen.getByLabelText(/latitude/i)).toHaveValue(mockEvent.latitude.toString());
    expect(screen.getByLabelText(/longitude/i)).toHaveValue(mockEvent.longitude.toString());
  });

  it('renders with empty values when creating', () => {
    render(<EventForm {...defaultProps} />);
    expect(screen.getByLabelText(/street/i)).toHaveValue('');
    expect(screen.getByLabelText(/area/i)).toHaveValue('');
    expect(screen.getByLabelText(/reason/i)).toHaveValue('');
    expect(screen.getByLabelText(/latitude/i)).toHaveValue('');
    expect(screen.getByLabelText(/longitude/i)).toHaveValue('');
  });

  it('validates required fields', async () => {
    render(<EventForm {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /thêm mới/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/street is required/i)).toBeInTheDocument();
      expect(screen.getByText(/area is required/i)).toBeInTheDocument();
      expect(screen.getByText(/reason is required/i)).toBeInTheDocument();
      expect(screen.getByText(/latitude is required/i)).toBeInTheDocument();
      expect(screen.getByText(/longitude is required/i)).toBeInTheDocument();
    });
  });

  it('validates latitude range', async () => {
    render(<EventForm {...defaultProps} />);
    
    fireEvent.change(screen.getByLabelText(/latitude/i), {
      target: { value: '91' },
    });
    
    await waitFor(() => {
      expect(screen.getByText(/latitude must be between -90 and 90/i)).toBeInTheDocument();
    });
  });

  it('validates longitude range', async () => {
    render(<EventForm {...defaultProps} />);
    
    fireEvent.change(screen.getByLabelText(/longitude/i), {
      target: { value: '181' },
    });
    
    await waitFor(() => {
      expect(screen.getByText(/longitude must be between -180 and 180/i)).toBeInTheDocument();
    });
  });

  it('validates date range', async () => {
    render(<EventForm {...defaultProps} />);
    
    const startDate = screen.getByLabelText(/thời gian bắt đầu/i);
    const endDate = screen.getByLabelText(/thời gian kết thúc/i);

    fireEvent.change(startDate, {
      target: { value: '2025-01-02T00:00' },
    });
    fireEvent.change(endDate, {
      target: { value: '2025-01-01T00:00' },
    });

    await waitFor(() => {
      expect(screen.getByText(/end time must be after start time/i)).toBeInTheDocument();
    });
  });

  it('calls onSubmit with form data when valid', async () => {
    render(<EventForm {...defaultProps} />);
    
    fireEvent.change(screen.getByLabelText(/street/i), {
      target: { value: 'Test Street' },
    });
    fireEvent.change(screen.getByLabelText(/area/i), {
      target: { value: 'Test Area' },
    });
    fireEvent.change(screen.getByLabelText(/reason/i), {
      target: { value: 'Test Reason' },
    });
    fireEvent.change(screen.getByLabelText(/latitude/i), {
      target: { value: '10' },
    });
    fireEvent.change(screen.getByLabelText(/longitude/i), {
      target: { value: '106' },
    });
    fireEvent.change(screen.getByLabelText(/thời gian bắt đầu/i), {
      target: { value: '2025-01-01T00:00' },
    });
    fireEvent.change(screen.getByLabelText(/thời gian kết thúc/i), {
      target: { value: '2025-01-02T00:00' },
    });

    fireEvent.click(screen.getByRole('button', { name: /thêm mới/i }));

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        street: 'Test Street',
        area: 'Test Area',
        reason: 'Test Reason',
        latitude: 10,
        longitude: 106,
        startTime: '2025-01-01T00:00:00Z',
        endTime: '2025-01-02T00:00:00Z',
      });
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<EventForm {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /hủy/i }));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
});
