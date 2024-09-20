import { z } from "zod";
import { DiscAlbum, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { insertaccountschema } from "@/db/schema";
import  {zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {Form, FormField, FormDescription, FormControl, FormLabel, FormMessage, FormItem} from "@/components/ui/form";
import { FormValue } from "hono/types";

const formschema = insertaccountschema.pick({
    name: true,
});

type formvalues = z.input<typeof formschema>;

type Props = {
    id?: string,
    defaultvalues?: formvalues;
    onsubmit: (values: formvalues) => void;
    ondelete?: () => void;
    disabled?: boolean;
};

export const TaskForm = ({
    id, 
    defaultvalues, 
    onsubmit, 
    ondelete,
    disabled,
}:Props) => {
    const form = useForm<formvalues>({
        resolver: zodResolver(formschema),
        defaultValues: defaultvalues, 
    });
    const handlesubmit = (values: formvalues) => {
        onsubmit(values);
    };
    const handledelete = () => {
        ondelete?.();
    };
    return (
        <Form{...form}>
            <form onSubmit={form.handleSubmit(handlesubmit)}className="space-y-4 pt-4">
                <FormField
                name="name"
                control={form.control}
                render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Name
                        </FormLabel>
                        <FormControl>
                            <Input
                            disabled = {disabled}
                            placeholder="e.g. Work, Gym, Studying"
                            {...field}
                            />
                        </FormControl>
                    </FormItem>
                )}/>
                <Button className="w-full" disabled={disabled}>
                    {id? "Save changes": "Create Task"}
                </Button>
                    {!!id && (
                        <Button
                        type = "button"
                        disabled = {disabled}
                        onClick={handledelete}
                        className="w-full"
                        variant="outline"
                    >
                        <Trash className="size-4 mr-2"/>
                        Delete task
                    </Button>
                )}
            </form>
        </Form>
    )
}