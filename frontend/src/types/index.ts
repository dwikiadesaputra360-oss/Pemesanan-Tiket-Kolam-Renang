// Types for models
export interface Ticket {
  id: number;
  name: string;
  price: string | number;
}

export interface BookingHistoryItem {
  id: number;
  user_name: string;
  ticket_name: string;
  quantity: number;
  total_price: string | number;
  payment_proof?: string;
  created_at: string;
}

// Types for Navigation
export type RootStackParamList = {
  Home: undefined;
  Tickets: undefined;
  Booking: { ticket: Ticket };
  History: undefined;
};
