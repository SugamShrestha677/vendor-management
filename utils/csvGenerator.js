import pkg from 'fast-csv';
const { stringify } = pkg;
import { Readable } from 'stream';

export const generateCSV = (data) => {
  return new Promise((resolve, reject) => {
    if (!data || data.length === 0) {
      resolve('');
      return;
    }

    const stream = stringify({ headers: true });
    const output = [];

    stream.on('data', row => output.push(row));
    stream.on('end', () => resolve(output.join('')));
    stream.on('error', reject);

    data.forEach(record => {
      const obj = record.toObject ? record.toObject() : record;
      stream.write(obj);
    });

    stream.end();
  });
};
