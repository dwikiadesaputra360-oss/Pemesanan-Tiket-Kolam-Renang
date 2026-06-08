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
     /* SafeAreaView memastikan konten tidak tertutup notch atau status bar */
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>Selamat Datang di RenangYuk</Text>
        </View>

        <View style={styles.buttonContainer}>
          <GradientButton
            title="Masuk"
            onPress={() => navigation.navigate('Login')}
            type="cyan"
            style={styles.button}
          />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
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
