import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import quizBank from '../data/quizBank.json';

const HomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Extract topic names from JSON keys
  const topics = Object.keys(quizBank);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleTopicPress = (topic) => {
    navigation.navigate('Quiz', { category: topic });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>MASTERY</Text>
          <Text style={styles.subtitle}>Select Your Expertise</Text>
        </Animated.View>

        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {topics.map((topic, index) => (
            <TouchableOpacity 
              key={topic} 
              activeOpacity={0.8}
              style={[styles.topicCard, { borderLeftColor: COLORS.primary }]}
              onPress={() => handleTopicPress(topic)}
            >
              <View>
                <Text style={styles.topicName}>{topic}</Text>
                <Text style={styles.topicStats}>{quizBank[topic].length} Questions</Text>
              </View>
              <View style={styles.arrowContainer}>
                <Text style={styles.arrow}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 56,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  content: {
    width: '100%',
  },
  topicCard: {
    backgroundColor: COLORS.surface,
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#222',
  },
  topicName: {
    fontSize: 22,
    color: COLORS.white,
    fontWeight: '700',
    marginBottom: 4,
  },
  topicStats: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
