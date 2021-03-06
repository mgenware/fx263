import * as mm from 'mingru-models';
import * as mr from '../../dist/main.js';
import post from '../models/post.js';
import user from '../models/user.js';
import { ioOpt } from './common.js';
import { ok, eq } from '../assert-aliases.js';

it('Delete', () => {
  class PostTA extends mm.TableActions {
    t = mm.unsafeDeleteAll().by(post.id);
  }
  const postTA = mm.tableActions(post, PostTA);
  const v = postTA.t;
  const io = mr.deleteIO(v, ioOpt);

  ok(io instanceof mr.DeleteIO);
  eq(io.getSQLCode(), '"DELETE FROM `db_post` WHERE `id` = ?"');
});

it('Delete with where', () => {
  class PostTA extends mm.TableActions {
    t = mm.unsafeDeleteAll().whereSQL(mm.sql`${post.id} = 1`);
  }
  const postTA = mm.tableActions(post, PostTA);
  const v = postTA.t;
  const io = mr.deleteIO(v, ioOpt);

  eq(io.getSQLCode(), '"DELETE FROM `db_post` WHERE `id` = 1"');
});

it('getInputs', () => {
  class UserTA extends mm.TableActions {
    t = mm.deleteOne().whereSQL(mm.sql`${user.id.toInput()} ${user.url_name.toInput()}`);
  }
  const ta = mm.tableActions(user, UserTA);
  const v = ta.t;
  const io = mr.deleteIO(v, ioOpt);
  eq(
    io.funcArgs.toString(),
    'queryable: mingru.Queryable|github.com/mgenware/mingru-go-lib, id: uint64, urlName: string',
  );
  eq(io.execArgs.toString(), 'id: uint64, urlName: string');
});

it('returnValues', () => {
  class UserTA extends mm.TableActions {
    t = mm.deleteOne().whereSQL(mm.sql`${user.id.toInput()} ${user.url_name.toInput()}`);
  }
  const ta = mm.tableActions(user, UserTA);
  const v = ta.t;
  const io = mr.deleteIO(v, ioOpt);
  const { returnValues } = io;
  eq(returnValues.toString(), '');
});

it('getInputs (no WHERE)', () => {
  class UserTA extends mm.TableActions {
    t = mm.unsafeDeleteAll();
  }
  const ta = mm.tableActions(user, UserTA);
  const v = ta.t;
  const io = mr.deleteIO(v, ioOpt);
  const inputs = io.funcArgs;
  eq(inputs.list.length, 1);
});

it('returnValues (no WHERE)', () => {
  class UserTA extends mm.TableActions {
    t = mm.unsafeDeleteAll();
  }
  const ta = mm.tableActions(user, UserTA);
  const v = ta.t;
  const io = mr.deleteIO(v, ioOpt);
  const { returnValues } = io;
  eq(returnValues.toString(), '__rowsAffected: int');
});
