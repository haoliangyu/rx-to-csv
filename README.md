# rx-to-csv

[![ReactiveX](http://reactivex.io/assets/Rx_Logo_S.png)](http://reactivex.io/)

[RxJS 5](http://reactivex.io/) operator to write data into a CSV file.

## Installation

```
npm install rx-to-csv
```

## Use

Import this library and it will add `toCSV` operator to the rxjs `Observable` class.

```
public toCSV(path: string, columns: Array<string>, options?: any): Observable
```

This operator will search values in its input by column names and write them into the target CSV file via a write file stream.

Parameters:

  * **path**: csv file path
  * **columns**: an array of column names
  * **options**: optional configuration for the csv creation
    * **wrapText**: a boolean value indicating whether to wrap each value with `"`. Default: `true`
    * **delimeter**: a character to separate values. Default: `,`

## Example

Generate a CSV file from data flow:

``` javascript
import { Observable } from 'rxjs';
import 'rx-to-csv';

let data = [
  { id: 1, name: 'Mike' },
  { id: 2, name: 'Tommy' }
];

Observable.of(...data)
  .toCSV('data.csv', ['id', 'name'])
  .subscribe();
```

Download data from a PostgreSQL dadtabase and save it as a CSV file:

``` javascript
import pgrx from 'pg-reactive';
import 'rx-to-csv';

let db = new pgrx('connection string');

db.query('SELECT id, display_name FROM users')
  .map((row) => {
    // convert the data to match column names
    return {
      id: row.id,
      name: row.display_name
    };
  })
  .toCSV('data.csv', ['id', 'name'])
  .subscribe();
```

## License

MIT
