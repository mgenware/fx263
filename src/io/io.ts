import * as dd from 'dd-models';
import Dialect from '../dialect';
import { throwIfFalsy } from 'throw-if-arg-empty';
import toTypeString from 'to-type-string';

export const MainAlias = '_main';

export class JoinIO {
  constructor(
    public path: string,
    public tableAlias: string,
    // Note that localTable can also be an alias of another join
    public localTable: string,
    public localColumn: dd.Column,
    public remoteTable: string,
    public remoteColumn: dd.Column,
  ) {}

  toSQL(dialect: Dialect): string {
    const e = dialect.escape;
    // Note that localTable is not used here, we use MainAlias as local table alias
    return `INNER JOIN ${e(this.remoteTable)} AS ${e(this.tableAlias)} ON ${e(
      this.tableAlias,
    )}.${e(this.remoteColumn.props.name)} = ${e(MainAlias)}.${e(
      this.localColumn.props.name,
    )}`;
  }
}

export class TableIO {
  constructor(public table: dd.Table, public sql: string) {
    throwIfFalsy(table, 'table');
    throwIfFalsy(sql, 'sql');
  }
}

export class SelectedColumnIO {
  constructor(
    public selectedColumn: dd.SelectActionColumns,
    public sql: string,
    public alias: string,
    public column: dd.Column | null,
    public externalProps: dd.ColumnProps | null,
  ) {
    throwIfFalsy(selectedColumn, 'selectedColumn');
    throwIfFalsy(sql, 'sql');
    throwIfFalsy(alias, 'alias');
  }

  getColumnProps(): dd.ColumnProps {
    if (this.column) {
      return this.column.props;
    }
    if (!this.externalProps) {
      throw new Error(
        `No column props found on column "${toTypeString(
          this.selectedColumn,
        )}", SQL: "${this.sql}"`,
      );
    }
    return this.externalProps;
  }
}

export class SQLIO {
  constructor(public sql: dd.SQL) {
    throwIfFalsy(sql, 'sql');
  }

  toSQL(
    dialect: Dialect,
    cb?: (element: dd.SQLElement) => string | null,
  ): string {
    const { sql } = this;
    let res = '';
    for (const element of sql.elements) {
      let cbRes: string | null = null;
      if (cb) {
        cbRes = cb(element);
      }
      res += cbRes === null ? this.handleElement(element, dialect) : cbRes;
    }
    return res;
  }

  private handleElement(element: dd.SQLElement, dialect: Dialect): string {
    switch (element.type) {
      case dd.SQLElementType.rawString: {
        return element.toRawString();
      }

      case dd.SQLElementType.column: {
        return dialect.escapeColumn(element.toColumn());
      }

      case dd.SQLElementType.call: {
        return dialect.sqlCall(element.toCall());
      }

      case dd.SQLElementType.input: {
        return dialect.inputPlaceholder(element.toInput());
      }

      default: {
        throw new Error(
          `Unsupported type of dd.SQLElement: ${
            element.type
          }, value: "${toTypeString(element)}"`,
        );
      }
    }
  }
}

export class SetterIO {
  static fromMap(map: Map<dd.Column, dd.SQL>): SetterIO[] {
    return Array.from(
      map,
      ([key, value]) => new SetterIO(key, new SQLIO(value)),
    );
  }

  constructor(public col: dd.Column, public sql: SQLIO) {
    throwIfFalsy(col, 'col');
    throwIfFalsy(sql, 'sql');
  }
}

export class SelectIO {
  constructor(
    public action: dd.SelectAction,
    public sql: string,
    public cols: SelectedColumnIO[],
    public from: TableIO,
    public where: SQLIO | null,
  ) {
    throwIfFalsy(action, 'action');
    throwIfFalsy(sql, 'sql');
    throwIfFalsy(cols, 'cols');
    throwIfFalsy(from, 'from');
  }
}

export class UpdateIO {
  constructor(
    public action: dd.UpdateAction,
    public sql: string,
    public table: TableIO,
    public setters: SetterIO[],
    public where: SQLIO | null,
  ) {
    throwIfFalsy(action, 'action');
    throwIfFalsy(sql, 'sql');
    throwIfFalsy(table, 'table');
    throwIfFalsy(setters, 'setters');
  }
}

export class InsertIO {
  constructor(
    public action: dd.InsertAction,
    public sql: string,
    public table: TableIO,
    public setters: SetterIO[],
  ) {
    throwIfFalsy(action, 'action');
    throwIfFalsy(sql, 'sql');
    throwIfFalsy(table, 'table');
  }
}

export class DeleteIO {
  constructor(
    public action: dd.DeleteAction,
    public sql: string,
    public table: TableIO,
    public where: SQLIO | null,
  ) {
    throwIfFalsy(action, 'action');
    throwIfFalsy(sql, 'sql');
    throwIfFalsy(table, 'table');
  }
}
