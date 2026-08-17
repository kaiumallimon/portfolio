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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  UserCheck,
  UserX,
  KeyRound,
  FileEdit,
  Trash2,
  PlusCircle,
  UploadCloud,
  Globe,
  Laptop,
  Smartphone,
  Tablet,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PAGE_SIZES = [15, 30, 50];

export interface SystemActivity {
  id: string;
  created_at: string;
  type: string;
  action: string;
  entity: string | null;
  entity_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  browser: string | null;
  os: string | null;
  device: string | null;
  status: "success" | "failure" | "warning";
  user_email: string | null;
  metadata: Record<string, any>;
}

export default function SystemActivityAdmin({
  all,
  activities,
  total,
  page,
  size,
  q,
  type,
  status,
}: {
  all: SystemActivity[];
  activities: SystemActivity[];
  total: number;
  page: number;
  size: number;
  q: string;
  type: string;
  status: string;
}) {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const [selectedActivity, setSelectedActivity] = useState<SystemActivity | null>(null);
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / size));
  const from = total === 0 ? 0 : (page - 1) * size + 1;
  const to = Math.min(page * size, total);

  // Quick stats derived from recent event sample
  const successfulLogins = all.filter((a) => a.type === "login_success").length;
  const failedEvents = all.filter((a) => a.status === "failure").length;
  const totalWrites = all.filter((a) =>
    ["create", "update", "delete", "upload", "settings_update"].includes(a.type)
  ).length;

  const hrefWith = (over: {
    page?: number;
    size?: number;
    q?: string;
    type?: string;
    status?: string;
  }) => {
    const next = {
      page: over.page ?? page,
      size: over.size ?? size,
      q: over.q !== undefined ? over.q : q,
      type: over.type !== undefined ? over.type : type,
      status: over.status !== undefined ? over.status : status,
    };
    const sp = new URLSearchParams();
    sp.set("page", String(next.page));
    sp.set("size", String(next.size));
    if (next.q) sp.set("q", next.q);
    if (next.type && next.type !== "all") sp.set("type", next.type);
    if (next.status && next.status !== "all") sp.set("status", next.status);
    return `/admin/system-activity?${sp.toString()}`;
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

  const handleTypeChange = (val: string) => {
    go(hrefWith({ type: val, page: 1 }));
  };

  const handleStatusChange = (val: string) => {
    go(hrefWith({ status: val, page: 1 }));
  };

  const handlePageSizeChange = (val: string) => {
    const newSize = parseInt(val, 10);
    go(hrefWith({ size: newSize, page: 1 }));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleCopyIp = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const getDeviceIcon = (device?: string | null) => {
    if (device === "Mobile") return <Smartphone className="h-3.5 w-3.5 text-amber-500" />;
    if (device === "Tablet") return <Tablet className="h-3.5 w-3.5 text-purple-500" />;
    return <Laptop className="h-3.5 w-3.5 text-indigo-500" />;
  };

  const getActionIcon = (itemType: string, itemStatus: string) => {
    if (itemStatus === "failure") return <UserX className="h-4 w-4 text-red-500" />;
    if (itemType === "login_success") return <UserCheck className="h-4 w-4 text-emerald-500" />;
    if (itemType.includes("password_reset")) return <KeyRound className="h-4 w-4 text-amber-500" />;
    if (itemType === "create") return <PlusCircle className="h-4 w-4 text-sky-500" />;
    if (itemType === "update" || itemType === "settings_update")
      return <FileEdit className="h-4 w-4 text-indigo-500" />;
    if (itemType === "delete") return <Trash2 className="h-4 w-4 text-rose-500" />;
    if (itemType === "upload") return <UploadCloud className="h-4 w-4 text-blue-500" />;
    return <Sparkles className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>System Activity</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">System Activity</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Audit log tracking administrator logins, security attempts, and database write mutations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="cursor-target"
          >
            <RefreshCw className={cn("h-4 w-4 mr-1.5", refreshing && "animate-spin text-indigo-500")} />
            {refreshing ? "Refreshing..." : "Refresh Feed"}
          </Button>
        </div>
      </div>

      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Tracked Events"
          value={total.toLocaleString()}
          description="Total audit entries logged"
          icon={ShieldAlert}
        />
        <StatsCard
          title="Successful Logins"
          value={successfulLogins.toLocaleString()}
          description="Verified admin sessions"
          icon={UserCheck}
        />
        <StatsCard
          title="Failed / Blocked"
          value={failedEvents.toLocaleString()}
          description="Failed access attempts"
          icon={ShieldX}
        />
        <StatsCard
          title="Data Mutations (Writes)"
          value={totalWrites.toLocaleString()}
          description="Creates, updates & deletes"
          icon={FileEdit}
        />
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Audit Log Entries</CardTitle>
            <CardDescription>
              {total === 0 ? "No records found" : `Showing ${from}–${to} of ${total} activities`}
            </CardDescription>
          </div>
          <CardAction className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative w-full sm:w-60">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchRef}
                defaultValue={q}
                placeholder="Search IP, user, action..."
                className="pl-8 pr-8 text-sm"
              />
              {q && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </form>

            {/* Type Filter */}
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-36 text-sm">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="login">Login Attempts</SelectItem>
                <SelectItem value="writes">Data Writes</SelectItem>
                <SelectItem value="security">Auth & Security</SelectItem>
                <SelectItem value="settings_update">Settings</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-32 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failure">Failure</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border border-border/40 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[280px]">Event & Action</TableHead>
                  <TableHead className="w-[110px]">Status</TableHead>
                  <TableHead>Actor / Email</TableHead>
                  <TableHead>Client IP</TableHead>
                  <TableHead>Browser & Environment</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right w-[80px]">Inspect</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                      <ShieldCheck className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
                      <p className="font-medium text-foreground">No system activities match your filter.</p>
                      <p className="text-xs mt-0.5">
                        Try clearing search terms or selecting a different event category.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  activities.map((item) => (
                    <TableRow key={item.id}>
                      {/* Event & Action */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                              item.status === "failure"
                                ? "bg-red-500/10 border-red-500/20"
                                : item.type.includes("login")
                                ? "bg-emerald-500/10 border-emerald-500/20"
                                : "bg-indigo-500/10 border-indigo-500/20"
                            )}
                          >
                            {getActionIcon(item.type, item.status)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground text-sm truncate">{item.action}</p>
                            {item.entity && (
                              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                                {item.entity}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "success"
                              ? "default"
                              : item.status === "failure"
                              ? "destructive"
                              : "secondary"
                          }
                          className="capitalize text-xs font-medium"
                        >
                          {item.status}
                        </Badge>
                      </TableCell>

                      {/* Actor Email */}
                      <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-[160px]">
                        {item.user_email || <span className="text-muted-foreground/60">Anonymous</span>}
                      </TableCell>

                      {/* Client IP */}
                      <TableCell className="font-mono text-xs text-foreground whitespace-nowrap">
                        {item.ip_address ? (
                          <div className="flex items-center gap-1.5">
                            <Globe className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span>{item.ip_address}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyIp(item.ip_address!)}
                              className="text-muted-foreground hover:text-foreground p-0.5 transition-colors cursor-target"
                              title="Copy IP"
                            >
                              {copiedIp === item.ip_address ? (
                                <Check className="h-3 w-3 text-emerald-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/60">—</span>
                        )}
                      </TableCell>

                      {/* Browser & OS */}
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          {getDeviceIcon(item.device)}
                          <span>
                            {item.browser || "Browser"} on {item.os || "OS"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Timestamp */}
                      <TableCell className="whitespace-nowrap text-xs font-mono text-muted-foreground">
                        {new Date(item.created_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </TableCell>

                      {/* Inspect Button */}
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 cursor-target"
                          onClick={() => setSelectedActivity(item)}
                          title="Inspect Telemetry Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <Select value={String(size)} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZES.map((s) => (
                      <SelectItem key={s} value={String(s)}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>
                  Showing {from}–{to} of {total}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 cursor-target"
                  disabled={page <= 1}
                  onClick={() => go(hrefWith({ page: page - 1 }))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-2 text-xs font-medium">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 cursor-target"
                  disabled={page >= totalPages}
                  onClick={() => go(hrefWith({ page: page + 1 }))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inspect Telemetry Detail Dialog */}
      <Dialog
        open={Boolean(selectedActivity)}
        onOpenChange={(open) => {
          if (!open) setSelectedActivity(null);
        }}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant={
                  selectedActivity?.status === "success"
                    ? "default"
                    : selectedActivity?.status === "failure"
                    ? "destructive"
                    : "secondary"
                }
                className="capitalize text-xs"
              >
                {selectedActivity?.status}
              </Badge>
              <span className="text-xs font-mono text-muted-foreground">
                {selectedActivity && new Date(selectedActivity.created_at).toLocaleString()}
              </span>
            </div>
            <DialogTitle>{selectedActivity?.action}</DialogTitle>
            <DialogDescription>
              Detailed cryptographic and telemetry audit records captured during execution.
            </DialogDescription>
          </DialogHeader>

          {selectedActivity && (
            <div className="space-y-4 text-xs">
              {/* Telemetry Key-Value Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-border/40 bg-muted/20 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground">Client IP</span>
                  <p className="font-mono font-medium text-foreground">{selectedActivity.ip_address || "Unknown"}</p>
                </div>
                <div className="p-3 rounded-lg border border-border/40 bg-muted/20 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground">User / Account</span>
                  <p className="font-mono font-medium text-foreground truncate">
                    {selectedActivity.user_email || "Anonymous"}
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-border/40 bg-muted/20 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground">Environment</span>
                  <p className="text-foreground">
                    {selectedActivity.browser} · {selectedActivity.os} ({selectedActivity.device})
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-border/40 bg-muted/20 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground">Target Entity</span>
                  <p className="font-mono text-indigo-500 uppercase">{selectedActivity.entity || "General"}</p>
                </div>
              </div>

              {/* User Agent String */}
              {selectedActivity.user_agent && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-muted-foreground">User Agent String</label>
                  <p className="text-[11px] font-mono text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/40 break-all select-all">
                    {selectedActivity.user_agent}
                  </p>
                </div>
              )}

              {/* Payload Metadata */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Metadata Payload</label>
                <pre className="text-[11px] font-mono text-foreground bg-muted/40 p-3 rounded-lg border border-border/40 overflow-x-auto max-h-48 scrollbar-thin">
                  {JSON.stringify(selectedActivity.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedActivity(null)}
              className="cursor-target"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
