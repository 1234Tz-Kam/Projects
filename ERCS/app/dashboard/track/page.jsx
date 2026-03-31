'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import { STATUS_FLOW } from '@/lib/data';

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

function EmergencyDetail({ e, onBack }) {
  return (
    <div className="fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
        ← Back to list
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <span className="font-mono text-xs text-gray-500 block mb-1">{e.id}</span>
          <h2 className="text-xl font-bold text-white">{e.type} Emergency</h2>
          <p className="text-gray-500 text-sm mt-1">Submitted on {e.submittedAt}</p>
        </div>
        <StatusBadge status={e.status} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Card className="py-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Description</p>
          <p className="text-sm text-gray-300 leading-relaxed">{e.description}</p>
        </Card>
        <Card className="py-4 space-y-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Location</p>
            <p className="text-sm text-gray-300">📍 {e.location}</p>
          </div>
          {e.responder && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Assigned Responder</p>
              <p className="text-sm text-gray-300">🛡️ {e.responder}</p>
            </div>
          )}
        </Card>
      </div>

      <Card>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-5">Status History</p>
        <Timeline history={e.history} />
      </Card>

      {/* Progress stepper */}
      <Card className="mt-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Progress</p>
        <div className="flex items-center gap-0">
          {STATUS_FLOW.map((s, i) => {
            const idx = STATUS_FLOW.indexOf(e.status);
            const done = i <= idx;
            return (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors
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
    </div>
  );
}

export default function TrackPage() {
  const { currentUser, emergencies } = useApp();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');

  const mine = emergencies.filter(e => e.userId === currentUser.id);
  const displayed = filter === 'All' ? mine : mine.filter(e => e.status === filter);

  // Keep selected in sync after admin updates
  const liveSelected = selected ? emergencies.find(e => e.id === selected.id) : null;

  if (liveSelected) return <EmergencyDetail e={liveSelected} onBack={() => setSelected(null)} />;

  return (
    <div className="fade-in">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">📋 My Emergency Reports</h1>
          <p className="text-gray-500 text-sm mt-1">{mine.length} total report{mine.length !== 1 ? 's' : ''}</p>
        </div>
        {/* filter pills */}
        <div className="flex flex-wrap gap-2">
          {['All', ...STATUS_FLOW].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors
                ${filter === s
                  ? 'bg-red-600 border-red-600 text-white'
                  : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {displayed.length === 0 ? (
        <Card className="text-center py-16">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-500">
            {filter === 'All' ? "You haven't reported any emergencies yet." : `No reports with status "${filter}".`}
          </p>
          {filter === 'All' && (
            <Link href="/dashboard/report" className="inline-block mt-4 text-sm text-red-400 hover:text-red-300">
              Report an emergency →
            </Link>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {displayed.map(e => (
            <Card key={e.id} className="cursor-pointer hover:border-gray-600 transition-colors py-4"
              onClick={() => setSelected(e)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono text-xs text-gray-500">{e.id}</span>
                    <span className="text-xs bg-gray-800 text-blue-300 px-2 py-0.5 rounded">{e.type}</span>
                    <StatusBadge status={e.status} />
                  </div>
                  <p className="text-sm text-gray-200 font-medium truncate">
                    {e.description.length > 90 ? e.description.slice(0, 90) + '…' : e.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1.5">
                    📍 {e.location} &nbsp;·&nbsp; 🕒 {e.submittedAt}
                    {e.responder && <>&nbsp;·&nbsp; 🛡️ {e.responder}</>}
                  </p>
                </div>
                <span className="text-gray-600 text-lg shrink-0">›</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
