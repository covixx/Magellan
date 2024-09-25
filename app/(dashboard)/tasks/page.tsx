"use client" 
import React, { useState, useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Bold, Italic, List, ListOrdered, CheckSquare } from "lucide-react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { useGetTasks } from "@/features/accounts/api/use-get-tasks";
import { Skeleton } from "@/components/ui/skeleton";
import { usedeletetask } from "@/features/accounts/api/use-delete-task";
import { usecreatetask } from "@/features/accounts/api/use-create-tasks";
import { useUpdateTask } from "@/features/accounts/api/use-update-task";

const TasksPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const createtask = usecreatetask();
    const updatetask = useUpdateTask();
    const taskquery = useGetTasks(selectedDate);
    const deletetask = usedeletetask();
    const task = taskquery.data?.[0];
    const isdisabled = taskquery.isLoading || deletetask.isPending;

    const editor = useEditor({
        extensions: [
            StarterKit,
            TaskList.configure({
                itemTypeName: 'taskItem',
                HTMLAttributes: {
                    class: 'task-list',
                },
            }),
            TaskItem.configure({
                nested: true,
                HTMLAttributes: {
                    class: 'task-item',
                },
            }),
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose max-w-none flex-grow outline-none color-',
            },
           
        },
    });

    useEffect(() => {
        if (editor && task) {
            editor.commands.setContent(task.content);
        }
    }, [editor, task]);

    const handleSaveTask = useCallback(() => {
        if (editor) {
            const content = editor.getHTML();
            if (content.trim().length > 0) {
                if (task) {
                    updatetask.mutate({ id: task.id, content: content.trim() }, {
                        onSuccess: () => {
                            taskquery.refetch();
                        }
                    });
                } else {
                    createtask.mutate({ content: content.trim() }, {
                        onSuccess: () => {
                            taskquery.refetch();
                        }
                    });
                }
            }
        }
    }, [editor, createtask, updatetask, task, taskquery]);

    const getPreviousDate = () => {
        const currentDate = new Date(selectedDate);
        const yesterday = new Date(currentDate);
        yesterday.setDate(currentDate.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    };

    const handleFetchYesterday = () => {
        const yesterdayDate = getPreviousDate();
        setSelectedDate(yesterdayDate);
    };

    useEffect(() => {
        taskquery.refetch();
    }, [selectedDate, taskquery]);

    if (taskquery.isLoading) {
        return (
            <div className="max-w-screen-2xl mx-auto w-full pb-10">
                <Card className="border-none drop-shadow-sm">
                    <CardHeader>
                        <Skeleton className="h-8 w-48"/>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[calc(100vh-200px)] w-full flex items-center justify-center">
                            <Loader2 className="size-6 text-slate-400 animate-spin"/>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        What's on your mind?
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button onClick={handleFetchYesterday} size="sm">
                            Fetch Yesterday's Notes
                        </Button>
                        <Button onClick={handleSaveTask} size="sm" disabled={!editor || editor.isEmpty || createtask.isPending || updatetask.isPending}>
                            {(createtask.isPending || updatetask.isPending) ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Plus className="size-4 mr-2" />}
                            {task ? 'Update' : 'Add new'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="h-[calc(100vh-200px)]">
                    <div className="border rounded-md p-2 mb-4 h-full flex flex-col">
                        <div className="flex gap-2 mb-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => editor?.chain().focus().toggleBold().run()}
                                disabled={!editor?.can().chain().focus().toggleBold().run()}
                                className={editor?.isActive('bold') ? 'is-active' : ''}
                            >
                                <Bold className="size-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => editor?.chain().focus().toggleItalic().run()}
                                disabled={!editor?.can().chain().focus().toggleItalic().run()}
                                className={editor?.isActive('italic') ? 'is-active' : ''}
                            >
                                <Italic className="size-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => editor?.chain().focus().toggleCode().run()}
                                className={editor?.isActive('bulletList') ? 'is-active' : ''}
                            >
                                <List className="size-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                                className={editor?.isActive('code') ? 'is-active' : ''}
                            >
                                <ListOrdered className="size-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => editor?.chain().focus().toggleTaskList().run()}
                                className={editor?.isActive('taskList') ? 'is-active' : ''}
                            >
                                <CheckSquare className="size-4" />
                            </Button>
                        </div>
                        {editor && <EditorContent editor={editor} />}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TasksPage;