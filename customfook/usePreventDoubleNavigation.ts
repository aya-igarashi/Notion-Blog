import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const usePreventDoubleNavigation = (timeout = 1000) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setIsNavigating(true);
    const handleComplete = () => setIsNavigating(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router.events]);

  const navigate = (url: string) => {
    if (!isNavigating) {
      router.push(url);
    }
  };

  return navigate;
};

export default usePreventDoubleNavigation;