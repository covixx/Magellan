"use client";
import { Workout, columns } from "./columns"
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card";
import { NewExerciseSheet } from "@/features/gym/components/new-exercise-sheet";
import { useNewExercise } from "@/features/gym/hooks/use-new-exercise";
import { useGetExercises } from "@/features/gym/api/use-get-exercise";
import { usedeleteexercise } from "@/features/gym/api/use-delete-exercise";
import { GymTable } from "@/components/gym-table";
import WorkoutParser from '@/components/workout-parser';

const GymPage = () => {
  const newexercise = useNewExercise();
  const exercisequery = useGetExercises();
  const deleteexercise = usedeleteexercise();
  const exercises = exercisequery.data || [];
  const isdisabled = exercisequery.isLoading || exercisequery.isPending;

  if (exercisequery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-400 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 space-y-6">
      
      
      <Card className="border-none drop-shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Enter your workouts</CardTitle>
          <CardDescription>Add workouts in the specified format</CardDescription>
        </CardHeader>
        <CardContent>
          <WorkoutParser />
          <GymTable columns={columns} data={exercises}/>
        </CardContent>
      </Card>
    </div>
  );
};
/*<Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Workout Tracker
          </CardTitle>
          <Button onClick={newexercise.onOpen} size="sm">
            <Plus className="size-4 mr-2"/>
            Log Exercise
          </Button>
        </CardHeader>
        <CardContent>
          <GymTable columns={columns} data={exercises}/>
          <NewExerciseSheet/>
        </CardContent>
      </Card>*/
export default GymPage;