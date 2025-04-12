// hooks/useIsMobile.ts
import { useEffect, useState } from 'react';

/**
 * <summary>
 * Custom React hook to determine if the current screen width is below a given breakpoint.
 * </summary>
 * @param breakpoint Width threshold (default: 768px) for determining "mobile"
 * @returns {boolean} True if window width is less than the breakpoint, otherwise false
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkMobile(); // Check on initial render
    window.addEventListener('resize', checkMobile); // Recheck on window resize

    return () => window.removeEventListener('resize', checkMobile); // Cleanup on unmount
  }, [breakpoint]);

  return isMobile;
}
