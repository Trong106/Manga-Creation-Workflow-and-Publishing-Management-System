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
import { useState, useEffect } from "react"
import { API_BASE_URL } from "@/lib/api-config"

export default function ReviewPage() {
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSeries, setSelectedSeries] = useState("dragon-hunters")
  const [selectedChapter, setSelectedChapter] = useState("45")
  const [annotationMode, setAnnotationMode] = useState(false)
  const [comment, setComment] = useState("")

  useEffect(() => {
    setLoading(true)
    fetch(`${API_BASE_URL}/api/data/review-pages`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPages(data)
          if (data.length > 0) {
            setCurrentPage(1)
          }
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching review pages:", err)
        setLoading(false)
      })
  }, [])

  const page = pages[currentPage - 1]

  const statusColors = {
    pending: "bg-muted text-muted-foreground",
    review: "bg-warning/20 text-warning",
    approved: "bg-success/20 text-success",
    rejected: "bg-destructive/20 text-destructive",
  }

  return (
    <div className="space-y-6">
<<<<<<< Updated upstream
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Eye className="w-8 h-8 text-primary" />
            Review Pages
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and annotate manga pages
          </p>
=======
      {/* SCREEN 1: Review Queue List */}
      {!activeSeriesId ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Eye className="w-8 h-8 text-primary" />
              Review Pages Queue
            </h1>
            <p className="text-muted-foreground mt-1">
              Danh sách truyện có trang vẽ hoàn thành chờ duyệt (Được xếp theo thời gian hoàn thành sớm nhất).
            </p>
          </div>

          {loadingQueue ? (
            <div className="text-center py-12 text-zinc-400 text-sm">Đang tải hàng đợi duyệt bài...</div>
          ) : reviewSeries.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm">Không có trang truyện nào cần duyệt hiện tại. 🎉</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {reviewSeries.map((s) => {
                const coverUrl = getFullCoverUrl(s.coverImageUrl)
                const relativeTime = getRelativeTime(s.oldestReviewPageTime)
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveSeriesId(s.id)
                      setActiveSeriesTitle(s.title)
                    }}
                    className="group cursor-pointer space-y-2.5"
                  >
                    {/* Image Cover */}
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-zinc-800 bg-[#202023] flex items-center justify-center">
                      {s.coverImageUrl ? (
                        <img
                          src={coverUrl}
                          alt={s.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <BookOpen className="w-8 h-8 text-zinc-700 mx-auto mb-1" />
                          <span className="text-[10px] text-zinc-500">No cover</span>
                        </div>
                      )}

                      {/* Time Badge top-left */}
                      <div className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded bg-amber-500 text-black font-bold flex items-center gap-1 shadow-lg">
                        <Clock className="w-3 h-3" />
                        {relativeTime}
                      </div>
                    </div>

                    {/* Text info */}
                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-sm truncate text-zinc-100 group-hover:text-primary transition-colors leading-tight">
                        {s.title}
                      </h4>
                      <p className="text-xs text-zinc-400">
                        {s.chapters} chapters • {s.genre}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
>>>>>>> Stashed changes
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

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              {loading ? (
                <div className="aspect-[3/4] bg-secondary rounded-lg flex items-center justify-center relative text-zinc-400">
                  Loading manga pages...
                </div>
              ) : pages.length === 0 ? (
                <div className="aspect-[3/4] bg-secondary rounded-lg flex items-center justify-center relative text-zinc-400">
                  No pages found in this chapter.
                </div>
              ) : (
                <div className="aspect-[3/4] bg-secondary rounded-lg flex items-center justify-center relative overflow-hidden">
                  {page?.imageUrl ? (
                    <img
                      src={page.imageUrl}
                      alt={`Page ${currentPage}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <p className="text-4xl font-bold text-muted-foreground mb-2">Page {currentPage}</p>
                      <p className="text-muted-foreground">Dragon Hunters - Chapter 45</p>
                      {annotationMode && (
                        <p className="text-sm text-primary mt-4">Click on the page to add annotations</p>
                      )}
                    </div>
                  )}
                  
                  {/* Dynamic annotations */}
                  {page?.annotations?.map((ann: any, index: number) => (
                    <div
                      key={ann.id}
                      style={{
                        left: `${ann.x}%`,
                        top: `${ann.y}%`,
                      }}
                      title={ann.body}
                      className="absolute w-8 h-8 bg-warning rounded-full flex items-center justify-center cursor-pointer -translate-x-1/2 -translate-y-1/2"
                    >
                      <span className="text-warning-foreground font-bold text-xs">{index + 1}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || pages.length === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Page</span>
                  <Select
                    value={currentPage.toString()}
                    onValueChange={(v) => setCurrentPage(parseInt(v))}
                    disabled={pages.length === 0}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pages.map((p) => (
                        <SelectItem key={p.id} value={p.number.toString()}>
                          {p.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground">of {pages.length}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(pages.length, currentPage + 1))}
                  disabled={currentPage === pages.length || pages.length === 0}
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
                  <Badge className={statusColors[(page?.status || "pending") as keyof typeof statusColors]}>
                    {page?.status || "pending"}
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
              {loading ? (
                <div className="text-center py-4 text-xs text-muted-foreground">Loading overview...</div>
              ) : pages.length === 0 ? (
                <div className="text-center py-4 text-xs text-muted-foreground">No pages.</div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {pages.map((p) => (
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
              )}
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
              <div className="space-y-3 max-h-[250px] overflow-y-auto">
                {page?.comments?.map((c: any) => (
                  <div key={c.id} className="p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${c.avatar}`} />
                        <AvatarFallback>{c.userName?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{c.userName}</span>
                      <span className="text-xs text-muted-foreground">{c.createdAt}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {c.body}
                    </p>
                  </div>
                ))}
                {(!page?.comments || page.comments.length === 0) && (
                  <p className="text-xs text-muted-foreground text-center py-4">No comments for this page.</p>
                )}
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
