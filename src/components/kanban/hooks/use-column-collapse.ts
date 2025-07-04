import { useState, useCallback, useMemo } from 'react';

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
    setCollapsedColumns((prev) => {
      const newState: ColumnCollapseState = { ...prev };
      columnIds.forEach((id) => {
        newState[id] = true;
      });
      return newState;
    });
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

  const getCollapsedCount = useMemo(() => {
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
