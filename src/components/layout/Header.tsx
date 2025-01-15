'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Don't show header on public pages
  if (!user || pathname === '/') return null;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/find-therapist" className="text-xl font-bold text-primary-600">
              Therapy Bestie
            </Link>
            <nav className="ml-10 space-x-4">
              <Link
                href="/find-therapist"
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === '/find-therapist'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                Find Therapist
              </Link>
              <Link
                href="/appointments"
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === '/appointments'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                My Appointments
              </Link>
              <Link
                href="/profile"
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === '/profile'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                Profile
              </Link>
            </nav>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
} 