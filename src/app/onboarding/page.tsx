'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import FormError from '@/components/ui/FormError';

interface OnboardingForm {
  name: string;
  age: string;
  location: string;
  preferred_language: string;
  session_format: 'in-person' | 'online' | 'both';
  budget: string;
  issues: string[];
  gender_preference: 'male' | 'female' | 'no-preference';
  additional_notes: string;
}

const COMMON_ISSUES = [
  'Anxiety',
  'Depression',
  'Relationships',
  'Stress',
  'Trauma',
  'Self-esteem',
  'Career',
  'Family',
  'Grief',
  'Identity',
];

export default function OnboardingPage() {
  const [form, setForm] = useState<OnboardingForm>({
    name: '',
    age: '',
    location: '',
    preferred_language: '',
    session_format: 'both',
    budget: '',
    issues: [],
    gender_preference: 'no-preference',
    additional_notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!user) {
      setError('You must be logged in to complete onboarding');
      setLoading(false);
      return;
    }

    try {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: user.id,
            ...form,
          },
        ]);

      if (profileError) throw profileError;

      router.push('/find-therapist');
      router.refresh();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleIssue = (issue: string) => {
    setForm((prev) => ({
      ...prev,
      issues: prev.issues.includes(issue)
        ? prev.issues.filter((i) => i !== issue)
        : [...prev.issues, issue],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Tell us about yourself</h1>
          <p className="mt-2 text-gray-600">
            Help us match you with the right therapist for your needs
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow-lg">
          {error && <FormError message={error} />}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                id="age"
                type="number"
                required
                min="18"
                value={form.age}
                onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                id="location"
                type="text"
                required
                value={form.location}
                onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="preferred_language" className="block text-sm font-medium text-gray-700">
                Preferred Language
              </label>
              <input
                id="preferred_language"
                type="text"
                required
                value={form.preferred_language}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, preferred_language: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Session Format</label>
              <div className="mt-2 space-x-4">
                {['in-person', 'online', 'both'].map((format) => (
                  <label key={format} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="session_format"
                      value={format}
                      checked={form.session_format === format}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          session_format: e.target.value as OnboardingForm['session_format'],
                        }))
                      }
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-gray-700">
                      {format.charAt(0).toUpperCase() + format.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                Budget per Session (USD)
              </label>
              <input
                id="budget"
                type="number"
                required
                min="0"
                value={form.budget}
                onChange={(e) => setForm((prev) => ({ ...prev, budget: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                What issues would you like to work on?
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {COMMON_ISSUES.map((issue) => (
                  <button
                    key={issue}
                    type="button"
                    onClick={() => toggleIssue(issue)}
                    className={`rounded-full px-4 py-2 text-sm ${
                      form.issues.includes(issue)
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {issue}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Therapist Gender Preference
              </label>
              <div className="mt-2 space-x-4">
                {['male', 'female', 'no-preference'].map((gender) => (
                  <label key={gender} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender_preference"
                      value={gender}
                      checked={form.gender_preference === gender}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          gender_preference: e.target.value as OnboardingForm['gender_preference'],
                        }))
                      }
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-gray-700">
                      {gender === 'no-preference'
                        ? 'No Preference'
                        : gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="additional_notes" className="block text-sm font-medium text-gray-700">
                Additional Notes
              </label>
              <textarea
                id="additional_notes"
                rows={4}
                value={form.additional_notes}
                onChange={(e) => setForm((prev) => ({ ...prev, additional_notes: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
} 