// hooks/use-column-collapse.ts - Hook para gerenciar collapse de colunas
import { useState, useCallback } from 'react';

export interface ColumnCollapseState {
  [columnId: string]: boolean;
}

export function useColumnCollapse() {
  const [collapsedColumns, setCollapsedColumns] = useState<ColumnCollapseState>(
    {}
  );

  const toggleColumnCollapse = useCallback((columnId: string) => {
    setCollapsedColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  }, []);

  const collapseColumn = useCallback((columnId: string) => {
    setCollapsedColumns((prev) => ({
      ...prev,
      [columnId]: true,
    }));
  }, []);

  const expandColumn = useCallback((columnId: string) => {
    setCollapsedColumns((prev) => ({
      ...prev,
      [columnId]: false,
    }));
  }, []);

  const collapseAll = useCallback((columnIds: string[]) => {
    const newState: ColumnCollapseState = {};
    columnIds.forEach((id) => {
      newState[id] = true;
    });
    setCollapsedColumns(newState);
  }, []);

  const expandAll = useCallback(() => {
    setCollapsedColumns({});
  }, []);

  const isColumnCollapsed = useCallback(
    (columnId: string) => {
      return !!collapsedColumns[columnId];
    },
    [collapsedColumns]
  );

  const getCollapsedCount = useCallback(() => {
    return Object.values(collapsedColumns).filter(Boolean).length;
  }, [collapsedColumns]);

  return {
    collapsedColumns,
    toggleColumnCollapse,
    collapseColumn,
    expandColumn,
    collapseAll,
    expandAll,
    isColumnCollapsed,
    getCollapsedCount,
  };
}
