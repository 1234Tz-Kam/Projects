'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import { STATUS_FLOW, EMERGENCY_TYPES } from '@/lib/data';

function EmergenciesContent() {
  const { emergencies } = useApp();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState(searchParams.get('filter') || 'All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    const f = searchParams.get('filter');
    if (f) setFilter(f);
  }, [searchParams]);

  let displayed = [...emergencies];
  if (filter !== 'All') displayed = displayed.filter(e => e.status === filter);
  if (typeFilter !== 'All') displayed = displayed.filter(e => e.type === typeFilter);
  if (search) {
    const q = search.toLowerCase();
    displayed = displayed.filter(e =>
      e.id.toLowerCase().includes(q) ||
      e.type.toLowerCase().includes(q) ||
      e.userName.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q)
    );
  }
  if (sort === 'oldest') displayed = displayed.reverse();

  const counts = { All: emergencies.length };
  STATUS_FLOW.forEach(s => { counts[s] = emergencies.filter(e => e.status === s).length; });

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* Sidebar */}
      <aside className="w-56 bg-black border-r border-gray-800 flex flex-col py-6 px-3 shrink-0">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 px-2">Status</p>
        {['All', ...STATUS_FLOW].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`flex justify-between items-center px-3 py-2 rounded-lg text-sm mb-1 transition-colors w-full
              ${filter === s
                ? 'bg-gray-800 text-white border-l-2 border-red-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border-l-2 border-transparent'}`}>
            <span>{s}</span>
            <span className="text-xs bg-gray-700/60 text-gray-400 px-2 py-0.5 rounded-full">{counts[s] || 0}</span>
          </button>
        ))}

        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 mt-6 px-2">Type</p>
        {['All', ...EMERGENCY_TYPES].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`flex justify-between px-3 py-1.5 rounded-lg text-xs mb-0.5 transition-colors w-full text-left
              ${typeFilter === t ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
            {t}
          </button>
        ))}
      </aside>

      {/* List */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-gray-800 flex flex-wrap items-center gap-3 bg-gray-900/50">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍  Search ID, type, user, location…"
            className="flex-1 min-w-48 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-600" />
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          <span className="text-xs text-gray-500">{displayed.length} result{displayed.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {displayed.length === 0 ? (
            <div className="text-center py-24 text-gray-500">
              <div className="text-4xl mb-3">🔍</div>
              <p>No emergencies match your filters.</p>
            </div>
          ) : displayed.map(e => (
            <Link key={e.id} href={`/admin/emergencies/${e.id}`}>
              <Card className="hover:border-gray-600 transition-colors cursor-pointer py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs text-gray-500">{e.id}</span>
                      <span className="text-xs bg-gray-800 text-blue-300 px-2 py-0.5 rounded">{e.type}</span>
                      <StatusBadge status={e.status} />
                      {e.responder && (
                        <span className="text-xs text-gray-500">🛡️ {e.responder}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-200 font-medium">
                      {e.description.length > 100 ? e.description.slice(0, 100) + '…' : e.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1.5">
                      👤 {e.userName} &nbsp;·&nbsp; 📍 {e.location} &nbsp;·&nbsp; 🕒 {e.submittedAt}
                    </p>
                  </div>
                  <span className="text-gray-600 text-lg shrink-0">›</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminEmergenciesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-500">Loading…</div>}>
      <EmergenciesContent />
    </Suspense>
  );
}
