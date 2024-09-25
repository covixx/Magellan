import { useQuery } from "@tanstack/react-query";
import {client} from "@/lib/hono";
import { error } from "console";

export const useGetTasks = (date: string) => {
    const query = useQuery({
        queryKey: ["tasks", date],
        queryFn: async () => {
            const response = await client.api.tasks.$get({ query: { date }});
        
        if (!response.ok) {
            throw new Error("Failed to fetch tasks");
        }
        const { data } = await response.json();
        return data;
    }
    });

    return query;
}