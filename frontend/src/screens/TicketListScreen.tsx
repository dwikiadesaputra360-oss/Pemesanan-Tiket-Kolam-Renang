import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import TicketCard from '../components/TicketCard';
import { getTickets } from '../services/api';
import { RootStackParamList, Ticket } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Tickets'>;

const TicketListScreen: React.FC<Props> = ({ navigation }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await getTickets();
      if (response.data.success) {
        setTickets(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Gagal memuat daftar tiket. Pastikan backend server menyala.');
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (ticket: Ticket) => {
    navigation.navigate('Booking', { ticket });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#103783" />
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
      <LinearGradient
        colors={['#103783', '#00b4db']}
        style={styles.headerGradient}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Pilih Tiket</Text>
            <Text style={styles.headerSubtitle}>Tentukan jenis tiket yang Anda inginkan</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TicketCard ticket={item} onPress={handlePress} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
    paddingVertical: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TicketListScreen;
