"use client"
import { Nutrition } from "@/app/(dashboard)/nutrition/columns"
import { Button } from "@/components/ui/button"
import * as React from "react"
import { ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    SortingState,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    getFilteredRowModel,
    ColumnFiltersState,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
    
} from "@/components/ui/table"


interface MealTable <TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function MealTable<TData, TValue>({
    columns,
    data,
  }: MealTable<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
      )
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    })
   
    return (
      <div>
        <div className="flex items-center py-4">
        <Input
          placeholder="Search for date or foods"
          value={(table.getColumn("food")?.getFilterValue() as string?? "")}
          onChange={(event) =>
            table.getColumn("food")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
        <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      </div>
    )
  }