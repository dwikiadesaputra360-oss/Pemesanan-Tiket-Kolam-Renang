import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, Image, TouchableOpacity, Modal, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getBookingHistory, deleteBooking } from '../services/api';
import { RootStackParamList, BookingHistoryItem } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

const HistoryScreen: React.FC<Props> = ({ navigation }) => {
  const [history, setHistory] = useState<BookingHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<BookingHistoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await getBookingHistory();
      if (response.data.success) {
        setHistory(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Gagal memuat riwayat pesanan.');
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async (id: number) => {
    try {
      const response = await deleteBooking(id);
      if (response.data.success) {
        fetchHistory();
      }
    } catch (err) {
      console.error(err);
      if (Platform.OS === 'web') {
        alert('Gagal menghapus riwayat.');
      } else {
        Alert.alert('Eror', 'Gagal menghapus riwayat.');
      }
    }
  };

  const handleDelete = (id: number) => {
    if (Platform.OS === 'web') {
      const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus riwayat pemesanan ini?');
      if (confirmDelete) {
        executeDelete(id);
      }
    } else {
      Alert.alert(
        'Konfirmasi Hapus',
        'Apakah Anda yakin ingin menghapus riwayat pemesanan ini?',
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Hapus',
            style: 'destructive',
            onPress: () => executeDelete(id)
          }
        ]
      );
    }
  };

  const renderItem = ({ item }: { item: BookingHistoryItem }) => {
    const date = new Date(item.created_at).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={14} color="#666" />
            <Text style={styles.dateText}>{date}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Berhasil</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={16} color="#e53935" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.cardBody}>
          <Text style={styles.ticketName}>{item.ticket_name}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color="#888" />
            <Text style={styles.infoText}>{item.user_name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="ticket-outline" size={16} color="#888" />
            <Text style={styles.infoText}>{item.quantity} Tiket</Text>
          </View>

          {item.payment_proof ? (
            <TouchableOpacity 
              style={styles.proofButton} 
              onPress={() => setSelectedItem(item)}
            >
              <Ionicons name="receipt-outline" size={16} color="#00b4db" />
              <Text style={styles.proofButtonText}>Lihat Struk & Bukti Bayar</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.totalLabel}>Total Pembayaran</Text>
          <Text style={styles.totalPrice}>Rp {Number(item.total_price).toLocaleString('id-ID')}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#103783" />
      </View>
    );
  }

  const filteredHistory = history.filter(item => 
    item.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.ticket_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#103783', '#00b4db']}
        style={styles.headerGradient}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Riwayat Pesanan</Text>
            <Text style={styles.headerSubtitle}>Pantau semua transaksi Anda di sini</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {error ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="receipt-outline" size={64} color="#ddd" />
          <Text style={styles.emptyText}>Belum ada riwayat pesanan</Text>
        </View>
      ) : (
        <>
          {/* Search Bar */}
          <View style={styles.searchBarContainer}>
            <Ionicons name="search-outline" size={18} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari nama pemesan atau tiket..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchButton}>
                <Ionicons name="close-circle" size={18} color="#aaa" />
              </TouchableOpacity>
            ) : null}
          </View>

          {filteredHistory.length === 0 ? (
            <View style={styles.center}>
              <Ionicons name="search-outline" size={64} color="#ddd" />
              <Text style={styles.emptyText}>Hasil pencarian tidak ditemukan</Text>
            </View>
          ) : (
            <FlatList
              data={filteredHistory}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      {/* Receipt Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedItem !== null}
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Struk Pembayaran</Text>
            <Text style={styles.modalSubtitle}>Detail transaksi pemesanan tiket</Text>

            <ScrollView style={{ width: '100%', marginBottom: 15 }} showsVerticalScrollIndicator={false}>
              {selectedItem && (
                <View style={styles.receiptContainer}>
                  {/* Receipt Details */}
                  <View style={styles.receiptDetails}>
                    <View style={styles.receiptRow}>
                      <Text style={styles.receiptLabel}>Nama Pemesan</Text>
                      <Text style={styles.receiptValue}>{selectedItem.user_name}</Text>
                    </View>
                    <View style={styles.receiptRow}>
                      <Text style={styles.receiptLabel}>Tiket</Text>
                      <Text style={styles.receiptValue}>{selectedItem.ticket_name}</Text>
                    </View>
                    <View style={styles.receiptRow}>
                      <Text style={styles.receiptLabel}>Jumlah</Text>
                      <Text style={styles.receiptValue}>{selectedItem.quantity} Tiket</Text>
                    </View>
                    <View style={styles.receiptRow}>
                      <Text style={styles.receiptLabel}>Tanggal</Text>
                      <Text style={styles.receiptValue}>
                        {new Date(selectedItem.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </Text>
                    </View>
                    
                    <View style={styles.dividerDashed} />
                    
                    <View style={styles.receiptRow}>
                      <Text style={[styles.receiptLabel, { fontWeight: 'bold', color: '#333' }]}>Total Bayar</Text>
                      <Text style={styles.receiptTotal}>Rp {Number(selectedItem.total_price).toLocaleString('id-ID')}</Text>
                    </View>
                  </View>

                  {/* Payment Proof Image */}
                  <Text style={styles.proofSectionTitle}>Bukti Pembayaran (Upload)</Text>
                  <View style={styles.modalImageWrapper}>
                    <Image 
                      source={{ uri: selectedItem.payment_proof }} 
                      style={styles.modalProofImage}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setSelectedItem(null)}
            >
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerGradient: {
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 5,
  },
  list: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    marginTop: 10,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  cardBody: {
    marginBottom: 15,
  },
  ticketName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#103783',
  },
  proofButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fafd',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e0f7fa',
    gap: 6,
  },
  proofButtonText: {
    color: '#00b4db',
    fontWeight: '600',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 24,
    width: '100%',
    maxWidth: 420,
    maxHeight: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#103783',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 20,
  },
  receiptContainer: {
    width: '100%',
    marginBottom: 10,
  },
  receiptDetails: {
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  receiptLabel: {
    fontSize: 13,
    color: '#666',
  },
  receiptValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  dividerDashed: {
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    marginVertical: 12,
    height: 1,
  },
  receiptTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#103783',
  },
  proofSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  modalImageWrapper: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: '#eee',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalProofImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    backgroundColor: '#103783',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    padding: 0,
    outlineStyle: 'none',
  } as any,
  clearSearchButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
});

export default HistoryScreen;
