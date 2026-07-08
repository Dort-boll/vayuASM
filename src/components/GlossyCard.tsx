import React from 'react';

interface GlossyCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'purple' | 'rose' | 'green' | 'none' | 'default';
  id?: string;
  onClick?: () => void;
  key?: React.Key;
}

export default function GlossyCard({
  children,
  className = '',
  glowColor = 'cyan',
  id,
  onClick
}: GlossyCardProps) {
  const glowClasses = {
    cyan: 'hover:shadow-[0_0_25px_rgba(0,229,255,0.15)] hover:border-[#00E5FF]/40',
    purple: 'hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] hover:border-[#8B5CF6]/40',
    rose: 'hover:shadow-[0_0_25px_rgba(255,61,113,0.15)] hover:border-[#FF3D71]/40',
    green: 'hover:shadow-[0_0_25px_rgba(0,217,126,0.15)] hover:border-[#00D97E]/40',
    none: 'hover:border-white/20',
    default: 'hover:border-white/20'
  };

  const baseGlow = {
    cyan: 'shadow-[0_8px_32px_0_rgba(0,229,255,0.02)]',
    purple: 'shadow-[0_8px_32px_0_rgba(139,92,246,0.02)]',
    rose: 'shadow-[0_8px_32px_0_rgba(255,61,113,0.02)]',
    green: 'shadow-[0_8px_32px_0_rgba(0,217,126,0.02)]',
    none: 'shadow-lg',
    default: 'shadow-lg'
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-black/50 backdrop-blur-xl
        border border-white/10 rounded-sm
        transition-all duration-300 ease-out
        ${baseGlow[glowColor]}
        ${glowClasses[glowColor]}
        ${onClick ? 'cursor-pointer active:scale-[0.99]' : ''}
        ${className}
      `}
    >
      {/* Dynamic corner tech markers */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/20"></div>
      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/20"></div>
      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white/20"></div>
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white/20"></div>

      {children}
    </div>
  );
}
