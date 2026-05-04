import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getBookingHistory } from '../services/api';
import { RootStackParamList, BookingHistoryItem } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

const HistoryScreen: React.FC<Props> = () => {
  const [history, setHistory] = useState<BookingHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

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

  const renderItem = ({ item }: { item: BookingHistoryItem }) => {
    const date = new Date(item.created_at).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.status}>Berhasil</Text>
        </View>
        <Text style={styles.ticketName}>{item.ticket_name}</Text>
        <Text style={styles.detailText}>Pemesan: {item.user_name}</Text>
        <Text style={styles.detailText}>Jumlah: {item.quantity} Tiket</Text>
        <View style={styles.footer}>
          <Text style={styles.totalLabel}>Total Pembayaran:</Text>
          <Text style={styles.totalPrice}>Rp {Number(item.total_price).toLocaleString('id-ID')}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {history.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Belum ada riwayat pesanan</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  status: {
    fontSize: 12,
    color: 'green',
    fontWeight: 'bold',
  },
  ticketName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0066cc',
  },
});

export default HistoryScreen;
