"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { StatsCard } from "@/components/dashboard/stats-card";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TextField, NumberField, SwitchField } from "@/components/admin/fields";
import { BarChart3, Plus, MoreHorizontal, Edit, Trash2, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { saveMetric, deleteMetric } from "@/app/admin/actions";
import type { Metric } from "@/types/content";

const PAGE_SIZES = [15, 30, 50];

export default function MetricsAdmin({
  all,
  metrics,
  total,
  page,
  size,
  q,
  featured,
}: {
  all: Metric[];
  metrics: Metric[];
  total: number;
  page: number;
  size: number;
  q: string;
  featured: string;
}) {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editSelected, setEditSelected] = useState<Metric | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Metric | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [saving, setSaving] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / size));
  const from = total === 0 ? 0 : (page - 1) * size + 1;
  const to = Math.min(page * size, total);

  const hrefWith = (over: { page?: number; size?: number; q?: string; featured?: string }) => {
    const next = {
      page: over.page ?? page,
      size: over.size ?? size,
      q: over.q !== undefined ? over.q : q,
      featured: over.featured !== undefined ? over.featured : featured,
    };
    const sp = new URLSearchParams();
    sp.set("page", String(next.page));
    sp.set("size", String(next.size));
    if (next.q) sp.set("q", next.q);
    if (next.featured && next.featured !== "all") sp.set("featured", next.featured);
    return `/admin/metrics?${sp.toString()}`;
  };

  const go = (href: string) => router.push(href);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const v = searchRef.current?.value ?? "";
    go(hrefWith({ q: v, page: 1 }));
  };

  const clearSearch = () => {
    if (searchRef.current) searchRef.current.value = "";
    go(hrefWith({ q: "", page: 1 }));
  };

  const handleFeaturedChange = (value: string) => {
    go(hrefWith({ featured: value, page: 1 }));
  };

  const handleSizeChange = (n: number) => {
    go(hrefWith({ size: n, page: 1 }));
  };

  const goPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    go(hrefWith({ page: p }));
  };

  const totalAll = all.length;
  const featuredAll = all.filter((m) => m.featured).length;
  const withIcon = all.filter((m) => m.icon).length;

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    await saveMetric(fd);
    setAddOpen(false);
    setSaving(false);
    router.refresh();
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    await saveMetric(fd);
    setEditOpen(false);
    setEditSelected(null);
    setSaving(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    const fd = new FormData();
    fd.append("id", selected.id);
    await deleteMetric(fd);
    setDeleteOpen(false);
    setSelected(null);
    setConfirmText("");
    setSaving(false);
    router.refresh();
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Metrics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Stats Cards — independent of pagination/filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <StatsCard icon={BarChart3} title="Total Metrics" value={totalAll} />
        <StatsCard icon={BarChart3} title="Featured" value={featuredAll} />
        <StatsCard icon={BarChart3} title="With Icon" value={withIcon} />
      </div>

      {/* Metrics List */}
      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Metrics
          </CardTitle>
          <CardDescription>Stat cards in the Impact at a Glance section. (GitHub stars are fetched live.)</CardDescription>
          <CardAction>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Metric
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          {/* Toolbar: search + filter */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-4">
            <form onSubmit={handleSearch} className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchRef}
                defaultValue={q}
                placeholder="Search metrics..."
                className="pl-9 pr-9"
              />
              {q && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>

            <Select value={featured} onValueChange={handleFeaturedChange}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {metrics.length === 0 ? (
            <div className="p-12 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No metrics found</h3>
              <p className="text-muted-foreground mb-4">
                {q || featured !== "all"
                  ? "No metrics match your search or filter."
                  : "No metrics have been created yet."}
              </p>
              {(q || featured !== "all") ? (
                <Button variant="outline" onClick={() => go(hrefWith({ q: "", featured: "all", page: 1 }))}>
                  Clear filters
                </Button>
              ) : (
                <Button onClick={() => setAddOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Metric
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-12 font-semibold px-4 py-4">#</TableHead>
                    <TableHead className="font-semibold px-4 py-4">Label</TableHead>
                    <TableHead className="font-semibold px-4 py-4">Value</TableHead>
                    <TableHead className="font-semibold px-4 py-4">Suffix</TableHead>
                    <TableHead className="font-semibold px-4 py-4">Featured</TableHead>
                    <TableHead className="font-semibold px-4 py-4">Order</TableHead>
                    <TableHead className="font-semibold px-4 py-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.map((m, i) => (
                    <TableRow key={m.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="px-4 py-4 text-sm text-muted-foreground w-12">
                        {from + i}
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="font-medium">{m.label}</div>
                        {m.icon && <div className="text-sm text-muted-foreground">{m.icon}</div>}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm">{m.value}</TableCell>
                      <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                        {m.suffix ?? "—"}
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <Badge variant={m.featured ? "default" : "secondary"}>
                          {m.featured ? "Featured" : "Standard"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-muted-foreground">{m.order}</TableCell>
                      <TableCell className="px-4 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onSelect={() => {
                                setEditSelected(m);
                                setEditOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Metric
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onSelect={() => {
                                setSelected(m);
                                setDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Metric
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {total > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{from}</span>–
                <span className="font-medium text-foreground">{to}</span> of{" "}
                <span className="font-medium text-foreground">{total}</span>
              </p>
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {size} per page
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {PAGE_SIZES.map((n) => (
                      <DropdownMenuItem key={n} onClick={() => handleSizeChange(n)}>
                        {n} per page
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goPage(page - 1)}
                    disabled={page <= 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goPage(page + 1)}
                    disabled={page >= totalPages}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Metric Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Metric</DialogTitle>
            <DialogDescription>Create a new metric. Fields marked with * are required.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdd} className="grid gap-4 py-4">
            <TextField label="Label *" name="label" placeholder="e.g. Projects Shipped" required />
            <div className="grid grid-cols-2 gap-4">
              <NumberField label="Value *" name="value" required />
              <TextField label="Suffix" name="suffix" placeholder="+ / + yrs" />
            </div>
            <TextField label="Icon key" name="icon" placeholder="Smartphone / Trophy / Crown / Users" />
            <SwitchField label="Featured (large card)" name="featured" />
            <NumberField label="Order" name="order" />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Creating..." : "Create Metric"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Metric Dialog */}
      <Dialog
        open={editOpen}
        onOpenChange={(o) => {
          setEditOpen(o);
          if (!o) setEditSelected(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Metric</DialogTitle>
            <DialogDescription>Update the metric below.</DialogDescription>
          </DialogHeader>
          {editSelected && (
            <form onSubmit={handleEdit} className="grid gap-4 py-4">
              <input type="hidden" name="id" value={editSelected.id} />
              <TextField label="Label *" name="label" defaultValue={editSelected.label} required />
              <div className="grid grid-cols-2 gap-4">
                <NumberField label="Value *" name="value" defaultValue={editSelected.value} required />
                <TextField label="Suffix" name="suffix" defaultValue={editSelected.suffix} />
              </div>
              <TextField label="Icon key" name="icon" defaultValue={editSelected.icon} />
              <SwitchField label="Featured (large card)" name="featured" defaultChecked={editSelected.featured} />
              <NumberField label="Order" name="order" defaultValue={editSelected.order} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)} disabled={saving}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Metric Dialog */}
      <Dialog
        open={deleteOpen}
        onOpenChange={(o) => {
          setDeleteOpen(o);
          if (!o) {
            setSelected(null);
            setConfirmText("");
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Metric</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Type the metric label below to confirm deletion.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="py-4 space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium">{selected.label}</h4>
                <p className="text-sm text-muted-foreground">{selected.value}{selected.suffix ?? ""}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Type <span className="font-semibold text-destructive">{selected.label}</span> to confirm
                </label>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={selected.label ?? ""}
                  className="font-mono"
                  autoFocus
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={saving || !selected || confirmText.trim() !== selected.label}
            >
              {saving ? "Deleting..." : "Delete Metric"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
