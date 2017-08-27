import { Observable } from 'rxjs';
import { dirname } from 'path';
import { createWriteStream, ensureDirSync } from 'fs-extra';
import defaults from 'lodash.defaults';

const defaultCSVOptions = {
  delimiter: ',',
  wrapText: 'true'
};

function toCSV(path, columns, options = {}) {

  options = defaults(options, defaultCSVOptions);

  return Observable.create((subscriber) => {
    let source = this;

    // make sure that the directory exists.
    ensureDirSync(dirname(path));

    let stream = createWriteStream(path);

    if (options.wrapText) {
      stream.write(columns.map((column) => `"${column}"`).join(options.delimiter));
    } else {
      stream.write(columns.join(options.delimiter));
    }

    stream.write('\n');
    stream.on('finish', () => subscriber.complete());
    stream.on('error', (err) => subscriber.error(err));

    let subscription = source.subscribe((values) => {
      try {
        let csvRow = [];

        for (let column of columns) {
          let value = values[column] || '';

          if (typeof values[column] === 'string' && options.wrapText) {
            csvRow.push(`"${value}"`);
          } else {
            csvRow.push(String(value));
          }
        }

        stream.write(csvRow.join(options.delimiter));
        stream.write('\n');
        subscriber.next();
      } catch(err) {
        subscriber.error(err);
      }
    },
    (err) => {
      stream.end();
      subscriber.error(err);
    },
    () => {
      stream.end();
    });

    return subscription;
  });
}

Observable.prototype.toCSV = toCSV;
