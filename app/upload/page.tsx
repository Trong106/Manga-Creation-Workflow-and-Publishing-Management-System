"use client"

import { useState } from "react"
import { Upload, X, ImageIcon, Folder, ChevronRight, Check, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const mockSeries = [
  { id: "1", title: "Dragon Hunters" },
  { id: "2", title: "Night Bloom" },
]

interface UploadedFile {
  id: string
  name: string
  size: string
  preview: string
  status: "uploading" | "complete" | "error"
  progress: number
}

export default function UploadPage() {
  const [selectedSeries, setSelectedSeries] = useState("")
  const [chapterNumber, setChapterNumber] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    { id: "1", name: "page_001.png", size: "2.4 MB", preview: "", status: "complete", progress: 100 },
    { id: "2", name: "page_002.png", size: "2.1 MB", preview: "", status: "complete", progress: 100 },
    { id: "3", name: "page_003.png", size: "2.8 MB", preview: "", status: "uploading", progress: 65 },
  ])
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // Handle file drop
    const files = Array.from(e.dataTransfer.files)
    const newFiles: UploadedFile[] = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      preview: "",
      status: "uploading",
      progress: 0,
    }))
    setUploadedFiles([...uploadedFiles, ...newFiles])
  }

  const removeFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Pages</h1>
        <p className="text-muted-foreground mt-1">Upload manga pages for your series chapters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Series Selection */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Select Series & Chapter</CardTitle>
              <CardDescription>Choose the series and chapter you want to upload pages to</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Series</Label>
                  <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select series" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSeries.map((series) => (
                        <SelectItem key={series.id} value={series.id}>
                          {series.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Chapter Number</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 45"
                    value={chapterNumber}
                    onChange={(e) => setChapterNumber(e.target.value)}
                  />
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Chapter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Chapter</DialogTitle>
                    <DialogDescription>Add a new chapter to your selected series</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Chapter Title</Label>
                      <Input placeholder="e.g., The Final Battle" />
                    </div>
                    <div className="space-y-2">
                      <Label>Chapter Number</Label>
                      <Input type="number" placeholder="e.g., 46" />
                    </div>
                  </div>
                  <Button className="w-full bg-primary text-primary-foreground">Create Chapter</Button>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Upload Zone */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>Drag and drop manga pages or click to browse</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Drop your pages here</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Support: PNG, JPG, PSD, TIFF (max 50MB per file)
                </p>
                <Button variant="outline">
                  <Folder className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Uploaded Pages ({uploadedFiles.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg"
                    >
                      <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{file.size}</p>
                        {file.status === "uploading" && (
                          <div className="mt-2">
                            <Progress value={file.progress} className="h-1.5" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {file.status === "complete" && (
                          <Badge className="bg-success/20 text-success">
                            <Check className="w-3 h-3 mr-1" />
                            Uploaded
                          </Badge>
                        )}
                        {file.status === "uploading" && (
                          <Badge className="bg-primary/20 text-primary">{file.progress}%</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Upload Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Series</span>
                <span className="font-medium">
                  {selectedSeries
                    ? mockSeries.find((s) => s.id === selectedSeries)?.title
                    : "Not selected"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Chapter</span>
                <span className="font-medium">{chapterNumber || "Not specified"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Pages</span>
                <span className="font-medium">{uploadedFiles.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge className="bg-warning/20 text-warning">Draft</Badge>
              </div>
              <div className="pt-4 border-t border-border">
                <Button className="w-full bg-primary text-primary-foreground" disabled={!selectedSeries || uploadedFiles.length === 0}>
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Continue to Region Selection
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Upload Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>- Name files sequentially (page_001, page_002...)</p>
              <p>- Use high resolution (300 DPI minimum)</p>
              <p>- Keep consistent page dimensions</p>
              <p>- Upload all pages before assigning tasks</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
