"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Column = { key: string; label: string };

export function ResourceTable({
  columns,
  rows,
  editBase,
  deleteAction,
  emptyText = "No records yet.",
}: {
  columns: Column[];
  rows: Record<string, unknown>[];
  editBase: string;
  deleteAction: (formData: FormData) => void | Promise<void>;
  emptyText?: string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-slate-500 py-8 text-center">{emptyText}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((c) => (
            <TableHead key={c.key}>{c.label}</TableHead>
          ))}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={String(row.id)}>
            {columns.map((c) => (
              <TableCell key={c.key} className="text-slate-300">
                {String(row[c.key] ?? "")}
              </TableCell>
            ))}
            <TableCell className="text-right space-x-3 whitespace-nowrap">
              <Link
                href={`${editBase}/${String(row.id)}`}
                className="text-indigo-400 hover:text-indigo-300 text-sm"
              >
                Edit
              </Link>
              <form action={deleteAction} className="inline">
                <input type="hidden" name="id" value={String(row.id)} />
                <button
                  type="submit"
                  className="text-red-400 hover:text-red-300 text-sm"
                  onClick={(e) => {
                    if (!confirm("Delete this record?")) e.preventDefault();
                  }}
                >
                  Delete
                </button>
              </form>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
