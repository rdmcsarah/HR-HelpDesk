"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"


import { z } from "zod";

type Request={

  id  :number    ;     
  title :string;       
  description  :string;
  requestType  :string;
  status        :string;
  createdAt    :Date;
  updatedAt    :Date;
  closedAt    : Date;
  comments     :  string[];
  assignedToId:number;
  userId  :string    
  assignedTo  :string;
           

}

export const schema = z.object({

  id  :z.number() ,    
  title :z.string(),       
  description  :z.string(),
  requestType  :z.string(),
  status        :z.string(),
  createdAt    :z.date(),
  updatedAt   :z.date(),
  closedAt    :z.date(),
  comments     :  z.array(z.string()),
  assignedToId:z.number() ,
  userId  :z.string(),  
  assignedTo :z.string(),
           

});

const createColumns = (empcode: string): ColumnDef<z.infer<typeof schema>>[] => [

  {
    accessorKey: "title",
    header: "Request",
    cell: ({ row }) => (
      <div className="capitalize">{row.index+1}</div>
    ),
  },
    {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div>{row.original.id}</div>,
    enableHiding: true,
  },
  {
    accessorKey: "requestType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Request Type
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.original?.requestType}</div>,
  },
  {
    accessorKey: "status",
    header: () => <div>Status</div>,
    cell: ({ row }) => {
      const status = row.original.status;
      let colorClass = "";
  
      switch (status) {
        case "COMPLETED":
          colorClass = "text-green-600";
          break;
        case "PENDING":
          colorClass = "text-yellow-500"; // or 'text-amber-500'
          break;
        case "REJECTED":
          colorClass = "text-red-700";
          break;
        default:
          colorClass = "text-gray-500"; // Fallback for unknown statuses
      }
  
      return <span className={`font-medium ${colorClass}`}>{status}</span>;
    },
    enableHiding: true
  },
  {
    accessorKey: "createdAt",
    header: "createdAt",
    cell: ({ row }) => {
      const raw = row.original?.createdAt
      const date = raw instanceof Date ? raw : new Date(raw)
      return <div>{date.toLocaleDateString()}</div>
    },

     
    
  },

  {
    accessorKey: "closedAt",
    header: "ClosedAt",
    cell: ({ row }) => {
      const raw = row.original?.closedAt;
      if (!raw) return <div>------------</div>; // Show "---" if no date
      
      const date = raw instanceof Date ? raw : new Date(raw);
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "userId",
    header: "MyRequest",
    cell: ({row}) => (
      <div className="capitalize">

        <Link
        href={`/${empcode}/hr_document/${row.original.id}`}
        className="inline-block bg-green-700 hover:bg-green-600 py-2 px-8  text-white rounded text-center"
      >
        View
      </Link>
      </div>
    ),
  },
    
  
 
]

export default function DataTableDemo({data,inputTitles,empcode}: {data:Request[],inputTitles:string[],empcode:string}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const columns = React.useMemo(
    () => createColumns( empcode),
    [empcode]
  );
  const table = useReactTable({
    
    data,
    columns,
    
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full h-auto">
        <h1 className="text-3xl font-serif pl-2">My Requests</h1>
      <div className="flex items-center py-4 ">
        <Input
          placeholder="Filter requestType..."
          value={(table.getColumn("requestType")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("requestType")?.setFilterValue(event.target.value)
          }
          className="max-w-sm  bg-white"
        />
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
      <div className="rounded-md border px-10">
      
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
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
    </div>
  )
}
