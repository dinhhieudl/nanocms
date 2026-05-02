// Mock Supabase client for local development without Supabase
import mockData from './mock-data.json';

type QueryFilter = {
  column: string;
  value: any;
  op: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'ilike' | 'in' | 'is' | 'not';
  notOp?: string;
};

class MockQueryBuilder {
  private table: string;
  private filters: QueryFilter[] = [];
  private orderBy: { column: string; ascending: boolean } | null = null;
  private limitCount: number | null = null;
  private rangeFrom: number | null = null;
  private rangeTo: number | null = null;
  private singleRow = false;
  private countEnabled = false;

  constructor(table: string) {
    this.table = table;
  }

  select(columns: any, opts?: any) {
    if (opts?.count === 'exact') this.countEnabled = true;
    return this;
  }

  eq(column: string, value: any) { this.filters.push({ column, value, op: 'eq' }); return this; }
  neq(column: string, value: any) { this.filters.push({ column, value, op: 'neq' }); return this; }
  gt(column: string, value: any) { this.filters.push({ column, value, op: 'gt' }); return this; }
  gte(column: string, value: any) { this.filters.push({ column, value, op: 'gte' }); return this; }
  lt(column: string, value: any) { this.filters.push({ column, value, op: 'lt' }); return this; }
  lte(column: string, value: any) { this.filters.push({ column, value, op: 'lte' }); return this; }
  ilike(column: string, value: any) { this.filters.push({ column, value, op: 'ilike' }); return this; }
  in(column: string, value: any) { this.filters.push({ column, value, op: 'in' }); return this; }
  is(column: string, value: any) { this.filters.push({ column, value, op: 'is' }); return this; }
  not(column: string, op: string, value: any) { this.filters.push({ column, value, op: 'not', notOp: op }); return this; }

  order(column: string, opts?: { ascending?: boolean }) {
    this.orderBy = { column, ascending: opts?.ascending ?? true };
    return this;
  }

  limit(count: number) { this.limitCount = count; return this; }
  range(from: number, to: number) { this.rangeFrom = from; this.rangeTo = to; return this; }
  single() { this.singleRow = true; return this; }

  // Make it thenable so `await supabase.from(...).select(...).eq(...)` works
  then(resolve: Function, reject?: Function) {
    try {
      let data: any[] = (mockData as any)[this.table] || [];

      for (const f of this.filters) {
        data = data.filter((row: any) => {
          const val = row[f.column];
          switch (f.op) {
            case 'eq': return val === f.value;
            case 'neq': return val !== f.value;
            case 'gt': return val > f.value;
            case 'gte': return val >= f.value;
            case 'lt': return val < f.value;
            case 'lte': return val <= f.value;
            case 'ilike': return typeof val === 'string' && val.toLowerCase().includes(f.value.replace(/%/g, '').toLowerCase());
            case 'in': return Array.isArray(f.value) && f.value.includes(val);
            case 'is': return f.value === null ? val == null : val === f.value;
            case 'not':
              if (f.notOp === 'is') return f.value === null ? val != null : val !== f.value;
              return val !== f.value;
            default: return true;
          }
        });
      }

      if (this.orderBy) {
        const { column, ascending } = this.orderBy;
        data.sort((a: any, b: any) => {
          if (a[column] < b[column]) return ascending ? -1 : 1;
          if (a[column] > b[column]) return ascending ? 1 : -1;
          return 0;
        });
      }

      const total = data.length;

      if (this.rangeFrom !== null && this.rangeTo !== null) {
        data = data.slice(this.rangeFrom, this.rangeTo + 1);
      } else if (this.limitCount !== null) {
        data = data.slice(0, this.limitCount);
      }

      const result = this.singleRow
        ? { data: data[0] ?? null, error: data[0] ? null : { message: 'Row not found', code: 'PGRST116' }, count: total }
        : { data, error: null, count: total };

      return resolve(result);
    } catch (err) {
      if (reject) reject(err);
      throw err;
    }
  }

  // Also support .then() chaining without await
  catch(handler: Function) { return this.then((v: any) => v, handler); }
  finally(handler: Function) { return this.then((v: any) => v, (e: any) => e).finally(handler); }
}

class MockSupabase {
  from(table: string) {
    return new MockQueryBuilder(table);
  }

  auth = {
    getUser: async () => ({ data: { user: null } }),
  };
}

export function createClient() {
  return new MockSupabase();
}
