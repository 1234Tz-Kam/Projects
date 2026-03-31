'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

export default function RegisterPage() {
  const { register } = useApp();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Full name is required.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    const result = register(name.trim(), email, password);
    setLoading(false);
    if (result.error) return setError(result.error);
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4"
      style={{ backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(239,68,68,0.12), transparent)' }}>
      <div className="w-full max-w-md fade-in">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600 text-3xl mb-4"
            style={{ boxShadow: '0 0 40px rgba(239,68,68,0.35)' }}>
            🚨
          </div>
          <h1 className="text-2xl font-bold tracking-widest text-white">ERCS</h1>
          <p className="text-gray-500 text-xs tracking-[0.25em] uppercase mt-1 font-mono">
            Emergency Response Coordination System
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Create your account</h2>

          {error && <Alert type="error">{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Input label="Full Name" value={name} onChange={setName}
              placeholder="Your full name" required />
            <Input label="Email" type="email" value={email} onChange={setEmail}
              placeholder="you@example.com" required />
            <Input label="Password" type="password" value={password} onChange={setPassword}
              placeholder="Min. 6 characters" required />
            <Button type="submit" className="w-full py-2.5 mt-2" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account →'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-red-400 hover:text-red-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
