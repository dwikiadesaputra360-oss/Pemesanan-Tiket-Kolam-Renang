import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { createTicket, updateTicket, deleteTicket } from '../services/api';

interface TicketType {
  id: number;
  name: string;
  price: string | number;
}

interface TicketsTabProps {
  tickets: TicketType[];
  onRefresh: () => void;
}

const TicketsTab: React.FC<TicketsTabProps> = ({ tickets, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingTicketId, setEditingTicketId] = useState<number | null>(null);
  
  // Form States
  const [ticketName, setTicketName] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Deletion Confirmation
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const openAddModal = () => {
    setModalMode('add');
    setTicketName('');
    setTicketPrice('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (ticket: TicketType) => {
    setModalMode('edit');
    setEditingTicketId(ticket.id);
    setTicketName(ticket.name);
    setTicketPrice(ticket.price.toString());
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName.trim() || !ticketPrice.trim()) {
      setErrorMsg('Semua field harus diisi');
      return;
    }

    const priceNum = parseFloat(ticketPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMsg('Harga tiket tidak valid');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      if (modalMode === 'add') {
        await createTicket(ticketName, priceNum);
      } else if (modalMode === 'edit' && editingTicketId !== null) {
        await updateTicket(editingTicketId, ticketName, priceNum);
      }
      onRefresh();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving ticket:', err);
      setErrorMsg('Gagal menyimpan tiket. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deletingId === null) return;
    setLoading(true);
    try {
      await deleteTicket(deletingId);
      onRefresh();
      setDeletingId(null);
    } catch (err) {
      console.error('Failed to delete ticket:', err);
      alert('Gagal menghapus tiket. Pastikan tiket tidak sedang digunakan di tabel booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">
          <h2>Kelola Tiket Kolam Renang</h2>
          <p>Tambah, edit, dan hapus jenis tiket masuk kolam renang.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          Tambah Tiket Baru
        </button>
      </div>

      <div className="data-card">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Tiket</th>
                <th>Harga Tiket</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>#{ticket.id}</td>
                    <td style={{ fontWeight: 600 }}>{ticket.name}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                      {formatCurrency(parseFloat(ticket.price.toString()))}
                    </td>
                    <td className="text-right">
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          className="btn-icon edit"
                          title="Edit Tiket"
                          onClick={() => openEditModal(ticket)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-icon delete"
                          title="Hapus Tiket"
                          onClick={() => setDeletingId(ticket.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    Belum ada jenis tiket yang terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Glassmorphic Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>
            <div className="modal-header">
              <h3>{modalMode === 'add' ? 'Tambah Tiket Baru' : 'Edit Tiket'}</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {errorMsg && (
                  <div style={{ color: 'var(--color-danger)', background: 'rgba(239, 71, 111, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                    {errorMsg}
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="ticket-name">Nama Tiket</label>
                  <input
                    type="text"
                    id="ticket-name"
                    className="form-control"
                    placeholder="Contoh: Tiket Dewasa (Weekend)"
                    value={ticketName}
                    onChange={(e) => setTicketName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ticket-price">Harga Tiket (IDR)</label>
                  <input
                    type="number"
                    id="ticket-price"
                    className="form-control"
                    placeholder="Contoh: 50000"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
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
              <p>Apakah Anda yakin ingin menghapus tiket dengan ID <strong>#{deletingId}</strong>?</p>
              <p style={{ color: 'var(--color-danger)', fontSize: '13px', marginTop: '8px' }}>
                Perhatian: Tiket tidak bisa dihapus jika ada transaksi yang merujuk padanya.
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

export default TicketsTab;
