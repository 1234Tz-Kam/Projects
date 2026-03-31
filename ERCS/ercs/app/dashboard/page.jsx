'use client';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';

function StatCard({ label, value, color, icon }) {
  return (
    <Card className="text-center py-6">
      <div className="text-4xl mb-1">{icon}</div>
      <div className="text-3xl font-bold mt-2" style={{ color }}>{value}</div>
      <div className="text-gray-500 text-xs uppercase tracking-widest mt-1">{label}</div>
    </Card>
  );
}

export default function DashboardHome() {
  const { currentUser, emergencies } = useApp();
  const mine = emergencies.filter(e => e.userId === currentUser.id);

  const stats = [
    { label: 'Total Reported',  value: mine.length,                                                    icon: '📋', color: '#93c5fd' },
    { label: 'Pending',         value: mine.filter(e => e.status === 'Pending').length,                 icon: '⏳', color: '#f5a623' },
    { label: 'In Progress',     value: mine.filter(e => ['Assigned','In Progress'].includes(e.status)).length, icon: '🚒', color: '#b39ddb' },
    { label: 'Resolved',        value: mine.filter(e => e.status === 'Resolved').length,                icon: '✅', color: '#66bb6a' },
  ];

  const recent = mine.slice(0, 3);

  return (
    <div className="fade-in">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {currentUser.name.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Here's an overview of your emergency reports.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <Link href="/dashboard/report">
          <div className="bg-red-950 border border-red-900 hover:border-red-700 rounded-xl p-6 cursor-pointer transition-colors group">
            <div className="text-3xl mb-3">🆘</div>
            <div className="font-semibold text-red-300 group-hover:text-red-200 text-lg">Report Emergency</div>
            <div className="text-red-400/60 text-sm mt-1">Submit a new emergency incident report</div>
          </div>
        </Link>
        <Link href="/dashboard/track">
          <div className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-6 cursor-pointer transition-colors group">
            <div className="text-3xl mb-3">📡</div>
            <div className="font-semibold text-gray-300 group-hover:text-white text-lg">Track Reports</div>
            <div className="text-gray-500 text-sm mt-1">Check status of your submitted reports</div>
          </div>
        </Link>
      </div>

      {/* Recent reports */}
      {recent.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-300 font-semibold">Recent Reports</h2>
            <Link href="/dashboard/track" className="text-xs text-red-400 hover:text-red-300">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recent.map(e => (
              <Card key={e.id} className="flex items-center justify-between py-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-gray-500">{e.id}</span>
                    <span className="text-xs bg-gray-800 text-blue-300 px-2 py-0.5 rounded">{e.type}</span>
                  </div>
                  <div className="text-sm text-gray-300 font-medium">
                    {e.description.length > 70 ? e.description.slice(0, 70) + '…' : e.description}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">📍 {e.location} · 🕒 {e.submittedAt}</div>
                </div>
                <StatusBadge status={e.status} />
              </Card>
            ))}
          </div>
        </div>
      )}

      {mine.length === 0 && (
        <Card className="text-center py-16">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-500">You haven't reported any emergencies yet.</p>
          <Link href="/dashboard/report" className="inline-block mt-4 text-sm text-red-400 hover:text-red-300">
            Report your first emergency →
          </Link>
        </Card>
      )}
    </div>
  );
}
