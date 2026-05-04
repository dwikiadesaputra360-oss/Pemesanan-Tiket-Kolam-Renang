import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createBooking } from '../services/api';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Booking'>;

const BookingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { ticket } = route.params;
  const [userName, setUserName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    if (!userName.trim()) {
      Alert.alert('Error', 'Nama pemesan tidak boleh kosong');
      return;
    }
    
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Error', 'Jumlah tiket tidak valid');
      return;
    }

    setLoading(true);
    const priceNum = typeof ticket.price === 'string' ? parseFloat(ticket.price) : ticket.price;
    const totalPrice = qty * priceNum;

    try {
      const response = await createBooking({
        user_name: userName,
        ticket_id: ticket.id,
        quantity: qty,
        total_price: totalPrice
      });

      if (response.data.success) {
        Alert.alert('Sukses', 'Pemesanan berhasil dibuat!', [
          { text: 'OK', onPress: () => navigation.navigate('History') }
        ]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Gagal membuat pemesanan. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  const priceNum = typeof ticket.price === 'string' ? parseFloat(ticket.price) : ticket.price;
  const totalPrice = (parseInt(quantity) || 0) * priceNum;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Tiket yang dipilih:</Text>
        <Text style={styles.value}>{ticket.name}</Text>
        
        <Text style={styles.label}>Harga per tiket:</Text>
        <Text style={styles.value}>Rp {Number(ticket.price).toLocaleString('id-ID')}</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Nama Pemesan</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nama lengkap"
          value={userName}
          onChangeText={setUserName}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Jumlah Tiket</Text>
        <TextInput
          style={styles.input}
          placeholder="1"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Bayar:</Text>
        <Text style={styles.totalValue}>Rp {totalPrice.toLocaleString('id-ID')}</Text>
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleBooking}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Konfirmasi Pesanan</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingScreen;
