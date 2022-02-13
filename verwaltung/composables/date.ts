import { refify } from './refify';

function _toDateFormat(d: Date) {
  return d.toISOString().split('T')[0].split('-').reverse().join('.');
}
function _toTimeFormat(d: Date) {
  const [date, time] = d.toISOString().split('T');
  return `${date.split('-').reverse().join('.')} ${time.split('.')[0]}`;
}

export const toDateFormat = refify(_toDateFormat);
export const toTimeFormat = refify(_toTimeFormat);
