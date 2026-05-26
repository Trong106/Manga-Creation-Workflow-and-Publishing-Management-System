"use client"

import { useState } from "react"
import { MoreHorizontal, Plus, Clock, MessageSquare, Paperclip } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

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

const initialColumns: Column[] = [
  {
    id: "storyboard",
    title: "Storyboard",
    color: "bg-blue-500",
    tasks: [
      {
        id: "1",
        title: "Chapter 45 - Draft Layout",
        chapter: "Dragon Hunters",
        assignee: { name: "Yuki", avatar: "yuki" },
        dueDate: "May 22",
        comments: 3,
        attachments: 2,
        priority: "high",
        progress: 75,
      },
      {
        id: "2",
        title: "Chapter 12 - Page Flow",
        chapter: "Night Bloom",
        assignee: { name: "Kenji", avatar: "kenji" },
        dueDate: "May 24",
        comments: 1,
        attachments: 0,
        priority: "medium",
        progress: 40,
      },
    ],
  },
  {
    id: "penciling",
    title: "Penciling",
    color: "bg-yellow-500",
    tasks: [
      {
        id: "3",
        title: "Chapter 44 - Pages 1-10",
        chapter: "Dragon Hunters",
        assignee: { name: "Mei", avatar: "mei" },
        dueDate: "May 21",
        comments: 5,
        attachments: 4,
        priority: "high",
        progress: 90,
      },
    ],
  },
  {
    id: "inking",
    title: "Inking",
    color: "bg-orange-500",
    tasks: [
      {
        id: "4",
        title: "Chapter 43 - Final Lines",
        chapter: "Dragon Hunters",
        assignee: { name: "Takeshi", avatar: "takeshi" },
        dueDate: "May 20",
        comments: 2,
        attachments: 3,
        priority: "medium",
        progress: 60,
      },
      {
        id: "5",
        title: "Chapter 11 - Backgrounds",
        chapter: "Night Bloom",
        assignee: { name: "Hana", avatar: "hana" },
        dueDate: "May 23",
        comments: 0,
        attachments: 1,
        priority: "low",
        progress: 30,
      },
    ],
  },
  {
    id: "coloring",
    title: "Coloring",
    color: "bg-purple-500",
    tasks: [
      {
        id: "6",
        title: "Chapter 42 - Color Flats",
        chapter: "Dragon Hunters",
        assignee: { name: "Sakura", avatar: "sakura" },
        dueDate: "May 19",
        comments: 4,
        attachments: 6,
        priority: "high",
        progress: 85,
      },
    ],
  },
  {
    id: "lettering",
    title: "Lettering",
    color: "bg-teal-500",
    tasks: [
      {
        id: "7",
        title: "Chapter 41 - Dialogue",
        chapter: "Dragon Hunters",
        assignee: { name: "Ryu", avatar: "ryu" },
        dueDate: "May 18",
        comments: 1,
        attachments: 2,
        priority: "medium",
        progress: 95,
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    color: "bg-accent",
    tasks: [
      {
        id: "8",
        title: "Chapter 40 - Final QC",
        chapter: "Dragon Hunters",
        assignee: { name: "Yuki", avatar: "yuki" },
        dueDate: "May 17",
        comments: 6,
        attachments: 1,
        priority: "high",
        progress: 100,
      },
    ],
  },
]

const priorityColors = {
  low: "bg-green-500/20 text-green-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  high: "bg-red-500/20 text-red-400",
}

export function WorkflowBoard() {
  const [columns] = useState(initialColumns)

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
                {column.tasks.map((task) => (
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
                ))}
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
