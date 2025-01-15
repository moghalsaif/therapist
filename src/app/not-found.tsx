import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary-600">Page Not Found</h2>
        <p className="mt-2 text-gray-600">Could not find requested resource</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
} 