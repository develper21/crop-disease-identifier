import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, Dimensions, PanResponder } from 'react-native';
import { colors, spacing } from '../styles/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function FloatingAssistButton({ onPress }: { onPress: () => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: screenWidth - 80,
    y: screenHeight - 150,
  });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      setIsDragging(true);
      setDragStart({
        x: evt.nativeEvent.pageX - position.x,
        y: evt.nativeEvent.pageY - position.y,
      });
    },
    onPanResponderMove: (evt) => {
      if (isDragging) {
        const newX = Math.max(10, Math.min(screenWidth - 66, evt.nativeEvent.pageX - dragStart.x));
        const newY = Math.max(40, Math.min(screenHeight - 90, evt.nativeEvent.pageY - dragStart.y));
        
        setPosition({ x: newX, y: newY });
      }
    },
    onPanResponderRelease: () => {
      setIsDragging(false);
    },
    onPanResponderTerminate: () => {
      setIsDragging(false);
    },
  });

  const handlePress = () => {
    if (!isDragging) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        {
          left: position.x,
          top: position.y,
          opacity: isDragging ? 0.8 : 1,
          transform: [{ scale: isDragging ? 1.1 : 1 }],
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
      {...panResponder.panHandlers}
    >
      <Text style={styles.fabText}>AI</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
    zIndex: 1000,
  },
  fabText: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: 16,
  },
});


