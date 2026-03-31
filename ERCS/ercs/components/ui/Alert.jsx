export default function Alert({ type = 'error', children }) {
  const styles = {
    error:   'bg-red-950 border-red-800 text-red-300',
    success: 'bg-green-950 border-green-800 text-green-300',
    info:    'bg-blue-950 border-blue-800 text-blue-300',
  };
  const icons = { error: '⚠️', success: '✅', info: 'ℹ️' };
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm mb-4 flex gap-2 items-start ${styles[type]}`}>
      <span>{icons[type]}</span>
      <span>{children}</span>
    </div>
  );
}
