"use client"
import { ColumnDef } from "@tanstack/react-table"
import { InferResponseType } from "hono"
import { client } from "@/lib/hono"
import {Checkbox} from "@/components/ui/checkbox"
import { format } from 'date-fns'
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { usedeletemeal } from "@/features/nutrition/api/use-delete-meal"
export type Nutrition = {
  id: string, 
  name: string,
  calories: number,
  protein: number, 
  fats: number,
  carbs: number,  
  date: string,
}
export const columns: ColumnDef<Nutrition>[] = [
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
      const { mutate } = usedeletemeal();
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return format(date, 'dd-MM-yyyy');
    },
  },
  {
    accessorKey: "name",
    header: "Food",
  },
  {
    accessorKey: "calories",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          KCal 
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "protein",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Proteins (g)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "carbs",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Carbs (g)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "fats",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fats (g)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
]