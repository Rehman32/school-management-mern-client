// ============================================
// LOADING SKELETON COMPONENT
// client/src/components/common/LoadingSkeleton.jsx
// Reusable loading skeleton for better UX
// ============================================

import React from 'react';

// Base skeleton element with shimmer animation
const SkeletonBase = ({ className = '', isDark = false }) => (
  <div 
    className={`animate-pulse rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} ${className}`}
  />
);

// Table skeleton
export const TableSkeleton = ({ rows = 5, cols = 4, isDark = false }) => (
  <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
    {/* Header */}
    <div className={`flex gap-4 p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      {Array(cols).fill(0).map((_, i) => (
        <SkeletonBase key={i} className="h-4 flex-1" isDark={isDark} />
      ))}
    </div>
    {/* Rows */}
    {Array(rows).fill(0).map((_, rowIdx) => (
      <div key={rowIdx} className={`flex gap-4 p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
        {Array(cols).fill(0).map((_, colIdx) => (
          <SkeletonBase key={colIdx} className="h-4 flex-1" isDark={isDark} />
        ))}
      </div>
    ))}
  </div>
);

// Card skeleton
export const CardSkeleton = ({ isDark = false }) => (
  <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
    <div className="flex items-center gap-4 mb-4">
      <SkeletonBase className="w-12 h-12 rounded-lg" isDark={isDark} />
      <div className="flex-1">
        <SkeletonBase className="h-4 w-3/4 mb-2" isDark={isDark} />
        <SkeletonBase className="h-3 w-1/2" isDark={isDark} />
      </div>
    </div>
    <SkeletonBase className="h-20" isDark={isDark} />
  </div>
);

// Stats card skeleton
export const StatsSkeleton = ({ count = 4, isDark = false }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {Array(count).fill(0).map((_, i) => (
      <div key={i} className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <SkeletonBase className="h-8 w-16 mb-2" isDark={isDark} />
        <SkeletonBase className="h-4 w-24" isDark={isDark} />
      </div>
    ))}
  </div>
);

// Profile skeleton
export const ProfileSkeleton = ({ isDark = false }) => (
  <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
    <div className="flex gap-6">
      <SkeletonBase className="w-24 h-24 rounded-xl" isDark={isDark} />
      <div className="flex-1">
        <SkeletonBase className="h-6 w-48 mb-3" isDark={isDark} />
        <SkeletonBase className="h-4 w-32 mb-4" isDark={isDark} />
        <div className="grid grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i}>
              <SkeletonBase className="h-3 w-12 mb-2" isDark={isDark} />
              <SkeletonBase className="h-4 w-20" isDark={isDark} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// List skeleton
export const ListSkeleton = ({ items = 5, isDark = false }) => (
  <div className="space-y-3">
    {Array(items).fill(0).map((_, i) => (
      <div key={i} className={`flex items-center gap-4 p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <SkeletonBase className="w-10 h-10 rounded-full" isDark={isDark} />
        <div className="flex-1">
          <SkeletonBase className="h-4 w-3/4 mb-2" isDark={isDark} />
          <SkeletonBase className="h-3 w-1/2" isDark={isDark} />
        </div>
        <SkeletonBase className="h-8 w-20 rounded-lg" isDark={isDark} />
      </div>
    ))}
  </div>
);

// Form skeleton
export const FormSkeleton = ({ fields = 4, isDark = false }) => (
  <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
    <div className="grid grid-cols-2 gap-6">
      {Array(fields).fill(0).map((_, i) => (
        <div key={i}>
          <SkeletonBase className="h-3 w-20 mb-2" isDark={isDark} />
          <SkeletonBase className="h-10 w-full rounded-lg" isDark={isDark} />
        </div>
      ))}
    </div>
  </div>
);

// Generic loading spinner
export const LoadingSpinner = ({ size = 'md', isDark = false }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} rounded-full border-violet-600 border-t-transparent animate-spin`} />
    </div>
  );
};

// Full page loading
export const PageLoading = ({ message = 'Loading...', isDark = false }) => (
  <div className="flex flex-col items-center justify-center h-96">
    <LoadingSpinner size="lg" isDark={isDark} />
    <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
      {message}
    </p>
  </div>
);

// Default export with all skeletons
const LoadingSkeleton = {
  Table: TableSkeleton,
  Card: CardSkeleton,
  Stats: StatsSkeleton,
  Profile: ProfileSkeleton,
  List: ListSkeleton,
  Form: FormSkeleton,
  Spinner: LoadingSpinner,
  Page: PageLoading,
};

export default LoadingSkeleton;
