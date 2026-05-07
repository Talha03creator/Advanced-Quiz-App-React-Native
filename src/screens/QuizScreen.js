import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');

const QuizScreen = ({ route, navigation }) => {
  const { quiz } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  
  const timerRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [currentQuestionIndex]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentQuestionIndex + 1) / quiz.questions.length,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentQuestionIndex]);

  const startTimer = () => {
    setTimeLeft(15);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeOut = () => {
    if (!isAnswered) {
      handleOptionSelect(null);
    }
  };

  const handleOptionSelect = (option) => {
    if (isAnswered) return;

    clearInterval(timerRef.current);
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQuestion.correctAnswer;
    if (isCorrect) setScore(score + 1);

    const newAnswer = {
      question: currentQuestion.question,
      selected: option || 'Time Out',
      correct: currentQuestion.correctAnswer,
      isCorrect,
      explanation: currentQuestion.explanation
    };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    setTimeout(() => {
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        navigation.navigate('Result', { 
          score: isCorrect ? score + 1 : score, 
          total: quiz.questions.length,
          answers: updatedAnswers,
          topic: quiz.topic
        });
      }
    }, 1500);
  };

  const getOptionStyle = (option) => {
    if (!isAnswered) {
      return selectedOption === option ? styles.selectedOption : styles.option;
    }
    if (option === currentQuestion.correctAnswer) return styles.correctOption;
    if (selectedOption === option) return styles.incorrectOption;
    return styles.option;
  };

  const getOptionTextStyle = (option) => {
    if (isAnswered && (option === currentQuestion.correctAnswer || selectedOption === option)) {
      return styles.optionTextDark;
    }
    return styles.optionText;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressBarContainer}>
          <Animated.View 
            style={[
              styles.progressBar, 
              { width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                }) 
              }
            ]} 
          />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.progressText}>Question {currentQuestionIndex + 1}/{quiz.questions.length}</Text>
          <View style={[styles.timerCircle, timeLeft <= 5 && styles.timerLow]}>
            <Text style={styles.timerText}>{timeLeft}</Text>
          </View>
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={getOptionStyle(option)}
            onPress={() => handleOptionSelect(option)}
            disabled={isAnswered}
            activeOpacity={0.7}
          >
            <Text style={getOptionTextStyle(option)}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isAnswered && (
        <View style={styles.feedbackContainer}>
          <Text style={[styles.feedbackText, selectedOption === currentQuestion.correctAnswer ? styles.correctText : styles.incorrectText]}>
            {selectedOption === currentQuestion.correctAnswer ? 'Correct!' : selectedOption === null ? 'Time Out!' : 'Incorrect'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 24,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  timerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerLow: {
    borderColor: COLORS.incorrect,
  },
  timerText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  questionContainer: {
    paddingHorizontal: 24,
    marginTop: 40,
    marginBottom: 40,
  },
  questionText: {
    fontSize: 26,
    color: COLORS.white,
    fontWeight: '700',
    lineHeight: 36,
  },
  optionsContainer: {
    paddingHorizontal: 24,
  },
  option: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedOption: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 15,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  correctOption: {
    backgroundColor: COLORS.correct,
    padding: 20,
    borderRadius: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.correct,
  },
  incorrectOption: {
    backgroundColor: COLORS.incorrect,
    padding: 20,
    borderRadius: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.incorrect,
  },
  optionText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '500',
  },
  optionTextDark: {
    color: COLORS.black,
    fontSize: 17,
    fontWeight: '700',
  },
  feedbackContainer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: 40,
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
  },
  correctText: {
    color: COLORS.correct,
  },
  incorrectText: {
    color: COLORS.incorrect,
  },
});

export default QuizScreen;
