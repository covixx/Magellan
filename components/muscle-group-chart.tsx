"use client"

import React, { useState, useMemo } from 'react';
import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useGetExercises } from '@/features/gym/api/use-get-exercise';

const muscleGroups = [ 'Hams', 'Quads','Traps', 'Calves','Shoulders', 'Delts','Triceps', 'Chest','Biceps', 'Lats', 'Rows'];

const chartConfig = {
  frequency: {
    label: "Frequency",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const MuscleGroupCharts = () => {
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const { data: gymData, error, isLoading } = useGetExercises();

  const muscleFrequencyData = useMemo(() => {
    if (!gymData) return [];
    return muscleGroups.map(muscle => ({
      muscle,
      frequency: gymData.filter(entry => entry.muscle === muscle).length
    }));
  }, [gymData]);
  console.log(muscleFrequencyData);
  const processedData = useMemo(() => {
    if (!gymData) return [];
    const groupedData = gymData.reduce((acc, entry) => {
      if (entry.muscle === selectedMuscle) {
        const date = entry.date.split('T')[0];
        const netWeight = entry.sets * entry.reps * entry.weight;
        if (!acc[date]) {
          acc[date] = { date, netWeight: 0 };
        }
        acc[date].netWeight += netWeight;
      }
      return acc;
    }, {});
    
    return Object.values(groupedData).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }, [gymData, selectedMuscle]);

  const trend = useMemo(() => {
    if (processedData.length < 2) return 0;
    const firstValue = processedData[0].netWeight;
    const lastValue = processedData[processedData.length - 1].netWeight;
    return ((lastValue - firstValue) / firstValue) * 100;
  }, [processedData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Card className="w-72 h-80">
      <CardHeader>
        <CardTitle className="text-center">{selectedMuscle}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center space-x-4 mb-2">
          <button
            onClick={() => setSelectedMuscle('All')}
            className={`justify-center w-4 h-4 rounded-full transition-all ${
              selectedMuscle === 'All'
                ? 'bg-blue-500 scale-125'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            title='Frequency'
          />
          {muscleGroups.map((muscle) => (
            <button
              key={muscle}
              onClick={() => setSelectedMuscle(muscle)}
              className={`justify-center w-4 h-4 rounded-full transition-all ${
                selectedMuscle === muscle
                  ? 'bg-blue-500 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              title={muscle}
            />
          ))}
        </div>
        {selectedMuscle === 'All' ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-[200px]"
          >
            <RadarChart data={muscleFrequencyData} outerRadius="85%" margin={{ top: 5, right: 10, bottom: 10, left: 10 }}>
  <PolarGrid gridType="polygon" strokeDasharray="3 3" />
  <PolarAngleAxis dataKey="muscle" tick={{ fontSize: 11, textAnchor: 'middle' }} />
  <Radar name="Frequency" dataKey="frequency" stroke="#8884d8" fill="#8884d8" fillOpacity={0.7} />
  <Tooltip />
</RadarChart>
          </ChartContainer>
        ) : (
          <ResponsiveContainer width="90%" height={150}>
            <LineChart data={processedData}>
              <XAxis dataKey="date" hide={true} />
              <YAxis hide={true} />
              <Tooltip />
              <Line type="monotone" dataKey="netWeight" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-center text-sm">
        {selectedMuscle !== 'All' && (
          <div className="flex gap-2 font-medium leading-none">
            {trend > 0 ? (
              <>
                Trending up by {Math.abs(trend).toFixed(2)}%
                <TrendingUp className="h-4 w-4 text-green-500" />
              </>
            ) : (
              <>
                Trending down by {Math.abs(trend).toFixed(2)}%
                <TrendingUp className={`h-4 w-4 text-red-500 ${trend < 0 ? 'scale-y-[-1]' : ''}`} />
              </>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default MuscleGroupCharts;