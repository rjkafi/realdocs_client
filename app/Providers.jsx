'use client';

import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";

export function Providers({ children }) {
  return <SessionProvider>
    <ToastContainer position="top-center" autoClose={3000} />
      {children}
    </SessionProvider>;
}
