'use client';

import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';

export default function Loading() {
    return <DashboardSkeleton />;
}

// Ensure these utility classes are in your tailwind.config.js or global.css:
// .glow-text-neonGreen { text-shadow: 0 0 8px theme('colors.neonGreen'); }
// .shadow-neon-green-strong { box-shadow: 0 0 25px 5px rgba(0,255,0,0.3); } 