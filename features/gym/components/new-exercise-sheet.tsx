import React from 'react';
import { useForm } from 'react-hook-form';
import { useCreateExercise } from '../api/use-create-exercise';
import { useUser } from "@clerk/nextjs";  // Import the useUser hook

// Assuming you have a Button and Input component
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type FormData = {
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  muscle: string;
};

export const NewExerciseSheet = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const mutation = useCreateExercise();
  const { user } = useUser();  // Get the current user

  const onSubmit = (data: FormData) => {
    if (user?.id) {
      const exerciseWithUserId = {
        ...data,
        userId: user.id
      };

      mutation.mutate(exerciseWithUserId, {
        onSuccess: () => {
          console.log('Exercise added successfully');
          reset();  // Reset the form after successful submission
        },
        onError: (error) => {
          console.error('Error adding exercise:', error);
        }
      });
    } else {
      console.error('User ID is not available');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('exercise')} placeholder="Exercise name" required />
      <Input {...register('sets', { valueAsNumber: true })} placeholder="Sets" type="number" required />
      <Input {...register('reps', { valueAsNumber: true })} placeholder="Reps" type="number" required />
      <Input {...register('weight', { valueAsNumber: true })} placeholder="Weight" type="number" required />
      <Input {...register('muscle')} placeholder="Muscle group" required />
      <Button type="submit">Add Exercise</Button>
    </form>
  );
};