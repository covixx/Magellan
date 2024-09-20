import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FocusTimeData {
  date: string;
  focusTime: number;
}

interface GymData {
  muscle: string;
  data: { date: string; weight: number }[];
}

interface TodoItem {
  name: string;
}

const DashboardCharts: React.FC = () => {
  const [focusTimeData, setFocusTimeData] = useState<FocusTimeData[]>([]);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [caloriesGoal] = useState(2000); // Set your default goal here
  const [gymData, setGymData] = useState<GymData[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [todoList, setTodoList] = useState<TodoItem[]>([]);

  useEffect(() => {
    // Fetch focus time data
    const fetchFocusTimeData = async () => {
      // Replace with your actual API call
      const response = await fetch('/api/focustime');
      const data: FocusTimeData[] = await response.json();
      setFocusTimeData(data);
    };

    // Fetch calories consumed
    const fetchCaloriesConsumed = async () => {
      // Replace with your actual API call
      const response = await fetch('/api/calories');
      const data: { total: number } = await response.json();
      setCaloriesConsumed(data.total);
    };

    // Fetch gym data
    const fetchGymData = async () => {
      // Replace with your actual API call
      const response = await fetch('/api/gym');
      const data: GymData[] = await response.json();
      setGymData(data);
    };

    // Fetch todo list
    const fetchTodoList = async () => {
      // Replace with your actual API call
      const response = await fetch('/api/todo');
      const data: TodoItem[] = await response.json();
      setTodoList(data);
    };

    fetchFocusTimeData();
    fetchCaloriesConsumed();
    fetchGymData();
    fetchTodoList();
  }, []);

  const caloriesData = [
    {
      name: 'Calories',
      value: (caloriesConsumed / caloriesGoal) * 100,
      fill: '#8884d8',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Focus Time (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={focusTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="focusTime" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calories Consumed Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="60%" 
                outerRadius="80%" 
                barSize={10} 
                data={caloriesData}
                startAngle={180} 
                endAngle={0}
              >
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={30}
                  fill="#8884d8"
                />
                <Legend iconSize={0} width={120} height={140} layout="vertical" verticalAlign="middle" align="right" />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
              <p className="text-2xl font-bold">{caloriesConsumed} / {caloriesGoal}</p>
              <p className="text-sm text-gray-500">Calories</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gym Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedMuscle}>
            <SelectTrigger>
              <SelectValue placeholder="Select muscle" />
            </SelectTrigger>
            <SelectContent>
              {gymData.map(item => (
                <SelectItem key={item.muscle} value={item.muscle}>{item.muscle}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedMuscle && (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={gymData.find(item => item.muscle === selectedMuscle)?.data || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            {todoList.map((todo, index) => (
              <li key={index}>{todo.name}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;