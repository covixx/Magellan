import { TrendingUp } from "lucide-react";
import { useGetMeals } from "@/features/nutrition/api/use-get-meals";
const MAX_CALORIES = 2500;
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

export const description = "A radial chart with a custom shape";

const chartConfig = {
  calories: {
    label: "KCal",
  },
} satisfies ChartConfig;

export function CalorieChart() {
  const { data: meals, isLoading, error } = useGetMeals();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Get today's date in 'YYYY-MM-DD' format
  const today = new Date().toISOString().split("T")[0];

  const todayMeals = meals?.filter((meal) => {
    const mealDate = new Date(meal.date).toISOString().split("T")[0];
    return mealDate === today;
  }) ?? [];

  // Sum up the calories for today
  const todayCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);

  // Prepare data for the RadialBarChart
  const chartData = [
    {
      name: "Calories",
      value: todayCalories,
      fill: "#2eb88a",
    },
  ];
  const angle = Math.floor(todayCalories / MAX_CALORIES * 360);
  console.log("Today's calorie sum:", todayMeals); 
  return (
    <Card className="w-72 h-80">
      <CardHeader className="items-center pb-0">
        <CardTitle>Calories Consumed</CardTitle>
        <CardDescription>Today</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[160px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={angle}
            innerRadius={60}
            outerRadius={130}
            width={300} // Adjust width to fit Card size
            height={300} // Adjust height to fit Card size
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[75, 52]}
            />
            <RadialBar dataKey="value" background />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {todayCalories.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Calories
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm mt-6">
        <div className="text-sm text-muted-foreground">
          Hungry? Grab a Snickers
        </div>
      </CardFooter>
    </Card>
  );
}
