'use client';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import { STATUS_FLOW } from '@/lib/data';

export default function AdminHome() {
  const { emergencies, users } = useApp();
  const normalUsers = users.filter(u => u.role === 'user');

  const counts = {};
  STATUS_FLOW.forEach(s => { counts[s] = emergencies.filter(e => e.status === s).length; });

  const recent = [...emergencies].slice(0, 5);

  const statCards = [
    { label: 'Total Reports',    value: emergencies.length,    icon: '📋', color: '#93c5fd' },
    { label: 'Pending',          value: counts['Pending'],      icon: '⏳', color: '#f5a623' },
    { label: 'In Progress',      value: (counts['Assigned'] || 0) + (counts['In Progress'] || 0), icon: '🚒', color: '#b39ddb' },
    { label: 'Resolved',         value: counts['Resolved'],     icon: '✅', color: '#66bb6a' },
    { label: 'Registered Users', value: normalUsers.length,    icon: '👥', color: '#f0abfc' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">📊 Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">System overview and recent activity.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">
        {statCards.map(s => (
          <Card key={s.label} className="text-center py-5">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-gray-500 text-xs uppercase tracking-wide mt-1 leading-tight">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Status breakdown */}
      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        <Card>
          <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Status Breakdown</h2>
          <div className="space-y-3">
            {STATUS_FLOW.map(s => {
              const count = counts[s] || 0;
              const pct = emergencies.length ? Math.round((count / emergencies.length) * 100) : 0;
              return (
                <div key={s}>
                  <div className="flex justify-between items-center mb-1">
                    <StatusBadge status={s} />
                    <span className="text-sm text-gray-400 font-mono">{count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/admin/emergencies">
              <div className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                <span className="text-xl">🗂</span>
                <div>
                  <div className="text-sm font-medium text-white">Manage All Emergencies</div>
                  <div className="text-xs text-gray-500">Review, assign, and update status</div>
                </div>
              </div>
            </Link>
            <Link href="/admin/emergencies?filter=Pending">
              <div className="flex items-center gap-3 p-3 bg-red-950/60 hover:bg-red-950 border border-red-900/50 rounded-lg cursor-pointer transition-colors">
                <span className="text-xl">⚠️</span>
                <div>
                  <div className="text-sm font-medium text-red-300">
                    {counts['Pending'] || 0} Pending {counts['Pending'] === 1 ? 'Report' : 'Reports'}
                  </div>
                  <div className="text-xs text-red-400/60">Require immediate attention</div>
                </div>
              </div>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Recent Reports</h2>
          <Link href="/admin/emergencies" className="text-xs text-red-400 hover:text-red-300">View all →</Link>
        </div>
        <div className="space-y-2">
          {recent.map(e => (
            <Link key={e.id} href={`/admin/emergencies/${e.id}`}>
              <Card className="flex items-center justify-between py-3 hover:border-gray-600 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-xs text-gray-500">{e.id}</span>
                      <span className="text-xs bg-gray-800 text-blue-300 px-2 py-0.5 rounded">{e.type}</span>
                    </div>
                    <p className="text-sm text-gray-300 font-medium">
                      {e.description.length > 75 ? e.description.slice(0, 75) + '…' : e.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">👤 {e.userName} · 📍 {e.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={e.status} />
                  <span className="text-gray-600">›</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
