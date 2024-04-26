import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Vibration,
  TextInput,
  Dimensions,
  Animated,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Easing,
} from 'react-native';
const { width, height } = Dimensions.get('window');
const colors = {
  black: '#323F4E',
  red: '#F76A6A',
  text: '#ffffff',
};

let timers = [...Array(13).keys()].map((i) => (i === 0 ? 1 : i * 5));
timers = timers.slice(1);

const ITEM_SIZE = width * 0.38;
const ITEM_SPACING = (width - ITEM_SIZE) / 2;

const TimerScreen = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const timerAnimation = useRef(new Animated.Value(height)).current;
  const textInputAnimation = useRef(new Animated.Value(0)).current;
  const buttonAnimation = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  const [duration, setDuration] = useState(timers[0]);
  const [countingDown, setCountingDown] = useState(false);

  const animation = useCallback(() => {
    textInputAnimation.setValue(duration);
    Animated.sequence([
      Animated.timing(buttonAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(timerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(textInputAnimation, {
          toValue: 0,
          duration: duration * 1000 * 60,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(timerAnimation, {
          toValue: height,
          duration: duration * 1000 * 60,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(400),
    ]).start(() => {
      Vibration.cancel();
      Vibration.vibrate();
      textInputAnimation.setValue(duration);
      Animated.timing(buttonAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setCountingDown(false);
    });
  }, [duration]);

  const opacity = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const textOpacity = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleCountdown = () => {
    setCountingDown(true);
    animation();
  };

  useEffect(() => {
    const listener = textInputAnimation.addListener(({ value }) => {
      const totalSeconds = value * 60;
      const minutes = Math.floor(totalSeconds / 60);
      const remainingSeconds = Math.floor(totalSeconds % 60);

      inputRef?.current?.setNativeProps({
        text: `${minutes.toString().padStart(2, '0')}:${remainingSeconds
          .toString()
          .padStart(2, '0')}`,
      });
    });

    return () => textInputAnimation.removeListener(listener);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            width,
            height,
            backgroundColor: colors.red,
            transform: [{ translateY: timerAnimation }],
          },
        ]}
      />
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: 100,
          },
        ]}
      >
        <TouchableOpacity onPress={handleCountdown}>
          <View style={styles.roundButton}>
            <Text style={{ color: 'white' }}>{countingDown ? 'pause' : 'start'}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
      <View
        style={{
          position: 'absolute',
          top: height / 3,
          left: 0,
          right: 0,
          flex: 1,
        }}
      >
        <Animated.View
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
            position: 'absolute',
            width: ITEM_SIZE,
            opacity: textOpacity,
          }}
        >
          <TextInput
            ref={inputRef}
            style={styles.text}
            defaultValue={duration.toString()}
          />
        </Animated.View>
        <Animated.FlatList
          data={timers}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item, index }) => {
            const inputRange = [
              (index - 1) * ITEM_SIZE,
              index * ITEM_SIZE,
              (index + 1) * ITEM_SIZE,
            ];

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.7, 1, 0.7],
              extrapolate: 'clamp',
            });

            return (
              <View
                style={{
                  width: ITEM_SIZE,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Animated.Text
                  style={[
                    styles.text,
                    {
                      opacity,
                      transform: [{ scale }],
                    },
                  ]}
                >
                  {item}
                </Animated.Text>
              </View>
            );
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          onMomentumScrollEnd={(ev) => {
            const index = Math.round(ev.nativeEvent.contentOffset.x / ITEM_SIZE);
            setDuration(timers[index]);
          }}
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_SIZE}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: ITEM_SPACING,
          }}
          style={{ flexGrow: 0, opacity }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  roundButton: {
    width: 80,
    height: 80,
    borderRadius: 80,
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: ITEM_SIZE * 0.3,
    color: colors.text,
    fontWeight: '900',
  },
});

export default TimerScreen;
