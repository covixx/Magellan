import { useQuery } from "@tanstack/react-query";
import {client} from "@/lib/hono";
import { error } from "console";

export const useGetMeals = () => {
  const query = useQuery({
    queryKey: ["nutrition"],
    queryFn: async () => {
      try {
        const response = await client.api.nutrition.$get();
        if (!response.ok) {
          throw new Error("Failed to fetch meals");
        }
        const { data } = await response.json();
        console.log("Fetched meals data:", data);
        return data;
      } catch (error) {
        console.error("Error fetching meals:", error);
        return []; // or some fallback value
      }
    }
  });

  return query;
};