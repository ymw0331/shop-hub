import React from 'react';

export default function ShopHubLogo({ className = "h-8 w-8", color = "currentColor" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Shopping bag with S shape */}
      <defs>
        <linearGradient id="shopHubGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#9333EA" />
        </linearGradient>
      </defs>
      
      {/* Main shopping bag shape */}
      <path
        d="M25 35 L25 80 Q25 90 35 90 L65 90 Q75 90 75 80 L75 35"
        stroke="url(#shopHubGradient)"
        strokeWidth="4"
        fill="none"
      />
      
      {/* Bag handle */}
      <path
        d="M35 35 Q35 20 50 20 Q65 20 65 35"
        stroke="url(#shopHubGradient)"
        strokeWidth="4"
        fill="none"
      />
      
      {/* S letter inside bag */}
      <path
        d="M40 50 Q40 45 45 45 L50 45 Q55 45 55 50 Q55 55 50 55 L45 55 Q40 55 40 60 Q40 65 45 65 L55 65 Q60 65 60 60"
        stroke="url(#shopHubGradient)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* H letter inside bag */}
      <path
        d="M40 70 L40 85 M55 70 L55 85 M40 77.5 L55 77.5"
        stroke="url(#shopHubGradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ShopHubLogoWithText({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ShopHubLogo className="h-10 w-10" />
      <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
        ShopHub
      </span>
    </div>
  );
}