import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { COLORS } from '../theme/colors';
import GoldButton from '../components/GoldButton';

const ResultScreen = ({ route, navigation }) => {
  const { score, total, answers, topic } = route.params;
  const percentage = Math.round((score / total) * 100);

  const getPerformanceMessage = () => {
    if (percentage === 100) return 'ELITE MASTERY';
    if (percentage >= 80) return 'EXCELLENT';
    if (percentage >= 60) return 'WELL DONE';
    return 'KEEP LEARNING';
  };

  const renderReviewItem = ({ item, index }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.questionNumber}>Q{index + 1}</Text>
        <View style={[styles.statusBadge, item.isCorrect ? styles.correctBadge : styles.incorrectBadge]}>
          <Text style={styles.statusText}>{item.isCorrect ? 'Correct' : 'Incorrect'}</Text>
        </View>
      </View>
      <Text style={styles.reviewQuestion}>{item.question}</Text>
      <View style={styles.answerRow}>
        <Text style={styles.answerLabel}>Your Answer: </Text>
        <Text style={[styles.answerValue, item.isCorrect ? styles.correctText : styles.incorrectText]}>{item.selected}</Text>
      </View>
      {!item.isCorrect && (
        <View style={styles.answerRow}>
          <Text style={styles.answerLabel}>Correct: </Text>
          <Text style={[styles.answerValue, styles.correctText]}>{item.correct}</Text>
        </View>
      )}
      <Text style={styles.explanationText}>{item.explanation}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.performanceText}>{getPerformanceMessage()}</Text>
        <View style={styles.circleContainer}>
          <View style={styles.scoreCircle}>
            <Text style={styles.percentageText}>{percentage}%</Text>
            <Text style={styles.ratioText}>{score}/{total}</Text>
          </View>
        </View>
        <Text style={styles.topicText}>{topic}</Text>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Review Results</Text>
      </View>

      <FlatList
        data={answers}
        renderItem={renderReviewItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <GoldButton 
          title="Retake Quiz" 
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })} 
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scoreContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  performanceText: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 4,
    marginBottom: 20,
  },
  circleContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  scoreCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    color: COLORS.black,
    fontSize: 36,
    fontWeight: '900',
  },
  ratioText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.8,
  },
  topicText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '500',
  },
  listHeader: {
    padding: 24,
    paddingBottom: 10,
  },
  listTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '700',
  },
  listContent: {
    padding: 24,
    paddingTop: 0,
  },
  reviewCard: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumber: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '900',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  correctBadge: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
  },
  incorrectBadge: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
  reviewQuestion: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    lineHeight: 22,
  },
  answerRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  answerLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  answerValue: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  correctText: {
    color: COLORS.correct,
  },
  incorrectText: {
    color: COLORS.incorrect,
  },
  explanationText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 10,
    lineHeight: 18,
  },
  footer: {
    padding: 24,
    backgroundColor: COLORS.background,
  },
});

export default ResultScreen;
