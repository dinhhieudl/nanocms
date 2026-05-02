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
  private selectColumns: string | null = null;

  constructor(table: string) {
    this.table = table;
  }

  select(columns: any, opts?: any) {
    this.selectColumns = typeof columns === 'string' ? columns : '*';
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

  // Support insert/update/delete
  insert(data: any) {
    const table = this.table;
    return {
      select: () => ({
        single: async () => {
          const arr = (mockData as any)[table] || [];
          const newItem = { ...data, id: data.id || `mock-${Date.now()}`, created_at: new Date().toISOString() };
          arr.push(newItem);
          return { data: newItem, error: null };
        },
      }),
      single: async () => {
        const arr = (mockData as any)[table] || [];
        const newItem = { ...data, id: data.id || `mock-${Date.now()}`, created_at: new Date().toISOString() };
        arr.push(newItem);
        return { data: newItem, error: null };
      },
    };
  }

  update(data: any) {
    return {
      eq: async (column: string, value: any) => {
        const arr = (mockData as any)[this.table] || [];
        const idx = arr.findIndex((r: any) => r[column] === value);
        if (idx >= 0) Object.assign(arr[idx], data);
        return { data: idx >= 0 ? arr[idx] : null, error: idx >= 0 ? null : { message: 'Not found' } };
      },
      match: async (filter: any) => {
        return { data: null, error: null };
      },
    };
  }

  delete() {
    return {
      eq: async (column: string, value: any) => {
        const arr = (mockData as any)[this.table] || [];
        const idx = arr.findIndex((r: any) => r[column] === value);
        if (idx >= 0) arr.splice(idx, 1);
        return { data: null, error: null };
      },
    };
  }

  // Make it a proper PromiseLike
  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return Promise.resolve(this._execute()).then(onfulfilled, onrejected);
  }

  private _execute() {
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
        const aVal = a[column] ?? '';
        const bVal = b[column] ?? '';
        if (aVal < bVal) return ascending ? -1 : 1;
        if (aVal > bVal) return ascending ? 1 : -1;
        return 0;
      });
    }

    const total = data.length;

    if (this.rangeFrom !== null && this.rangeTo !== null) {
      data = data.slice(this.rangeFrom, this.rangeTo + 1);
    } else if (this.limitCount !== null) {
      data = data.slice(0, this.limitCount);
    }

    return this.singleRow
      ? { data: data[0] ?? null, error: data[0] ? null : { message: 'Row not found', code: 'PGRST116' }, count: total }
      : { data, error: null, count: total };
  }

  catch(handler: any) { return this.then((v: any) => v, handler); }
  finally(handler: any) { return this.then((v: any) => v, (e: any) => e).finally(handler); }
}

class MockSupabase {
  from(table: string) {
    return new MockQueryBuilder(table);
  }

  auth = {
    getUser: async () => ({ data: { user: null } }),
  };

  rpc = async (fn: string, params?: any) => ({ data: null, error: null });
}

export function createClient() {
  return new MockSupabase();
}
