import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {client} from "@/lib/hono";

type responsetype = InferResponseType<typeof client.api.nutrition.deletemeal.$post>;
type reqeusttype = InferRequestType<typeof client.api.nutrition.deletemeal.$post>["json"];

export const usedeletemeal = () => {
    const queryclient = useQueryClient();
    const mutation = useMutation<
    responsetype,
    Error,
    reqeusttype
    >({
        mutationFn: async (json) => {
            const response = await client.api.nutrition.deletemeal.$post({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Meal deleted");
            queryclient.invalidateQueries({ queryKey: ["nutrition"]});
            //TODO: Also invalidate summary
        },
        onError: () => {
            toast.error("Failed to delete meal");

        },
    })
    return mutation;
};