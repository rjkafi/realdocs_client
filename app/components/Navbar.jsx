'use client';

import Link from 'next/link';
import { FaRegFileAlt } from 'react-icons/fa';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const user = session?.user;

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md border-b border-gray-300 z-50">
      <div className="container mx-auto px-4 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo + Name */}
        <Link href="/" className="flex items-center gap-2">
          <FaRegFileAlt className="w-5 h-5 text-blue-400" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
            RealDocs
          </h2>
        </Link>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <Link href="/dashboard">
                <img
                  src={user.image || '/default-avatar.png'}
                  alt={user.name || 'User'}
                  title={user.name || 'User'}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 shadow hover:border-blue-500 transition"
                />
              </Link>

              {/* Logout */}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-5 py-2 rounded-lg bg-red-500 text-white font-medium shadow hover:bg-red-600 transition"
              >
                Log Out
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => signIn('google', { callbackUrl })}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
              <Link
                href="/signUp"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition shadow-md hover:shadow-lg"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
    </Suspense>
  );
}
