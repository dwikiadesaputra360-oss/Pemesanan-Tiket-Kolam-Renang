import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Mengimpor halaman-halaman yang digunakan dalam navigasi
import HomeScreen from '../screens/HomeScreen';
import TicketListScreen from '../screens/TicketListScreen';
import BookingScreen from '../screens/BookingScreen';
import HistoryScreen from '../screens/HistoryScreen';
import { RootStackParamList } from '../types';

// Membuat stack navigator dengan tipe parameter yang telah ditentukan
const Stack = createNativeStackNavigator<RootStackParamList, any>();

// Komponen navigator utama aplikasi
const AppNavigator = () => {
  return (

    // Menentukan halaman pertama yang ditampilkan saat aplikasi dibuka
    <Stack.Navigator
      initialRouteName="Home"

      // Konfigurasi tampilan header untuk seluruh halaman
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0066cc',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'WaterJoy Booking' }} 
      />
      <Stack.Screen 
        name="Tickets" 
        component={TicketListScreen} 
        options={{ title: 'Pilih Tiket' }} 
      />
      <Stack.Screen 
        name="Booking" 
        component={BookingScreen} 
        options={{ title: 'Konfirmasi Pesanan' }} 
      />
      <Stack.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{ title: 'Riwayat Pesanan' }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
