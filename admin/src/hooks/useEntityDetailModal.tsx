import { useCallback, useState } from 'react';
import type { AdminResource, EntityModalMode } from '../api/types';
import { EntityDetailModal } from '../components/EntityDetailModal';

export function useEntityDetailModal(resource: AdminResource, onSaved?: () => void) {
  const [recordId, setRecordId] = useState<number | null>(null);
  const [mode, setMode] = useState<EntityModalMode>('view');

  const open = useCallback((id: number, m: 'view' | 'edit') => {
    setRecordId(id);
    setMode(m);
  }, []);

  const openCreate = useCallback(() => {
    setRecordId(null);
    setMode('create');
  }, []);

  const close = useCallback(() => {
    setRecordId(null);
    setMode('view');
  }, []);

  const modalOpen = recordId !== null || mode === 'create';

  const modal = (
    <EntityDetailModal
      resource={resource}
      recordId={recordId}
      mode={mode}
      open={modalOpen}
      onClose={close}
      onSaved={onSaved}
    />
  );

  return { open, openCreate, modal };
}
