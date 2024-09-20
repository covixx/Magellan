import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useCreateExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      exercise: string;
      sets: number;
      reps: number;
      weight: number;
      muscle: string;
    }) => client.api.gym.$post({ 
      json: {
         // Send a timestamp instead of a string
        exercise: data.exercise,
        sets: Math.floor(data.sets), // Convert to integer
        reps: Math.floor(data.reps), // Convert to integer
        weight: Math.floor(data.weight), // Convert to integer
        muscle: data.muscle, // Convert to integer
      }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gym"] });
    },
  });
};