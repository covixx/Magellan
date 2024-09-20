import { use } from "react";
import { z } from "zod";
import { useNewTask } from "../hooks/use-new-task";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { TaskForm } from "./task-form";
import { insertaccountschema } from "@/db/schema";
import { usecreatetask } from "../api/use-create-tasks";

const formschema = insertaccountschema.pick({
    name: true,
});
type formvalues = z.input<typeof formschema>;
export const NewTaskSheet = () => {
    const { isOpen, onClose } = useNewTask();
    const mutation = usecreatetask();
    const onsubmit = (values: formvalues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    }
    return (
        <Sheet open={isOpen} onOpenChange={onClose}> 
        <SheetContent className="space-y-4">
            <SheetHeader>
                <SheetTitle>
                </SheetTitle>
                <SheetDescription>
                    Are you locking in, anon?
                </SheetDescription>
            </SheetHeader>
            <TaskForm onsubmit={onsubmit} disabled = {mutation.isPending}
            defaultvalues={{
                name: "",
            }}/>
        </SheetContent>
        </Sheet>
    )
};