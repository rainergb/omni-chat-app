'use client';

import { useQueryState, parseAsString } from 'nuqs'

export function useEditTaskModal() {
    const [isOpen, setIsOpen] = useQueryState('edit_task', parseAsString.withDefault("").withOptions({ clearOnDefault: true }));

    const open = (id: string) => setIsOpen(id);
    const close = () => setIsOpen("");

    return {
        isOpen,
        open,
        close,
    }
}