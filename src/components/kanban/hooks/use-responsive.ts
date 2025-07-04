import { useState, useEffect, useCallback, useRef } from 'react';

export interface ResponsiveBreakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
}

export function useResponsive(): ResponsiveBreakpoints {
  const [breakpoints, setBreakpoints] = useState<ResponsiveBreakpoints>(() => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 1024,
  }));

  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const updateBreakpoints = useCallback(() => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;

    setBreakpoints({
      isMobile: width < 480,
      isTablet: width >= 480 && width < 768,
      isDesktop: width >= 768,
      screenWidth: width,
    });
  }, []);

  const handleResize = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(updateBreakpoints, 100);
  }, [updateBreakpoints]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    updateBreakpoints();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleResize, updateBreakpoints]);

  return breakpoints;
}

export function useAutoCollapseOnMobile(
  columnIds: string[],
  collapseAll: (ids: string[]) => void,
  expandAll: () => void
) {
  const { isMobile } = useResponsive();
  const prevIsMobileRef = useRef<boolean | undefined>(undefined);
  const prevColumnIdsRef = useRef<string[] | undefined>(undefined);

  useEffect(() => {
    const columnIdsChanged =
      !prevColumnIdsRef.current ||
      prevColumnIdsRef.current.length !== columnIds.length ||
      prevColumnIdsRef.current.some((id, index) => id !== columnIds[index]);

    const mobileChanged = prevIsMobileRef.current !== isMobile;

    if (mobileChanged || columnIdsChanged) {
      if (isMobile && columnIds.length > 3) {
        const columnsToCollapse = columnIds.slice(2);
        collapseAll(columnsToCollapse);
      } else if (!isMobile && prevIsMobileRef.current === true) {
        expandAll();
      }
    }

    prevIsMobileRef.current = isMobile;
    prevColumnIdsRef.current = [...columnIds];
  }, [isMobile, columnIds, collapseAll, expandAll]);

  return { isMobile };
}
