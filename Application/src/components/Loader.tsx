import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSizes } from '../styles/theme';

interface LoaderProps {
  message?: string;
}

export function Loader({ message }: LoaderProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  message: {
    marginTop: spacing.md,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
});

// import React from 'react';
// import { View, ImageBackground, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';

// const { width, height } = Dimensions.get('window');

// export function Loader() {
//   return (
//     <View style={styles.container}>
//       <StatusBar hidden /> {/* hide status bar during splash */}
//       <ImageBackground
//         source={require('../../assets/h1.png')} // ensure this path is correct
//         style={styles.image}
//         resizeMode="cover"
//       >
//         <View style={styles.overlay}>
//           <Text style={styles.title}>CropGuard</Text>
//           <Text style={styles.subtitle}>Identify crop diseases instantly</Text>
//           <Text style={styles.footer}>Made for Hackathon 2025</Text>
//         </View>
//       </ImageBackground>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     width: width,
//     height: height,
//   },
//   image: {
//     flex: 1,
//     width: width,
//     height: height,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.3)', // optional: makes text readable
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: '800',
//     color: '#fff',
//     marginBottom: 6,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: 'rgba(255,255,255,0.9)',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 30,
//     color: 'rgba(255,255,255,0.9)',
//     fontSize: 12,
//   },
// });
