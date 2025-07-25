'use client';

import { useQueryState, parseAsBoolean } from 'nuqs'

export function useCreateTaskModal() {
    const [isOpen, setIsOpen] = useQueryState('create_task', parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }));

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    return {
        isOpen,
        open,
        close,
    }
}