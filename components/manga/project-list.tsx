"use client"

import { MoreHorizontal, Star, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const projects = [
  {
    id: "1",
    title: "Dragon Hunters",
    genre: "Action / Fantasy",
    chapters: 45,
    progress: 78,
    status: "ongoing",
    team: ["yuki", "mei", "takeshi", "sakura"],
    starred: true,
    color: "from-red-500 to-orange-500",
  },
  {
    id: "2",
    title: "Night Bloom",
    genre: "Romance / Drama",
    chapters: 12,
    progress: 45,
    status: "ongoing",
    team: ["kenji", "hana"],
    starred: false,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "3",
    title: "Cyber Samurai",
    genre: "Sci-Fi / Action",
    chapters: 28,
    progress: 100,
    status: "completed",
    team: ["ryu", "yuki", "mei"],
    starred: true,
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "4",
    title: "Spirit Academy",
    genre: "Supernatural / Comedy",
    chapters: 8,
    progress: 25,
    status: "planning",
    team: ["sakura", "kenji"],
    starred: false,
    color: "from-green-500 to-teal-500",
  },
]

const statusColors = {
  ongoing: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400",
  planning: "bg-yellow-500/20 text-yellow-400",
}

export function ProjectList() {
  return (
    <Card className="bg-card border-border mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Active Projects</CardTitle>
          <Button variant="outline" size="sm">View All</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="flex items-center gap-4 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer"
            >
              <div className={`w-12 h-16 rounded-lg bg-gradient-to-br ${project.color} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white font-bold text-lg">{project.title[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold truncate">{project.title}</h4>
                  {project.starred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                  <Badge className={statusColors[project.status]}>{project.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{project.genre} • {project.chapters} chapters</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex-1 max-w-32">
                    <Progress value={project.progress} className="h-1.5" />
                  </div>
                  <span className="text-xs text-muted-foreground">{project.progress}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-muted-foreground mr-2" />
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member) => (
                      <Avatar key={member} className="w-6 h-6 border-2 border-card">
                        <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${member}`} />
                        <AvatarFallback>{member[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                    ))}
                    {project.team.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-card">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
