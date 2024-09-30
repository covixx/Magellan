import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
type MealInput = {
  food: string;
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
  userId: string;
};
export const useCreateMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MealInput) => client.api.nutrition.$post({
      json: {
        
        food: data.food,
        calories: Math.floor(data.calories),
        carbs: Math.floor(data.carbs),
        proteins: Math.floor(data.proteins),
        fats: Math.floor(data.fats),
      }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutrition"] });
    },
  });
};