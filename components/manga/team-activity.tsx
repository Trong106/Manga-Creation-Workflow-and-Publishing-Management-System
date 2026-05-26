"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    id: "1",
    user: { name: "Yuki Tanaka", avatar: "yuki" },
    action: "completed inking for",
    target: "Chapter 44 - Page 15",
    project: "Dragon Hunters",
    time: "2 minutes ago",
    type: "complete",
  },
  {
    id: "2",
    user: { name: "Mei Suzuki", avatar: "mei" },
    action: "uploaded new sketch for",
    target: "Character Design - Villain",
    project: "Night Bloom",
    time: "15 minutes ago",
    type: "upload",
  },
  {
    id: "3",
    user: { name: "Takeshi Yamamoto", avatar: "takeshi" },
    action: "left a comment on",
    target: "Chapter 43 - Panel Layout",
    project: "Dragon Hunters",
    time: "32 minutes ago",
    type: "comment",
  },
  {
    id: "4",
    user: { name: "Sakura Ito", avatar: "sakura" },
    action: "started working on",
    target: "Chapter 42 - Color Flats",
    project: "Dragon Hunters",
    time: "1 hour ago",
    type: "start",
  },
  {
    id: "5",
    user: { name: "Kenji Nakamura", avatar: "kenji" },
    action: "requested review for",
    target: "Chapter 11 - Final Pages",
    project: "Night Bloom",
    time: "2 hours ago",
    type: "review",
  },
]

const typeBadges = {
  complete: "bg-green-500/20 text-green-400",
  upload: "bg-blue-500/20 text-blue-400",
  comment: "bg-yellow-500/20 text-yellow-400",
  start: "bg-purple-500/20 text-purple-400",
  review: "bg-accent/20 text-accent",
}

export function TeamActivity() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${activity.user.avatar}`} />
                <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>
                  <span className="text-muted-foreground"> {activity.action} </span>
                  <span className="font-medium">{activity.target}</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{activity.project}</Badge>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
              <Badge className={`${typeBadges[activity.type]} text-xs`}>
                {activity.type}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
