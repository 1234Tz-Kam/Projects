export function nowString() {
  return new Date().toLocaleString('en-GB', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  }).replace(',', '');
}

export function generateId() {
  return 'EID-' + String(Math.floor(Math.random() * 9000) + 1000);
}
