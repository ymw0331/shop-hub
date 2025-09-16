import React from 'react';

export default function ShopHubLogo({ className = "h-8 w-8", color = "currentColor" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`logo transition-transform hover:scale-105 ${className}`}
      data-testid="logo"
    >
      <defs>
        {/* Main gradient - vibrant purple to pink */}
        <linearGradient id="shopHubGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>

        {/* Secondary gradient for accents */}
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#d946ef" />
        </linearGradient>

        {/* Shadow filter */}
        <filter id="logoShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
        </filter>
      </defs>

      {/* Background circle for contrast */}
      <circle cx="50" cy="50" r="45" fill="white" opacity="0.1"/>

      {/* Modern shopping bag design */}
      <g filter="url(#logoShadow)">
        {/* Bag body with rounded corners */}
        <path
          d="M 22 38 C 22 36 24 34 26 34 L 74 34 C 76 34 78 36 78 38 L 78 72 C 78 78 74 82 68 82 L 32 82 C 26 82 22 78 22 72 Z"
          fill="url(#shopHubGradient)"
          opacity="0.9"
        />

        {/* Inner white layer for depth */}
        <path
          d="M 27 40 L 27 70 C 27 74 30 77 34 77 L 66 77 C 70 77 73 74 73 70 L 73 40 Z"
          fill="white"
          opacity="0.95"
        />

        {/* Elegant bag handles */}
        <path
          d="M 36 34 C 36 26 41 20 50 20 C 59 20 64 26 64 34"
          stroke="url(#accentGradient)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Modern "S" monogram */}
        <path
          d="M 38 50 C 38 46 41 43 45 43 L 50 43 C 55 43 58 46 58 50 C 58 53 56 55 53 56 L 47 57 C 44 57 42 59 42 62 C 42 66 45 69 49 69 L 55 69 C 59 69 62 66 62 62"
          stroke="url(#shopHubGradient)"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Decorative dots */}
        <circle cx="32" cy="45" r="2" fill="url(#accentGradient)" opacity="0.6"/>
        <circle cx="68" cy="45" r="2" fill="url(#accentGradient)" opacity="0.6"/>
      </g>

      {/* Animated sparkle effects */}
      <circle cx="70" cy="25" r="1.5" fill="white" opacity="0.8">
        <animate attributeName="opacity" values="0;0.8;0" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="80" cy="30" r="1" fill="white" opacity="0.6">
        <animate attributeName="opacity" values="0;0.6;0" dur="3s" begin="1s" repeatCount="indefinite"/>
      </circle>
      <circle cx="25" cy="70" r="1" fill="white" opacity="0.7">
        <animate attributeName="opacity" values="0;0.7;0" dur="3s" begin="2s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );
}

export function ShopHubLogoWithText({ className = "", size = "default" }) {
  const sizes = {
    small: {
      logo: "h-8 w-8",
      text: "text-xl"
    },
    default: {
      logo: "h-10 w-10",
      text: "text-2xl"
    },
    large: {
      logo: "h-12 w-12",
      text: "text-3xl"
    }
  };

  const currentSize = sizes[size] || sizes.default;

  return (
    <div className={`flex items-center gap-2 brand-logo group cursor-pointer ${className}`} data-testid="brand-logo">
      <ShopHubLogo className={`${currentSize.logo} logo transition-transform group-hover:rotate-12`} />
      <div className="flex flex-col">
        <span className={`${currentSize.text} font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent transition-all group-hover:scale-105`}>
          ShopHub
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
          Your Shopping Paradise
        </span>
      </div>
    </div>
  );
}

// Animated loading logo variant
export function ShopHubLogoLoading({ className = "h-16 w-16" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-pulse ${className}`}
    >
      <defs>
        <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed">
            <animate attributeName="stop-color" values="#7c3aed;#ec4899;#7c3aed" dur="2s" repeatCount="indefinite"/>
          </stop>
          <stop offset="100%" stopColor="#ec4899">
            <animate attributeName="stop-color" values="#ec4899;#7c3aed;#ec4899" dur="2s" repeatCount="indefinite"/>
          </stop>
        </linearGradient>
      </defs>

      <path
        d="M 22 38 C 22 36 24 34 26 34 L 74 34 C 76 34 78 36 78 38 L 78 72 C 78 78 74 82 68 82 L 32 82 C 26 82 22 78 22 72 Z"
        fill="url(#loadingGradient)"
        opacity="0.2"
      />

      <path
        d="M 36 34 C 36 26 41 20 50 20 C 59 20 64 26 64 34"
        stroke="url(#loadingGradient)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />

      <circle cx="50" cy="60" r="15" stroke="url(#loadingGradient)" strokeWidth="3" fill="none" opacity="0.4">
        <animate attributeName="r" values="10;15;10" dur="1.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1.5s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );
}