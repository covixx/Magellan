"use client";
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

const Settings = () => {
  const [spotifyLink, setSpotifyLink] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('');
  const [workoutDays, setWorkoutDays] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    // Load the saved Spotify link when the component mounts
    const savedLink = localStorage.getItem('spotifyLink');
    if (savedLink) {
      setSpotifyLink(savedLink);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Save the Spotify link to localStorage
    localStorage.setItem('spotifyLink', spotifyLink);
    alert('Settings saved!');
  };

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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeight(e.target.value)}
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
          <Select
  name="goal"
  value={goal}
  onValueChange={(value: string) => setGoal(value)}
>
  <option value="">Select a goal</option>
  <option value="mildWeightGain">Mild Weight Gain</option>
  <option value="weightLoss">Weight Loss</option>
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

        <Button type="submit">Save Settings</Button>
      </form>
    </div>
  );
};

export default Settings;