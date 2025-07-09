/**
 * LoadingLink Component
 * A simple Link component that works with nprogress route change detection
 */

import React from 'react';
import { Link } from 'react-router-dom';

interface LoadingLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const LoadingLink: React.FC<LoadingLinkProps> = ({ children, onClick, to, className }) => {
  return (
    <Link to={to} className={className} onClick={onClick}>
      {children}
    </Link>
  );
};

export default LoadingLink;
