import React from 'react';

interface AdPlaceholderProps {
  type: 'banner' | 'rectangle' | 'sidebar';
  className?: string;
}

export default function AdPlaceholder({ type, className = '' }: AdPlaceholderProps) {
  const getAdClass = () => {
    switch (type) {
      case 'banner': return 'ad-banner';
      case 'rectangle': return 'ad-rectangle';
      case 'sidebar': return 'ad-sidebar';
      default: return 'ad-banner';
    }
  };

  return (
    <div className={`ad-placeholder ${getAdClass()} ${className} rounded-lg`}>
      {/* Content is handled by CSS ::after */}
    </div>
  );
}
