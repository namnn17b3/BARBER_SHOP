import StatisticQuantityOrder from "@/components/admin/statistic/StatisticQuantityOrder";
import StatisticQuantityUser from "@/components/admin/statistic/StatisticQuantityUser";
import { StatisticRevenue } from "@/components/admin/statistic/StatisticRevenue";
import StatisticTopItem from "@/components/admin/statistic/StatisticTopItem";
import React from 'react';

export default function AdminPage() {
  return (
    <>
      <div className="mb-4 col-span-full xl:mb-2">
        <nav className="flex mb-5" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 text-sm font-medium md:space-x-2">
            <li className="inline-flex items-center">
              <a href="/admin" className="inline-flex items-center text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white">
                <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                Dashboard
              </a>
            </li>
          </ol>
        </nav>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">Common statistics</h1>
      </div>
      <div className="h-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-5">
        <StatisticQuantityUser />
        <StatisticQuantityOrder />
      </div>
      <StatisticRevenue />
      <StatisticTopItem />
      <script src="/js/apexcharts.js" defer></script>
      <script src="/js/draw-chart.js" defer></script>
    </>
  );
}
