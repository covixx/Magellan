"use client";
import { Nutrition, columns } from "./columns"
import { Button } from "@/components/ui/button";
  import { Loader2, Plus } from "lucide-react";
import { MealTable } from "@/components/meal-table"
import { Skeleton } from "@/components/ui/skeleton";
import {useCreateMeal} from "@/features/nutrition/api/use-create-meals"
import {useNewMeal} from "@/features/nutrition/hooks/use-new-meal"
import {usedeletemeal} from "@/features/nutrition/api/use-delete-meal"
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card";
import { useGetMeals } from "@/features/nutrition/api/use-get-meals";
import { NewMealSheet } from "@/features/nutrition/components/new-meal-sheet";

//TODO: Add Delete meal button 
const MealPage = () => {
  const newmeal = useNewMeal();
  const mealquery = useGetMeals();
  const deletemeal = usedeletemeal();
  const tasks = mealquery.data || [];
  const isdisabled = mealquery.isLoading || deletemeal.isPending;

  if (mealquery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-400 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10">
        <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl line-clamp-1">
                Nutrition Tracker
            </CardTitle>
            <Button onClick={newmeal.onOpen} size="sm">
                <Plus className="size-4 mr-2"/>
                    Log Meal
            </Button>
        </CardHeader>
        <CardContent>
            <MealTable columns={columns} data={tasks}/>
            <NewMealSheet/>
        </CardContent>
        </Card>
        
    </div>
);
};
export default MealPage;