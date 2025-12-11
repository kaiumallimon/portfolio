'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function GAListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    const fullPath = pathname + searchParams.toString();

    // Only send pageview if GA is loaded and in production
    if (process.env.NODE_ENV === 'production' && window.gtag && prevPath.current !== fullPath) {
      window.gtag('config', 'G-T8EL28VE67', { page_path: fullPath });
      prevPath.current = fullPath;
    }
  }, [pathname, searchParams]);

  return null;
}
