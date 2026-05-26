"use client"

import { Eye, Check, X, MessageSquare, ZoomIn, ChevronLeft, ChevronRight, Pencil, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

const mockPages = Array.from({ length: 24 }, (_, i) => ({
  id: `${i + 1}`,
  number: i + 1,
  status: i < 20 ? "approved" : i < 22 ? "review" : "pending",
  hasAnnotations: i === 5 || i === 12,
}))

export default function ReviewPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSeries, setSelectedSeries] = useState("dragon-hunters")
  const [selectedChapter, setSelectedChapter] = useState("45")
  const [annotationMode, setAnnotationMode] = useState(false)
  const [comment, setComment] = useState("")

  const page = mockPages[currentPage - 1]

  const statusColors = {
    pending: "bg-muted text-muted-foreground",
    review: "bg-warning/20 text-warning",
    approved: "bg-success/20 text-success",
    rejected: "bg-destructive/20 text-destructive",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Eye className="w-8 h-8 text-primary" />
            Review Pages
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and annotate manga pages
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Viewer */}
        <div className="lg:col-span-3 space-y-4">
          {/* Selection Bar */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dragon-hunters">Dragon Hunters</SelectItem>
                    <SelectItem value="night-bloom">Night Bloom</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="45">Chapter 45</SelectItem>
                    <SelectItem value="44">Chapter 44</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex-1" />
                <Button
                  variant={annotationMode ? "default" : "outline"}
                  onClick={() => setAnnotationMode(!annotationMode)}
                  className={annotationMode ? "bg-primary text-primary-foreground" : ""}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Annotate
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Page Viewer */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="aspect-[3/4] bg-secondary rounded-lg flex items-center justify-center relative">
                <div className="text-center">
                  <p className="text-4xl font-bold text-muted-foreground mb-2">Page {currentPage}</p>
                  <p className="text-muted-foreground">Dragon Hunters - Chapter 45</p>
                  {annotationMode && (
                    <p className="text-sm text-primary mt-4">Click on the page to add annotations</p>
                  )}
                </div>
                
                {/* Mock annotation markers */}
                {page.hasAnnotations && (
                  <>
                    <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-warning rounded-full flex items-center justify-center cursor-pointer">
                      <span className="text-warning-foreground font-bold">1</span>
                    </div>
                    <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-warning rounded-full flex items-center justify-center cursor-pointer">
                      <span className="text-warning-foreground font-bold">2</span>
                    </div>
                  </>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Page</span>
                  <Select
                    value={currentPage.toString()}
                    onValueChange={(v) => setCurrentPage(parseInt(v))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPages.map((p) => (
                        <SelectItem key={p.id} value={p.number.toString()}>
                          {p.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground">of {mockPages.length}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(mockPages.length, currentPage + 1))}
                  disabled={currentPage === mockPages.length}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=yuki" />
                    <AvatarFallback>Y</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Yuki Tanaka</p>
                    <p className="text-xs text-muted-foreground">Submitted 2 hours ago</p>
                  </div>
                  <Badge className={statusColors[page.status as keyof typeof statusColors]}>
                    {page.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="text-destructive border-destructive/50">
                    <X className="w-4 h-4 mr-2" />
                    Request Revision
                  </Button>
                  <Button className="bg-success text-success-foreground hover:bg-success/90">
                    <Check className="w-4 h-4 mr-2" />
                    Approve Page
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Page Thumbnails */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm">Pages Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {mockPages.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setCurrentPage(p.number)}
                    className={`aspect-[3/4] rounded border-2 transition-colors relative ${
                      currentPage === p.number
                        ? "border-primary bg-primary/10"
                        : "border-border bg-secondary hover:border-primary/50"
                    }`}
                  >
                    <span className="text-xs">{p.number}</span>
                    {p.status === "approved" && (
                      <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-success rounded-full" />
                    )}
                    {p.hasAnnotations && (
                      <div className="absolute bottom-0.5 right-0.5 w-2 h-2 bg-warning rounded-full" />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-muted-foreground">Approved</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-warning rounded-full" />
                  <span className="text-muted-foreground">Has Notes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4" />
                Comments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=sakura" />
                      <AvatarFallback>S</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">Sakura Ito</span>
                    <span className="text-xs text-muted-foreground">1h ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The panel transitions look great. Just need a small fix on page 6.
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-20"
                />
                <Button size="sm" className="w-full bg-primary text-primary-foreground">
                  Post Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
