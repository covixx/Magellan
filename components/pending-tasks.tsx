import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Loader2, BookOpen, Calculator, Activity, CheckCircle2, Theater, Brain, Video, BugIcon, Wrench, MonitorCog, Monitor } from "lucide-react";
import { useGetTasks } from "@/features/accounts/api/use-get-tasks";
import { useTheme } from "next-themes";
interface TaskNode {
  type: string;
  attrs?: {
    checked?: boolean;
  };
  content?: TaskNode[];
  text?: string;
  marks?: { type: string; attrs: { href: string } }[];
}

interface TaskContent {
  type: string;
  content: TaskNode[];
}

const UncheckedTasks: React.FC = () => {
const { theme, setTheme } = useTheme();
  const [uncheckedTasks, setUncheckedTasks] = useState<string[]>([]);
  const today = new Date().toISOString().split("T")[0];
  const { data: taskData, isLoading, error } = useGetTasks(today);

  useEffect(() => {
    if (taskData && taskData[0]) {
      try {
        const content = JSON.parse(taskData[0].content) as TaskContent;
        const extractedTasks = extractUncheckedTasks(content);
        setUncheckedTasks(extractedTasks);
      } catch (error) {
        console.error("Error parsing task content:", error);
      }
    }
  }, [taskData]);

  const extractUncheckedTasks = (json: TaskContent): string[] => {
    const tasks: string[] = [];
    const traverse = (node: TaskNode) => {
      if (node.type === "taskItem" && node.attrs && !node.attrs.checked) {
        let taskText = "";
        if (node.content) {
          node.content.forEach((contentNode) => {
            if (contentNode.type === "paragraph" && contentNode.content) {
              contentNode.content.forEach((textNode) => {
                if (textNode.type === "text") {
                  taskText += textNode.text;
                  if (
                    textNode.marks &&
                    textNode.marks.some((mark) => mark.type === "link")
                  ) {
                    const link = textNode.marks.find(
                      (mark) => mark.type === "link"
                    );
                    if (link && link.attrs && link.attrs.href) {
                      taskText += ` (${link.attrs.href})`;
                    }
                  }
                }
              });
            }
          });
        }
        if (taskText) {
          tasks.push(taskText);
        }
      }
      if (node.content) {
        node.content.forEach(traverse);
      }
    };
    json.content.forEach(traverse);
    return tasks;
  };

  const getIconForTask = (task: string) => {
    if (task.toLowerCase().includes("lecture")) {
      return <Video className="text-blue-500" />;
    } else if (task.toLowerCase().includes("numbers")) {
      return <Calculator className="text-green-500" />;
    } else if (task.toLowerCase().includes("lr")) {
      return <Brain className="text-orange-500" />;
    } else if (task.toLowerCase().includes("varc")) {
      return <BookOpen className="text-purple-500" />;
    }
    else if (task.toLowerCase().includes("bug")) {
        return <BugIcon className="text-purple-500" />;
      }
      else if (task.toLowerCase().includes("settings")) {
        return <Wrench className="text-orange-500" />;
      }
      else if (task.toLowerCase().includes("dashboard")) {
        return <Monitor className="text-blue-500" />;
      }
      
    return <CheckSquare className="text-gray-600" />;
  };

  if (isLoading) {
    return (
      <Card className="w-full -ml-14 mr-72 h-[30rem] flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-lg">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full -ml-14 mr-72 h-[30rem] flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-lg">
        <p>Error loading tasks</p>
      </Card>
    );
  }

  return (
    <Card className= "w-[45vw] h-[27vw] shadow-lg bg-inherit rounded-lg ">
      <CardHeader className="text-center py-4">
      <CardTitle className={`text-2xl ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'} font-semibold`}>
      Pending Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto h-[calc(100%-4rem)] p-4">
        {uncheckedTasks.length > 0 ? (
          <ul className="space-y-4">
            {uncheckedTasks.map((task, index) => (
              <li
              key={index}
              className="flex items-center space-x-3 p-2 bg-inherit  rounded-md shadow-mdtransition-transform transform hover:scale-105 overflow-y-hidden"
            >
                <div className="flex-shrink-0">{getIconForTask(task)}</div>
                <span className="${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'} font-medium">{task}</span>
                
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-lg font-medium text-gray-600">
            You're all wrapped up!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default UncheckedTasks;
