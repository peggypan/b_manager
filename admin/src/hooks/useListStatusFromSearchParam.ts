import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/** 列表页：读取 ?status= 并同步到 usePagedList */
export function useListStatusFromSearchParam(
  setStatus: (v: string) => void,
  paramName = 'status',
) {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const value = searchParams.get(paramName);
    if (value) setStatus(value);
    // 仅首屏同步 URL，避免与用户手动改筛选互相覆盖
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
