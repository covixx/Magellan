"use client" 
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface HabitDay {
  date: string;
  done: boolean;
}

interface Habit {
  id: string;
  name: string;
  days: HabitDay[];
}

const DAYS_OF_WEEK = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const HabitsTracker: React.FC = () => {
  const [newHabit, setNewHabit] = useState('');
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

  const addHabit = async () => {
    if (newHabit.trim() !== '') {
      try {
        const response = await fetch('/api/habits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newHabit,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create new habit');
        }

        const data: Habit = await response.json();
        setHabits(prevHabits => [...prevHabits, data]);
        setNewHabit('');
      } catch (error) {
        console.error('Error creating new habit:', error);
      }
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

  const getDateString = (dayOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    return date.toISOString().split('T')[0];
  };

  const isDayDone = (habit: Habit, date: string) => {
    return habit.days.some(day => day.date === date && day.done);
  };

  return (
    <Card className="w-full h-screen flex flex-col">
      <CardHeader>
        <CardTitle>Habits Tracker</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="flex space-x-2 mb-4">
          <Input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Enter a new habit"
            className="flex-grow"
          />
          <Button onClick={addHabit}>Add</Button>
        </div>
        <div className="overflow-x-auto flex-grow">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Habit</th>
                {DAYS_OF_WEEK.map((day, index) => (
                  <th key={day} className="px-4 py-2">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => (
                <tr key={habit.id}>
                  <td className="px-4 py-2 font-semibold">{habit.name}</td>
                  {DAYS_OF_WEEK.map((_, index) => {
                    const date = getDateString(index);
                    const done = isDayDone(habit, date);
                    return (
                      <td key={date} className="px-4 py-2">
                        <Button
                          variant={done ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0 rounded-full"
                          onClick={() => toggleHabit(habit.id, date)}
                        >
                          {done ? '✓' : ''}
                        </Button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitsTracker;