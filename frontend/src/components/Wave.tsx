import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const Wave = ({ color = '#ffffff' }) => {
  return (
    <View style={styles.container}>
      <Svg
        height="100%"
        width="100%"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <Path
          fill={color}
          fillOpacity="1"
          d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,160C672,160,768,192,864,213.3C960,235,1056,245,1152,224C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: 120,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: -119, // slightly offset to prevent subpixel gap
    left: 0,
  },
});

export default Wave;
