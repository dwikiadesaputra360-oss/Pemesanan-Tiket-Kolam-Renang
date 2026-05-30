import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  type?: 'primary' | 'outline' | 'solid' | 'cyan' | 'navy';
  disabled?: boolean;
}

const GradientButton: React.FC<GradientButtonProps> = ({ 
  title, 
  onPress, 
  style, 
  textStyle,
  type = 'cyan',
  disabled = false
}) => {
  const buttonOpacity = disabled ? 0.6 : 1;

  if (type === 'outline') {
    return (
      <TouchableOpacity 
        style={[styles.outlineButton, style, { opacity: buttonOpacity }]} 
        onPress={onPress} 
        activeOpacity={0.8}
        disabled={disabled}
      >
        <Text style={[styles.outlineText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  if (type === 'cyan') {
    return (
      <TouchableOpacity 
        style={[styles.cyanButton, style, { opacity: buttonOpacity }]} 
        onPress={onPress} 
        activeOpacity={0.8}
        disabled={disabled}
      >
        <Text style={[styles.solidText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  if (type === 'navy') {
    return (
      <TouchableOpacity 
        style={[styles.navyButton, style, { opacity: buttonOpacity }]} 
        onPress={onPress} 
        activeOpacity={0.8}
        disabled={disabled}
      >
        <Text style={[styles.solidText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.solidButton, style, { opacity: buttonOpacity }]} 
      onPress={onPress} 
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={[styles.solidText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const baseButton: ViewStyle = {
  paddingVertical: 14,
  paddingHorizontal: 24,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 30,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 5,
};

const styles = StyleSheet.create({
  outlineButton: {
    ...baseButton,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  outlineText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  solidButton: {
    ...baseButton,
    backgroundColor: '#fff',
  },
  cyanButton: {
    ...baseButton,
    backgroundColor: '#00c6ff',
  },
  navyButton: {
    ...baseButton,
    backgroundColor: '#1e3c72',
  },
  solidText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GradientButton;
