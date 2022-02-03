/* eslint-disable @typescript-eslint/no-explicit-any */
const dateRegex = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/;

export function handleDate(obj: any) {
  if (typeof obj === 'string' && obj.match(dateRegex)) return new Date(obj);
  if (typeof obj !== 'object') return obj;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const el = obj[key];

      if (typeof el === 'string' && el.match(dateRegex)) {
        obj[key] = new Date(el);
      }

      if (typeof el === 'object') {
        handleDate(obj[key]);
      }
    }
  }

  return obj;
}
