'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

export default function LoginPage() {
  const { login } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = login(email, password);
    setLoading(false);
    if (result.error) return setError(result.error);
    if (result.user.role === 'admin') router.push('/admin');
    else router.push('/dashboard');
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
          <h2 className="text-lg font-semibold text-white mb-6">Sign in to your account</h2>

          {error && <Alert type="error">{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Input label="Email" type="email" value={email} onChange={setEmail}
              placeholder="you@example.com" required />
            <Input label="Password" type="password" value={password} onChange={setPassword}
              placeholder="••••••••" required />
            <Button type="submit" className="w-full py-2.5 mt-2" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            No account?{' '}
            <Link href="/register" className="text-red-400 hover:text-red-300 font-medium">
              Register here
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 bg-gray-900/60 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Demo Credentials</p>
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-gray-400">👤 User</span>
              <span className="text-blue-400">user@ercs.com / user123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">🔑 Admin</span>
              <span className="text-purple-400">admin@ercs.com / admin123</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
