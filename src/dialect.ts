import * as dd from 'dd-models';

// A bridge represents a mapping from SQL type to Go type.
export class TypeBridge {
  importPath: string|null = null;

  constructor(
    public type: string,
  ) { }
}

export class Dialect {
  escape(_: string): string {
    throw new Error('Not implemented yet');
  }

  goType(_: dd.Column): TypeBridge {
    throw new Error('Not implemented yet');
  }

  as(_: string, __: string): string {
    throw new Error('Not implemented yet');
  }

  escapeColumn(column: dd.ColumnBase): string {
    return this.escape(column.__name);
  }

  escapeTable(table: dd.Table): string {
    return this.escape(table.__name);
  }

  goString(_: string): string {
    throw new Error('Not implemented yet');
  }

  inputPlaceholder(_: dd.InputParam): string {
    return '?';
  }
}

export default Dialect;
