'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ClosureEvent } from '@/app/types/models';

const eventSchema = z.object({
  street: z.string().min(1, 'Vui lòng nhập tên đường'),
  area: z.string().min(1, 'Vui lòng nhập khu vực'),
  startTime: z.string().min(1, 'Vui lòng chọn thời gian bắt đầu'),
  endTime: z.string().min(1, 'Vui lòng chọn thời gian kết thúc'),
  reason: z.string().min(1, 'Vui lòng nhập lý do'),
  latitude: z.number()
    .min(-90, 'Vĩ độ phải từ -90 đến 90')
    .max(90, 'Vĩ độ phải từ -90 đến 90'),
  longitude: z.number()
    .min(-180, 'Kinh độ phải từ -180 đến 180')
    .max(180, 'Kinh độ phải từ -180 đến 180'),
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return end > start;
}, {
  message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
  path: ['endTime'],
});

type EventFormData = z.infer<typeof eventSchema>;

interface Props {
  event?: ClosureEvent;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
}

export default function EventForm({ event, onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: event ? {
      ...event,
      startTime: event.startTime.split('Z')[0], // Remove Z suffix for input
      endTime: event.endTime.split('Z')[0], // Remove Z suffix for input
    } : {
      latitude: 10.7769,
      longitude: 106.7009,
    },
  });

  const onFormSubmit = async (data: EventFormData) => {
    // Add Z suffix back to make it UTC
    const formattedData = {
      ...data,
      startTime: `${data.startTime}Z`,
      endTime: `${data.endTime}Z`,
    };
    await onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="street" className="block text-sm font-medium text-gray-700">
          Tên đường
        </label>
        <input
          type="text"
          id="street"
          {...register('street')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.street && (
          <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="area" className="block text-sm font-medium text-gray-700">
          Khu vực
        </label>
        <input
          type="text"
          id="area"
          {...register('area')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.area && (
          <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
            Thời gian bắt đầu
          </label>
          <input
            type="datetime-local"
            id="startTime"
            {...register('startTime')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.startTime && (
            <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
            Thời gian kết thúc
          </label>
          <input
            type="datetime-local"
            id="endTime"
            {...register('endTime')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.endTime && (
            <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
          Lý do
        </label>
        <textarea
          id="reason"
          rows={3}
          {...register('reason')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.reason && (
          <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
            Vĩ độ
          </label>
          <input
            type="number"
            step="any"
            id="latitude"
            {...register('latitude', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.latitude && (
            <p className="mt-1 text-sm text-red-600">{errors.latitude.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
            Kinh độ
          </label>
          <input
            type="number"
            step="any"
            id="longitude"
            {...register('longitude', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.longitude && (
            <p className="mt-1 text-sm text-red-600">{errors.longitude.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {event ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </div>
    </form>
  );
}
