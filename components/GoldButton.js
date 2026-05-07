import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../theme/colors';

const GoldButton = ({ title, onPress, style, outline = false }) => {
  const animatedValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: animatedValue }] }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.button,
          outline ? styles.outlineButton : styles.filledButton,
          style,
        ]}
      >
        <Text
          style={[
            styles.text,
            outline ? styles.outlineText : styles.filledText,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  filledButton: {
    backgroundColor: COLORS.primary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  filledText: {
    color: COLORS.black,
  },
  outlineText: {
    color: COLORS.primary,
  },
});

export default GoldButton;
