import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.tasks.$patch>;
type RequestType = InferRequestType<typeof client.api.tasks.$patch>["json"];

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.tasks.$patch({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Task updated");
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: () => {
            toast.error("Failed to update task");
        },
    });
    return mutation;
};