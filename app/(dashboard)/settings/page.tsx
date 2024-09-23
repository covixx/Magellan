"use client";
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

const Settings = () => {
  const [spotifyLink, setSpotifyLink] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('');
  const [workoutDays, setWorkoutDays] = useState('');
  const [age, setAge] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const settings = await response.json();
          setSpotifyLink(settings.spotifyLink || '');
          setHeight(settings.height?.toString() || '');
          setWeight(settings.weight?.toString() || '');
          setGoal(settings.goal || '');
          setWorkoutDays(settings.workoutDays?.toString() || '');
          setAge(settings.age?.toString() || '');
        } else {
          throw new Error('Failed to fetch settings');
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error("Failed to update settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spotifyLink,
          height: parseFloat(height),
          weight: parseFloat(weight),
          goal,
          workoutDays: parseInt(workoutDays),
          age: parseInt(age),
        }),
      });

      if (response.ok) {
        toast.success("Saved settings successfully!");
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error("Failed to update settings");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-bold mb-2">Locking In</h2>
        <div>
          <label htmlFor="spotifyLink" className="block text-sm font-medium text-gray-700">
            Spotify Playlist Link
          </label>
          <Input
            type="text"
            id="spotifyLink"
            value={spotifyLink}
            onChange={(e) => setSpotifyLink(e.target.value)}
            placeholder="https://open.spotify.com/playlist/..."
            className="mt-1"
          />
        </div>

        <h2 className="text-lg font-bold mb-2">Nutrition</h2>
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700">
            Height (in cm)
          </label>
          <Input
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
            Weight (in kg)
          </label>
          <Input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
            Goal
          </label>
          <Select value={goal} onValueChange={setGoal}>
            <SelectTrigger>
              <SelectValue placeholder="Select a goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mildWeightGain">Mild Weight Gain</SelectItem>
              <SelectItem value="weightLoss">Weight Loss</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="workoutDays" className="block text-sm font-medium text-gray-700">
            Workout Days per Week
          </label>
          <Input
            type="number"
            id="workoutDays"
            value={workoutDays}
            onChange={(e) => setWorkoutDays(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
            Age
          </label>
          <Input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-1"
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
};

export default Settings;