import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface UserType {
  id: number;
  full_name: string;
  email: string;
  created_at: string;
}

interface UsersTabProps {
  users: UserType[];
}

const UsersTab: React.FC<UsersTabProps> = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter((user) =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toString().includes(searchTerm)
  );

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <div className="page-title">
          <h2>Pengguna Terdaftar</h2>
          <p>Daftar akun pelanggan yang terdaftar di sistem pemesanan tiket.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Cari pengguna..."
              className="form-control"
              style={{ paddingLeft: '40px', width: '250px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="data-card">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Lengkap</th>
                <th>Alamat Email</th>
                <th>Tanggal Pendaftaran</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td style={{ fontWeight: 600 }}>{user.full_name}</td>
                    <td style={{ color: 'var(--color-primary)' }}>{user.email}</td>
                    <td>{new Date(user.created_at).toLocaleString('id-ID')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    Tidak ada data pengguna yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersTab;
