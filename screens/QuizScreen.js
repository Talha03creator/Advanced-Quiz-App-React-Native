import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { COLORS } from '../theme/colors';
import quizBank from '../data/quizBank.json';
import { shuffleArray } from '../utils/shuffle';

const QuizScreen = ({ route, navigation }) => {
  const { category } = route.params;
  
  // Quiz State
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  
  const timerRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Initialize Quiz: Filter and Shuffle
  useEffect(() => {
    const categoryQuestions = quizBank[category];
    const shuffledQuestions = shuffleArray(categoryQuestions).map(q => ({
      ...q,
      options: shuffleArray(q.options) // Shuffle options as well
    }));
    setQuestions(shuffledQuestions);
    setIsLoading(false);
  }, [category]);

  // Timer Logic
  useEffect(() => {
    if (isLoading) return;
    
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [currentIndex, isLoading]);

  // Progress Bar
  useEffect(() => {
    if (questions.length > 0) {
      Animated.timing(progressAnim, {
        toValue: (currentIndex + 1) / questions.length,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [currentIndex, questions]);

  const startTimer = () => {
    setTimeLeft(15);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleOptionSelect(null); // Auto-fail on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOptionSelect = (option) => {
    if (isAnswered) return;

    clearInterval(timerRef.current);
    setSelectedOption(option);
    setIsAnswered(true);

    const currentQuestion = questions[currentIndex];
    const isCorrect = option === currentQuestion.correctAnswer;
    
    if (isCorrect) setScore(prev => prev + 1);

    const resultEntry = {
      question: currentQuestion.question,
      selected: option || 'Time Out',
      correct: currentQuestion.correctAnswer,
      isCorrect,
      explanation: currentQuestion.explanation
    };
    
    const updatedResults = [...results, resultEntry];
    setResults(updatedResults);

    // Transition to next or results
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        navigation.navigate('Result', { 
          score: isCorrect ? score + 1 : score, 
          total: questions.length,
          topic: category,
          history: updatedResults
        });
      }
    }, 1500);
  };

  if (isLoading || questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];

  const getOptionStyle = (option) => {
    if (!isAnswered) {
      return selectedOption === option ? styles.selectedOption : styles.option;
    }
    if (option === currentQuestion.correctAnswer) return styles.correctOption;
    if (selectedOption === option) return styles.incorrectOption;
    return styles.option;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.barContainer}>
          <Animated.View style={[styles.progressBar, { 
            width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) 
          }]} />
        </View>
        <View style={styles.meta}>
          <Text style={styles.metaText}>{category} • {currentIndex + 1}/{questions.length}</Text>
          <View style={[styles.timer, timeLeft <= 5 && styles.timerUrgent]}>
            <Text style={styles.timerText}>{timeLeft}</Text>
          </View>
        </View>
      </View>

      <View style={styles.questionSection}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      <View style={styles.optionsSection}>
        {currentQuestion.options.map((option, idx) => (
          <TouchableOpacity
            key={idx}
            activeOpacity={0.7}
            style={getOptionStyle(option)}
            onPress={() => handleOptionSelect(option)}
            disabled={isAnswered}
          >
            <Text style={[styles.optionText, isAnswered && (option === currentQuestion.correctAnswer || selectedOption === option) && styles.optionTextActive]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        {isAnswered && (
          <Text style={[styles.feedback, selectedOption === currentQuestion.correctAnswer ? styles.correctFeedback : styles.incorrectFeedback]}>
            {selectedOption === currentQuestion.correctAnswer ? 'EXCELLENT' : selectedOption === null ? 'TIME EXPIRED' : 'INCORRECT'}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 24 },
  barContainer: { height: 4, backgroundColor: '#222', borderRadius: 2, marginBottom: 20, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: COLORS.primary },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '700', letterSpacing: 1 },
  timer: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  timerUrgent: { borderColor: COLORS.incorrect },
  timerText: { color: COLORS.white, fontWeight: 'bold' },
  questionSection: { padding: 24, marginVertical: 20 },
  questionText: { color: COLORS.white, fontSize: 26, fontWeight: '800', lineHeight: 36 },
  optionsSection: { paddingHorizontal: 24 },
  option: { backgroundColor: COLORS.surface, padding: 20, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#333' },
  selectedOption: { backgroundColor: COLORS.surface, padding: 20, borderRadius: 16, marginBottom: 12, borderWidth: 2, borderColor: COLORS.primary },
  correctOption: { backgroundColor: COLORS.correct, padding: 20, borderRadius: 16, marginBottom: 12 },
  incorrectOption: { backgroundColor: COLORS.incorrect, padding: 20, borderRadius: 16, marginBottom: 12 },
  optionText: { color: COLORS.white, fontSize: 17, fontWeight: '500' },
  optionTextActive: { color: COLORS.black, fontWeight: '700' },
  footer: { marginTop: 'auto', alignItems: 'center', paddingBottom: 40 },
  feedback: { fontSize: 20, fontWeight: '900', letterSpacing: 3 },
  correctFeedback: { color: COLORS.correct },
  incorrectFeedback: { color: COLORS.incorrect },
});

export default QuizScreen;
