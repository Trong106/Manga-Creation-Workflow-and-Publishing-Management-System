"use client"

import { Plus, BookOpen, Eye, MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mockSeries = [
  {
    id: "1",
    title: "Dragon Hunters",
    genre: ["Action", "Fantasy"],
    status: "active",
    chapters: 45,
    ranking: 3,
    rankChange: 2,
    progress: 78,
    coverColor: "from-orange-500 to-red-600",
  },
  {
    id: "2",
    title: "Night Bloom",
    genre: ["Romance", "Drama"],
    status: "active",
    chapters: 12,
    ranking: 8,
    rankChange: -1,
    progress: 45,
    coverColor: "from-pink-500 to-purple-600",
  },
  {
    id: "3",
    title: "Steel Dynasty",
    genre: ["Mecha", "Sci-Fi"],
    status: "proposal",
    chapters: 0,
    ranking: null,
    rankChange: 0,
    progress: 0,
    coverColor: "from-blue-500 to-cyan-600",
  },
]

const statusColors = {
  active: "bg-success/20 text-success",
  proposal: "bg-warning/20 text-warning",
  hiatus: "bg-muted text-muted-foreground",
  completed: "bg-primary/20 text-primary",
  cancelled: "bg-destructive/20 text-destructive",
}

export function MangakaSeries() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          My Series
        </CardTitle>
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Proposal
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockSeries.map((series) => (
            <div
              key={series.id}
              className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
            >
              {/* Cover placeholder */}
              <div
                className={`w-16 h-20 rounded-lg bg-gradient-to-br ${series.coverColor} flex items-center justify-center`}
              >
                <span className="text-2xl font-bold text-white/90">{series.title[0]}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold truncate">{series.title}</h4>
                  <Badge className={statusColors[series.status as keyof typeof statusColors]}>
                    {series.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {series.genre.map((g) => (
                    <Badge key={g} variant="outline" className="text-xs">
                      {g}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{series.chapters} chapters</span>
                  {series.ranking && (
                    <span className="flex items-center gap-1">
                      Rank #{series.ranking}
                      {series.rankChange > 0 ? (
                        <TrendingUp className="w-3 h-3 text-success" />
                      ) : series.rankChange < 0 ? (
                        <TrendingDown className="w-3 h-3 text-destructive" />
                      ) : null}
                    </span>
                  )}
                </div>
                {series.status === "active" && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Current chapter progress</span>
                      <span>{series.progress}%</span>
                    </div>
                    <Progress value={series.progress} className="h-1.5" />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="w-4 h-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Series</DropdownMenuItem>
                    <DropdownMenuItem>View Chapters</DropdownMenuItem>
                    <DropdownMenuItem>Team Settings</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
