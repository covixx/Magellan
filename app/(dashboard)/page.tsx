"use client"
import React from 'react';
import { useGetLockingInData } from "@/features/lockingin/use-get-lockingin";
import { Component as ChartComponent } from "@/components/lockedin-chart";
import { NutritionRadialChart } from "@/components/calorie-chart";
import MuscleGroupCharts from "@/components/muscle-group-chart";
import TodayHabits from '@/components/habits-chart';
import UncheckedTasks from '@/components/pending-tasks';

export default function Dashboard() {
  const { data: timeData, isLoading, error } = useGetLockingInData();

  return (
    <div className="bg-inherit min-h-screen p-6">
      <div className="grid grid-cols-3 gap-8">
        {/* Left column: Unchecked Tasks, Today's Habits, and Weekly Time Chart */}
        <div className="col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-lg p-4 max-h-[38.5vh] overflow-y-auto">
            <UncheckedTasks />
          </div>
          <div className="bg-gray-800 rounded-lg p-4 grid grid-cols-3">
            <div>
              <TodayHabits />
            </div>
            <div>
              {isLoading && <p>Loading time data...</p>}
              {error && <p>Error fetching time data: {error.message}</p>}
              <MuscleGroupCharts />
              
            </div>
            <div>
              <div className="bg-gray-800 rounded-lg">
                <NutritionRadialChart />
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Muscle Groups and additional card */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-4">
          {timeData && <ChartComponent data={timeData} />}
          </div>
          {/* New card added below MuscleGroupCharts */}
          <div className="bg-gray-800 rounded-lg p-4">
            <p>Switch will be added here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
