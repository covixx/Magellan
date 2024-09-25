import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {client} from "@/lib/hono";

type responsetype = InferResponseType<typeof client.api.tasks.deletetask.$post>;
type reqeusttype = InferRequestType<typeof client.api.tasks.deletetask.$post>["json"];

export const usedeletetask = () => {
    const queryclient = useQueryClient();
    const mutation = useMutation<
    responsetype,
    Error,
    reqeusttype
    >({
        mutationFn: async (json) => {
            const response = await client.api.tasks.deletetask.$post({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Task completed");
            queryclient.invalidateQueries({ queryKey: ["tasks"]});
            //TODO: Also invalidate summary
        },
        onError: () => {
            toast.error("Failed to delete task");

        },
    })
    return mutation;
};

