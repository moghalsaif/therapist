'use client';

import type { Therapist } from '@/types/supabase';
import { formatCurrency } from '@/lib/utils';

interface TherapistCardProps {
  therapist: Therapist;
  onContact: () => void;
}

export default function TherapistCard({ therapist, onContact }: TherapistCardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-lg">
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{therapist.name}</h3>
          <div className="mt-1 flex items-center">
            <span className="text-sm text-gray-500">{therapist.location}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="flex items-center text-sm text-yellow-500">
              {therapist.rating}
              <svg
                className="ml-1 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          </div>
        </div>

        <p className="mb-4 text-sm text-gray-600 line-clamp-3">{therapist.bio}</p>

        <div className="mb-4 space-y-2">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Specialties</h4>
            <div className="mt-1 flex flex-wrap gap-1">
              {therapist.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="inline-flex items-center rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900">Languages</h4>
            <div className="mt-1 flex flex-wrap gap-1">
              {therapist.languages.map((language) => (
                <span
                  key={language}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900">Session Format</h4>
            <p className="mt-1 text-sm text-gray-600">{therapist.session_format}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900">Rate per Session</h4>
            <p className="mt-1 text-sm text-gray-600">{formatCurrency(therapist.rate)}</p>
          </div>
        </div>

        <button
          onClick={onContact}
          className="w-full rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Contact Therapist
        </button>
      </div>
    </div>
  );
} 