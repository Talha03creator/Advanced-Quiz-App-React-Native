import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated, ScrollView } from 'react-native';
import { COLORS } from '../theme/colors';
import GoldButton from '../components/GoldButton';
import quizData from '../data/quizBank.json';

const HomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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

  const handleStartQuiz = (quiz) => {
    navigation.navigate('Quiz', { quiz });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>MASTERY</Text>
          <Text style={styles.subtitle}>Elevate Your Knowledge</Text>
        </Animated.View>

        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.sectionTitle}>Select a Topic</Text>
          
          {quizData.quizzes.map((quiz) => (
            <View key={quiz.id} style={styles.card}>
              <Text style={styles.cardTitle}>{quiz.topic}</Text>
              <Text style={styles.cardDescription}>{quiz.description}</Text>
              <GoldButton 
                title="Start Quiz" 
                onPress={() => handleStartQuiz(quiz)} 
                style={styles.startButton}
              />
            </View>
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
    marginBottom: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  content: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    color: COLORS.white,
    marginBottom: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardTitle: {
    fontSize: 22,
    color: COLORS.primary,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  startButton: {
    marginTop: 10,
    height: 50,
  },
});

export default HomeScreen;
