"use client"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import {Checkbox} from "@/components/ui/checkbox"
import { table } from "console"
import { InferResponseType } from "hono"
import { client } from "@/lib/hono"
import { usedeletetask } from "@/features/accounts/api/use-delete-task"
export type ResponseType = InferResponseType<typeof client.api.tasks.$get, 200>["data"][0]  ;

export const columns: ColumnDef<ResponseType>[] = [
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
      const { mutate } = usedeletetask();
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
    accessorKey: "name",
    header: "Tasks",
  },
  // ...
]