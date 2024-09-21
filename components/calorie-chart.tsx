import React, { useState } from 'react';
import { TrendingUp } from "lucide-react";
import { useGetMeals } from "@/features/nutrition/api/use-get-meals";
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

const MAX_CALORIES = 2500;
const MAX_PROTEIN = 130; // grams
const MAX_FAT = 85; // grams
const MAX_CARBS = 320; // grams
const NUTRIENTS: Nutrient[] = ['calories', 'protein', 'fat', 'carbs'];
const chartConfig = {
  calories: {
    label: "KCal",
  },
} satisfies ChartConfig;
type Nutrient = 'calories' | 'protein' | 'fat' | 'carbs';

type NutritionData = {
  [key in Nutrient]: number;
};
export function NutritionRadialChart() {
  const { data: meals, isLoading, error } = useGetMeals();
  const [selectedNutrient, setSelectedNutrient] = useState<Nutrient>('calories');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const today = new Date().toISOString().split("T")[0];

  const todayMeals = meals?.filter((meal) => {
    const mealDate = new Date(meal.date).toISOString().split("T")[0];
    return mealDate === today;
  }) ?? [];

  const todayNutrition = todayMeals.reduce((sum, meal) => ({
    calories: sum.calories + meal.calories,
    protein: sum.protein + meal.protein,
    fat: sum.fat + meal.fats,
    carbs: sum.carbs + meal.carbs,
  }), { calories: 0, protein: 0, fat: 0, carbs: 0 });

  const getNutrientData = (nutrient: Nutrient) => {
    const maxValues = {
      calories: MAX_CALORIES,
      protein: MAX_PROTEIN,
      fat: MAX_FAT,
      carbs: MAX_CARBS,
    };

    return [
      {
        name: nutrient.charAt(0).toUpperCase() + nutrient.slice(1),
        value: todayNutrition[nutrient],
        fill: "#2eb88a",
      },
    ];
  };

  const getAngle = (nutrient: Nutrient) => {
    const maxValues = {
      calories: MAX_CALORIES,
      protein: MAX_PROTEIN,
      fat: MAX_FAT,
      carbs: MAX_CARBS,
    };
    return Math.floor((todayNutrition[nutrient] / maxValues[nutrient]) * 360);
  };

  const chartData = getNutrientData(selectedNutrient);
  const angle = getAngle(selectedNutrient);

  return (
    <Card className="w-72 h-80">
      <CardHeader className="items-center pb-0">
        <CardTitle>Nutrition Tracker</CardTitle>
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
            width={300}
            height={300}
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
                          {todayNutrition[selectedNutrient].toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {selectedNutrient.charAt(0).toUpperCase() + selectedNutrient.slice(1)}
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
        <div className="flex justify-center space-x-4 mb-2">
          {NUTRIENTS.map((nutrient) => (
            <button
              key={nutrient}
              onClick={() => setSelectedNutrient(nutrient)}
              className={`justify-center w-4 h-4 rounded-full transition-all ${
                selectedNutrient === nutrient
                  ? 'bg-blue-500 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              title={nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}
            />
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          Hungry? Grab a Snickers
        </div>
      </CardFooter>
    </Card>
  );
}