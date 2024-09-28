"use client"
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSettingsData } from '@/features/settings/use-get-settings';
import { useUpdateSettings } from '@/features/settings/use-update-settings';

type Goal = "mildWeightGain" | "weightLoss" | "maintainWeight" | "mildWeightLoss" | "weightGain";

type FormData = {
  spotifyLink: string;
  height: number | 0;
  weight: number | 0;
  goal: Goal;
  workoutDays: number | 0;
  age: number | 0;
};

const Settings: React.FC = () => {
  const { data: settingsData, isLoading } = useSettingsData();
  const updateSettings = useUpdateSettings();

  const [formData, setFormData] = useState<FormData>({
    spotifyLink: '',
    height: 0,
    weight: 0,
    goal: 'maintainWeight',
    workoutDays: 0,
    age: 0,
  });

  useEffect(() => {
    if (settingsData && 'data' in settingsData && settingsData.data) {
      setFormData({
        spotifyLink: settingsData.data.spotifyLink || '',
        height: settingsData.data.height || 0,
        weight: settingsData.data.weight || 0,
        goal: (settingsData.data.goal as Goal) || 'maintainWeight',
        workoutDays: settingsData.data.workoutDays || 0,
        age: settingsData.data.age || 0,
      });
    }
  }, [settingsData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'spotifyLink' ? value : value === '' ? null : Number(value),
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, goal: value as Goal }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateSettings.mutateAsync({
        spotifyLink: formData.spotifyLink,
        height: formData.height,
        weight: formData.weight,
        goal: formData.goal,
        workoutDays: formData.workoutDays,
        age: formData.age,
      });
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  if (isLoading) {
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
            value={formData.spotifyLink}
            onChange={handleChange}
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
            value={formData.height ?? ''}
            onChange={handleChange}
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
            value={formData.weight ?? ''}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
            Goal
          </label>
          <Select value={formData.goal} onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mildWeightGain">Mild Weight Gain</SelectItem>
              <SelectItem value="weightGain">Weight Gain</SelectItem>
              <SelectItem value="maintainWeight">Maintain Weight</SelectItem>
              <SelectItem value="mildWeightLoss">Mild Weight Loss</SelectItem>
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
            value={formData.workoutDays ?? ''}
            onChange={handleChange}
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
            value={formData.age ?? ''}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <Button type="submit" disabled={updateSettings.isPending}>
          {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
};

export default Settings;