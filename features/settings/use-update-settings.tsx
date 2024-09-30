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
            console.log('Sending update request with data:', json);
            const response = await client.api.settings.$post({ json });
            const result = await response.json();
            console.log('Received update response:', result);
            return result;
        },
        onSuccess: (data) => {
            console.log('Update successful, invalidating queries');
            toast.success("Settings updated");
            queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
        onError: (error) => {
            console.error('Update failed:', error);
            toast.error(`Failed to update settings: ${error.message}`);
        },
    });
    return mutation;
};