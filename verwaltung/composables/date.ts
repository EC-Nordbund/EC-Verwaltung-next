export function toDateFormat(d: Date) {
  return d.toISOString().split('T')[0].split('-').reverse().join('.');
}
export function toTimeFormat(d: Date) {
  const [date, time] = d.toISOString().split('T');
  return `${date.split('-').reverse().join('.')} ${time.split('.')[0]}`;
}
