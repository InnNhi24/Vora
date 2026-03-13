/**
 * Vora logo component
 */

import svgPaths from '../../imports/svg-lr0db5q4fx';

interface VoraLogoProps {
  size?: number;
  className?: string;
  color?: string; // Custom color for the logo
}

export function VoraLogo({ size = 64, className = '', color = '#FFFFFF' }: VoraLogoProps) {
  return (
    <div 
      className={className}
      style={{ 
        width: size, 
        height: size,
      }}
    >
      <svg 
        className="w-full h-full" 
        fill="none" 
        preserveAspectRatio="xMidYMid meet" 
        viewBox="0 0 308.771 286.752"
      >
        <g>
          <path d={svgPaths.p3adbae00} stroke={color} strokeWidth="8" fill="none" />
          <path d={svgPaths.p19cb5700} stroke={color} strokeWidth="8" fill="none" />
          <path d={svgPaths.p1483f000} stroke={color} strokeWidth="8" fill="none" />
          <path d={svgPaths.p3e3da700} stroke={color} strokeWidth="8" fill="none" />
          <path d={svgPaths.p371e2900} stroke={color} strokeWidth="8" fill="none" />
          <path d={svgPaths.p34c89800} stroke={color} strokeWidth="8" fill={color} />
          <path d={svgPaths.p1e501d00} stroke={color} strokeWidth="8" fill="none" />
          <path d={svgPaths.p37f0d900} stroke={color} strokeWidth="8" fill="none" />
          <path d={svgPaths.p237d8280} stroke={color} strokeWidth="8" fill="none" />
          <path d={svgPaths.p1c061580} stroke={color} strokeWidth="8" fill="none" />
        </g>
      </svg>
    </div>
  );
}