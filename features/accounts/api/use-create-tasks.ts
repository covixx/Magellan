import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {client} from "@/lib/hono";

type responsetype = InferResponseType<typeof client.api.tasks.$post>;
type reqeusttype = InferRequestType<typeof client.api.tasks.$post>["json"];

export const usecreatetask = () => {
    const queryclient = useQueryClient();
    const mutation = useMutation<
    responsetype,
    Error,
    reqeusttype
    >({
        mutationFn: async (json) => {
            const response = await client.api.tasks.$post({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Task created");
            queryclient.invalidateQueries({ queryKey: ["tasks"]});
        },
        onError: () => {
            toast.error("Failed to create task");

        },
    })
    return mutation;
};