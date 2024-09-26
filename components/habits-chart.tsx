import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X } from 'lucide-react'

interface HabitDay {
  date: string;
  done: boolean;
}

interface Habit {
  id: string;
  name: string;
  days: HabitDay[];
}

const TodayHabits: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits');
      if (!response.ok) {
        throw new Error('Failed to fetch habits');
      }
      const data = await response.json();
      setHabits(data);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const toggleHabit = async (habitId: string, date: string) => {
    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update habit');
      }

      const updatedHabit: Habit = await response.json();
      
      setHabits(prevHabits => 
        prevHabits.map(habit => 
          habit.id === habitId ? updatedHabit : habit
        )
      );
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const isDayDone = (habit: Habit, date: string) => {
    return habit.days.some(day => day.date === date && day.done);
  };

  const todayHabits = habits.map(habit => ({
    ...habit,
    done: isDayDone(habit, getTodayString())
  }));

  return (
    <Card className="w-full h-full shadow-lg">
      <CardHeader>
        <CardTitle>Today&rsquo;s Habits</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {todayHabits.map(habit => (
            <li key={habit.id} className="flex items-center px-4">
              <span>{habit.name}</span>
              <Button
                variant={habit.done ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => toggleHabit(habit.id, getTodayString())}
              >
                {habit.done ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TodayHabits;