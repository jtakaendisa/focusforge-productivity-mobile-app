import { StyleSheet, Text, View } from 'react-native';

const TimerScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timer</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default TimerScreen;
