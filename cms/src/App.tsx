import { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, Ticket, Users, RefreshCw } from 'lucide-react';
import { getBookings, getTickets, getUsers } from './services/api';
import DashboardTab from './components/DashboardTab';
import BookingsTab from './components/BookingsTab';
import TicketsTab from './components/TicketsTab';
import UsersTab from './components/UsersTab';

type TabType = 'dashboard' | 'bookings' | 'tickets' | 'users';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [bookings, setBookings] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [bookingsRes, ticketsRes, usersRes] = await Promise.all([
        getBookings(),
        getTickets(),
        getUsers(),
      ]);

      setBookings(bookingsRes.data.data || []);
      setTickets(ticketsRes.data.data || []);
      setUsers(usersRes.data.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gagal memuat data dari server backend. Pastikan server backend sedang aktif.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const renderActiveTab = () => {
    if (loading && bookings.length === 0) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
          <RefreshCw size={40} className="animate-spin" style={{ color: 'var(--color-primary)', animation: 'spin 1.5s linear infinite' }} />
          <p style={{ color: 'var(--text-muted)' }}>Memuat data dari database...</p>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ background: 'rgba(239, 71, 111, 0.1)', border: '1px solid rgba(239, 71, 111, 0.3)', padding: '24px', borderRadius: '16px', marginTop: '20px' }}>
          <h3 style={{ color: 'var(--color-danger)', marginBottom: '8px', fontWeight: 700 }}>Koneksi Gagal</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>{error}</p>
          <button className="btn btn-primary" onClick={loadAllData}>
            <RefreshCw size={16} />
            Coba Lagi
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab bookings={bookings} tickets={tickets} users={users} />;
      case 'bookings':
        return <BookingsTab bookings={bookings} onRefresh={loadAllData} />;
      case 'tickets':
        return <TicketsTab tickets={tickets} onRefresh={loadAllData} />;
      case 'users':
        return <UsersTab users={users} />;
      default:
        return <DashboardTab bookings={bookings} tickets={tickets} users={users} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">T</div>
          <span className="sidebar-title">Pool Admin</span>
        </div>

        <ul className="sidebar-menu">
          <li>
            <div
              className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </div>
          </li>
          <li>
            <div
              className={`sidebar-item ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <Calendar size={20} />
              <span>Pemesanan</span>
            </div>
          </li>
          <li>
            <div
              className={`sidebar-item ${activeTab === 'tickets' ? 'active' : ''}`}
              onClick={() => setActiveTab('tickets')}
            >
              <Ticket size={20} />
              <span>Kelola Tiket</span>
            </div>
          </li>
          <li>
            <div
              className={`sidebar-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={20} />
              <span>Pengguna</span>
            </div>
          </li>
        </ul>

        <div className="sidebar-footer">
          <div className="admin-avatar">AD</div>
          <div className="admin-info">
            <h4>Admin Pool</h4>
            <p>Administrator</p>
          </div>
          <button 
            className="btn-icon" 
            title="Refresh Data" 
            onClick={loadAllData} 
            style={{ marginLeft: 'auto' }}
            disabled={loading}
          >
            <RefreshCw size={16} style={{ animation: loading ? 'spin 1.5s linear infinite' : 'none' }} />
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="main-content">
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default App;
