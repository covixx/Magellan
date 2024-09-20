import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useCreateMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      food: string;
      calories: number;
      carbs: number;
      proteins: number;
      fats: number;
    }) => client.api.nutrition.$post({ 
      json: {
         // Send a timestamp instead of a string
        food: data.food,
        calories: Math.floor(data.calories), // Convert to integer
        carbs: Math.floor(data.carbs), // Convert to integer
        proteins: Math.floor(data.proteins), // Convert to integer
        fats: Math.floor(data.fats), // Convert to integer
      }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutrition"] });
    },
  });
};