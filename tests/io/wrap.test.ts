import * as mr from '../../';
import * as dd from 'mingru-models';
import user from '../models/user';
import post from '../models/post';
import { WrapIO } from '../../';
import * as assert from 'assert';

const expect = assert.equal;
const dialect = mr.mysql;

class WrapSelfTA extends dd.TA {
  s = dd
    .updateSome()
    .set(user.url_name, dd.sql`${dd.input(user.url_name)}`)
    .setInputs(user.sig, user.follower_count)
    .where(
      dd.sql`${user.url_name.toInput()} ${user.id.toInput()} ${user.url_name.toInput()}`,
    );
  d = this.s.wrap({ sig: '"haha"' });
}
const wrapSelf = dd.ta(user, WrapSelfTA);

class WrapOtherTA extends dd.TA {
  standard = wrapSelf.s.wrap({ id: '123' });
  nested = wrapSelf.d.wrap({ id: '123' });
}
const wrapOther = dd.ta(post, WrapOtherTA);

it('WrapIO', () => {
  const io = mr.wrapIO(wrapSelf.d, dialect);
  assert.ok(io instanceof mr.WrapIO);
});

it('getInputs (wrapSelf and innerIO)', () => {
  const io = mr.wrapIO(wrapSelf.d, dialect) as WrapIO;
  expect(
    io.funcArgs.toString(),
    'queryable: dbx.Queryable|github.com/mgenware/go-packagex/v5/dbx, urlName: string, id: uint64, urlName: string, followerCount: *string {queryable: dbx.Queryable|github.com/mgenware/go-packagex/v5/dbx, urlName: string, id: uint64, followerCount: *string}',
  );
  expect(
    io.execArgs.toString(),
    'queryable: dbx.Queryable|github.com/mgenware/go-packagex/v5/dbx, urlName: string, id: uint64, sig: *string="haha", followerCount: *string',
  );
  expect(io.funcPath, 'da.S');
});

it('getInputs (wrapOther)', () => {
  const io = mr.wrapIO(wrapOther.standard, dialect) as WrapIO;
  expect(
    io.funcArgs.toString(),
    'queryable: dbx.Queryable|github.com/mgenware/go-packagex/v5/dbx, urlName: string, urlName: string, sig: *string, followerCount: *string {queryable: dbx.Queryable|github.com/mgenware/go-packagex/v5/dbx, urlName: string, sig: *string, followerCount: *string}',
  );
  expect(
    io.execArgs.toString(),
    'queryable: dbx.Queryable|github.com/mgenware/go-packagex/v5/dbx, urlName: string, id: uint64=123, sig: *string, followerCount: *string',
  );
  expect(io.funcPath, 'User.S');
});

it('getInputs (wrapOther, nested)', () => {
  const io = mr.wrapIO(wrapOther.nested, dialect) as WrapIO;
  expect(
    io.funcArgs.toString(),
    'queryable: dbx.Queryable|github.com/mgenware/go-packagex/v5/dbx, urlName: string, urlName: string, followerCount: *string {queryable: dbx.Queryable|github.com/mgenware/go-packagex/v5/dbx, urlName: string, followerCount: *string}',
  );
  expect(
    io.execArgs.toString(),
    'queryable: dbx.Queryable|github.com/mgenware/go-packagex/v5/dbx, urlName: string, id: uint64=123, followerCount: *string',
  );
  expect(io.funcPath, 'User.D');
});

it('Throws on undefined inputs', () => {
  class UserTA extends dd.TA {
    t = dd
      .select(user.id, user.url_name)
      .where(
        dd.sql`${user.id.toInput()} ${user.url_name.toInput()} ${user.id.toInput()}`,
      );
    t2 = this.t.wrap({
      haha: `"tony"`,
    });
  }
  const ta = dd.ta(user, UserTA);
  const v = ta.t2;
  assert.throws(() => mr.wrapIO(v, dialect), 'haha');
});
