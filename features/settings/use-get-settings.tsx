import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type Settings = {
  spotifyLink?: string;
  height?: number;
  weight?: number;
  goal?: 'mildWeightGain' | 'weightLoss';
  workoutDays?: number;
  age?: number;
  maxCalories?: number;
};


export const useSettingsData = () => {
  const query = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      try {
        // Adjust this line based on your actual API structure
        const response = await client.api.settings.$get();
        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }
        const settings = await response.json();
        return settings;
      } catch (error) {
        console.error("Error fetching settings:", error);
        const tempsettings: Settings = {};
        return tempsettings;
      }
    }
  });

  return query;
};