import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ticket } from '../types';

interface TicketCardProps {
  ticket: Ticket;
  onPress: (ticket: Ticket) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onPress }) => {
  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{ticket.name}</Text>
        <Text style={styles.price}>Rp {Number(ticket.price).toLocaleString('id-ID')}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => onPress(ticket)}>
        <Text style={styles.buttonText}>Pesan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TicketCard;
