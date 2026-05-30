import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import InputField from '../components/InputField';
import GradientButton from '../components/GradientButton';
import { loginUser } from '../services/api';
import Wave from '../components/Wave';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Peringatan', 'Email dan password harus diisi');
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      if (response.data.success) {
        navigation.replace('MainApp');
      }
    } catch (error: any) {
      Alert.alert('Gagal', error.response?.data?.message || 'Login gagal, periksa kredensial Anda');
    } finally {
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
            
            <Text style={styles.title}>Login</Text>

            <View style={styles.formContainer}>
              <InputField 
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                iconName="person-outline"
              />
              
              <InputField 
                placeholder="Kata sandi"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                iconName="lock-closed-outline"
              />

              <GradientButton 
                title={loading ? "Tunggu..." : "Login"}
                onPress={handleLogin}
                type="cyan"
                style={styles.loginButton}
                disabled={loading}
              />

              <TouchableOpacity style={styles.forgotContainer}>
                <Text style={styles.forgotText}>Lupa kata sandi?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Section (White) */}
          <View style={styles.footerSection}>
            <Wave color="#ffffff" />
            
            <View style={styles.footerContent}>
              <Text style={styles.orText}>atau masuk dengan</Text>

              <View style={styles.socialContainer}>
                <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#1877F2' }]}>
                  <Ionicons name="logo-facebook" size={20} color="#fff" />
                  <Text style={styles.socialText}>Facebook</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#1DA1F2' }]}>
                  <Ionicons name="logo-twitter" size={20} color="#fff" />
                  <Text style={styles.socialText}>Twitter</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footerLinks}>
                <Text style={styles.footerText}>Belum punya akun? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.footerLink}>Daftar</Text>
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
    backgroundColor: '#fff', // Bottom part is white
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '65%', // Blue covers top 65%
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
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
  },
  loginButton: {
    marginTop: 10,
    marginBottom: 16,
  },
  forgotContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  forgotText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  footerSection: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
    marginTop: 40, // Space for the wave
  },
  footerContent: {
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  orText: {
    color: '#888',
    fontSize: 13,
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 40,
    width: '100%',
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flex: 1,
  },
  socialText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
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

export default LoginScreen;
