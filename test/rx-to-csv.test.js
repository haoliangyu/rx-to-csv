import chai from 'chai';
import { join } from 'path';
import { Observable } from 'rxjs';
import { existsSync, unlinkSync, readFileSync } from 'fs';
import '../src/rx-to-csv';

const expect = chai.expect;
const testCSV = join(__dirname, 'write.test.csv');
const noop = () => {};

describe('toCSV()', () => {

  beforeEach(() => {
    cleanup();
  });

  after(() => {
    cleanup();
  });

  it('should generate a csv file.', (done) => {
    let data = [
      { id: 1, name: 'Mike' },
      { id: 2, name: 'Tommy' }
    ];
    let csvString = '"id","name"\n1,"Mike"\n2,"Tommy"\n';

    Observable.of(...data)
      .toCSV(testCSV, ['id', 'name'])
      .subscribe(noop, noop, () => {
        let csv = readFileSync(testCSV, 'utf8');
        expect(csv).to.equal(csvString);
        done();
      });
  });

});

function cleanup() {
  if (existsSync(testCSV)) {
    unlinkSync(testCSV);
  }
}
