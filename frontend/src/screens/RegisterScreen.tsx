import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import InputField from '../components/InputField';
import GradientButton from '../components/GradientButton';
import { registerUser } from '../services/api';
import Wave from '../components/Wave';

const RegisterScreen = ({ navigation }: any) => {
  
  // State untuk menyimpan data input pengguna
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleRegister = async () => {

     // Memeriksa apakah semua kolom sudah diisi
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Peringatan', 'Tolong isi semua bidang');
      return;
    }

    // Memeriksa kecocokan kata sandi dan konfirmasi kata sandi
    if (password !== confirmPassword) {
      Alert.alert('Peringatan', 'Konfirmasi kata sandi tidak cocok');
      return;
    }

    // Memastikan pengguna menyetujui syarat dan ketentuan
    if (!agreeTerms) {
      Alert.alert('Peringatan', 'Anda harus menyetujui syarat & ketentuan');
      return;
    }
    
    setLoading(true);
    try {

      // Mengirim data pendaftaran ke API
      const response = await registerUser({ fullName, email, password });
      if (response.data.success) {
        Alert.alert('Sukses', 'Pendaftaran berhasil! Silakan login.');
        navigation.navigate('Login');
      }
    } catch (error: any) {

      // Menampilkan pesan kesalahan jika pendaftaran gagal
      Alert.alert('Gagal', error.response?.data?.message || 'Gagal melakukan pendaftaran');
    } finally {
      // Mengembalikan status loading ke false
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#103783', '#00b4db']}
        style={styles.gradientBackground}
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header Section (Blue) */}
          <View style={styles.headerSection}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
            
            <Text style={styles.title}>Daftar</Text>

            <View style={styles.formContainer}>
              <InputField 
                placeholder="Nama Lengkap"
                value={fullName}
                onChangeText={setFullName}
                iconName="person-outline"
              />

              <InputField 
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                iconName="mail-outline"
              />
              
              <InputField 
                placeholder="Kata sandi"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                iconName="lock-closed-outline"
              />

              <InputField 
                placeholder="Konfirmasi kata sandi"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                iconName="lock-closed-outline"
              />

              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => setAgreeTerms(!agreeTerms)}
              >
                <Ionicons 
                  name={agreeTerms ? "checkbox" : "square"} 
                  size={20} 
                  color="#fff" 
                />
                <Text style={styles.checkboxText}>Saya setuju dengan Syarat dan Privasi</Text>
              </TouchableOpacity>

              <GradientButton 
                title={loading ? "Tunggu..." : "Daftar"}
                onPress={handleRegister}
                type="navy"
                style={styles.registerButton}
                disabled={loading}
              />
            </View>
          </View>

          {/* Footer Section (White) */}
          <View style={styles.footerSection}>
            <Wave color="#ffffff" />
            
            <View style={styles.footerContent}>
              <View style={styles.footerLinks}>
                <Text style={styles.footerText}>Sudah punya akun? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.footerLink}>Masuk</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '75%', 
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerSection: {
    paddingTop: 50,
    paddingHorizontal: 30,
    zIndex: 2,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: -5,
  },
  checkboxText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 13,
  },
  registerButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  footerSection: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
    marginTop: 40,
  },
  footerContent: {
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: '#888',
    fontSize: 14,
  },
  footerLink: {
    color: '#103783',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default RegisterScreen;
