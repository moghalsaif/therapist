import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-4 text-4xl font-bold">Therapy Bestie</h1>
      <p className="mb-8 text-xl text-gray-600">Find the right therapist for you</p>
      <Link 
        href="/form" 
        className="rounded-lg bg-blue-600 px-6 py-3 text-lg text-white hover:bg-blue-700"
      >
        Get Started
      </Link>
    </div>
  );
} 