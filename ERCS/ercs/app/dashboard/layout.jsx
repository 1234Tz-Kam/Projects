'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Navbar from '@/components/layout/Navbar';

export default function DashboardLayout({ children }) {
  const { currentUser } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) router.replace('/login');
    else if (currentUser.role === 'admin') router.replace('/admin');
  }, [currentUser, router]);

  if (!currentUser || currentUser.role === 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
