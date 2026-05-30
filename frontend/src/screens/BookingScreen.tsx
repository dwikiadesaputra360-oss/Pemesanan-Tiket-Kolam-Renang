import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView, ScrollView, Platform, Modal, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { createBooking } from '../services/api';
import { RootStackParamList } from '../types';
import GradientButton from '../components/GradientButton';
import Wave from '../components/Wave';

type Props = NativeStackScreenProps<RootStackParamList, 'Booking'>;

const BookingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { ticket } = route.params;
  const [userName, setUserName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showQRISModal, setShowQRISModal] = useState(false);
  const [paymentProof, setPaymentProof] = useState<string | null>(null);

  const handleBooking = async () => {
    if (!userName.trim()) {
      Alert.alert('Eror', 'Nama pemesan tidak boleh kosong');
      return;
    }
    
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Eror', 'Jumlah tiket tidak valid');
      return;
    }

    setShowQRISModal(true);
  };

  const handleSelectImage = async () => {
    if (Platform.OS === 'web') {
      try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/jpeg, image/jpg, image/png';
        input.onchange = (e: any) => {
          const file = e.target.files[0];
          if (file) {
            if (file.size > 2 * 1024 * 1024) { // limit 2MB
              Alert.alert('Peringatan', 'Ukuran gambar maksimal 2MB');
              return;
            }
            const reader = new FileReader();
            reader.onload = () => {
              setPaymentProof(reader.result as string);
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      } catch (err) {
        console.error('File picker error:', err);
      }
    } else {
      Alert.alert('Info', 'Fitur upload gambar di mobile memerlukan library tambahan.');
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentProof) {
      Alert.alert('Peringatan', 'Harap upload bukti pembayaran terlebih dahulu.');
      return;
    }

    setLoading(true);
    const qty = parseInt(quantity);
    const priceNum = typeof ticket.price === 'string' ? parseFloat(ticket.price) : ticket.price;
    const totalPrice = qty * priceNum;

    try {
      const response = await createBooking({
        user_name: userName,
        ticket_id: ticket.id,
        quantity: qty,
        total_price: totalPrice,
        payment_proof: paymentProof
      });

      if (response.data.success) {
        setShowQRISModal(false);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Eror', 'Gagal membuat pemesanan. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  const priceNum = typeof ticket.price === 'string' ? parseFloat(ticket.price) : ticket.price;
  const totalPrice = (parseInt(quantity) || 0) * priceNum;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#103783', '#00b4db']}
        style={styles.headerGradient}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Konfirmasi Pesanan</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.ticketCard}>
            <Text style={styles.ticketLabel}>Tiket yang dipilih</Text>
            <Text style={styles.ticketName}>{ticket.name}</Text>
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>Rp {Number(ticket.price).toLocaleString('id-ID')}</Text>
            </View>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nama Lengkap Pemesan</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Budi Santoso"
                  value={userName}
                  onChangeText={setUserName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Jumlah Tiket</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="ticket-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="1"
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={setQuantity}
                />
              </View>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Pembayaran</Text>
                <Text style={styles.totalValue}>Rp {totalPrice.toLocaleString('id-ID')}</Text>
              </View>
            </View>

            <GradientButton 
              title={loading ? "Memproses..." : "Konfirmasi & Bayar"}
              onPress={handleBooking}
              type="cyan"
              disabled={loading}
              style={styles.payButton}
            />
          </View>
        </View>
      </ScrollView>

      {/* QRIS Payment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showQRISModal}
        onRequestClose={() => setShowQRISModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.qrisHeader}>Pembayaran QRIS</Text>
            <Text style={styles.qrisSubheader}>Pindai kode QR di bawah untuk membayar</Text>
            
            <View style={styles.qrisAmountCard}>
              <Text style={styles.qrisAmountLabel}>Total Tagihan</Text>
              <Text style={styles.qrisAmountValue}>Rp {totalPrice.toLocaleString('id-ID')}</Text>
            </View>

            <View style={styles.qrisContainer}>
              <Image 
                source={require('../../assets/qris_mockup.png')} 
                style={styles.qrisImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.qrisTimer}>Berlaku selama 5 menit</Text>

            {paymentProof ? (
              <View style={styles.uploadPreviewContainer}>
                <Image 
                  source={{ uri: paymentProof }} 
                  style={styles.uploadPreviewImage}
                  resizeMode="cover"
                />
                <TouchableOpacity style={styles.changeUploadButton} onPress={handleSelectImage} disabled={loading}>
                  <Text style={styles.changeUploadText}>Ubah Gambar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadButton} onPress={handleSelectImage} disabled={loading}>
                <Ionicons name="cloud-upload-outline" size={24} color="#00b4db" />
                <Text style={styles.uploadButtonText}>Upload Bukti Pembayaran (JPG/PNG)</Text>
              </TouchableOpacity>
            )}

            <GradientButton 
              title={loading ? "Memverifikasi..." : "Kirim & Konfirmasi"}
              onPress={handleConfirmPayment}
              type="cyan"
              disabled={loading || !paymentProof}
              style={styles.modalButton}
            />
            
            <TouchableOpacity 
              style={styles.closeTextButton}
              onPress={() => {
                setPaymentProof(null);
                setShowQRISModal(false);
              }}
              disabled={loading}
            >
              <Text style={[styles.closeText, { color: '#e53935' }]}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="checkmark-circle" size={80} color="#00b4db" />
            </View>
            
            <Text style={styles.modalTitle}>Pemesanan Berhasil!</Text>
            <Text style={styles.modalMessage}>
              Tiket Anda telah berhasil dipesan. Anda dapat melihat detail tiket di riwayat pemesanan.
            </Text>
            
            <View style={styles.modalDetailsCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailsLabel}>Tiket:</Text>
                <Text style={styles.detailsValue}>{ticket.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailsLabel}>Jumlah:</Text>
                <Text style={styles.detailsValue}>{quantity}x</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailsLabel}>Total Bayar:</Text>
                <Text style={[styles.detailsValue, { color: '#103783', fontWeight: 'bold' }]}>
                  Rp {totalPrice.toLocaleString('id-ID')}
                </Text>
              </View>
            </View>

            <GradientButton 
              title="Lihat Riwayat"
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('History');
              }}
              type="cyan"
              style={styles.modalButton}
            />
            
            <TouchableOpacity 
              style={styles.closeTextButton}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('Home');
              }}
            >
              <Text style={styles.closeText}>Kembali ke Beranda</Text>
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
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
  },
  ticketCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  ticketLabel: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  ticketName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  priceBadge: {
    backgroundColor: '#e3f2fd',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#103783',
  },
  formContainer: {
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginLeft: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 15,
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#103783',
  },
  payButton: {
    width: '100%',
    shadowColor: '#00c6ff',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#103783',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalDetailsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 15,
    width: '100%',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#eee',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailsLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailsValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  modalButton: {
    width: '100%',
    marginBottom: 15,
  },
  closeTextButton: {
    paddingVertical: 10,
  },
  closeText: {
    color: '#00b4db',
    fontWeight: '600',
    fontSize: 14,
  },
  qrisHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#103783',
    marginBottom: 5,
    textAlign: 'center',
  },
  qrisSubheader: {
    fontSize: 13,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  qrisAmountCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  qrisAmountLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
  },
  qrisAmountValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#103783',
    marginTop: 4,
  },
  qrisContainer: {
    width: 220,
    height: 220,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  qrisImage: {
    width: '100%',
    height: '100%',
  },
  qrisTimer: {
    fontSize: 12,
    color: '#f57c00',
    fontWeight: '600',
    marginBottom: 25,
    textAlign: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#00b4db',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#f8fdfd',
  },
  uploadButtonText: {
    color: '#00b4db',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 13,
  },
  uploadPreviewContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  uploadPreviewImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  changeUploadButton: {
    marginTop: 6,
    padding: 4,
  },
  changeUploadText: {
    color: '#00b4db',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default BookingScreen;
