'use client';

import { useAuth } from "@/lib/auth-context";
import { StatsCards as MetricCard } from "@/components/manga/stats-cards";
import { TeamActivity as RecentActivity } from "@/components/manga/team-activity";
import { WorkflowBoard as QuickActions } from "@/components/manga/workflow-board";
import { ProjectList as MangaCarousel } from "@/components/manga/project-list";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api-config";

// Định nghĩa danh sách tính năng theo từng vai trò 
const ROLE_INFO: Record<string, { name: string; desc: string; metrics: { title: string; val: string; change: string; icon: string }[] }> = {
  mangaka: {
    name: 'Yuki Tanaka (Mangaka)',
    desc: 'Studio Owner / Main Artist',
    metrics: [
      { title: "Active Series", val: "3", change: "+1 this month", icon: "📚" },
      { title: "Team Members", val: "12", change: "4 Assistants active", icon: "👥" },
      { title: "Pages This Week", val: "24", change: "Target: 30 pages", icon: "📄" }
    ]
  },
  assistant: {
    name: 'Kenji Yamamoto (Assistant)',
    desc: 'Studio Assistant & Line Artist',
    metrics: [
      { title: "Assigned Tasks", val: "5 pending", change: "2 urgent tasks", icon: "📋" },
      { title: "Downloaded Pages", val: "14 pages", change: "Ready to ink", icon: "💾" },
      { title: "Earned Payroll", val: "$450", change: "This chapter cycle", icon: "💰" }
    ]
  },
  tantou: {
    name: 'Minh Nguyễn (Tantou Editor)',
    desc: 'Quality Control / Publishing Manager',
    metrics: [
      { title: "Studio Progress", val: "85%", change: "Chapter 45 in review", icon: "📉" },
      { title: "Pages to Review", val: "8 pages", change: "3 annotated edits", icon: "👀" },
      { title: "Publish Status", val: "Pending", change: "Waiting for approval", icon: "🚀" }
    ]
  },
  editorial: {
    name: 'Tuấn Đinh (Editorial Board)',
    desc: 'High-Level Publishing Authority',
    metrics: [
      { title: "New Proposals", val: "2 pending", change: "1 Action, 1 Romance", icon: "⚖️" },
      { title: "Reader Votes", val: "45.2K", change: "+12% overall traffic", icon: "🗳️" },
      { title: "Global Ranking", val: "Top 3", change: "Dragon Hunters series", icon: "🏆" }
    ]
  }
};

export default function Dashboard() {
  const { role, user } = useAuth();
  const currentRole = ROLE_INFO[role || 'mangaka'] || ROLE_INFO['mangaka'];
  const [metrics, setMetrics] = useState<any[]>(currentRole.metrics);

  useEffect(() => {
    if (role && user?.id) {
      fetch(`${API_BASE_URL}/api/data/dashboard-metrics?role=${role}&userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setMetrics(data);
          }
        })
        .catch((err) => {
          console.error("Error fetching dashboard metrics:", err);
        });
    }
  }, [role, user?.id]);

  // Đang đợi đọc bộ nhớ máy
  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const displayName = user?.name || currentRole.name;

  return (
    <div className="space-y-6">
      {/* Header góc trên */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Frontend Dashboard</h1>
          <p className="text-sm text-purple-400 mt-1">
            Welcome back, <span className="font-semibold text-white">{displayName}</span> —{" "}
            <span className="text-gray-400 text-xs italic">{currentRole.desc}</span>
          </p>
        </div>
      </div>

      {/* Khối danh sách các bộ truyện đang xử lý (Chỉ Mangaka và Editor cần xem cái này) */}
      {(role === 'mangaka' || role === 'tantou' || role === 'editorial') && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Active Series Portfolio</h2>
          <MangaCarousel />
        </div>
      )}

      {/* Bộ các chỉ số thống kê (Biến đổi động 100% theo vai trò được truyền từ Login) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m, idx) => (
          <MetricCard key={idx} title={m.title} value={m.val} change={m.change} icon={m.icon} />
        ))}
      </div>

      {/* Bố cục chia đôi bên dưới: Luồng hoạt động & Thao tác nhanh */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}