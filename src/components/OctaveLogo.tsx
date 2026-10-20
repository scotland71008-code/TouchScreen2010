import React from 'react';

export interface OctaveLogoProps {
  className?: string;
  variant?: 'full' | 'icon-only' | 'text-only' | 'avatar';
  iconSize?: number;
  textColor?: string;
  markColor?: string;
}

// Crisp Octave Emblem SVG Path
const OCTAVE_SVG_PATH = "M345.2258,154.4092l48.3546-48.3545c-27.9454-11.4647-66.4618-19.5342-120.1795-19.5342-89.0889,0-161.3097,42.386-161.3097,94.6717,0,42.9558,48.746,79.2298,115.544,90.8075l-25.3316,25.3315c-70.0282-30.953-146.837-2.3193-146.837,36.843,0,22.8683,26.1903,42.1465,61.9273,48.0667l-26.7324,26.7323c19.373,6.3267,39.5785,8.5061,61.4075,8.5061,46.9944,0,85.0908-22.3587,85.0908-49.9394,0-14.8649-11.0703-28.2104-28.6316-37.3587,23.3335,5.528,51.8043,8.9352,86.6953,8.9352,89.0889,0,161.3096-42.3859,161.3096-94.6717,0-42.0424-46.6949-77.684-111.3075-90.0356ZM146.3564,377.3511c-35.0264,0-63.4209-12.9627-63.4209-28.953,0-15.9903,28.3945-28.953,63.4209-28.953,35.0264,0,63.4209,12.9627,63.4209,28.953,0,15.9903-28.3945,28.953-63.4209,28.953ZM285.7908,268.8329c-67.5146,0-122.2461-25.1023-122.2461-56.0678,0-30.9653,54.7315-56.0677,122.2461-56.0677,67.5147,0,122.246,25.1024,122.246,56.0678,0,30.9654-54.7314,56.0677-122.2461,56.0677Z";

export default function OctaveLogo({
  className = '',
  variant = 'icon-only',
  iconSize = 38,
  textColor = 'text-white',
  markColor = '#ffffff',
}: OctaveLogoProps) {
  const textClass = textColor || 'text-white';
  const fill = markColor || '#ffffff';

  if (variant === 'avatar') {
    return (
      <div className={`avatar-badge ${className}`}>
        <svg
          viewBox="0 0 512 512"
          width={iconSize}
          height={iconSize}
          className="avatar-icon shrink-0"
        >
          <path fill={fill} d={OCTAVE_SVG_PATH} />
        </svg>
      </div>
    );
  }

  if (variant === 'text-only') {
    return (
      <span
        className={`font-['Montserrat',sans-serif] font-black uppercase tracking-[0.08em] leading-none select-none ${textClass} ${className}`}
        style={{ fontSize: `${iconSize * 0.65}px` }}
      >
        OCTAVE
      </span>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`inline-flex items-center gap-2.5 shrink-0 select-none ${className}`}>
        <svg
          viewBox="0 0 512 512"
          width={iconSize}
          height={iconSize}
          className="shrink-0 transition-transform duration-200 hover:scale-105"
        >
          <path fill={fill} d={OCTAVE_SVG_PATH} />
        </svg>
        <span
          className={`font-['Montserrat',sans-serif] font-black uppercase tracking-[0.1em] leading-none ${textClass}`}
          style={{ fontSize: `${iconSize * 0.55}px` }}
        >
          OCTAVE
        </span>
      </div>
    );
  }

  // Emblem Icon Only (Without "OCTAVE" text)
  return (
    <div className={`inline-flex items-center justify-center shrink-0 select-none ${className}`}>
      <svg
        viewBox="0 0 512 512"
        width={iconSize}
        height={iconSize}
        className="main-logo shrink-0 transition-transform duration-200 hover:scale-[1.03]"
      >
        <path fill={fill} d={OCTAVE_SVG_PATH} />
      </svg>
    </div>
  );
}
