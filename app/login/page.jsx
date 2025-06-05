'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [callbackUrl, setCallbackUrl] = useState('/dashboard');

  useEffect(() => {
    const url = searchParams.get('callbackUrl');
    if (url) setCallbackUrl(url);
  }, [searchParams]);

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome to Real Docs</h1>
        <button
          onClick={handleGoogleSignIn}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md w-full flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M533.5 278.4c0-17.4-1.5-34.1-4.3-50.3H272v95.1h146.6c-6.3 34-25.2 62.8-53.9 82.1v68.2h87.2c51-47 80.6-116.2 80.6-195.1z"
              fill="#4285F4"
            />
            <path
              d="M272 544.3c72.6 0 133.6-24 178.1-64.9l-87.2-68.2c-24.2 16.2-55 25.8-90.9 25.8-69.9 0-129.2-47.2-150.3-110.6H32.5v69.7c44.3 87.8 134.2 148.2 239.5 148.2z"
              fill="#34A853"
            />
            <path
              d="M121.7 326.4c-10.3-30.6-10.3-63.6 0-94.2v-69.7H32.5c-36.6 72.4-36.6 158.9 0 231.3l89.2-67.4z"
              fill="#FBBC04"
            />
            <path
              d="M272 107.7c39.4 0 75 13.6 102.9 40.4l77.3-77.3C405.6 24.5 344.6 0 272 0 166.7 0 76.8 60.4 32.5 148.2l89.2 69.7C142.8 154.9 202.1 107.7 272 107.7z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
