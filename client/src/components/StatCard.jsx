import React from 'react';

export default function StatCard({ title, value, color }) {
  return (
    <div className="card bg-white dark:bg-teal-950 border border-gray-200 dark:border-dark-border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{title}</p>
          <p className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mt-2">
            {value}
          </p>
        </div>
        <div className={`${color} w-12 h-12 sm:w-16 sm:h-16 rounded-lg opacity-20 dark:opacity-30`}></div>
      </div>
    </div>
  );
}