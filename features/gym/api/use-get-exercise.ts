import { useQuery } from "@tanstack/react-query";
import {client} from "@/lib/hono";
import { error } from "console";

export const useGetExercises = () => {
  const query = useQuery({
    queryKey: ["gym"],
    queryFn: async () => {
      try {
        const response = await client.api.gym.$get();
        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }
        const { data } = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching workouts:", error);
        return []; // or some fallback value
      }
    }
  });

  return query;
};