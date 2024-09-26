"use client"
import React, { useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSwitch } from "@/app/switch-context";
import { useRouter } from 'next/navigation';
import { useGetLockingInData } from "@/features/lockingin/use-get-lockingin";
import { Component as ChartComponent } from "@/components/lockedin-chart";
import { NutritionRadialChart } from "@/components/calorie-chart";
import MuscleGroupCharts from "@/components/muscle-group-chart";
import TodayHabits from '@/components/habits-chart';
import UncheckedTasks from '@/components/pending-tasks';

export default function Dashboard() {
  const router = useRouter();
  const { isSwitchOn, toggleSwitch } = useSwitch();
  const { data: timeData, isLoading, error } = useGetLockingInData();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSwitchChange = () => {
    toggleSwitch();
    if (!isSwitchOn) {
      router.push('/lockingin');
    }
  };

  return (
    <div className="flex p-10 h-[95vh]">
  {/* Left side: Tasks */}
  <div className="w-1/2 p-4 pr-4 overflow-y-auto shadow-card-small mr-4 " >
    <UncheckedTasks />
  </div>

  {/* Right side: Charts */}
  <div className="w-1/2 p-5 overflow-y-auto  shadow-card ml-4 flex items-start">
  <div className="grid grid-cols-2 gap-9">
        <MuscleGroupCharts />
        <NutritionRadialChart />
        <TodayHabits />
        {isLoading && <p>Loading time data...</p>}
        {error && <p>Error fetching time data: {error.message}</p>}
        {timeData && <ChartComponent data={timeData} />}
      </div>
  </div>
</div>
  );
}