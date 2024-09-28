"use client" 
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Bold, Italic, List, ListOrdered, CheckSquare, Heading1, Heading2, Heading3, Link2, Image as ImageIcon, Code2 } from "lucide-react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { useGetTasks } from "@/features/accounts/api/use-get-tasks";
import { Skeleton } from "@/components/ui/skeleton";
import { usedeletetask } from "@/features/accounts/api/use-delete-task";
import { usecreatetask } from "@/features/accounts/api/use-create-tasks";
import { useUpdateTask } from "@/features/accounts/api/use-update-task";
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'
import Code from '@tiptap/extension-code'
import Heading from '@tiptap/extension-heading'
import Link from "@tiptap/extension-link"
import Image from '@tiptap/extension-image'

const lowlight = createLowlight(all)

const TasksPage: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const createtask = usecreatetask();
    const updatetask = useUpdateTask();
    const taskquery = useGetTasks(selectedDate);
    const deletetask = usedeletetask();
    const task = taskquery.data?.[0];
    const isdisabled = taskquery.isLoading || deletetask.isPending;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Heading.configure({
                levels: [1,2,3],
            }),
            TaskList.configure({
                HTMLAttributes: {
                    class: 'tw-inline-flex',
                },
            }),
            TaskItem.configure({
                nested: true,
                HTMLAttributes: {
                    class: 'task-item tw-inline-flex',
                },
            }),
            CodeBlockLowlight.configure({
                defaultLanguage: 'plaintext',
                lowlight: lowlight,
            }),
            Code,
            Link.configure({
                openOnClick: true,
                linkOnPaste: true,
                autolink: true,
                defaultProtocol: 'https',
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: {
                    class: "image",
                }
            }),
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose max-w-none flex-grow outline-none overflow-y-auto',
            },
        },
        immediatelyRender: false,
    });

    useEffect(() => {
        if (editor && taskquery.data !== undefined) {
            if (task) {
                try {
                    const contentObject = JSON.parse(task.content);
                    editor.commands.setContent(contentObject);
                } catch (error) {
                    console.error('Error parsing task content:', error);
                    editor.commands.setContent(task.content);
                }
            } else {
                editor.commands.setContent('');
            }
        }
    }, [editor, task, taskquery.data]);
    useEffect(() => {
        taskquery.refetch();
    }, [selectedDate, taskquery]);
    
    const handleSaveTask = useCallback(() => {
        if (editor) {
            const content = JSON.stringify(editor.getJSON());
            if (content.length > 2) {  // Check if it's not just an empty object "{}"
                if (task) {
                    updatetask.mutate({ id: task.id, content: content }, {
                        onSuccess: () => {
                            taskquery.refetch();
                        }
                    });
                } else {
                    createtask.mutate({ content: content}, {
                        onSuccess: () => {
                            taskquery.refetch();
                        }
                    });
                }
            }
        }
    }, [editor, createtask, updatetask, task, taskquery]);

    const handleImageUpload = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            const imageDataUrl = e.target?.result;
            if (typeof imageDataUrl === 'string') {
                editor?.chain().focus().setImage({ src: imageDataUrl }).run();
            }
        };
        reader.readAsDataURL(file);
    }, [editor]);

    const handleFileSelect = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    }, [handleImageUpload]);

    

    const getPreviousDate = () => {
        const currentDate = new Date(selectedDate);
        const yesterday = new Date(currentDate);
        yesterday.setDate(currentDate.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    };

    const handleFetchYesterday = () => {
        const currentDate = new Date(selectedDate);
        const yesterday = new Date(currentDate);
        yesterday.setDate(currentDate.getDate() - 1);
        const yesterdayDate = yesterday.toISOString().split('T')[0];
        setSelectedDate(yesterdayDate);
    };
    const setLink = useCallback(() => {
        const previousUrl = editor?.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)
    
        // cancelled
        if (url === null) {
          return
        }
    
        
        if (url) {
            editor?.chain().focus().extendMarkRange('link').unsetLink()
        }
        // update link
        editor?.chain().focus().extendMarkRange('link').setLink({ href: url })
          .run()
      }, [editor])
    
      if (!editor) {
        return null
      }
    

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
        <div className="max-w-screen-2xl mx-auto w-full h-screen flex flex-col bg-transparent">
            <Card className="border-none drop-shadow-sm flex-grow flex flex-col overflow-hidden bg-transparent">
                <CardHeader className="flex-shrink-0 gap-y-2 lg:flex-row lg:items-stretch lg:justify-between bg-transparent">
                    <CardTitle className="text-xl line-clamp-1">
                        What&apos;s on your mind?
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button onClick={handleFetchYesterday} size="sm">
                            Fetch Yesterday&apos;s Notes
                        </Button>
                        <Button onClick={handleSaveTask} size="sm" disabled={!editor || editor.isEmpty || createtask.isPending || updatetask.isPending}>
                            {(createtask.isPending || updatetask.isPending) ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Plus className="size-4 mr-2" />}
                            {task ? 'Update' : 'Add new'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col overflow-hidden">
                    <div className="border rounded-md mb-4 flex-grow flex flex-col overflow-hidden">
                        <div className="flex gap-2 mb-2 justify-start p-3">
                                                <Button
                                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                                    className={`is-active ${editor?.isActive('heading', { level: 1 }) ? 'is-active' : ''} padding-3`}
                                >
                                    <Heading1 className="size-3" />
                                </Button>
                                <Button
                                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                                    className={editor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                                >
                                   <Heading2 className="size-3" />
                                </Button>
                                <Button
                                    onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                                    className={editor?.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                                >
                                    <Heading3 className="size-3" />
                                </Button >
                                                    <Button
                                
                                onClick={() => editor?.chain().focus().toggleBold().run()}
                                disabled={!editor?.can().chain().focus().toggleBold().run()}
                                className={editor?.isActive('bold') ? 'is-active' : ''}
                            >
                                <Bold className="size-3" />
                            
                            </Button>
                            <Button
                               
                                onClick={() => editor?.chain().focus().toggleItalic().run()}
                                disabled={!editor?.can().chain().focus().toggleItalic().run()}
                                className={editor?.isActive('italic') ? 'is-active' : ''}
                            >
                                <Italic className="size-3" />
                            </Button>
                            <Button
                                
                                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                                className={editor?.isActive('codeBlock') ? 'is-active' : ''}
                            >
                                <Code2 className="size-3" />
                            </Button>
                            <Button
                               
                                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                                className={editor?.isActive('code') ? 'is-active' : ''}
                            >
                                <ListOrdered className="size-3" />
                            </Button>
                            <Button
                                
                                onClick={() => editor?.chain().focus().toggleTaskList().run()}
                                className={editor?.isActive('taskList') ? 'is-active' : ''}
                            >
                                <CheckSquare className="size-3" />
                            </Button>
                            <Button
                                
                                onClick={setLink} className={editor.isActive('link') ? 'is-active' : ''}
                            >
                                <Link2 className="size-3" />
                            </Button>
                            <Button
                                onClick={handleFileSelect}
                                className={editor?.isActive('image') ? 'is-active' : ''}
                            >
                                <ImageIcon className="size-3" />
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </div>
                        <div className="editor-content px-2 flex-grow overflow-y-auto" onClick={() => editor?.chain().focus().run()}>
                        {editor && <EditorContent editor={editor} />}
                    </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
export default TasksPage;