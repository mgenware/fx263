import * as dd from 'dd-models';
import { Dialect } from '../dialect';
import SQLVariableList from '../io/sqlInputList';
import { throwIfFalsy } from 'throw-if-arg-empty';

export class TypeInfo {
  static fromSQLVariable(variable: dd.SQLVariable, dialect: Dialect): TypeInfo {
    throwIfFalsy(variable, 'variable');
    throwIfFalsy(dialect, 'dialect');

    if (variable.type instanceof dd.Column) {
      return dialect.convertColumnType((variable.type as dd.Column).type);
    }
    // variable.type is a string
    const parts = variable.type.split('|');
    const typeName = parts[0];
    let namespace: string | undefined;
    if (parts.length > 1) {
      namespace = parts[1];
    }
    return new TypeInfo(typeName, namespace);
  }
  constructor(public typeName: string, public namespace?: string) {}
}

export class VarInfo {
  static fromSQLVars(vars: SQLVariableList, dialect: Dialect): VarInfo[] {
    throwIfFalsy(vars, 'vars');
    throwIfFalsy(dialect, 'dialect');

    const res: VarInfo[] = [];
    for (const v of vars.list) {
      const typeInfo = TypeInfo.fromSQLVariable(v, dialect);
      res.push(new VarInfo(v.name, typeInfo));
    }
    return res;
  }
  constructor(public name: string, public type: TypeInfo) {}
}

export default VarInfo;
