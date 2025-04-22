'use client';

import Modal from '../common/Modal';
import EventForm from './EventForm';
import type { ClosureEvent } from '@/app/types/models';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ClosureEvent, 'id' | 'lastUpdated'>) => void;
  event?: ClosureEvent;
}

export default function EventFormModal({ isOpen, onClose, onSubmit, event }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện mới'}
    >
      <EventForm
        event={event}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
