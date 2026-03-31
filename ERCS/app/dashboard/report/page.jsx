'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { EMERGENCY_TYPES } from '@/lib/data';

export default function ReportPage() {
  const { submitEmergency } = useApp();
  const router = useRouter();
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!type || !description.trim() || !location.trim())
      return setError('All fields are required.');
    setError('');
    setSubmitting(true);
    const report = submitEmergency({ type, description: description.trim(), location: location.trim() });
    setSubmitting(false);
    setSuccess(report);
    setType(''); setDescription(''); setLocation('');
  }

  return (
    <div className="fade-in max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">🆘 Report an Emergency</h1>
        <p className="text-gray-500 text-sm mt-1">
          Fill in the details below. All fields are mandatory.
        </p>
      </div>

      {success && (
        <Alert type="success">
          <div>
            Emergency submitted successfully! Your tracking ID is{' '}
            <span className="font-mono font-bold text-green-200">{success.id}</span>.{' '}
            <button onClick={() => router.push('/dashboard/track')}
              className="underline text-green-200 hover:text-green-100">
              Track it here →
            </button>
          </div>
        </Alert>
      )}

      {error && <Alert type="error">{error}</Alert>}

      <Card>
        <form onSubmit={handleSubmit}>
          <Select
            label="Emergency Type"
            value={type}
            onChange={setType}
            options={EMERGENCY_TYPES}
            required
          />
          <Input
            label="Location"
            value={location}
            onChange={setLocation}
            placeholder="e.g. Block C, Sector 4, Near main gate"
            required
          />
          <Textarea
            label="Description"
            value={description}
            onChange={setDescription}
            placeholder="Describe what is happening, how many people are involved, visible hazards, etc."
            rows={5}
            required
          />

          {/* Info box */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-5 text-xs text-gray-400 space-y-1">
            <p>📌 A unique Emergency ID will be generated for tracking.</p>
            <p>📌 Your name and submission timestamp are recorded automatically.</p>
            <p>📌 An administrator will review and assign a responder shortly.</p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => router.push('/dashboard')} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="px-6">
              {submitting ? 'Submitting…' : '🚨 Submit Report'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
