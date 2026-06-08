import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GradientButton from '../components/GradientButton';

// Halaman awal aplikasi yang menampilkan logo,
// judul aplikasi, serta tombol navigasi ke Login dan Register.
const WelcomeScreen = ({ navigation }: any) => {
  return (
    // Background menggunakan gradasi warna biru
    <LinearGradient
      colors={['#103783', '#00b4db']}
      style={styles.container}
    >
    {/* SafeAreaView memastikan konten tidak tertutup notch atau status bar */}
      <SafeAreaView style={styles.safeArea}>
        {/* Bagian tengah layar berisi logo dan judul */}
        <View style={styles.content}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          {/* Judul aplikasi */}
          <Text style={styles.title}>Selamat Datang di RenangYuk</Text>
        </View>

         {/* Bagian bawah berisi tombol aksi */}
        <View style={styles.buttonContainer}>
          {/* Tombol menuju halaman Login */}
          <GradientButton
            title="Masuk"
            onPress={() => navigation.navigate('Login')}
            type="cyan"
            style={styles.button}
          />
          {/* Tombol menuju halaman Registrasi */}
          <GradientButton
            title="Buat Akun"
            onPress={() => navigation.navigate('Register')}
            type="navy"
            style={styles.button}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

// Kumpulan style untuk komponen WelcomeScreen
const styles = StyleSheet.create({
   // Container utama memenuhi seluruh layar
  container: {
    flex: 1,
  },
   // Area aman perangkat (menghindari notch/status bar)
  safeArea: {
    flex: 1,
  },
  // Posisi konten utama di tengah layar
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logoImage: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  button: {
    marginBottom: 20,
    width: '100%',
  },
});

export default WelcomeScreen;
