import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

interface Habit {
  id: string;
  name: string;
  userId: string;
  days: { date: string; done: boolean }[];
  createdAt: string;
}

export const useHabitsData = () => {
  const query = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      try {
        // Adjust this line based on your actual API structure
        const response = await client.api.habits.$get();
        if (!response.ok) {
          throw new Error("Failed to fetch habits");
        }
        const habits: Habit[] = await response.json();
        return habits;
      } catch (error) {
        console.error("Error fetching habits:", error);
        return [] as Habit[];
      }
    }
  });

  return query;
};