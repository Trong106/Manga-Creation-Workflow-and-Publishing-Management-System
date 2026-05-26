"use client"

import { useState } from "react"
import {
  BookOpen,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Clock,
  Users,
  FileText,
  TrendingUp,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Series {
  id: string
  title: string
  titleJp: string
  genre: string
  status: "ongoing" | "hiatus" | "completed"
  chapters: number
  totalPages: number
  currentChapter: number
  progress: number
  readers: number
  rating: number
  coverColor: string
  nextDeadline: string
  assistants: number
}

const seriesData: Series[] = [
  {
    id: "1",
    title: "Demon Blade Chronicles",
    titleJp: "鬼刃記",
    genre: "Action / Fantasy",
    status: "ongoing",
    chapters: 45,
    totalPages: 892,
    currentChapter: 46,
    progress: 65,
    readers: 125000,
    rating: 4.8,
    coverColor: "from-red-500/20 to-orange-500/20",
    nextDeadline: "2024-01-20",
    assistants: 3,
  },
  {
    id: "2",
    title: "Love in Tokyo",
    titleJp: "東京ラブストーリー",
    genre: "Romance / Slice of Life",
    status: "ongoing",
    chapters: 28,
    totalPages: 560,
    currentChapter: 29,
    progress: 40,
    readers: 89000,
    rating: 4.6,
    coverColor: "from-pink-500/20 to-purple-500/20",
    nextDeadline: "2024-01-25",
    assistants: 2,
  },
  {
    id: "3",
    title: "Cyber Detective",
    titleJp: "サイバー探偵",
    genre: "Sci-Fi / Mystery",
    status: "hiatus",
    chapters: 15,
    totalPages: 300,
    currentChapter: 16,
    progress: 0,
    readers: 45000,
    rating: 4.3,
    coverColor: "from-cyan-500/20 to-blue-500/20",
    nextDeadline: "TBD",
    assistants: 1,
  },
  {
    id: "4",
    title: "Spirit World Academy",
    titleJp: "霊界学園",
    genre: "Supernatural / Comedy",
    status: "completed",
    chapters: 120,
    totalPages: 2400,
    currentChapter: 120,
    progress: 100,
    readers: 250000,
    rating: 4.9,
    coverColor: "from-purple-500/20 to-indigo-500/20",
    nextDeadline: "Completed",
    assistants: 0,
  },
]

const statusConfig = {
  ongoing: { label: "Ongoing", color: "bg-green-500/20 text-green-400" },
  hiatus: { label: "Hiatus", color: "bg-yellow-500/20 text-yellow-400" },
  completed: { label: "Completed", color: "bg-blue-500/20 text-blue-400" },
}

export default function SeriesPage() {
  const [series, setSeries] = useState<Series[]>(seriesData)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const totalReaders = series.reduce((acc, s) => acc + s.readers, 0)
  const activeSeries = series.filter((s) => s.status === "ongoing").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            My Series
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all your manga series and chapters
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Series
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Series</DialogTitle>
              <DialogDescription>
                Start a new manga series. You can add chapters and pages later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title (English)</Label>
                <Input id="title" placeholder="Enter series title" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="titleJp">Title (Japanese)</Label>
                <Input id="titleJp" placeholder="日本語タイトル" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="genre">Genre</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="action">Action</SelectItem>
                    <SelectItem value="romance">Romance</SelectItem>
                    <SelectItem value="comedy">Comedy</SelectItem>
                    <SelectItem value="fantasy">Fantasy</SelectItem>
                    <SelectItem value="scifi">Sci-Fi</SelectItem>
                    <SelectItem value="horror">Horror</SelectItem>
                    <SelectItem value="slice-of-life">Slice of Life</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="synopsis">Synopsis</Label>
                <Textarea
                  id="synopsis"
                  placeholder="Brief description of your manga..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateOpen(false)}>Create Series</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{series.length}</p>
                <p className="text-xs text-muted-foreground">Total Series</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeSeries}</p>
                <p className="text-xs text-muted-foreground">Active Series</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Eye className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{(totalReaders / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground">Total Readers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <FileText className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {series.reduce((acc, s) => acc + s.totalPages, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Pages</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Series Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {series.map((s) => (
          <Card
            key={s.id}
            className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors"
          >
            <CardContent className="p-0">
              <div className="flex">
                {/* Cover placeholder */}
                <div
                  className={`w-32 h-44 bg-gradient-to-br ${s.coverColor} rounded-l-lg flex items-center justify-center shrink-0`}
                >
                  <BookOpen className="w-10 h-10 text-foreground/30" />
                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{s.title}</h3>
                      <p className="text-sm text-muted-foreground">{s.titleJp}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Series
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {s.genre}
                    </Badge>
                    <Badge className={statusConfig[s.status].color}>
                      {statusConfig[s.status].label}
                    </Badge>
                  </div>

                  <div className="mt-auto pt-3 space-y-2">
                    {s.status === "ongoing" && (
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">
                            Chapter {s.currentChapter} Progress
                          </span>
                          <span className="font-medium">{s.progress}%</span>
                        </div>
                        <Progress value={s.progress} className="h-1.5" />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {s.chapters} ch
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {(s.readers / 1000).toFixed(0)}K
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {s.assistants}
                        </span>
                      </div>
                      {s.status === "ongoing" && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {s.nextDeadline}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
