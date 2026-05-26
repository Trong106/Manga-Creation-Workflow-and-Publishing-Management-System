"use client"

import { TrendingUp, TrendingDown, BookOpen, Users, Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    title: "Active Projects",
    value: "12",
    change: "+2",
    trend: "up",
    icon: BookOpen,
  },
  {
    title: "Team Members",
    value: "28",
    change: "+5",
    trend: "up",
    icon: Users,
  },
  {
    title: "Hours This Week",
    value: "164",
    change: "-12",
    trend: "down",
    icon: Clock,
  },
  {
    title: "Completed Tasks",
    value: "89",
    change: "+15",
    trend: "up",
    icon: CheckCircle2,
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
