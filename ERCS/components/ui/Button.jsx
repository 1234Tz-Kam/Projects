const VARIANTS = {
  primary:   'bg-red-600 hover:bg-red-700 text-white border-transparent',
  secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-600',
  ghost:     'bg-transparent hover:bg-gray-800 text-gray-400 border-gray-700',
  danger:    'bg-red-900 hover:bg-red-800 text-red-200 border-red-700',
  success:   'bg-green-900 hover:bg-green-800 text-green-200 border-transparent',
};

export default function Button({ children, onClick, variant = 'primary', className = '', disabled, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        px-4 py-2 rounded-lg border font-semibold text-sm
        transition-colors duration-150
        disabled:opacity-40 disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${className}
      `}
    >
      {children}
    </button>
  );
}
