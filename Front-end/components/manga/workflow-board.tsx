"use client"

import { useState, useEffect } from "react"
import { MoreHorizontal, Plus, Clock, MessageSquare, Paperclip, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { API_BASE_URL } from "@/lib/api-config"

interface Task {
  id: string
  title: string
  chapter: string
  assignee: { name: string; avatar: string }
  dueDate: string
  comments: number
  attachments: number
  priority: "low" | "medium" | "high"
  progress?: number
}

interface Column {
  id: string
  title: string
  color: string
  tasks: Task[]
}

const DEFAULT_COLUMNS = [
  {
    id: "storyboard",
    title: "Storyboard",
    color: "bg-blue-500",
  },
  {
    id: "penciling",
    title: "Penciling",
    color: "bg-yellow-500",
  },
  {
    id: "inking",
    title: "Inking",
    color: "bg-orange-500",
  },
  {
    id: "coloring",
    title: "Coloring",
    color: "bg-purple-500",
  },
  {
    id: "lettering",
    title: "Lettering",
    color: "bg-teal-500",
  },
  {
    id: "review",
    title: "Review",
    color: "bg-accent",
  },
]

const priorityColors = {
  low: "bg-green-500/20 text-green-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  high: "bg-red-500/20 text-red-400",
}

function getColumnIdFromTaskType(type: string): string {
  const t = type.toLowerCase()
  if (t === "line_art") return "penciling"
  if (t === "background" || t === "effects") return "inking"
  if (t === "coloring") return "coloring"
  if (t === "lettering") return "lettering"
  if (t === "review") return "review"
  return "storyboard" // Fallback / storyboard
}

function formatDueDate(dateStr: string): string {
  if (!dateStr || dateStr === "TBD") return "TBD"
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${months[date.getMonth()]} ${date.getDate()}`
  } catch {
    return dateStr
  }
}

export function WorkflowBoard() {
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS.map(col => ({ ...col, tasks: [] })))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/data/tasks`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch workflow tasks")
        return res.json()
      })
      .then((data: any[]) => {
        const updatedColumns = DEFAULT_COLUMNS.map((col) => {
          const colTasks = data
            .filter((t) => getColumnIdFromTaskType(t.type) === col.id)
            .map((t) => {
              // Generate deterministic values for comments & attachments based on task ID hash
              const hash = t.id.replace(/-/g, "")
              const comments = (parseInt(hash.substring(0, 2), 16) % 5) || 0
              const attachments = (parseInt(hash.substring(2, 4), 16) % 4) || 0
              
              // Priority mapping based on status
              let priority: "low" | "medium" | "high" = "medium"
              if (t.status === "revision" || t.status === "rejected") {
                priority = "high"
              } else if (t.status === "pending") {
                priority = "low"
              }

              // Progress mapping based on status
              const progressMap: Record<string, number> = {
                pending: 10,
                in_progress: 50,
                submitted: 80,
                approved: 100,
                revision: 40,
                cancelled: 0,
              }
              const progress = progressMap[t.status.toLowerCase()] || 0

              return {
                id: t.id,
                title: t.title,
                chapter: `${t.seriesTitle} (Ch ${t.chapterNumber})`,
                assignee: {
                  name: t.assigneeName || "Unassigned",
                  avatar: t.assigneeAvatar || "kenji",
                },
                dueDate: formatDueDate(t.dueDate),
                comments,
                attachments,
                priority,
                progress,
              }
            })

          return {
            ...col,
            tasks: colTasks,
          }
        })
        setColumns(updatedColumns)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center min-h-[200px] border border-border rounded-lg bg-card text-muted-foreground p-6">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
        <p className="text-sm">Loading Production Pipeline...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-8 p-4 border border-red-900 bg-red-950/20 text-red-400 rounded-lg text-sm">
        Error loading pipeline: {error}
      </div>
    )
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Production Pipeline</h2>
          <p className="text-muted-foreground mt-1">Track your manga through every stage</p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${column.color}`} />
                    <CardTitle className="text-base">{column.title}</CardTitle>
                    <Badge variant="secondary" className="ml-2">{column.tasks.length}</Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {column.tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 border border-dashed border-border rounded-lg text-muted-foreground text-xs">
                    No tasks in this stage
                  </div>
                ) : (
                  column.tasks.map((task) => (
                    <Card key={task.id} className="bg-secondary border-border hover:border-accent/50 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge className={priorityColors[task.priority]}>
                            {task.priority}
                          </Badge>
                          <Button variant="ghost" size="icon" className="w-6 h-6 -mr-2 -mt-1">
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </div>
                        <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                        <p className="text-xs text-muted-foreground mb-3">{task.chapter}</p>
                        {task.progress !== undefined && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span>{task.progress}%</span>
                            </div>
                            <Progress value={task.progress} className="h-1.5" />
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {task.dueDate}
                            </span>
                            {task.comments > 0 && (
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                {task.comments}
                              </span>
                            )}
                            {task.attachments > 0 && (
                              <span className="flex items-center gap-1">
                                <Paperclip className="w-3 h-3" />
                                {task.attachments}
                              </span>
                            )}
                          </div>
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${task.assignee.avatar}`} />
                            <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
                          </Avatar>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Add task
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
