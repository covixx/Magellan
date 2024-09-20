import { create } from "zustand";

type NewTaskState = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useNewTask = create <NewTaskState>((set) => ({
    isOpen: false,
    onOpen: () => set( {isOpen: true}),
    onClose: () => set({ isOpen: false}),
}));