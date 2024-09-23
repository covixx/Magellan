import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCreateMeal } from '@/features/nutrition/api/use-create-meals';
import { useGetMeals } from '@/features/nutrition/api/use-get-meals';
import { Loader2 } from "lucide-react";
import { MealForm } from './meal-form'; // Assuming MealForm is in the same directory

type MealInput = {
  food: string;
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
};

type ApiMeal = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  date: string;
};

export function NewMealSheet() {
  const [open, setOpen] = useState(false);
  const createMealMutation = useCreateMeal();
  const { data: meals, isLoading: mealsLoading } = useGetMeals();

  const handleSubmit = (mealInput: MealInput) => {
    createMealMutation.mutate(mealInput, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  const handleQuickAdd = (meal: ApiMeal) => {
    const mealInput: MealInput = {
      food: meal.name,
      calories: meal.calories,
      carbs: meal.carbs,
      proteins: meal.protein,
      fats: meal.fats,
    };
    createMealMutation.mutate(mealInput);
  };
  const uniqueMeals = meals?.slice(0, 100)
  .filter((meal, index, self) =>
    index === self.findIndex((m) => m.name === meal.name)
  );
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Add New Meal</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Meal</SheetTitle>
          <SheetDescription>
            Enter the details of your meal here. You can also quickly add previously entered meals.
          </SheetDescription>
        </SheetHeader>
        <MealForm
          onSubmit={handleSubmit}
          disabled={createMealMutation.isPending}
          defaultValues={{
            food: '',
            calories: 0,
            carbs: 0,
            proteins: 0,
            fats: 0,
          }}
        />

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Quick Add Previous Meals</h3>
          {mealsLoading ? (
            <p>Loading previous meals...</p>
          ) : (
            <div className="space-y-2">
              
              {uniqueMeals?.map((meal: ApiMeal) => (
                <Button
                  key={meal.id}
                  onClick={() => handleQuickAdd(meal)}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {meal.name} - {meal.calories} cal
                </Button>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}