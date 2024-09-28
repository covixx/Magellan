import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.settings.$post>;
type RequestType = InferRequestType<typeof client.api.settings.$post>["json"];

export const useUpdateSettings = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.settings.$post({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Settings updated");
            queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
        onError: () => {
            toast.error("Failed to update settings");
        },
    });
    return mutation;
};