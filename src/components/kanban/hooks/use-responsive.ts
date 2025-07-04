// hooks/use-responsive.ts - Hook para detectar breakpoints responsivos
import { useState, useEffect } from 'react';

export interface ResponsiveBreakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
}

export function useResponsive(): ResponsiveBreakpoints {
  const [breakpoints, setBreakpoints] = useState<ResponsiveBreakpoints>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 1024,
  });

  useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth;

      setBreakpoints({
        isMobile: width < 480,
        isTablet: width >= 480 && width < 768,
        isDesktop: width >= 768,
        screenWidth: width,
      });
    };

    // Atualizar na montagem
    updateBreakpoints();

    // Listener para mudanças de tamanho
    window.addEventListener('resize', updateBreakpoints);

    return () => {
      window.removeEventListener('resize', updateBreakpoints);
    };
  }, []);

  return breakpoints;
}

// Hook adicional para auto-collapse em mobile
export function useAutoCollapseOnMobile(
  columnIds: string[],
  collapseAll: (ids: string[]) => void,
  expandAll: () => void
) {
  const { isMobile } = useResponsive();

  useEffect(() => {
    if (isMobile && columnIds.length > 3) {
      // Auto-collapse todas as colunas exceto as primeiras 2 em mobile
      const columnsToCollapse = columnIds.slice(2);
      collapseAll(columnsToCollapse);
    } else if (!isMobile) {
      // Expandir todas quando não for mobile
      expandAll();
    }
  }, [isMobile, columnIds, collapseAll, expandAll]);

  return { isMobile };
}
