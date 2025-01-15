'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { groq } from '@/lib/groq';
import { useAuth, useProfile } from '@/lib/hooks';
import TherapistCard from '@/components/therapists/TherapistCard';
import ScheduleModal from '@/components/therapists/ScheduleModal';
import type { Therapist } from '@/types/supabase';

export default function PromptPage() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<Array<{ therapist: Therapist; explanation: string }>>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const { user } = useAuth();
  const { profile } = useProfile();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!user || !profile) throw new Error('Please complete your profile first');

      // Get therapists
      const { data: therapists } = await supabase
        .from('therapists')
        .select('*');

      if (!therapists) throw new Error('No therapists found');

      // Use Groq to match therapists
      const matchingPrompt = `
        Given a user profile and their needs, find the best matching therapists.
        
        User Profile:
        ${JSON.stringify(profile)}
        
        User's Current Needs:
        ${prompt}
        
        Available Therapists:
        ${JSON.stringify(therapists)}
        
        Return the top 3 best matching therapists as a JSON array with explanation for each match.
        Each match should have: { therapist: Therapist, explanation: string }
      `;

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: matchingPrompt }],
        model: 'mixtral-8x7b-32768',
      });

      const matches = JSON.parse(completion.choices[0]?.message?.content || '[]');
      setMatches(matches);
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchedule = async (date: string, time: string) => {
    if (!selectedTherapist || !user) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          therapist_id: selectedTherapist.id,
          date,
          time,
          status: 'scheduled'
        });

      if (error) throw error;

      setSelectedTherapist(null);
      router.push('/appointments');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to schedule appointment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-600">Find Your Match</h1>
          <p className="mt-2 text-gray-600">
            Tell us what you're looking for, and we'll match you with the perfect therapist.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <label htmlFor="prompt" className="block text-lg font-medium text-gray-700 mb-4">
              What kind of help are you looking for?
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., I'm looking for someone who specializes in anxiety and CBT..."
              className="w-full min-h-[100px] rounded-md border border-gray-300 p-4"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {isLoading ? 'Finding matches...' : 'Find Matches'}
            </button>
          </div>
        </form>

        {matches.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Matches</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {matches.map(({ therapist, explanation }, index) => (
                <TherapistCard
                  key={therapist.id}
                  therapist={therapist}
                  explanation={explanation}
                  onSchedule={() => setSelectedTherapist(therapist)}
                />
              ))}
            </div>
          </div>
        )}

        {selectedTherapist && (
          <ScheduleModal
            therapist={selectedTherapist}
            onClose={() => setSelectedTherapist(null)}
            onSchedule={handleSchedule}
          />
        )}
      </div>
    </div>
  );
} 