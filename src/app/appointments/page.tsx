'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useAuth } from '@/lib/hooks';
import type { Therapist } from '@/types/supabase';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import SuccessMessage from '@/components/ui/SuccessMessage';

interface Appointment {
  id: string;
  user_id: string;
  therapist_id: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  therapist: Therapist;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getAppointments = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*, therapist:therapists(*)')
          .eq('user_id', user.id)
          .order('date', { ascending: true });

        if (error) throw error;
        setAppointments(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    getAppointments();
  }, [user, supabase]);

  const handleCancel = async () => {
    if (!appointmentToCancel) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentToCancel);

      if (error) throw error;

      setAppointments(appointments.map(apt => 
        apt.id === appointmentToCancel ? { ...apt, status: 'cancelled' } : apt
      ));
      setSuccessMessage('Appointment cancelled successfully');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to cancel appointment. Please try again.');
    } finally {
      setAppointmentToCancel(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">My Appointments</h1>

        {successMessage && (
          <div className="mb-4">
            <SuccessMessage message={successMessage} />
          </div>
        )}

        {appointments.length === 0 ? (
          <div className="rounded-lg bg-white p-6 text-center shadow-lg">
            <p className="text-gray-600">No appointments scheduled yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-lg bg-white p-6 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {appointment.therapist.name}
                    </h2>
                    <p className="text-gray-600">
                      {formatDate(appointment.date)} at {appointment.time}
                    </p>
                    <p className="text-gray-600">
                      {appointment.therapist.session_format} • {formatCurrency(appointment.therapist.rate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-sm ${
                        appointment.status === 'scheduled'
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                    {appointment.status === 'scheduled' && (
                      <button
                        onClick={() => setAppointmentToCancel(appointment.id)}
                        className="mt-2 block text-sm text-red-600 hover:text-red-500"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {appointmentToCancel && (
          <ConfirmDialog
            title="Cancel Appointment"
            message="Are you sure you want to cancel this appointment? This action cannot be undone."
            confirmLabel="Cancel Appointment"
            onConfirm={handleCancel}
            onCancel={() => setAppointmentToCancel(null)}
          />
        )}
      </div>
    </div>
  );
} 