import * as dd from 'dd-models';
import post from '../models/post';
import { testBuildAsync } from './common';
import cols from '../models/cols';

test('UpdateSome', async () => {
  class PostTA extends dd.TA {
    updateT = dd
      .updateSome()
      .set(post.title, dd.sql`"haha"`)
      .set(post.content, dd.sql`${dd.input(post.content)}`)
      .set(post.cmtCount, dd.sql`${post.cmtCount} + 1`)
      .byID();
  }
  const ta = dd.ta(post, PostTA);
  await testBuildAsync(ta, 'update/update');
});

test('UpdateOne', async () => {
  class PostTA extends dd.TA {
    updateT = dd
      .updateOne()
      .set(post.title, dd.sql`"haha"`)
      .set(post.content, dd.sql`${dd.input(post.content)}`)
      .set(post.cmtCount, dd.sql`${post.cmtCount} + 1`)
      .byID();
  }
  const ta = dd.ta(post, PostTA);
  await testBuildAsync(ta, 'update/updateOne');
});

test('Update with where', async () => {
  class PostTA extends dd.TA {
    updateT = dd
      .updateOne()
      .set(post.title, dd.sql`"haha"`)
      .set(post.content, post.content.toInput())
      .where(
        dd.sql`${post.id} = ${post.id.toInput()} AND ${
          post.content
        } = ${post.content.toInput('content2')}`,
      );
  }
  const ta = dd.ta(post, PostTA);
  await testBuildAsync(ta, 'update/updateWithWhere');
});

test('Update with non-input setters', async () => {
  class PostTA extends dd.TA {
    updateT = dd
      .unsafeUpdateAll()
      .set(post.title, dd.sql`"haha"`)
      .set(post.content, post.content.toInput());
  }
  const ta = dd.ta(post, PostTA);
  await testBuildAsync(ta, 'update/updateWithNonInputSetters');
});

test('Duplicate names in WHERE and setters', async () => {
  class PostTA extends dd.TA {
    updateT = dd
      .updateSome()
      .set(post.content, post.content.toInput())
      .set(post.title, dd.sql`"haha"`)
      .set(post.m_user_id, post.m_user_id.toInput())
      .where(
        dd.sql`${post.title.isEqualToInput()} ${post.title.isEqualToInput()} AND ${post.content.isEqualToInput()}`,
      );
  }
  const ta = dd.ta(post, PostTA);
  await testBuildAsync(ta, 'update/dupNamesWhereSetters');
});

test('Custom DB column name', async () => {
  class PostTA extends dd.TA {
    updateT = dd
      .unsafeUpdateAll()
      .set(post.title, dd.sql`"haha"`)
      .set(post.content, dd.sql`${dd.input(post.content)}`)
      .set(post.cmtCount, dd.sql`${post.cmtCount} + 1`)
      .byID();
  }
  const ta = dd.ta(post, PostTA);
  await testBuildAsync(ta, 'update/customName');
});

test('updateWithDefaults', async () => {
  class ColsTA extends dd.TA {
    updateT = dd
      .updateOne()
      .setInputs(cols.fk)
      .setDefaults()
      .byID();
  }
  const ta = dd.ta(cols, ColsTA);
  await testBuildAsync(ta, 'update/updateWithDefaults');
});
