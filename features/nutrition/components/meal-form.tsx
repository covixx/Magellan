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
    food: z.string().min(1, "Food name is required"),
    calories: z.number().min(0, "Calories must be a positive number"),
    carbs: z.number().min(0, "Carbs must be a positive number"),
    proteins: z.number().min(0, "Proteins must be a positive number"),
    fats: z.number().min(0, "Fats must be a positive number"),
});

type FormValues = z.infer<typeof formSchema>;

interface MealFormProps {
    onSubmit: (values: FormValues) => void;
    disabled: boolean;
    defaultValues: FormValues;
}

export const MealForm = ({ onSubmit, disabled, defaultValues }: MealFormProps) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="food"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Food Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="calories"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Calories (kcal)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="carbs"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Carbs (g)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="proteins"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Proteins (g)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="fats"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fats (g)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
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