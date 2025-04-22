import type { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fullHeight?: boolean;
}

export default function Loading({ children, fullHeight = true }: Props) {
  return (
    <div className={`flex items-center justify-center w-full bg-gray-100 ${fullHeight ? 'h-full' : 'min-h-[200px]'}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        {children && <p className="text-gray-600">{children}</p>}
      </div>
    </div>
  );
}
