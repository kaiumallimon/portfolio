// Self-contained zero-dependency stub client for MongoDB migration
export function getServerSupabase(): any {
  const queryChain: any = {
    select: () => queryChain,
    eq: () => queryChain,
    order: () => queryChain,
    range: async () => ({ data: [], error: null, count: 0 }),
    maybeSingle: async () => ({ data: null, error: null }),
    single: async () => ({ data: null, error: null }),
    or: () => queryChain,
    insert: async () => ({ data: null, error: null }),
    update: async () => ({ data: null, error: null }),
    delete: async () => ({ data: null, error: null }),
    then: (resolve: any) => resolve({ data: [], error: null }),
  };

  return {
    from: () => queryChain,
    storage: {
      from: () => ({
        remove: async () => ({ data: null, error: null }),
        upload: async () => ({ data: null, error: null }),
      }),
    },
  };
}
