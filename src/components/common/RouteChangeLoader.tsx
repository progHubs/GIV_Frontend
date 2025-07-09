/**
 * Route Change Loader
 * Shows loading bar during route transitions using nprogress
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  speed: 400,
  minimum: 0.1,
  easing: 'ease',
  trickleSpeed: 200,
});

// Custom CSS for blue color
const style = document.createElement('style');
style.innerHTML = `
  #nprogress .bar {
    background: linear-gradient(to right, #3b82f6, #2563eb) !important;
    height: 3px !important;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5) !important;
  }
  #nprogress .peg {
    box-shadow: 0 0 10px #3b82f6, 0 0 5px #3b82f6 !important;
  }
`;
document.head.appendChild(style);

function RouteChangeLoader() {
  const location = useLocation();

  useEffect(() => {
    // Start loading immediately when route changes
    NProgress.start();

    // Finish loading after a short delay to simulate transition
    const timeout = setTimeout(() => {
      NProgress.done();
    }, 400);

    return () => {
      clearTimeout(timeout);
      NProgress.done();
    };
  }, [location.pathname]);

  return null;
}

export default RouteChangeLoader;
