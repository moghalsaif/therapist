'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { Therapist } from '@/types/supabase';
import { formatCurrency, generateTimeSlots } from '@/lib/utils';
import { useAuth } from '@/lib/hooks';
import FormError from './FormError';
import SuccessMessage from './SuccessMessage';

interface ScheduleModalProps {
  therapist: Therapist;
  onClose: () => void;
}

export default function ScheduleModal({ therapist, onClose }: ScheduleModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!user) {
      setError('You must be logged in to schedule an appointment');
      setLoading(false);
      return;
    }

    try {
      const { error: appointmentError } = await supabase.from('appointments').insert([
        {
          user_id: user.id,
          therapist_id: therapist.id,
          date,
          time,
          status: 'scheduled',
        },
      ]);

      if (appointmentError) throw appointmentError;

      setSuccess('Appointment scheduled successfully!');
      setTimeout(() => {
        router.push('/appointments');
        router.refresh();
      }, 2000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = generateTimeSlots('09:00', '17:00', 60);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Schedule Appointment</h2>
          <p className="mt-1 text-sm text-gray-600">
            with {therapist.name} • {formatCurrency(therapist.rate)} per session
          </p>
        </div>

        {error && <FormError message={error} />}
        {success && <SuccessMessage message={success} />}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              required
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <select
              id="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            >
              <option value="">Select a time</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 