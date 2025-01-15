'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import FormError from '../ui/FormError';

export default function OnboardingForm() {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    preferredLanguages: [] as string[],
    preferredFormat: '',
    budget: '',
    concerns: [] as string[],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const languages = ['English', 'Spanish', 'French', 'Mandarin', 'Hindi', 'Arabic'];
  const sessionFormats = ['In-person', 'Video call', 'Phone call', 'Chat'];
  const commonConcerns = [
    'Anxiety',
    'Depression',
    'Stress',
    'Relationships',
    'Self-esteem',
    'Trauma',
    'Career',
    'Family',
    'Grief',
    'Identity',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: profileError } = await supabase.from('user_preferences').upsert([
        {
          user_id: (await supabase.auth.getUser()).data.user?.id,
          ...formData,
        },
      ]);

      if (profileError) throw profileError;

      router.push('/chat');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (field: 'preferredLanguages' | 'concerns', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Help us understand your needs</h1>
      {error && <FormError message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
            Age
          </label>
          <input
            type="number"
            id="age"
            required
            min="13"
            max="120"
            value={formData.age}
            onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            id="gender"
            required
            value={formData.gender}
            onChange={(e) => setFormData((prev) => ({ ...prev, gender: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Languages</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {languages.map((language) => (
              <label key={language} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.preferredLanguages.includes(language)}
                  onChange={() => handleCheckboxChange('preferredLanguages', language)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{language}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="preferredFormat" className="block text-sm font-medium text-gray-700">
            Preferred Session Format
          </label>
          <select
            id="preferredFormat"
            required
            value={formData.preferredFormat}
            onChange={(e) => setFormData((prev) => ({ ...prev, preferredFormat: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          >
            <option value="">Select format</option>
            {sessionFormats.map((format) => (
              <option key={format} value={format.toLowerCase()}>
                {format}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
            Budget per Session (USD)
          </label>
          <select
            id="budget"
            required
            value={formData.budget}
            onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          >
            <option value="">Select budget range</option>
            <option value="50-100">$50-$100</option>
            <option value="100-150">$100-$150</option>
            <option value="150-200">$150-$200</option>
            <option value="200+">$200+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Areas of Concern</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {commonConcerns.map((concern) => (
              <label key={concern} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.concerns.includes(concern)}
                  onChange={() => handleCheckboxChange('concerns', concern)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{concern}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Continue to Chat'}
        </button>
      </form>
    </div>
  );
} 