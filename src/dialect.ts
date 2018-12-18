import * as dd from 'dd-models';

// A bridge represents a mapping from SQL type to Go type.
export class TypeBridge {
  constructor(
    public type: string,
    public importPath: string | null,
    public isSystemImport: boolean,
  ) {}

  toString(): string {
    return this.type;
  }
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

  inputPlaceholder(_: dd.InputParam | null): string {
    return '?';
  }

  currentDate(): string {
    throw new Error('Not implemented yet');
  }

  currentTime(): string {
    throw new Error('Not implemented yet');
  }

  currentDateTime(): string {
    throw new Error('Not implemented yet');
  }

  currentTimestamp(): string {
    throw new Error('Not implemented yet');
  }
}

export default Dialect;
