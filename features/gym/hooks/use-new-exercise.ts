import { create } from "zustand";

type NewExerciseState = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useNewExercise = create <NewExerciseState>((set) => ({
    isOpen: false,
    onOpen: () => {
        set( {isOpen: true})
        console.log("Opened")
    },
    onClose: () => {set({ isOpen: false}
        
    )
    console.log("Closed")},
}));