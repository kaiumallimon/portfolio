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
import { Award, Plus, MoreHorizontal, Edit, Trash2, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { saveAchievement, deleteAchievement } from "@/app/admin/actions";
import type { Achievement } from "@/types/content";

const PAGE_SIZES = [15, 30, 50];

const RANK_LABELS: Record<string, string> = {
  champion: "Champion",
  "1st-runner-up": "1st Runner-Up",
  "2nd-runner-up": "2nd Runner-Up",
  other: "Other",
};

export default function AchievementsAdmin({
  all,
  achievements,
  total,
  page,
  size,
  q,
  awardRank,
}: {
  all: Achievement[];
  achievements: Achievement[];
  total: number;
  page: number;
  size: number;
  q: string;
  awardRank: string;
}) {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editSelected, setEditSelected] = useState<Achievement | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Achievement | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [saving, setSaving] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / size));
  const from = total === 0 ? 0 : (page - 1) * size + 1;
  const to = Math.min(page * size, total);

  const hrefWith = (over: { page?: number; size?: number; q?: string; awardRank?: string }) => {
    const next = {
      page: over.page ?? page,
      size: over.size ?? size,
      q: over.q !== undefined ? over.q : q,
      awardRank: over.awardRank !== undefined ? over.awardRank : awardRank,
    };
    const sp = new URLSearchParams();
    sp.set("page", String(next.page));
    sp.set("size", String(next.size));
    if (next.q) sp.set("q", next.q);
    if (next.awardRank && next.awardRank !== "all") sp.set("award_rank", next.awardRank);
    return `/admin/achievements?${sp.toString()}`;
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

  const handleRankChange = (value: string) => {
    go(hrefWith({ awardRank: value, page: 1 }));
  };

  const handleSizeChange = (n: number) => {
    go(hrefWith({ size: n, page: 1 }));
  };

  const goPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    go(hrefWith({ page: p }));
  };

  const totalAll = all.length;
  const champions = all.filter((a) => a.award_rank === "champion").length;
  const runnerUps = all.filter(
    (a) => a.award_rank === "1st-runner-up" || a.award_rank === "2nd-runner-up"
  ).length;

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    await saveAchievement(fd);
    setAddOpen(false);
    setSaving(false);
    router.refresh();
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    await saveAchievement(fd);
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
    await deleteAchievement(fd);
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
            <BreadcrumbPage>Achievements</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Stats Cards — independent of pagination/filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <StatsCard icon={Award} title="Total Achievements" value={totalAll} />
        <StatsCard icon={Award} title="Champions" value={champions} />
        <StatsCard icon={Award} title="Runner-Ups" value={runnerUps} />
      </div>

      {/* Achievements List */}
      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
          <CardDescription>Awards and recognition from project showcases.</CardDescription>
          <CardAction>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Achievement
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
                placeholder="Search achievements..."
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

            <Select value={awardRank} onValueChange={handleRankChange}>
              <SelectTrigger className="w-full sm:w-[170px]">
                <SelectValue placeholder="Filter rank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ranks</SelectItem>
                <SelectItem value="champion">Champion</SelectItem>
                <SelectItem value="1st-runner-up">1st Runner-Up</SelectItem>
                <SelectItem value="2nd-runner-up">2nd Runner-Up</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {achievements.length === 0 ? (
            <div className="p-12 text-center">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No achievements found</h3>
              <p className="text-muted-foreground mb-4">
                {q || awardRank !== "all"
                  ? "No achievements match your search or filter."
                  : "No achievements have been created yet."}
              </p>
              {(q || awardRank !== "all") ? (
                <Button variant="outline" onClick={() => go(hrefWith({ q: "", awardRank: "all", page: 1 }))}>
                  Clear filters
                </Button>
              ) : (
                <Button onClick={() => setAddOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Achievement
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-12 font-semibold px-4 py-4">#</TableHead>
                    <TableHead className="font-semibold px-4 py-4">Title</TableHead>
                    <TableHead className="font-semibold px-4 py-4">Award</TableHead>
                    <TableHead className="font-semibold px-4 py-4">Rank</TableHead>
                    <TableHead className="font-semibold px-4 py-4">Date</TableHead>
                    <TableHead className="font-semibold px-4 py-4">Order</TableHead>
                    <TableHead className="font-semibold px-4 py-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {achievements.map((a, i) => (
                    <TableRow key={a.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="px-4 py-4 text-sm text-muted-foreground w-12">
                        {from + i}
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="font-medium">{a.title}</div>
                        {a.project && (
                          <div className="text-sm text-muted-foreground truncate max-w-xs">{a.project}</div>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm">{a.award}</TableCell>
                      <TableCell className="px-4 py-4">
                        <Badge variant="secondary">
                          {RANK_LABELS[a.award_rank] ?? a.award_rank}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                        {a.date ?? "—"}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-muted-foreground">{a.order}</TableCell>
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
                                setEditSelected(a);
                                setEditOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Achievement
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onSelect={() => {
                                setSelected(a);
                                setDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Achievement
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

      {/* Add Achievement Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Achievement</DialogTitle>
            <DialogDescription>Create a new achievement. Fields marked with * are required.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdd} className="grid gap-4 py-4">
            <TextField label="Title *" name="title" placeholder="e.g. National Hackathon" required />
            <TextAreaField label="Award *" name="award" placeholder="e.g. 1st Runner-Up" required />
            <SelectField
              label="Award Rank *"
              name="award_rank"
              options={[
                { value: "champion", label: "Champion" },
                { value: "1st-runner-up", label: "1st Runner-Up" },
                { value: "2nd-runner-up", label: "2nd Runner-Up" },
                { value: "other", label: "Other" },
              ]}
              required
            />
            <TextField label="Date" name="date" placeholder="e.g. 2024" />
            <TextField label="Project" name="project" placeholder="Related project" />
            <TextField label="Team" name="team" placeholder="Team members" />
            <NumberField label="Order" name="order" />
            <ImageUploader label="Image" name="image" bucket="portfolio-media" />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Creating..." : "Create Achievement"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Achievement Dialog */}
      <Dialog
        open={editOpen}
        onOpenChange={(o) => {
          setEditOpen(o);
          if (!o) setEditSelected(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Achievement</DialogTitle>
            <DialogDescription>Update the achievement details below.</DialogDescription>
          </DialogHeader>
          {editSelected && (
            <form onSubmit={handleEdit} className="grid gap-4 py-4">
              <input type="hidden" name="id" value={editSelected.id} />
              <TextField label="Title *" name="title" defaultValue={editSelected.title} required />
              <TextAreaField label="Award *" name="award" defaultValue={editSelected.award} required />
              <SelectField
                label="Award Rank *"
                name="award_rank"
                defaultValue={editSelected.award_rank}
                options={[
                  { value: "champion", label: "Champion" },
                  { value: "1st-runner-up", label: "1st Runner-Up" },
                  { value: "2nd-runner-up", label: "2nd Runner-Up" },
                  { value: "other", label: "Other" },
                ]}
                required
              />
              <TextField label="Date" name="date" defaultValue={editSelected.date} />
              <TextField label="Project" name="project" defaultValue={editSelected.project} />
              <TextField label="Team" name="team" defaultValue={editSelected.team} />
              <NumberField label="Order" name="order" defaultValue={editSelected.order} />
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

      {/* Delete Achievement Dialog */}
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
            <DialogTitle>Delete Achievement</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Type the achievement title below to confirm deletion.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="py-4 space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium">{selected.title}</h4>
                <p className="text-sm text-muted-foreground">{selected.award}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Type <span className="font-semibold text-destructive">{selected.title}</span> to confirm
                </label>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={selected.title ?? ""}
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
              disabled={saving || !selected || confirmText.trim() !== selected.title}
            >
              {saving ? "Deleting..." : "Delete Achievement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
