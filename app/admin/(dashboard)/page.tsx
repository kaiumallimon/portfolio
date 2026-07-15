import Link from "next/link";
import {
  getProjects,
  getAchievements,
  getActivities,
  getEducation,
  getSkills,
  getHobbies,
  getMetrics,
  getContactMessages,
  getSiteSettings,
} from "@/lib/data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  FolderKanban,
  Award,
  Mail,
  Code2,
  ExternalLink,
  Plus,
  Activity as ActivityIcon,
  GraduationCap,
  Gamepad2,
  BarChart3,
  MessagesSquare,
} from "lucide-react";
import { DonutChart } from "@/components/admin/charts/donut";
import { BarChart } from "@/components/admin/charts/bar-chart";
import { AreaChart } from "@/components/admin/charts/area-chart";
import { HBarChart } from "@/components/admin/charts/hbar-chart";
import type { Achievement } from "@/types/content";

export const dynamic = "force-dynamic";

const C = {
  indigo: "#6366f1",
  emerald: "#10b981",
  sky: "#0ea5e9",
  amber: "#f59e0b",
  fuchsia: "#d946ef",
  rose: "#f43f5e",
  violet: "#8b5cf6",
  cyan: "#06b6d4",
  slate: "#64748b",
};

function Kpi({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: number | string;
  sub: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${color}1f`, color }}
          >
            <Icon className="h-4 w-4" />
          </span>
        </div>
        <div className="mt-3 text-3xl font-bold tabular-nums text-foreground">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
      </CardContent>
    </Card>
  );
}

export default async function AdminOverview() {
  const [settings, projects, achievements, activities, education, skills, hobbies, metrics, messages] =
    await Promise.all([
      getSiteSettings(),
      getProjects(),
      getAchievements(),
      getActivities(),
      getEducation(),
      getSkills(),
      getHobbies(),
      getMetrics(),
      getContactMessages(),
    ]);

  const unread = messages.filter((m) => !m.read).length;
  const displayName = settings?.display_name || "Admin";

  // ---- Distributions ----
  const mobile = projects.filter((p) => p.client === "mobile").length;
  const web = projects.filter((p) => p.client === "web").length;
  const otherProjects = projects.length - mobile - web;

  const projectsByType = [
    { label: "Mobile", value: mobile, color: C.sky },
    { label: "Web", value: web, color: C.indigo },
    { label: "Other", value: otherProjects, color: C.slate },
  ];

  const rankMeta: { key: Achievement["award_rank"]; label: string; color: string }[] = [
    { key: "champion", label: "Champion", color: C.amber },
    { key: "1st-runner-up", label: "1st Runner-up", color: C.indigo },
    { key: "2nd-runner-up", label: "2nd Runner-up", color: C.sky },
    { key: "other", label: "Other", color: C.slate },
  ];
  const achievementsByRank = rankMeta.map((r) => ({
    label: r.label,
    value: achievements.filter((a) => a.award_rank === r.key).length,
    color: r.color,
  }));

  const activeActivities = activities.filter((a) => a.active).length;
  const activityStatus = [
    { label: "Active", value: activeActivities, color: C.emerald },
    { label: "Inactive", value: activities.length - activeActivities, color: C.slate },
  ];

  const currentEducation = education.filter((e) => e.status === "current").length;
  const educationStatus = [
    { label: "Current", value: currentEducation, color: C.indigo },
    { label: "Completed", value: education.length - currentEducation, color: C.emerald },
  ];

  const skillsPerCategory = skills
    .map((s) => ({
      label: s.category,
      value: s.skills?.length ?? 0,
      color: C.fuchsia,
    }))
    .sort((a, b) => b.value - a.value);

  const featuredMetrics = metrics.filter((m) => m.featured).length;

  // ---- Messages timeline (last 6 months) ----
  const now = new Date();
  const months: { key: string; label: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleString("en", { month: "short" }),
      count: 0,
    });
  }
  for (const m of messages) {
    const d = new Date(m.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const found = months.find((x) => x.key === key);
    if (found) found.count++;
  }
  const messagesTimeline = months.map((m) => ({ label: m.label, value: m.count }));

  const contentOverview = [
    { label: "Projects", value: projects.length, color: C.indigo },
    { label: "Awards", value: achievements.length, color: C.amber },
    { label: "Activities", value: activities.length, color: C.emerald },
    { label: "Education", value: education.length, color: C.sky },
    { label: "Skills", value: skills.length, color: C.fuchsia },
    { label: "Hobbies", value: hobbies.length, color: C.rose },
    { label: "Metrics", value: metrics.length, color: C.violet },
    { label: "Messages", value: messages.length, color: C.cyan },
  ];

  const recentMessages = messages.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Overview</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Welcome back, {displayName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s an analytical snapshot of your portfolio content.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/" target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Site
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/projects">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          label="Projects"
          value={projects.length}
          sub={`${mobile} mobile · ${web} web`}
          icon={FolderKanban}
          color={C.indigo}
        />
        <Kpi
          label="Achievements"
          value={achievements.length}
          sub={`${achievementsByRank[0].value} championships`}
          icon={Award}
          color={C.amber}
        />
        <Kpi
          label="Messages"
          value={messages.length}
          sub={`${unread} unread`}
          icon={Mail}
          color={C.cyan}
        />
        <Kpi
          label="Skill Categories"
          value={skills.length}
          sub={`${skills.reduce((s, c) => s + (c.skills?.length ?? 0), 0)} skills`}
          icon={Code2}
          color={C.fuchsia}
        />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Content Overview</CardTitle>
            <CardDescription>Total entries across every content type.</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={contentOverview} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projects by Type</CardTitle>
            <CardDescription>Mobile vs web vs other.</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={projectsByType} unit="Projects" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Messages Timeline</CardTitle>
            <CardDescription>Incoming contact messages over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChart data={messagesTimeline} color={C.cyan} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements by Rank</CardTitle>
            <CardDescription>Distribution of award ranks.</CardDescription>
          </CardHeader>
          <CardContent>
            <HBarChart data={achievementsByRank} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Skills by Category</CardTitle>
            <CardDescription>Number of skills per category.</CardDescription>
          </CardHeader>
          <CardContent>
            <HBarChart data={skillsPerCategory} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Status</CardTitle>
            </CardHeader>
            <CardContent>
              <DonutChart data={activityStatus} size={150} thickness={18} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <DonutChart data={educationStatus} size={150} thickness={18} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom: recent messages + content health */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Latest contact form submissions.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/messages">
                View all
                <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentMessages.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No messages yet.
              </p>
            ) : (
              recentMessages.map((m) => (
                <Link
                  key={m.id}
                  href={`/admin/messages?email=${encodeURIComponent(m.email ?? "")}`}
                  className="flex items-center gap-3 rounded-lg border border-border/40 p-3 transition-colors hover:bg-muted/40"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-sm font-medium text-white">
                    {(m.name?.charAt(0) || "A").toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-foreground">
                        {m.name || "Anonymous"}
                      </span>
                      {!m.read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {m.message}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Health</CardTitle>
            <CardDescription>Quick aggregate stats.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <HealthRow
              icon={ActivityIcon}
              label="Active activities"
              value={`${activeActivities} / ${activities.length}`}
              color={C.emerald}
            />
            <HealthRow
              icon={GraduationCap}
              label="Current education"
              value={`${currentEducation} / ${education.length}`}
              color={C.indigo}
            />
            <HealthRow
              icon={BarChart3}
              label="Featured metrics"
              value={`${featuredMetrics} / ${metrics.length}`}
              color={C.violet}
            />
            <HealthRow
              icon={Gamepad2}
              label="Hobbies"
              value={`${hobbies.length}`}
              color={C.rose}
            />
            <HealthRow
              icon={MessagesSquare}
              label="Unread messages"
              value={`${unread}`}
              color={C.cyan}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function HealthRow({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" style={{ color }} />
        {label}
      </span>
      <span className="text-sm font-semibold tabular-nums text-foreground">
        {value}
      </span>
    </div>
  );
}
