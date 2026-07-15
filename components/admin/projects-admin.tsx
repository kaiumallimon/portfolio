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
import { TextField, TextAreaField, NumberField, SelectField, ImageUploader } from "@/components/admin/fields";
import { FolderKanban, Plus, MoreHorizontal, Edit, Trash2, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { saveProject, deleteProject } from "@/app/admin/actions";
import type { Project } from "@/types/project";

const PAGE_SIZES = [15, 30, 50];

export default function ProjectsAdmin({
  all,
  projects,
  total,
  page,
  size,
  q,
  client,
}: {
  all: Project[];
  projects: Project[];
  total: number;
  page: number;
  size: number;
  q: string;
  client: string;
}) {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editSelected, setEditSelected] = useState<Project | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [saving, setSaving] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / size));
  const from = total === 0 ? 0 : (page - 1) * size + 1;
  const to = Math.min(page * size, total);

  const hrefWith = (over: { page?: number; size?: number; q?: string; client?: string }) => {
    const next = {
      page: over.page ?? page,
      size: over.size ?? size,
      q: over.q !== undefined ? over.q : q,
      client: over.client !== undefined ? over.client : client,
    };
    const sp = new URLSearchParams();
    sp.set("page", String(next.page));
    sp.set("size", String(next.size));
    if (next.q) sp.set("q", next.q);
    if (next.client && next.client !== "all") sp.set("client", next.client);
    return `/admin/projects?${sp.toString()}`;
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

  const handleClientChange = (value: string) => {
    go(hrefWith({ client: value, page: 1 }));
  };

  const handleSizeChange = (n: number) => {
    go(hrefWith({ size: n, page: 1 }));
  };

  const goPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    go(hrefWith({ page: p }));
  };

  const totalAll = all.length;
  const mobileAll = all.filter((p) => p.client === "mobile").length;
  const webAll = all.filter((p) => p.client === "web").length;

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    await saveProject(fd);
    setAddOpen(false);
    setSaving(false);
    router.refresh();
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    await saveProject(fd);
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
    await deleteProject(fd);
    setDeleteOpen(false);
    setSelected(null);
    setSaving(false);
    router.refresh();
  };

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Projects</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Stats Cards — independent of pagination/filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <StatsCard icon={FolderKanban} title="Total Projects" value={totalAll} />
        <StatsCard icon={FolderKanban} title="Mobile Apps" value={mobileAll} />
        <StatsCard icon={FolderKanban} title="Web Apps" value={webAll} />
      </div>

      {/* Projects List */}
      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5" />
            Projects
          </CardTitle>
          <CardDescription>Manage portfolio projects shown on the home and /projects pages.</CardDescription>
          <CardAction>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
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
                placeholder="Search projects..."
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

            <Select value={client} onValueChange={handleClientChange}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Filter type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="web">Web</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {projects.length === 0 ? (
            <div className="p-12 text-center">
              <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                {q || client !== "all"
                  ? "No projects match your search or filter."
                  : "No projects have been created yet."}
              </p>
              {(q || client !== "all") ? (
                <Button variant="outline" onClick={() => go(hrefWith({ q: "", client: "all", page: 1 }))}>
                  Clear filters
                </Button>
              ) : (
                <Button onClick={() => setAddOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Project
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-12 font-semibold px-4 py-4">#</TableHead>
                    <TableHead className="font-semibold px-4 py-4">Project</TableHead>
                    <TableHead className="font-semibold px-4 py-4">Type</TableHead>
                    <TableHead className="font-semibold px-4 py-4">Order</TableHead>
                    <TableHead className="font-semibold px-4 py-4">Technologies</TableHead>
                    <TableHead className="font-semibold px-4 py-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project, i) => (
                    <TableRow key={project.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="px-4 py-4 text-sm text-muted-foreground w-12">
                        {from + i}
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {project.short_details}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <Badge variant="secondary" className="capitalize">
                          {project.client ?? "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                        {project.order}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                        {project.technologies?.length
                          ? `${project.technologies.length} skill${project.technologies.length !== 1 ? "s" : ""}`
                          : "—"}
                      </TableCell>
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
                              setEditSelected(project);
                              setEditOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={() => {
                              setSelected(project);
                              setDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Project
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

      {/* Add Project Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription>
              Create a new project. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdd} className="grid gap-4 py-4">
            <TextField label="Name *" name="name" placeholder="e.g. MediTouch" required />
            <TextAreaField label="Short Details" name="short_details" placeholder="One-line summary" />
            <SelectField
              label="Client *"
              name="client"
              options={[
                { value: "mobile", label: "Mobile" },
                { value: "web", label: "Web" },
              ]}
              required
            />
            <TextField label="GitHub URL" name="github_url" placeholder="https://github.com/..." />
            <TextField label="Live URL" name="live_url" placeholder="https://..." />
            <NumberField label="Order" name="order" />
            <ImageUploader label="Image" name="image" bucket="portfolio-media" />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog
        open={editOpen}
        onOpenChange={(o) => {
          setEditOpen(o);
          if (!o) setEditSelected(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update the project details below.</DialogDescription>
          </DialogHeader>
          {editSelected && (
            <form onSubmit={handleEdit} className="grid gap-4 py-4">
              <input type="hidden" name="id" value={editSelected.id} />
              <TextField label="Name *" name="name" defaultValue={editSelected.name} required />
              <TextAreaField label="Short Details" name="short_details" defaultValue={editSelected.short_details} />
              <SelectField
                label="Client *"
                name="client"
                defaultValue={editSelected.client}
                options={[
                  { value: "mobile", label: "Mobile" },
                  { value: "web", label: "Web" },
                ]}
                required
              />
              <TextField label="GitHub URL" name="github_url" defaultValue={editSelected.github_url} />
              <TextField label="Live URL" name="live_url" defaultValue={editSelected.live_url} />
              <NumberField label="Order" name="order" defaultValue={editSelected.order} />
              <TextField
                label="Technologies (comma separated)"
                name="technologies"
                defaultValue={editSelected.technologies?.join(", ")}
                placeholder="Flutter, Dart, FastAPI"
              />
              <ImageUploader label="Image" name="image" bucket="portfolio-media" defaultValue={editSelected.image} />
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

      {/* Delete Project Dialog */}
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
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Type the project name below to confirm deletion.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="py-4 space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium">{selected.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {selected.client ?? "N/A"} • Order {selected.order}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Type <span className="font-semibold text-destructive">{selected.name}</span> to confirm
                </label>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={selected.name ?? ""}
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
              disabled={saving || !selected || confirmText.trim() !== selected.name}
            >
              {saving ? "Deleting..." : "Delete Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
