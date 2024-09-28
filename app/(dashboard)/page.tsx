"use client"
import React, { useState, useEffect } from 'react';
import { useGetLockingInData } from "@/features/lockingin/use-get-lockingin";
import { Component as ChartComponent } from "@/components/lockedin-chart";
import { NutritionRadialChart } from "@/components/calorie-chart";
import MuscleGroupCharts from "@/components/muscle-group-chart";
import TodayHabits from '@/components/habits-chart';
import UncheckedTasks from '@/components/pending-tasks';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import { useSwitch } from "@/app/switch-context";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { useTheme } from "next-themes";
export default function Dashboard() {
  const { data: timeData, isLoading, error } = useGetLockingInData();
  const router = useRouter();
  const { isSwitchOn, toggleSwitch } = useSwitch();
  const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();
  const handleSwitchChange = () => {
    toggleSwitch();
    if (!isSwitchOn) {
      router.push('/lockingin');
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="bg-inherit overflow-hidden min-h-screen p-6 ">
      <div className="grid grid-cols-3 gap-16 ">
        {/* Left column: Unchecked Tasks, Today's Habits, and Weekly Time Chart */}
        <div className="col-span-2 space-y-6">
          <div className=" rounded-lg p-0 pt-4 max-h-[36.5vh] overflow-y-hidden shadow-xl">
            <UncheckedTasks />
          </div>
          <div className=" rounded-lg p-4 grid grid-cols-3 gap-x-5">
            <div>
              <TodayHabits />
            </div>
            <div>
              {isLoading && <p>Loading time data...</p>}
              {error && <p>Error fetching time data: {error.message}</p>}
              <MuscleGroupCharts />
            </div>
            <div>
              <div className="rounded-lg">
                <NutritionRadialChart />
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Muscle Groups and additional card */}
        <div className="space-y-6">
          <div className=" rounded-lg p-4 mx-12 mr-16">
            {timeData && <ChartComponent data={timeData} />}
          </div>
          {/* New card added below MuscleGroupCharts */}
          <div className=" rounded-lg p-4 mx-12 mr-16 pt-0">
            <Card className="w-72 h-80 relative shadow-lg">
              <CardHeader>
                <CardTitle className='flex justify-center font-extrabold'>Lock In</CardTitle>
                <CardDescription className='flex justify-center italic'> Take control. </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center flex-grow pt-10 ">
                  <Switch id="lock-in" checked={isSwitchOn} onCheckedChange={handleSwitchChange} style={{transform: 'scale(2.0)'}}/>
                </div>
                <div  className={`absolute ${theme === 'dark' ? 'bottom-0' : '-bottom-3'} right-0 w-24 h-24`}>
                {
      theme === 'dark' 
      ? (<img 
          src="/test.png"
          alt="Manga character" 
          className="object-cover w-full h-full"
        />)
      : (<img 
          src="/canvas.png"
          alt="Manga character" 
          className="object-cover w-full h-full"
        />)
    }
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}