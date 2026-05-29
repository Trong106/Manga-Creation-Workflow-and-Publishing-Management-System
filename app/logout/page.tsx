'use client';

import React from 'react';

export default function LogoutPage() {
  const handleLogout = () => {
    // 1. Xóa token lưu trong bộ nhớ trình duyệt (localStorage hoặc cookie)
    localStorage.removeItem('token');
    alert('Bạn đã đăng xuất thành công khỏi hệ thống MangaFlow!');
    
    // 2. Chuyển hướng người dùng quay trở lại trang đăng nhập
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', textAlign: 'center', backgroundColor: '#0f172a', minHeight: '100vh', color: '#fff' }}>
      <h1>Cấu hình Đăng xuất Hệ thống</h1>
      <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Bấm nút bên dưới để thử nghiệm luồng xóa dữ liệu phiên làm việc.</p>
      
      <button 
        onClick={handleLogout} 
        style={{ padding: '12px 24px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}
      >
        Xác nhận Đăng xuất (Logout)
      </button>
    </div>
  );
}