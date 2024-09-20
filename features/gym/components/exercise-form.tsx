import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    exercise: z.string(),
    sets: z.number(),
    reps: z.number(),
    weight: z.number(),
    muscle: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface ExerciseFormProps {
    onSubmit: (values: FormValues) => void;
    disabled: boolean;
    defaultValues: FormValues;
}

export const ExerciseForm = ({ onSubmit, disabled, defaultValues }: ExerciseFormProps) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="exercise"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Exercise</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="sets"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sets</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reps"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Reps per set</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Weight per rep</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="muscle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Muscle exercised</FormLabel>
                            <FormControl>
                            <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={disabled}>
                    {disabled ? "Submitting..." : "Submit"}
                </Button>
            </form>
        </Form>
    );
};