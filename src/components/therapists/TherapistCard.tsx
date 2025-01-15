'use client';

import { Therapist } from '@/types/supabase';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';

interface TherapistCardProps {
  therapist: Therapist;
  explanation?: string;
  onSchedule: (therapist: Therapist) => void;
}

export default function TherapistCard({ therapist, explanation, onSchedule }: TherapistCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg transition-all hover:shadow-xl">
      <div className="mb-4 flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full">
          {therapist.photo_url ? (
            <Image
              src={therapist.photo_url}
              alt={therapist.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary-100 text-xl font-semibold text-primary-600">
              {therapist.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{therapist.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">⭐ {therapist.rating}</span>
            <span className="text-sm text-gray-600">({therapist.reviews} reviews)</span>
          </div>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex flex-wrap gap-2">
          {therapist.specialties.map((specialty, index) => (
            <span
              key={index}
              className="rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-700"
            >
              {specialty}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-600">
          {therapist.languages.join(', ')}
        </p>
        <p className="text-sm text-gray-600">
          {therapist.session_format} • {therapist.location}
        </p>
        <p className="font-medium text-gray-900">
          {formatCurrency(therapist.rate)}/session
        </p>
      </div>

      {explanation && (
        <p className="mb-4 text-sm text-gray-600">{explanation}</p>
      )}

      <button
        onClick={() => onSchedule(therapist)}
        className="w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
      >
        Schedule Session
      </button>
    </div>
  );
} 