"use client"

import { useState } from "react"
import { Sparkles, Wand2, ScanText, Palette, Layers, Play, Check, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AIJob {
  id: string
  type: "segment" | "colorize" | "ocr"
  pageName: string
  status: "queued" | "processing" | "completed" | "failed"
  progress: number
  createdAt: string
}

const mockJobs: AIJob[] = [
  { id: "1", type: "segment", pageName: "page_001.png", status: "completed", progress: 100, createdAt: "5 min ago" },
  { id: "2", type: "colorize", pageName: "page_002.png", status: "processing", progress: 45, createdAt: "2 min ago" },
  { id: "3", type: "ocr", pageName: "page_003.png", status: "queued", progress: 0, createdAt: "Just now" },
]

const aiTools = [
  {
    id: "segment",
    title: "Auto-Segment Pages",
    description: "Automatically detect and separate regions like panels, speech bubbles, characters, and backgrounds",
    icon: Layers,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
  },
  {
    id: "colorize",
    title: "Auto-Colorize",
    description: "Apply AI-powered coloring to black and white manga pages with style consistency",
    icon: Palette,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
  },
  {
    id: "ocr",
    title: "Extract Text (OCR)",
    description: "Automatically extract text from speech bubbles and captions for translation or editing",
    icon: ScanText,
    color: "text-green-400",
    bgColor: "bg-green-500/20",
  },
]

const statusConfig = {
  queued: { label: "Queued", color: "bg-muted text-muted-foreground", icon: Clock },
  processing: { label: "Processing", color: "bg-primary/20 text-primary", icon: Play },
  completed: { label: "Completed", color: "bg-success/20 text-success", icon: Check },
  failed: { label: "Failed", color: "bg-destructive/20 text-destructive", icon: AlertCircle },
}

export default function AIToolsPage() {
  const [selectedTool, setSelectedTool] = useState("segment")
  const [selectedSeries, setSelectedSeries] = useState("")
  const [selectedChapter, setSelectedChapter] = useState("")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          AI Tools
        </h1>
        <p className="text-muted-foreground mt-1">
          Automate repetitive tasks with AI-powered tools
        </p>
      </div>

      <Tabs defaultValue="tools" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tools">AI Tools</TabsTrigger>
          <TabsTrigger value="jobs">Job History ({mockJobs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="tools" className="space-y-6">
          {/* Tool Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiTools.map((tool) => (
              <Card
                key={tool.id}
                className={`bg-card border-border cursor-pointer transition-all hover:border-primary/50 ${
                  selectedTool === tool.id ? "border-primary ring-1 ring-primary" : ""
                }`}
                onClick={() => setSelectedTool(tool.id)}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${tool.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <tool.icon className={`w-6 h-6 ${tool.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tool Configuration */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-primary" />
                Configure {aiTools.find((t) => t.id === selectedTool)?.title}
              </CardTitle>
              <CardDescription>Select the pages you want to process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Series</label>
                  <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select series" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dragon-hunters">Dragon Hunters</SelectItem>
                      <SelectItem value="night-bloom">Night Bloom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Chapter</label>
                  <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="45">Chapter 45</SelectItem>
                      <SelectItem value="44">Chapter 44</SelectItem>
                      <SelectItem value="43">Chapter 43</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pages</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Pages (24)</SelectItem>
                      <SelectItem value="1-10">Pages 1-10</SelectItem>
                      <SelectItem value="11-20">Pages 11-20</SelectItem>
                      <SelectItem value="custom">Custom Selection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tool-specific options */}
              {selectedTool === "segment" && (
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <h4 className="font-medium mb-3">Segmentation Options</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["Panels", "Speech Bubbles", "Characters", "Backgrounds", "Effects", "Text Areas"].map((option) => (
                      <label key={option} className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded border-border" />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {selectedTool === "colorize" && (
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <h4 className="font-medium mb-3">Colorization Style</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["Anime", "Watercolor", "Cel-shaded", "Realistic"].map((style) => (
                      <label key={style} className="flex items-center gap-2">
                        <input type="radio" name="style" className="rounded-full border-border" />
                        <span className="text-sm">{style}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {selectedTool === "ocr" && (
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <h4 className="font-medium mb-3">OCR Options</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Language</label>
                      <Select defaultValue="ja">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ja">Japanese</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ko">Korean</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <label className="flex items-center gap-2 self-end pb-2">
                      <input type="checkbox" defaultChecked className="rounded border-border" />
                      <span className="text-sm">Include sound effects</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button className="bg-primary text-primary-foreground">
                  <Play className="w-4 h-4 mr-2" />
                  Start Processing
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Recent Jobs</CardTitle>
              <CardDescription>View the status of your AI processing jobs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockJobs.map((job) => {
                const status = statusConfig[job.status]
                const tool = aiTools.find((t) => t.id === job.type)
                return (
                  <div
                    key={job.id}
                    className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg"
                  >
                    <div className={`w-10 h-10 ${tool?.bgColor} rounded-lg flex items-center justify-center`}>
                      {tool && <tool.icon className={`w-5 h-5 ${tool.color}`} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{tool?.title}</span>
                        <span className="text-muted-foreground">-</span>
                        <span className="text-sm text-muted-foreground">{job.pageName}</span>
                      </div>
                      {job.status === "processing" && (
                        <div className="flex items-center gap-3">
                          <Progress value={job.progress} className="flex-1 h-1.5" />
                          <span className="text-sm text-muted-foreground">{job.progress}%</span>
                        </div>
                      )}
                      {job.status !== "processing" && (
                        <span className="text-sm text-muted-foreground">{job.createdAt}</span>
                      )}
                    </div>
                    <Badge className={status.color}>
                      <status.icon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
