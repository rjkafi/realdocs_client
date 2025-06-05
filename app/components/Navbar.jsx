'use client';

import Link from 'next/link';
import { FaRegFileAlt } from 'react-icons/fa';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [callbackUrl, setCallbackUrl] = useState('/dashboard');

  useEffect(() => {
    const url = searchParams.get('callbackUrl');
    if (url) setCallbackUrl(url);
  }, [searchParams]);

  const user = session?.user;

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md border-b border-gray-300 z-50">
      <div className="container mx-auto px-4 lg:px-8 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <FaRegFileAlt className="w-5 h-5 text-blue-400" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
            RealDocs
          </h2>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard">
                <img
                  src={user.image || '/default-avatar.png'}
                  alt={user.name || 'User'}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-blue-500 shadow transition"
                />
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-5 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
              >
                Log Out
              </button>
            </>
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
  );
}
