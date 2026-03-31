export default function Textarea({ label, value, onChange, placeholder, required, rows = 4 }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wide">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="
          w-full bg-gray-950 border border-gray-700 rounded-lg
          px-3.5 py-2.5 text-sm text-gray-100 placeholder-gray-600
          focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600
          resize-y transition-colors
        "
      />
    </div>
  );
}
