export default function Select({ label, value, onChange, options, required, placeholder = 'Select…' }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wide">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="
          w-full bg-gray-950 border border-gray-700 rounded-lg
          px-3.5 py-2.5 text-sm text-gray-100
          focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600
          transition-colors
        "
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
