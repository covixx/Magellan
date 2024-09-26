"use client"
import { useEffect } from 'react';
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

export default function Home() {
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
    <div className="h-screen w-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="h-full w-full grid grid-cols-3 grid-rows-3 gap-6">
        <div className="col-span-1 row-span-2 bg-white rounded-xl shadow-lg p-4">
          {isLoading && <p>Loading time data...</p>}
          {error && <p>Error fetching time data: {error.message}</p>}
          {timeData && <ChartComponent data={timeData} />}
        </div>
        
        <div className="col-span-1 row-span-1 bg-white rounded-xl shadow-lg p-4">
          <UncheckedTasks />
        </div>
        
        <div className="col-span-1 row-span-2 bg-white rounded-xl shadow-lg p-4">
          <NutritionRadialChart />
        </div>
        
        <div className="col-span-1 row-span-1 bg-white rounded-xl shadow-lg p-4">
          <TodayHabits />
        </div>
        
        <div className="col-span-1 row-span-2 bg-white rounded-xl shadow-lg p-4">
          <MuscleGroupCharts />
        </div>
        
        <div className="col-span-3 flex justify-center items-center">
          <div className="bg-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-3">
            <Switch
              id="lock-in"
              checked={isSwitchOn}
              onClick={handleSwitchChange}
              className="shadow-md"
            />
            <Label htmlFor="lock-in" className="text-xl font-semibold text-gray-800">
              Lock In
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}