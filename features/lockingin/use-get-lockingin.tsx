import { useQuery } from "@tanstack/react-query";
import {client} from "@/lib/hono";
import { error } from "console";

export const useGetLockingInData = () => {
  const query = useQuery({
    queryKey: ["lockingin"],
    queryFn: async () => {
      try {
        const response = await client.api.lockingin.$get();
        if (!response.ok) {
          throw new Error("Failed to fetch focus time");
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