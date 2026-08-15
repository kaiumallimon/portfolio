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
import { TextField, NumberField, SkillsField } from "@/components/admin/fields";
import { Code2, Plus, MoreHorizontal, Edit, Trash2, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { saveSkill, deleteSkill } from "@/app/admin/actions";
import type { SkillCategory } from "@/types/content";

const PAGE_SIZES = [15, 30, 50];

export default function SkillsAdmin({
  all,
  skills,
  total,
  page,
  size,
  q,
}: {
  all: SkillCategory[];
  skills: SkillCategory[];
  total: number;
  page: number;
  size: number;
  q: string;
}) {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editSelected, setEditSelected] = useState<SkillCategory | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<SkillCategory | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [saving, setSaving] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / size));
  const from = total === 0 ? 0 : (page - 1) * size + 1;
  const to = Math.min(page * size, total);

  const hrefWith = (over: { page?: number; size?: number; q?: string }) => {
    const next = {
      page: over.page ?? page,
      size: over.size ?? size,
      q: over.q !== undefined ? over.q : q,
    };
    const sp = new URLSearchParams();
    sp.set("page", String(next.page));
    sp.set("size", String(next.size));
    if (next.q) sp.set("q", next.q);
    return `/admin/skills?${sp.toString()}`;
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

  const handleSizeChange = (n: number) => {
    go(hrefWith({ size: n, page: 1 }));
  };

  const goPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    go(hrefWith({ page: p }));
  };

  const totalCategories = all.length;
  const totalSkills = all.reduce((sum, s) => sum + (s.skills?.length ?? 0), 0);
  const highlightedSkills = all.reduce(
    (sum, s) => sum + (s.skills?.filter((sk) => sk.highlight).length ?? 0),
    0
  );

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    await saveSkill(fd);
    setAddOpen(false);
    setSaving(false);
    router.refresh();
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    await saveSkill(fd);
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
    await deleteSkill(fd);
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
            <BreadcrumbPage>Skills</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Stats Cards — independent of pagination/filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <StatsCard icon={Code2} title="Total Categories" value={totalCategories} />
        <StatsCard icon={Code2} title="Total Skills" value={totalSkills} />
        <StatsCard icon={Code2} title="Highlighted" value={highlightedSkills} />
      </div>

      {/* Skills List */}
      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Skills
          </CardTitle>
          <CardDescription>Tech stack categories shown in the Engineering Toolkit section.</CardDescription>
          <CardAction>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          {/* Toolbar: search */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-4">
            <form onSubmit={handleSearch} className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchRef}
                defaultValue={q}
                placeholder="Search categories..."
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
          </div>

          {skills.length === 0 ? (
            <div className="p-12 text-center">
              <Code2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No categories found</h3>
              <p className="text-muted-foreground mb-4">
                {q
                  ? "No categories match your search."
                  : "No skill categories have been created yet."}
              </p>
              {q ? (
                <Button variant="outline" onClick={() => go(hrefWith({ q: "", page: 1 }))}>
                  Clear filters
                </Button>
              ) : (
                <Button onClick={() => setAddOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Category
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-12 font-semibold px-4 py-4">#</TableHead>
                    <TableHead className="font-semibold px-4 py-4">Category</TableHead>
                    <TableHead className="font-semibold px-4 py-4">Icon</TableHead>
                    <TableHead className="font-semibold px-4 py-4">Skills</TableHead>
                    <TableHead className="font-semibold px-4 py-4">Order</TableHead>
                    <TableHead className="font-semibold px-4 py-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {skills.map((s, i) => (
                    <TableRow key={s.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="px-4 py-4 text-sm text-muted-foreground w-12">
                        {from + i}
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="font-medium">{s.category}</div>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                        {s.icon ?? "—"}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                        {s.skills?.length
                          ? `${s.skills.length} skill${s.skills.length !== 1 ? "s" : ""}${
                              s.skills.some((sk) => sk.highlight) ? ` (${s.skills.filter((sk) => sk.highlight).length} ★)` : ""
                            }`
                          : "—"}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-muted-foreground">{s.order}</TableCell>
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
                                setEditSelected(s);
                                setEditOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Category
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onSelect={() => {
                                setSelected(s);
                                setDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Category
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

      {/* Add Category Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>Create a new skill category. Fields marked with * are required.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdd} className="grid gap-4 py-4">
            <TextField label="Category *" name="category" placeholder="e.g. Frontend" required />
            <TextField label="Icon key" name="icon" placeholder="FaMobile / Server / Globe" />
            <SkillsField name="skills_json" />
            <NumberField label="Order" name="order" />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Creating..." : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog
        open={editOpen}
        onOpenChange={(o) => {
          setEditOpen(o);
          if (!o) setEditSelected(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the skill category below.</DialogDescription>
          </DialogHeader>
          {editSelected && (
            <form onSubmit={handleEdit} className="grid gap-4 py-4">
              <input type="hidden" name="id" value={editSelected.id} />
              <TextField label="Category *" name="category" defaultValue={editSelected.category} required />
              <TextField label="Icon key" name="icon" defaultValue={editSelected.icon} />
              <SkillsField name="skills_json" defaultValue={editSelected.skills} />
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

      {/* Delete Category Dialog */}
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
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Type the category name below to confirm deletion.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="py-4 space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium">{selected.category}</h4>
                <p className="text-sm text-muted-foreground">
                  {selected.skills?.length ?? 0} skill{selected.skills?.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Type <span className="font-semibold text-destructive">{selected.category}</span> to confirm
                </label>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={selected.category ?? ""}
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
              disabled={saving || !selected || confirmText.trim() !== selected.category}
            >
              {saving ? "Deleting..." : "Delete Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
