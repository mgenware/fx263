import * as mr from '../../';
import * as dd from 'dd-models';

const TimePkg = '"time"';

const dialect = new mr.MySQL();

function testType(col: dd.Column, type: string, pkg: string | null) {
  const tb = dialect.goType(col);
  expect(tb.type).toBe(type);
  expect(tb.importPath).toBe(pkg);
}

test('escape', () => {
  expect(dialect.escape('abc')).toBe('`abc`');
});

test('DT', () => {
  const tests: Array<Array<unknown>> = [
    // PK
    [dd.pk(), 'uint64', null],
    // Integer
    [dd.int(), 'int', null],
    [dd.unsignedInt(), 'uint', null],
    [dd.bigInt(), 'int64', null],
    [dd.unsignedBigInt(), 'uint64', null],
    [dd.smallInt(), 'int16', null],
    [dd.unsignedSmallInt(), 'uint16', null],
    [dd.tinyInt(), 'int8', null],
    [dd.unsignedTinyInt(), 'uint8', null],
    // String
    [dd.varChar(10), 'string', null],
    [dd.char(10), 'string', null],
    // Time
    [dd.datetime(), 'time.Time', TimePkg],
    [dd.date(), 'time.Time', TimePkg],
  ];

  for (const t of tests) {
    const column = t[0] as dd.Column;
    testType(column, t[1] as string, t[2] as string | null);
    if (!column.props.pk) {
      column.props.nullable = true;
      testType(column, ('*' + t[1]) as string, t[2] as string | null);
    }
  }
});

test('DT (not supported)', () => {
  expect(() => dialect.goType(new dd.Column('_HAHA_'))).toThrow('"_HAHA_"');
});

test('as', () => {
  expect(dialect.as('abc', 'def')).toBe('abc AS `def`');
});

test('Current date/time', () => {
  expect(dialect.currentDate()).toBe('CURDATE()');
  expect(dialect.currentTime()).toBe('CURTIME()');
  expect(dialect.currentDateTime()).toBe('NOW()');
  expect(dialect.currentTimestamp()).toBe('NOW()');
});
