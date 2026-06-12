import React, { useState } from 'react';
import { Trash2, Search, X } from 'lucide-react';
import { deleteBooking } from '../services/api';

interface BookingType {
  id: number;
  user_name: string;
  ticket_name: string;
  quantity: number;
  total_price: string | number;
  created_at: string;
  payment_proof?: string;
}

interface BookingsTabProps {
  bookings: BookingType[];
  onRefresh: () => void;
}

const BookingsTab: React.FC<BookingsTabProps> = ({ bookings, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const filteredBookings = bookings.filter((booking) =>
    booking.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.ticket_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.id.toString().includes(searchTerm)
  );

  const handleDelete = async () => {
    if (deletingId === null) return;
    setLoading(true);
    try {
      await deleteBooking(deletingId);
      onRefresh();
      setDeletingId(null);
    } catch (err) {
      console.error('Failed to delete booking:', err);
      alert('Gagal menghapus transaksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <div className="page-title">
          <h2>Daftar Pemesanan Tiket</h2>
          <p>Verifikasi bukti pembayaran QRIS dan kelola transaksi pelanggan.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Cari transaksi..."
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
                <th>Nama Pelanggan</th>
                <th>Tipe Tiket</th>
                <th>Jumlah</th>
                <th>Total Harga</th>
                <th>Bukti Pembayaran</th>
                <th>Waktu Transaksi</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>#{booking.id}</td>
                    <td style={{ fontWeight: 600 }}>{booking.user_name}</td>
                    <td>{booking.ticket_name}</td>
                    <td>{booking.quantity}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>
                      {formatCurrency(parseFloat(booking.total_price.toString()))}
                    </td>
                    <td>
                      {booking.payment_proof ? (
                        <img
                          src={booking.payment_proof}
                          alt={`Receipt ${booking.user_name}`}
                          className="proof-thumbnail"
                          onClick={() => setSelectedReceipt(booking.payment_proof || null)}
                        />
                      ) : (
                        <span className="no-proof">Belum Upload</span>
                      )}
                    </td>
                    <td>{new Date(booking.created_at).toLocaleString('id-ID')}</td>
                    <td className="text-right">
                      <button
                        className="btn-icon delete"
                        title="Hapus Transaksi"
                        onClick={() => setDeletingId(booking.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    Tidak ada data pemesanan yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lightbox Modal for Payment Receipt */}
      {selectedReceipt && (
        <div className="modal-overlay" onClick={() => setSelectedReceipt(null)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedReceipt(null)}>
              <X size={24} />
            </button>
            <div className="modal-header">
              <h3>Bukti Pembayaran QRIS</h3>
            </div>
            <div className="modal-body" style={{ display: 'flex', justifyContent: 'center' }}>
              <img src={selectedReceipt} alt="Bukti Pembayaran Penuh" className="lightbox-img" />
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      {deletingId !== null && (
        <div className="modal-overlay" onClick={() => setDeletingId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setDeletingId(null)}>
              <X size={20} />
            </button>
            <div className="modal-header">
              <h3>Konfirmasi Hapus</h3>
            </div>
            <div className="modal-body">
              <p>Apakah Anda yakin ingin menghapus transaksi pemesanan <strong>#{deletingId}</strong>?</p>
              <p style={{ color: 'var(--color-danger)', fontSize: '13px', marginTop: '8px' }}>
                Tindakan ini permanen dan tidak dapat dibatalkan.
              </p>
            </div>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setDeletingId(null)}>Batal</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
                {loading ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsTab;
