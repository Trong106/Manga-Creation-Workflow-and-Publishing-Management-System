'use client';

import React, { useState } from 'react';

// Định nghĩa danh sách các vai trò (Roles) trong hệ thống MangaFlow
const ROLES = [
  { id: 'mangaka', name: '👨‍🎨 Mangaka', desc: 'Tác giả / Quản lý Studio', defaultEmail: 'yuki.tanaka@mangaflow.com' },
  { id: 'assistant', name: '🥷 Assistant', desc: 'Trợ lý xử lý bản thảo', defaultEmail: 'long.assistant@mangaflow.com' },
  { id: 'tantou', name: '📝 Tantou Editor', desc: 'Biên tập viên kiểm soát chất lượng', defaultEmail: 'minh.editor@mangaflow.com' },
  { id: 'editorial', name: '🏛️ Editorial Board', desc: 'Hội đồng duyệt & xuất bản', defaultEmail: 'tuan.board@mangaflow.com' },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('mangaka');
  const [email, setEmail] = useState(ROLES[0].defaultEmail);
  const [password, setPassword] = useState('123456');

  // Hàm xử lý khi người dùng bấm đổi Vai trò nhanh
  const handleRoleChange = (roleId: string, defaultEmail: string) => {
    setSelectedRole(roleId);
    setEmail(defaultEmail); // Tự động điền email mẫu để demo cho nhanh
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`[Đăng nhập hệ thống]\nVai trò: ${selectedRole.toUpperCase()}\nTài khoản: ${email}`);
    
    // Luồng điều hướng demo dựa trên vai trò được chọn
    if (selectedRole === 'mangaka') {
      window.location.href = '/'; // Quay về trang chủ dashboard mặc định của Mangaka
    } else {
      window.location.href = `/${selectedRole}`; // Đi đến các phân hệ tương ứng
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', width: '450px' }}>
        
        <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#38bdf8', fontSize: '28px' }}>MangaFlow Portal</h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '24px', fontSize: '14px' }}>Hệ thống quản lý quy trình sáng tác và xuất bản truyện tranh</p>
        
        {/* LỰA CHỌN NHIỆM VỤ / VAI TRÒ (ROLE SELECTOR) */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '10px', color: '#94a3b8', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase' }}>
            Chọn phân hệ nhiệm vụ đăng nhập:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {ROLES.map((role) => {
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleChange(role.id, role.defaultEmail)}
                  style={{
                    padding: '12px 8px',
                    borderRadius: '6px',
                    border: isSelected ? '2px solid #38bdf8' : '1px solid #475569',
                    backgroundColor: isSelected ? '#0369a1' : '#334155',
                    color: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{role.name}</div>
                  <div style={{ fontSize: '11px', color: isSelected ? '#e0f2fe' : '#94a3b8', marginTop: '2px' }}>{role.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        <hr style={{ border: '0', borderTop: '1px solid #334155', marginBottom: '24px' }} />

        {/* FORM ĐĂNG NHẬP THỰC TẾ */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Tài khoản hệ thống:</label>
            <input 
              type="text" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Nhập email hoặc username..." 
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
              required 
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Mật khẩu:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Nhập mật khẩu..." 
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
              required 
            />
          </div>

          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '14px', 
              borderRadius: '6px', 
              border: 'none', 
              backgroundColor: '#38bdf8', 
              color: '#0f172a', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              fontSize: '16px',
              boxShadow: '0 4px 6px -1px rgba(56, 189, 248, 0.2)'
            }}
          >
            Vào phân hệ làm việc
          </button>
        </form>

      </div>
    </div>
  );
}