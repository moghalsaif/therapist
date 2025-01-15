'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import OnboardingForm from '../onboarding/OnboardingForm';
import ChatInterface from '../chat/ChatInterface';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function AuthCheck() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function checkOnboardingStatus() {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setHasCompletedOnboarding(!!preferences);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkOnboardingStatus();
  }, [user, router, supabase]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!hasCompletedOnboarding) {
    return <OnboardingForm />;
  }

  return <ChatInterface />;
} 