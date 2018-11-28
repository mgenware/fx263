import * as dd from 'dd-models';
import Dialect from '../dialect';
import { SQLIO } from '../io/common';

export default class ParamInfo {
  static getList(dialect: Dialect, sql: SQLIO|null): ParamInfo[] {
    if (!sql) {
      return [];
    }
    const result: ParamInfo[] = [];
    for (const element of sql.sql.elements) {
      if (element instanceof dd.InputParam) {
        const input = element as dd.InputParam;
        let type;
        if (input.type instanceof dd.Column) {
          type = dialect.goType(input.type as dd.Column).type;
        } else {
          type = input.type as string;
        }
        result.push(new ParamInfo(input.name, type, input));
      }
    }
    return result;
  }

  constructor(
    public name: string,
    public type: string,
    public inputParam: dd.InputParam,
  ) { }
}
