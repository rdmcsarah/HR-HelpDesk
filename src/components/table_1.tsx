"use client";

import * as React from "react";
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
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import "@/i18n"; // Import the i18n configuration
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

import { z } from "zod";
import i18n from "@/i18n";

type Request = {
  id: number;
  title: string;
  description: string;
  requestType: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date;
  comments: string[];
  assignedToId: number;
  userId: string;
  assignedTo: string;
};

export const schema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  requestType: z.string(),
  status: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  closedAt: z.date(),
  comments: z.array(z.string()),
  assignedToId: z.number(),
  userId: z.string(),
  assignedTo: z.string(),
});

const createColumns = (
  empcode: string,
  mounted: boolean,
  filterRequests: (rowValue: string, filterValue: string) => boolean,
  t: (key: string, options?: any) => string
): ColumnDef<z.infer<typeof schema>>[] => [
  {
    accessorKey: "title",
    header: () => (
      <div className="px-2 py-3 text-center">
        {mounted ? (
          <>{t("request")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}
      </div>
    ),
    cell: ({ row }) => {
      const index = row.index + 1;
      const localizedIndex =
        i18n.language === "ar" ? index.toLocaleString("ar-EG") : index;

      return (
        <div className="px-2 py-3 text-center capitalize">{localizedIndex}</div>
      );
    },
  },
  {
    accessorKey: "id",
    header: () => (
      <div className="px-2 py-3 text-center">
        {mounted ? <>{t("id")}</> : <span className="opacity-50">&nbsp;</span>}
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-2 py-3 text-center">{row.original.id}</div>
    ),
    enableHiding: true,
  },
//   {
//     accessorKey: "requestType",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         className="px-4 py-2 w-full justify-center font-semibold"
//         onClick={() => {
//           const isSorted = column.getIsSorted();
//           if (!isSorted) {
//             column.toggleSorting(false); // sort asc
//           } else if (isSorted === "asc") {
//             column.toggleSorting(true); // sort desc
//           } else {
//             column.clearSorting(); // reset sort
//           }
//         }}
//       >
//         {mounted ? (
//           <>{t("RequestType")}</>
//         ) : (
//           <span className="opacity-50">&nbsp;</span>
//         )}{" "}
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => (
//       <div className="px-4 py-2 text-center lowercase">
//         {/* {row.original.requestType} */}
//         {mounted ? t(row.original.requestType) : row.original.requestType}
//       </div>




      
//     ),
// filterFn: (row, columnId, filterValue) => {
//     const rowValue = row.getValue(columnId) as string;
//     return filterRequests(rowValue, filterValue);
//   },
    
//     enableHiding: true,
//   },

{
  accessorKey: "requestType",
  header: ({ column }) => (
    <Button
      variant="ghost"
      className="px-4 py-2 w-full justify-center font-semibold"
      onClick={() => {
        const isSorted = column.getIsSorted();
        if (!isSorted) {
          column.toggleSorting(false); // sort asc
        } else if (isSorted === "asc") {
          column.toggleSorting(true); // sort desc
        } else {
          column.clearSorting(); // reset sort
        }
      }}
    >
      {mounted ? (
        <>{t("RequestType")}</>
      ) : (
        <span className="opacity-50">&nbsp;</span>
      )}{" "}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }) => (
    <div className="px-4 py-2 text-center lowercase">
      {mounted ? t(row.original.requestType) : row.original.requestType}
    </div>
  ),
  sortingFn: (rowA, rowB, columnId) => {
    // Get the raw values
    const valueA = rowA.getValue(columnId) as string;
    const valueB = rowB.getValue(columnId) as string;
    
    // Get translated values for comparison
    const translatedA = t(valueA).toLowerCase();
    const translatedB = t(valueB).toLowerCase();
    
    return translatedA.localeCompare(translatedB);
  },
  filterFn: (row, columnId, filterValue) => {
    const rowValue = row.getValue(columnId) as string;
    return filterRequests(rowValue, filterValue);
  },
  enableHiding: true,
},
  {
    accessorKey: "status",
    header: () => (
      <div className="px-2 py-3 text-center">
        {mounted ? (
          <>{t("status")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}
      </div>
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      let colorClass = "";

      switch (status) {
        case "COMPLETED":
          colorClass = "text-green-600";
          break;
        case "PENDING":
          colorClass = "text-yellow-500";
          break;
        case "REJECTED":
          colorClass = "text-red-700";
          break;
        default:
          colorClass = "text-gray-500";
      }

      return (
        <div className={`px-2 py-3 text-center font-medium ${colorClass}`}>
          {mounted ? t(row.original.status) : row.original.status}
        </div>
      );
    },
    enableHiding: true,
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <div className="px-2 py-3 text-center">
        {mounted ? (
          <>{t("createdOn")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}
      </div>
    ),
    cell: ({ row }) => {
      const raw = row.original?.createdAt;
      if (!raw)
        return <div className="px-2 py-3 text-center">------------</div>;

      const date = raw instanceof Date ? raw : new Date(raw);
      const localizedDate = date.toLocaleDateString(
        i18n.language === "ar" ? "ar-EG" : i18n.language
      );

      return (
        <div className="px-2 py-3 text-center">
          {mounted ? localizedDate : date.toLocaleDateString()}
        </div>
      );
    },
  },
  {
    accessorKey: "closedAt",
    header: () => (
      <div className="px-2 py-3 text-center">
        {mounted ? (
          <>{t("closedon")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}
      </div>
    ),
    cell: ({ row }) => {
      const raw = row.original?.closedAt;
      if (!raw)
        return <div className="px-2 py-3 text-center">------------</div>;

      const date = raw instanceof Date ? raw : new Date(raw);
      const localizedDate = date.toLocaleDateString(
        i18n.language === "ar" ? "ar-EG" : i18n.language
      );

      return (
        <div className="px-2 py-3 text-center">
          {mounted ? localizedDate : date.toLocaleDateString()}
        </div>
      );
    },
  },
  {
    accessorKey: "userId",
    header: () => (
      <div className="px-2 py-3 text-center">
        {mounted ? (
          <>{t("MyRequest")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-2 py-3 text-center">
        <Link
          href={`/hr_document/${row.original.id}`}
          className="inline-block bg-green-700 hover:bg-green-600 py-2 px-4 text-white rounded text-center transition-colors duration-200"
        >
          {mounted ? (
            <>{t("View")}</>
          ) : (
            <span className="opacity-50">&nbsp;</span>
          )}
        </Link>
      </div>
    ),
  },
];
export default function DataTableDemo({
  data,
  inputTitles,
  empcode,
}: {
  data: Request[];
  inputTitles: string[];
  empcode: string | null;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const filterRequests = (rowValue: string, filterValue: string) => {
  // Get the translation for the row's request type
  const translatedValue = t(rowValue);
  // Compare with the filter value (case insensitive)
  return translatedValue.toLowerCase().includes(filterValue.toLowerCase());
};
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Apply RTL styling if needed when the component mounts
    if (i18n.language === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = i18n.language;
    }

    // Mark component as mounted to avoid hydration mismatch
    setMounted(true);
  }, [i18n.language]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});




  const columns = React.useMemo(
    () => createColumns(empcode ?? "",mounted,filterRequests, t),
    [empcode, mounted, t]
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
  });

  return (
   <div className="w-full h-auto dark:bg-gray-900 dark:text-gray-100">
  {/* Header */}
  <h1 className="text-3xl font-serif pl-2 dark:text-white">
    {mounted ? (
      <>{t("MyRequests")}</>
    ) : (
      <span className="opacity-50">&nbsp;</span>
    )}
  </h1>

  {/* Filter Input
  <div className="flex items-center py-4">
    <Input
      placeholder={mounted ? t("filter") : ""}
      
      value={
        t(table.getColumn("requestType")?.getFilterValue() as string) ?? ""
      }
      onChange={(event) =>
        table.getColumn("requestType")?.setFilterValue(event.target.value)
      }
      className="bg-white text-base px-4 py-3 w-80 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
  </div> */}


<div className="flex items-center py-4">
  <Input
    placeholder={mounted ? t("filter") : ""}
    value={table.getColumn("requestType")?.getFilterValue() as string ?? ""}
    onChange={(event) => {
      table.getColumn("requestType")?.setFilterValue(event.target.value);
    }}
    className="bg-white text-base px-4 py-3 w-80 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
</div>

  {/* Table */}
  <div className="rounded-md border px-10 dark:border-gray-700">
    <Table>
      <TableHeader className="dark:bg-gray-800">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="dark:border-gray-700">
            {headerGroup.headers.map((header) => {
              return (
                <TableHead 
                  key={header.id}
                  className="dark:text-gray-300"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className="dark:bg-gray-900">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className="dark:border-gray-700 dark:hover:bg-gray-800"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="dark:text-gray-300">
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
              className="h-24 text-center dark:text-gray-400"
            >
              {mounted ? (
                <>{t("noResults")}</>
              ) : (
                <span className="opacity-50">&nbsp;</span>
              )}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>

  {/* Pagination */}
  <div className="flex items-center justify-end space-x-2 py-4">
    <div className="space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        {mounted ? (
          <>{t("previous")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        {mounted ? (
          <>{t("next")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}
      </Button>
    </div>
  </div>
</div>
  );
}


