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
import HabitsTracker from './habits/page';

export default function Home() {
  const router = useRouter();
  const { isSwitchOn, toggleSwitch } = useSwitch();
  const { data: timeData, isLoading, error } = useGetLockingInData();

  useEffect(() => {
    // Disable scrolling
    document.body.style.overflow = 'hidden';

    // Clean up on component unmount
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
    <div className="relative h-screen overflow-hidden">
      <div className="absolute right-8 bottom-56 shadow-lg">
        <MuscleGroupCharts />
      </div>
      {/* Chart positioned on the middle left */}
      <div className="absolute left-8 top-48 transform -translate-y-1/2">
        {isLoading && <p>Loading time data...</p>}
        {error && <p>Error fetching time data: {error.message}</p>}
        {timeData && <ChartComponent data={timeData} />}
      </div>

      {/* Calorie Chart positioned on the middle right */}
      <div className="absolute right-8 top-48 transform -translate-y-1/2 'shadow-lg'">
        <NutritionRadialChart />
      </div>
      <div className='absolute left-[26%] top-48 transform -translate-y-[37.5%] shadow-lg'><UncheckedTasks/></div>
      <div className="absolute left-8 bottom-56 h-80 w-72 shadow-lg">
        <TodayHabits/>
      </div>
      {/* Lock In switch centered at the bottom */}
      <div className="absolute bottom-80 left-1/2 transform -translate-x-1/2 flex items-center">
        <Switch id="lock-in" checked={isSwitchOn} onClick={handleSwitchChange} className='shadow-lg' />
        <Label htmlFor="lock-in" className="ml-2 label-font text-xl font-semibold">
          Lock In
        </Label>
      </div>
      
    </div>
  );
}
