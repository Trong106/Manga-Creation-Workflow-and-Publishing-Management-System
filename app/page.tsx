"use client"

import { useAuth } from "@/lib/auth-context"
import { RoleBasedStats } from "@/components/dashboard/role-based-stats"
import { MangakaSeries } from "@/components/dashboard/mangaka-series"
import { AssistantTasks } from "@/components/dashboard/assistant-tasks"
import { AssistantEarnings } from "@/components/dashboard/assistant-earnings"
import { TantouReviewQueue } from "@/components/dashboard/tantou-review"
import { EditorialDashboard } from "@/components/dashboard/editorial-dashboard"
import { WorkflowBoard } from "@/components/manga/workflow-board"
import { TeamActivity } from "@/components/manga/team-activity"
import { DeadlineCalendar } from "@/components/manga/deadline-calendar"

const roleGreetings = {
  mangaka: {
    title: "Welcome back, Mangaka",
    subtitle: "Manage your series, team, and production workflow",
  },
  assistant: {
    title: "Welcome back, Assistant",
    subtitle: "View your assigned tasks and track your earnings",
  },
  tantou: {
    title: "Welcome back, Editor",
    subtitle: "Review submissions and track series progress",
  },
  editorial: {
    title: "Editorial Dashboard",
    subtitle: "Manage publishing decisions and series performance",
  },
}

export default function DashboardPage() {
  const { role, user } = useAuth()
  const greeting = roleGreetings[role]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting.title.replace("Mangaka", user?.name || "Mangaka").replace("Assistant", user?.name || "Assistant").replace("Editor", user?.name || "Editor")}
        </h1>
        <p className="text-muted-foreground mt-1">{greeting.subtitle}</p>
      </div>

      {/* Stats */}
      <RoleBasedStats />

      {/* Role-specific content */}
      {role === "mangaka" && (
        <div className="space-y-8">
          <MangakaSeries />
          <WorkflowBoard />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TeamActivity />
            </div>
            <DeadlineCalendar />
          </div>
        </div>
      )}

      {role === "assistant" && (
        <div className="space-y-8">
          <AssistantTasks />
          <AssistantEarnings />
        </div>
      )}

      {role === "tantou" && <TantouReviewQueue />}

      {role === "editorial" && <EditorialDashboard />}
    </div>
  )
}
