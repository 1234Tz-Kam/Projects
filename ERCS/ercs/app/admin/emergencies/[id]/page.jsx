'use client';
import { useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import { STATUS_FLOW, RESPONDERS } from '@/lib/data';

function Timeline({ history }) {
  return (
    <div className="border-l-2 border-gray-800 pl-5 space-y-4">
      {history.map((h, i) => (
        <div key={i} className="relative">
          <div className={`absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 border-gray-950
            ${i === history.length - 1 ? 'bg-red-500' : 'bg-gray-600'}`} />
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <StatusBadge status={h.status} />
            <span className="text-xs text-gray-500 font-mono">{h.at}</span>
          </div>
          <p className="text-sm text-gray-400">{h.note}</p>
        </div>
      ))}
    </div>
  );
}

export default function AdminEmergencyDetail({ params }) {
  const { id } = use(params);
  const { emergencies, updateEmergency } = useApp();
  const e = emergencies.find(em => em.id === id);

  const [newStatus, setNewStatus] = useState('');
  const [responder, setResponder] = useState('');
  const [note, setNote] = useState('');
  const [toast, setToast] = useState('');
  const [err, setErr] = useState('');

  if (!e) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">❌</div>
        <p className="text-gray-400 mb-4">Emergency <span className="font-mono text-white">{id}</span> not found.</p>
        <Link href="/admin/emergencies" className="text-red-400 hover:text-red-300 text-sm">← Back to list</Link>
      </div>
    );
  }

  function handleSave() {
    if (!newStatus && !responder) return setErr('Select a new status or assign a responder.');
    setErr('');
    updateEmergency(e.id, { status: newStatus, responder, note });
    setToast('Changes saved successfully!');
    setNewStatus(''); setResponder(''); setNote('');
    setTimeout(() => setToast(''), 4000);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 fade-in">
      <Link href="/admin/emergencies" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 w-fit transition-colors">
        ← Back to emergencies
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <span className="font-mono text-xs text-gray-500 block mb-1">{e.id}</span>
          <h1 className="text-2xl font-bold text-white">{e.type} Emergency</h1>
          <p className="text-gray-500 text-sm mt-1">
            Reported by <span className="text-gray-300">{e.userName}</span> on {e.submittedAt}
          </p>
        </div>
        <StatusBadge status={e.status} />
      </div>

      {toast && <Alert type="success">{toast}</Alert>}
      {err && <Alert type="error">{err}</Alert>}

      {/* Details grid */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Card className="py-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Description</p>
          <p className="text-sm text-gray-300 leading-relaxed">{e.description}</p>
        </Card>
        <Card className="py-4 space-y-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Location</p>
            <p className="text-sm text-gray-300">📍 {e.location}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reporter</p>
            <p className="text-sm text-gray-300">👤 {e.userName}</p>
          </div>
          {e.responder && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Assigned Responder</p>
              <p className="text-sm text-gray-300">🛡️ {e.responder}</p>
            </div>
          )}
        </Card>
      </div>

      {/* Update panel */}
      <Card className="mb-6 border-gray-700">
        <h2 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">⚙️ Update Emergency</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Select
            label="Update Status"
            value={newStatus}
            onChange={setNewStatus}
            options={STATUS_FLOW}
            placeholder="Keep current status"
          />
          <Select
            label="Assign / Reassign Responder"
            value={responder}
            onChange={setResponder}
            options={RESPONDERS}
            placeholder="Keep current responder"
          />
        </div>
        <Input
          label="Action Note (optional)"
          value={note}
          onChange={setNote}
          placeholder="Add a note about this update…"
        />

        {/* Audit info */}
        <div className="text-xs text-gray-600 mb-4">
          🔒 All changes are logged with your admin ID and timestamp per REQ-14.
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => { setNewStatus(''); setResponder(''); setNote(''); }}>
            Clear
          </Button>
          <Button variant="success" onClick={handleSave} disabled={!newStatus && !responder} className="px-6">
            Save Changes ✓
          </Button>
        </div>
      </Card>

      {/* Progress stepper */}
      <Card className="mb-6">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Workflow Progress</p>
        <div className="flex items-center">
          {STATUS_FLOW.map((s, i) => {
            const idx = STATUS_FLOW.indexOf(e.status);
            const done = i <= idx;
            return (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2
                    ${done ? 'bg-red-600 border-red-600 text-white' : 'bg-gray-800 border-gray-700 text-gray-600'}`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs mt-1 text-center ${done ? 'text-gray-300' : 'text-gray-600'}`}>{s}</span>
                </div>
                {i < STATUS_FLOW.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < idx ? 'bg-red-600' : 'bg-gray-800'}`} />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* History */}
      <Card>
        <h2 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">📅 Audit Log / Status History</h2>
        <Timeline history={e.history} />
      </Card>
    </div>
  );
}
