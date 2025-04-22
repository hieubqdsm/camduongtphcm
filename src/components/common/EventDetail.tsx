'use client';

import { EventDetailProps } from '@/app/types/models';

export default function EventDetail({ event, onClose, isOpen }: EventDetailProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-lg p-4 transform transition-transform duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Chi tiết đóng đường</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{event.street}</h3>
          <p className="text-gray-600">{event.area}</p>
        </div>

        <div>
          <h4 className="font-medium">Thời gian:</h4>
          <p className="text-gray-600">
            Từ: {new Date(event.startTime).toLocaleString('vi-VN')}
          </p>
          <p className="text-gray-600">
            Đến: {new Date(event.endTime).toLocaleString('vi-VN')}
          </p>
        </div>

        <div>
          <h4 className="font-medium">Mô tả:</h4>
          <p className="text-gray-600">{event.description}</p>
        </div>

        {event.affectedAreas.length > 0 && (
          <div>
            <h4 className="font-medium">Khu vực ảnh hưởng:</h4>
            <ul className="list-disc list-inside text-gray-600">
              {event.affectedAreas.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-sm text-gray-500">
          Cập nhật lần cuối: {new Date(event.lastUpdated).toLocaleString('vi-VN')}
        </div>
      </div>
    </div>
  );
}
