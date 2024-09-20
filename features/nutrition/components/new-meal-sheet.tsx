import { z } from "zod";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { MealForm } from "./meal-form";
import { useNewMeal } from "../hooks/use-new-meal";
import { useCreateMeal } from "../api/use-create-meals";

const formSchema = z.object({
    food: z.string(),
    calories: z.number(),
    carbs: z.number(),
    proteins: z.number(),
    fats: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

export const NewMealSheet = () => {
    const { isOpen, onClose } = useNewMeal();
    const mutation = useCreateMeal();

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}> 
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>Log New Meal</SheetTitle>
                    <SheetDescription>
                        Enter the details of your meal
                    </SheetDescription>
                </SheetHeader>
                <MealForm 
                    onSubmit={onSubmit} 
                    disabled={mutation.isPending}
                    defaultValues={{
                        food: "",
                        calories: 0,
                        carbs: 0,
                        proteins: 0,
                        fats: 0,
                    }}
                />
            </SheetContent>
        </Sheet>
    );
};