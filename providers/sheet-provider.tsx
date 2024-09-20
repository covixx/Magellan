"use client";

import { NewTaskSheet } from "@/features/accounts/components/new-task-sheet";
import { useMountedState } from "react-use";

export const SheetProvider = () => {
    const ismounted = useMountedState();
    if (!ismounted) return null;
    return (
        <>
            <NewTaskSheet/>
        </>
    );
};