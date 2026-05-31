'use client';

import { useEffect, useState } from 'react';
import { AppSidebar as Sidebar } from "@/components/app-sidebar";
import { StatsCards as MetricCard } from "@/components/manga/stats-cards";
import { TeamActivity as RecentActivity } from "@/components/manga/team-activity";
import { WorkflowBoard as QuickActions } from "@/components/manga/workflow-board";
import { ProjectList as MangaCarousel } from "@/components/manga/project-list";

// Định nghĩa danh sách tính năng theo từng vai trò như Toàn yêu cầu
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
    name: 'Ngọc Toàn (Assistant)',
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
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // 1. Đọc vai trò đã chọn từ trang Login lưu trong localStorage
    const savedRole = localStorage.getItem('userRole') || 'mangaka';
    setRole(savedRole);
  }, []);

  // Hàm Đăng xuất nhanh để test luồng
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // Đang đợi đọc bộ nhớ máy
  if (!role) return <div className="flex h-screen bg-[#050507] text-white items-center justify-center">Loading system...</div>;

  const currentRole = ROLE_INFO[role] || ROLE_INFO['mangaka'];

  return (
    <div className="flex h-screen bg-[#050507] text-white overflow-hidden">
      {/* Sidebar điều hướng bên trái */}
      <Sidebar />

      {/* Khu vực nội dung chính của Dashboard */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Header góc trên */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Studio Dashboard</h1>
            <p className="text-sm text-purple-400 mt-1">Welcome back, {currentRole.name} — <span className="text-gray-400 text-xs italic">{currentRole.desc}</span></p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-950 border border-red-800 rounded-lg text-sm font-medium text-red-200 hover:bg-red-900 transition"
            >
              🚪 Logout
            </button>
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-sm">
              {role.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Khối danh sách các bộ truyện đang xử lý (Chỉ Mangaka và Editor cần xem cái này) */}
        {(role === 'mangaka' || role === 'tantou' || role === 'editorial') && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Active Series Portfolio</h2>
            <MangaCarousel />
          </div>
        )}

        {/* Bộ các chỉ số thống kê (Biến đổi động 100% theo vai trò được truyền từ Login) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {currentRole.metrics.map((m, idx) => (
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
      </main>
    </div>
  );
}