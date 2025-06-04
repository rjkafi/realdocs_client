'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { getJwtToken } from '@/app/utils/getJwtToken'; 

export default function AuthSync() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      const currentUser = {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      };
      getJwtToken(currentUser);
    }
  }, [session]);

  return null;
}
