'use client';

import { FullscreenProvider } from './context/FullscreenContext';
import KanbanPageContent from './KanbanPageContent';

export default function KanbanPage() {
  return (
    <FullscreenProvider>
      <KanbanPageContent />
    </FullscreenProvider>
  );
}
