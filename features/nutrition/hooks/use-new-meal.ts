import { create } from "zustand";

type NewMealState = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useNewMeal = create <NewMealState>((set) => ({
    isOpen: false,
    onOpen: () => {
        set( {isOpen: true})
        console.log("Opened")
    },
    onClose: () => {set({ isOpen: false}
        
    )
    console.log("Closed")},
}));