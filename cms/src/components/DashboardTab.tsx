import React from 'react';
import { DollarSign, Ticket, Calendar, Users, Tag } from 'lucide-react';

interface TicketType {
  id: number;
  name: string;
  price: string | number;
}

interface BookingType {
  id: number;
  user_name: string;
  ticket_name: string;
  quantity: number;
  total_price: string | number;
  created_at: string;
  payment_proof?: string;
}

interface UserType {
  id: number;
  full_name: string;
  email: string;
  created_at: string;
}

interface DashboardTabProps {
  bookings: BookingType[];
  tickets: TicketType[];
  users: UserType[];
}

const DashboardTab: React.FC<DashboardTabProps> = ({ bookings, tickets, users }) => {
  // Calculations
  const totalRevenue = bookings.reduce((sum, booking) => sum + parseFloat(booking.total_price.toString()), 0);
  const totalTicketsSold = bookings.reduce((sum, booking) => sum + booking.quantity, 0);
  const totalTransactions = bookings.length;
  const totalUsersCount = users.length;
  const totalTicketTypes = tickets.length;

  // Formatting helpers
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="fade-in">
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrapper" style={{ backgroundColor: 'rgba(6, 214, 160, 0.15)', color: '#06d6a0' }}>
            <DollarSign size={24} />
          </div>
          <div className="metric-info">
            <h3>{formatCurrency(totalRevenue)}</h3>
            <p>Total Pendapatan</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrapper" style={{ backgroundColor: 'rgba(58, 80, 107, 0.25)', color: '#3a86ff' }}>
            <Calendar size={24} />
          </div>
          <div className="metric-info">
            <h3>{totalTransactions}</h3>
            <p>Total Transaksi</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrapper" style={{ backgroundColor: 'rgba(131, 56, 236, 0.15)', color: '#8338ec' }}>
            <Ticket size={24} />
          </div>
          <div className="metric-info">
            <h3>{totalTicketsSold}</h3>
            <p>Tiket Terjual</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrapper" style={{ backgroundColor: 'rgba(239, 71, 111, 0.15)', color: '#ef476f' }}>
            <Tag size={24} />
          </div>
          <div className="metric-info">
            <h3>{totalTicketTypes}</h3>
            <p>Tipe Tiket</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrapper" style={{ backgroundColor: 'rgba(255, 209, 102, 0.15)', color: '#ffd166' }}>
            <Users size={24} />
          </div>
          <div className="metric-info">
            <h3>{totalUsersCount}</h3>
            <p>User Terdaftar</p>
          </div>
        </div>
      </div>

      <div className="data-card">
        <div className="card-header">
          <h2>Pemesanan Terbaru</h2>
          <span className="badge badge-info">{recentBookings.length} data terakhir</span>
        </div>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Pelanggan</th>
                <th>Tipe Tiket</th>
                <th>Jumlah</th>
                <th>Total Harga</th>
                <th>Waktu Pemesanan</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>#{booking.id}</td>
                    <td style={{ fontWeight: 600 }}>{booking.user_name}</td>
                    <td>{booking.ticket_name}</td>
                    <td>{booking.quantity}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>
                      {formatCurrency(parseFloat(booking.total_price.toString()))}
                    </td>
                    <td>{new Date(booking.created_at).toLocaleString('id-ID')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    Belum ada transaksi saat ini.
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

export default DashboardTab;
