import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { planningStyles as styles } from '../style/planning.styles';

type PlanningProps = {
  onDateChange?: (date: Date) => void; // facultatif, si tu veux notifier le parent
};

const Planning: React.FC<PlanningProps> = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
    onDateChange?.(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
    onDateChange?.(newDate);
  };

  return (
    <View style={styles.planningContainer}>
      <Text style={styles.planningTitle}>Planning</Text>
      <View style={styles.dateRow}>
        <TouchableOpacity onPress={goToPreviousDay} style={styles.arrowButton}>
          <Ionicons name="chevron-back" size={20} color="white" />
        </TouchableOpacity>

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {selectedDate.toLocaleDateString('fr-FR', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>

        <TouchableOpacity onPress={goToNextDay} style={styles.arrowButton}>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Planning;
