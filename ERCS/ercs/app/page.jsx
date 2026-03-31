'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function Home() {
  const { currentUser } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) router.replace('/login');
    else if (currentUser.role === 'admin') router.replace('/admin');
    else router.replace('/dashboard');
  }, [currentUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500 text-sm tracking-widest uppercase font-mono">Loading…</div>
    </div>
  );
}
