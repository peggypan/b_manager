import { useCallback, useEffect, useState } from 'react';
import type { PageQuery, PageResult } from '../api/types';

const KEYWORD_DEBOUNCE_MS = 350;

export function usePagedList<T>(
  fetcher: (query: PageQuery) => Promise<PageResult<T>>,
  deps: unknown[] = [],
) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PageResult<T>>({
    list: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedKeyword(keyword.trim()), KEYWORD_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [keyword]);

  const load = useCallback(
    async (page = 1, pageSize = data.pageSize) => {
      setLoading(true);
      try {
        const res = await fetcher({
          page,
          pageSize,
          keyword: debouncedKeyword,
          status: status as PageQuery['status'],
        });
        setData(res);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetcher, debouncedKeyword, status, ...deps],
  );

  useEffect(() => {
    load(1, data.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword, status]);

  return {
    loading,
    data,
    keyword,
    setKeyword,
    status,
    setStatus,
    reload: () => load(data.page, data.pageSize),
    onPageChange: (page: number, pageSize: number) => load(page, pageSize),
  };
}
