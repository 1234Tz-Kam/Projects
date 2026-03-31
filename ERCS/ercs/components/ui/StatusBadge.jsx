import { STATUS_STYLES } from '@/lib/data';

export default function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || { bg: '#1f2937', text: '#9ca3af', border: '#374151' };
  return (
    <span style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
      className="inline-block rounded px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase">
      {status}
    </span>
  );
}
