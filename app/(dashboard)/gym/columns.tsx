"use client"
import { ColumnDef } from "@tanstack/react-table"
import { InferResponseType } from "hono"
import { client } from "@/lib/hono"
import {Checkbox} from "@/components/ui/checkbox"
import { format } from 'date-fns'
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { usedeleteexercise } from "@/features/gym/api/use-delete-exercise"
export type Workout = {
  date: string,
  id: string, 
  exercise: string,
  sets: number,
  reps: number, 
  weight: number,
  muscle: string,
}

export const columns: ColumnDef<Workout>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => {
      const { mutate } = usedeleteexercise();
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            if (value) {
              
              mutate({ id: [row.original.id]  });
            } else {
              row.toggleSelected(!!value);
            }
          }}
          aria-label="Select row"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return format(date, 'dd-MM-yyyy');
    },
  },
  {
    accessorKey: "exercise",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Exercise 
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "sets",
    header: "Sets",
  },
  {
    accessorKey: "reps",
    header: "Reps",
  },
  {
    accessorKey: "muscle",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Muscle 
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "weight",
    header: "Weight",
  },
]