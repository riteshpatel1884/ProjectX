'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function NavigationLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && !link.href.startsWith('#') && !link.target) {
        const url = new URL(link.href);
        const currentUrl = new URL(window.location.href);
        
        if (url.origin === currentUrl.origin && url.pathname !== currentUrl.pathname) {
          setLoading(true);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 z-[9999] flex items-center justify-center">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-500/20 via-transparent to-transparent"></div>
      
      {/* Main loader container */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        
        
        {/* AI-style text */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-lg tracking-wider">ProjectX</span>
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce-dot-1"></span>
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce-dot-2"></span>
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce-dot-3"></span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-progress-fill rounded-full"></div>
          </div>
          
          <p className="text-slate-400 text-sm font-light">Built for students. Designed for growth</p>
        </div>
      </div>
    </div>
  );
}