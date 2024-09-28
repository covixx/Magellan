"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
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

const chartConfig = {
  time: {
    label: "Focus",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function Component({ data }: { data: { date: string; id: string; time: number | null }[] }) {
  // Get the date 7 days ago
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Set to end of day
  const sixDaysAgo = new Date(today);
  sixDaysAgo.setDate(today.getDate() - 6);
  sixDaysAgo.setHours(0, 0, 0, 0); // Set to start of day

  // Filter and process the data for the last 7 days
  const last7Days = data
    .filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= sixDaysAgo && entryDate <= today;
    })
    .reduce((acc, curr) => {
      const date = new Date(curr.date);
      const dayKey = date.toISOString().split('T')[0]; // Use ISO date for unique keys
      if (!acc[dayKey]) {
        acc[dayKey] = { date: dayKey, time: 0 }; // Use full date as key
      }
      acc[dayKey].time += curr.time || 0;
      return acc;
    }, {} as Record<string, { date: string; time: number }>);
  // Ensure all 7 days are represented, even if there's no data
  for (let i = 1; i < 7; i++) {
    const date = new Date(sixDaysAgo);
    date.setDate(date.getDate() + i);
    const dayKey = date.toISOString().split('T')[0]; // Use full date for consistency
    if (!last7Days[dayKey]) {
      last7Days[dayKey] = { date: dayKey, time: 0 }; // Keep date consistent in format
    }
  }

  const chartData = Object.entries(last7Days)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([_, value]) => ({
    date: new Date(value.date).toLocaleDateString('en-US', { weekday: 'short' }),
    time: Math.round(value.time),
  }))
  .filter(({ time }) => time > 0); 

  // Calculate the trend
  const nonZeroDays = chartData.filter(day => day.time > 0);
  const trend = nonZeroDays.length >= 2
    ? ((nonZeroDays[nonZeroDays.length - 1].time - nonZeroDays[0].time) / nonZeroDays[0].time) * 100
    : 0;

  return (
    <Card className="w-72 h-80 shadow-lg ">
      <CardHeader>
        <CardTitle>Weekly Time Chart</CardTitle>
        <CardDescription>Last 7 Days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{
              top: 30,
              right: 20,
              left: 20,
              bottom: 5,
            }}
            width={300}
            height={200}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={false}/>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="time" fill="#e23670" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="time" position="top" formatter={(value: number) => `${value}m`} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {trend !== 0 ? (
            <>
              Trending {trend > 0 ? 'up' : 'down'} by {Math.abs(trend).toFixed(1)}% this week 
              <TrendingUp className={`h-4 w-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            </>
          ) : (
            'Not enough data to calculate trend'
          )}
        </div>
      </CardFooter>
    </Card>
  );
}