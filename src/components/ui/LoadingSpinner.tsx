'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
      <span className="ml-2 text-sm text-gray-500">Loading...</span>
    </div>
  );
} 