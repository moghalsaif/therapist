'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/lib/hooks';
import type { Therapist } from '@/types/supabase';
import TherapistCard from '@/components/ui/TherapistCard';
import ScheduleModal from '@/components/ui/ScheduleModal';
import FormError from '@/components/ui/FormError';

interface Filters {
  session_format: string;
  max_rate: string;
  specialties: string[];
  languages: string[];
}

export default function FindTherapistPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [filters, setFilters] = useState<Filters>({
    session_format: '',
    max_rate: '',
    specialties: [],
    languages: [],
  });
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getTherapists = async () => {
      if (!user) return;

      try {
        let query = supabase
          .from('therapists')
          .select('*')
          .order('rating', { ascending: false });

        if (filters.session_format) {
          query = query.eq('session_format', filters.session_format);
        }

        if (filters.max_rate) {
          query = query.lte('rate', parseInt(filters.max_rate));
        }

        if (filters.specialties.length > 0) {
          query = query.contains('specialties', filters.specialties);
        }

        if (filters.languages.length > 0) {
          query = query.contains('languages', filters.languages);
        }

        const { data, error } = await query;

        if (error) throw error;
        setTherapists(data || []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getTherapists();
  }, [user, supabase, filters]);

  const handleSchedule = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
  };

  const handleCloseModal = () => {
    setSelectedTherapist(null);
  };

  const handleFilterChange = (key: keyof Filters, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
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
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Therapist</h1>
          <p className="mt-2 text-gray-600">Browse our network of licensed therapists</p>
        </div>

        {error && <FormError message={error} />}

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="space-y-4 rounded-lg bg-white p-4 shadow-lg">
            <h2 className="font-semibold text-gray-900">Filters</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">Session Format</label>
              <select
                value={filters.session_format}
                onChange={(e) => handleFilterChange('session_format', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                aria-label="Filter by session format"
              >
                <option value="">Any</option>
                <option value="in-person">In-person</option>
                <option value="online">Online</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Max Rate per Session</label>
              <input
                type="number"
                value={filters.max_rate}
                onChange={(e) => handleFilterChange('max_rate', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Enter maximum rate"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Specialties</label>
              <div className="mt-2 space-y-2">
                {['Anxiety', 'Depression', 'Trauma', 'Relationships', 'Stress'].map((specialty) => (
                  <label key={specialty} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.specialties.includes(specialty)}
                      onChange={(e) => {
                        const newSpecialties = e.target.checked
                          ? [...filters.specialties, specialty]
                          : filters.specialties.filter((s) => s !== specialty);
                        handleFilterChange('specialties', newSpecialties);
                      }}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{specialty}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Languages</label>
              <div className="mt-2 space-y-2">
                {['English', 'Spanish', 'French', 'Mandarin', 'Hindi'].map((language) => (
                  <label key={language} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.languages.includes(language)}
                      onChange={(e) => {
                        const newLanguages = e.target.checked
                          ? [...filters.languages, language]
                          : filters.languages.filter((l) => l !== language);
                        handleFilterChange('languages', newLanguages);
                      }}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{language}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            {therapists.length === 0 ? (
              <div className="rounded-lg bg-white p-6 text-center shadow-lg">
                <p className="text-gray-600">No therapists found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {therapists.map((therapist) => (
                  <TherapistCard
                    key={therapist.id}
                    therapist={therapist}
                    onSchedule={() => handleSchedule(therapist)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedTherapist && (
        <ScheduleModal therapist={selectedTherapist} onClose={handleCloseModal} />
      )}
    </div>
  );
} 