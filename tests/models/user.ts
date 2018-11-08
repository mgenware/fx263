import * as dd from 'dd-models';

class User extends dd.Table {
  id = dd.pk();
  name = dd.varChar(100);
  age = dd.int(0);
}

export default dd.table(User);
