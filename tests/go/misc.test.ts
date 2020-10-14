import * as mm from 'mingru-models';
import cols from '../models/cols';
import post from '../models/post';
import { testBuildAsync } from './common';

it('Ghost table', async () => {
  class Ghost extends mm.GhostTable {}
  const ghost = mm.table(Ghost);
  class GhostTA extends mm.TableActions {
    selectT = mm.selectRows(post.id, post.title).from(post).orderByAsc(post.id);
    insertT = mm.insert().from(cols).setInputs(cols.fk).setDefaults();
  }
  const ta = mm.tableActions(ghost, GhostTA);
  await testBuildAsync(ta, 'misc/ghostTable');
});
