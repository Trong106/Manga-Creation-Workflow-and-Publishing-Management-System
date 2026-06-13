"use client"

import { MoreHorizontal, Star, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { API_BASE_URL } from "@/lib/api-config"

// Removed hardcoded mock projects array in favor of dynamic backend database mapping.

const statusColors: Record<string, string> = {
  ongoing: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400",
  planning: "bg-yellow-500/20 text-yellow-400",
}

export function ProjectList() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/data/series`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching projects:", err)
        setLoading(false)
      })
  }, [])

<<<<<<< Updated upstream
  return (
    <Card className="bg-card border-border mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Active Projects</CardTitle>
          <Button variant="outline" size="sm">View All</Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-zinc-400">Loading active series...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8 text-zinc-400">No active series found.</div>
        ) : (
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
=======
  const getFullCoverUrl = (coverPath?: string) => {
    if (!coverPath) return ""
    if (coverPath.startsWith("http")) return coverPath
    return `${API_BASE_URL}${coverPath}`
  }

  const handleCardClick = (id: string) => {
    setSelectedSeriesId(id)
    setIsModalOpen(true)
  }

  const getRelativeTimeString = (dateStr: string) => {
    const date = new Date(dateStr)
    const diffMs = new Date().getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) {
      const mins = diffMins || 1
      return `${mins} ${mins === 1 ? "minute" : "minutes"} ago`
    }
    if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`
    }
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          📖 New Releases
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-12 text-zinc-400 text-sm">Loading new releases...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 text-zinc-400 text-sm">No new releases found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {projects.map((project) => {
            const coverUrl = getFullCoverUrl(project.coverImageUrl)
            const updatedTime = getRelativeTimeString(project.updatedAtRaw)
            return (
              <div
                key={project.id}
                onClick={() => handleCardClick(project.id)}
                className="group cursor-pointer space-y-2.5"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-zinc-800 bg-[#202023] flex items-center justify-center">
                  {project.coverImageUrl ? (
                    <img
                      src={coverUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <BookOpen className="w-8 h-8 text-zinc-700 mx-auto mb-1" />
                      <span className="text-[10px] text-zinc-500">No cover</span>
                    </div>
                  )}

                  {/* Time Badge top-left */}
                  <div className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded bg-[#000000]/70 text-zinc-200 border border-zinc-800/40">
                    {updatedTime}
                  </div>

                  {/* Rating or Bookmark top-right */}
                  <div className="absolute top-2 right-2 p-1.5 rounded-full bg-[#000000]/60 text-white/90 hover:text-yellow-500 hover:bg-[#000000]/80 transition-colors">
                    <Bookmark className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm truncate text-zinc-100 group-hover:text-primary transition-colors leading-tight">
                    {project.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Chapter {project.chapters ?? 0}</span>
                    <span className="flex items-center gap-0.5 text-[10px] text-zinc-500">
                      <Eye className="w-3 h-3" />
                      {project.readerCount >= 1000 ? `${(project.readerCount / 1000).toFixed(1)}k` : project.readerCount}
                    </span>
>>>>>>> Stashed changes
                  </div>
                  <span className="text-xs text-muted-foreground">{project.progress}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-muted-foreground mr-2" />
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member: string) => (
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
        )}
      </CardContent>
    </Card>
  )
}
