import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GymTable } from "@/components/gym-table";  // Assuming GymTable is in a separate file
import { columns, Workout } from "@/app/(dashboard)/gym/columns";  // Assuming columns and Workout type are defined in columns.ts
import { useCreateExercise } from "@/features/gym/api/use-create-exercise";
import { useUser } from "@clerk/nextjs";
 const WorkoutParser = () => {
 const mutation = useCreateExercise();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [inputText, setInputText] = useState('');
  const { user } = useUser();
  const parseWorkout = (text: string): Workout[] => {
    const lines = text.trim().split('\n').filter(line => line !== '');
    return lines.map((line, index) => {
      const [setReps, ...exerciseParts] = line.split(' ');
      const repsAndWeights = setReps.split(/\s*x\s*/);
    const weight = repsAndWeights[1];
      const exercise = exerciseParts.join(' ');
      let sets = 1;
      let modreps = 1;
      let reps: number = parseInt(setReps.split('x')[0], 10);
    if (reps % 8 === 0) {
        sets = reps / 8;
        modreps = 8;
    }
      else if (reps % 10 === 0) {
      sets = reps / 10;
      modreps = 10;
    } else if (reps % 12 === 0) {
      sets = reps / 12;
      modreps = 12;
    } else if (reps % 15 === 0) {
      sets = reps / 15;
      modreps = 15;
    }

      // Simple logic to determine muscle group - you might want to enhance this
      const muscle = exercise.toLowerCase().includes('bench') ? 'Chest' :
                     exercise.toLowerCase().includes('chest') ? 'Chest' :
                     exercise.toLowerCase().includes('curl') ? 'Biceps' :
                     exercise.toLowerCase().includes('curls') ? 'Biceps' :
                     exercise.toLowerCase().includes('tricep') ? 'Triceps' :
                     exercise.toLowerCase().includes('shoulder') ? 'Shoulders' :
                     exercise.toLowerCase().includes('row') ? 'Back' :
                     exercise.toLowerCase().includes('rows') ? 'Back' :
                     exercise.toLowerCase().includes('pullup') ? 'Lats' :
                     exercise.toLowerCase().includes('pulldown') ? 'Lats' :
                     exercise.toLowerCase().includes('lat') ? 'Lats' :
                     exercise.toLowerCase().includes('raises') ? 'Delts' :
                     exercise.toLowerCase().includes('pushups') ? 'Chest' :
                    
                     exercise.toLowerCase().includes('facepull') ? 'Traps' :
                     exercise.toLowerCase().includes('fly') ? 'Chest' :
                     exercise.toLowerCase().includes('reverse fly') ? 'Shoulders' :
                     exercise.toLowerCase().includes('reverse pec') ? 'Shoulders' :
                     'Other';

      return {
        id: `workout-${Date.now()}-${index}`,
        exercise: exercise.toLocaleUpperCase(),
        sets: sets,
        reps: modreps,
        muscle,
        weight: parseInt(weight),
        date: new Date().toISOString(),
      };
    });
  };

  const handleParseAndAdd = () => {
    const sanitizedInput = inputText.replace(/\n+/g, ' ').trim();
    const newWorkouts = parseWorkout(inputText);
    
    newWorkouts.forEach((workout) => {
      if (user?.id) {
        const workoutWithUserId = {
          ...workout,
          userId: user.id  // Add the userId to the workout data
        };
        
        mutation.mutate(workoutWithUserId, {
          onSuccess: () => {
            console.log('Workout added to DB:', workoutWithUserId);
          },
          onError: (error) => {
            console.error('Error adding workout:', error);
          },
        });
      } else {
        console.error('User ID is not available');
      }
    });

    setWorkouts([...workouts, ...newWorkouts]);
    setInputText('');
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Format: total reps x weight per set name of exercise (e.g. 36x40 pulldowns if you did 3 sets of 12 reps)"
        className="min-h-[100px]"
      />
      <Button onClick={handleParseAndAdd}>Add Workout</Button>
      
    </div>
  );
};

export default WorkoutParser;