import { z } from "zod";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { ExerciseForm } from "./exercise-form";
import { useNewExercise } from "../hooks/use-new-exercise";
import { useCreateExercise } from "../api/use-create-exercise";

const formSchema = z.object({
    exercise: z.string(),
    sets: z.number(),
    reps: z.number(),
    weight: z.number(),
    muscle: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const NewExerciseSheet = () => {
    const { isOpen, onClose } = useNewExercise();
    const mutation = useCreateExercise();

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
                    <SheetTitle>Log Workout</SheetTitle>
                    <SheetDescription>
                        Enter details
                    </SheetDescription>
                </SheetHeader>
                <ExerciseForm 
                    onSubmit={onSubmit} 
                    disabled={mutation.isPending}
                    defaultValues={{
                        exercise: "",
                        sets: 0,
                        reps: 0,
                        weight: 0,
                        muscle: "",
                    }}
                />
            </SheetContent>
        </Sheet>
    );
};