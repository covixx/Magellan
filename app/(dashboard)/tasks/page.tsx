    "use client";
    import { Button } from "@/components/ui/button";
    import { Loader2, Plus } from "lucide-react";
    import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card";
    import { useNewTask } from "@/features/accounts/hooks/use-new-task";
    import { columns } from "@/app/(dashboard)/tasks/columns"
    import { DataTable } from "@/components/data-table";
    import { useGetTasks } from "@/features/accounts/api/use-get-tasks";
    import { Skeleton } from "@/components/ui/skeleton";
    import { usedeletetask } from "@/features/accounts/api/use-delete-task";

    const TasksPage = () => {
        
        const newtask = useNewTask();
        const taskquery = useGetTasks();
        const deletetask = usedeletetask();
        const tasks = taskquery.data || []; 
        const isdisabled = taskquery.isLoading || deletetask.isPending;
        if(taskquery.isLoading) {
            return (
                <div className="max-w-screen-2xl mx-auto w-full pb-10">
                    <Card className="border-none drop-shadow-sm">
                        <CardHeader>
                            <Skeleton className="h-8 w-48"/>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[500px] w-full flex items-center justify-center">
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
                        Tasks
                    </CardTitle>
                    <Button onClick={newtask.onOpen} size="sm">
                        <Plus className="size-4 mr-2"/>
                            Add new 
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={tasks} onClick={(row)=>{
                        deletetask.mutate({ id: [row[0].id] });
                    }} disabled = {isdisabled} />
                </CardContent>
                </Card>
                
            </div>
        );
    };
    export default TasksPage;