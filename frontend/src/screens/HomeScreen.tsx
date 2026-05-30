import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import GradientButton from '../components/GradientButton';
import Wave from '../components/Wave';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#103783', '#00b4db']}
        style={styles.gradientBackground}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerSection}>
            <Text style={styles.title}>WaterJoy</Text>
            <Text style={styles.subtitle}>Selamat Datang, Pemesan!</Text>
            
            <View style={styles.cardContainer}>
              <Text style={styles.cardTitle}>Mau Berenang Hari Ini?</Text>
              <Text style={styles.cardDescription}>Pesan tiket sekarang dan nikmati liburan seru bersama keluarga.</Text>
              
              <GradientButton 
                title="Pesan Tiket Sekarang"
                onPress={() => navigation.navigate('Tickets')}
                type="cyan"
                style={styles.actionButton}
              />
            </View>
          </View>

          <View style={styles.footerSection}>
            <Wave color="#ffffff" />
            
            <View style={styles.footerContent}>
              <Text style={styles.sectionTitle}>Aktivitas Anda</Text>
              
              <GradientButton 
                title="Lihat Riwayat Pesanan"
                onPress={() => navigation.navigate('History')}
                type="outline"
                style={styles.historyButton}
                textStyle={{ color: '#103783' }}
              />
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
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
    height: '50%',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerSection: {
    paddingTop: 40,
    paddingHorizontal: 30,
    paddingBottom: 20,
    zIndex: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 40,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  actionButton: {
    width: '100%',
  },
  footerSection: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 60,
    position: 'relative',
  },
  footerContent: {
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  historyButton: {
    borderColor: '#103783',
    borderWidth: 1,
  },
});

export default HomeScreen;
