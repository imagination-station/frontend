import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  scrollIndicator: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10
  },
  indicatorDot: {
    height: 6,
    width: 6,
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 3
  },
});

export default function ImageCarousel(props) {
  const position = Animated.divide(props.scrollValue, props.width);

  return (
      <View style={props.containerStyle}>
        <Animated.ScrollView
          style={props.scrollViewStyle}
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  x: props.scrollValue,
                },
              },
            }],
            {useNativeDriver: true}
          )}
        >
          {props.children}
        </Animated.ScrollView>
        <View style={styles.scrollIndicator}>
          {props.children.map((_, i) => {
            let opacity = position.interpolate({
              // each dot will need to have an opacity of 1 when position is equal to their index (i)
              inputRange: [i - 1, i, i + 1],
              // when position is not i, the opacity of the dot will animate to 0.3
              outputRange: [0.3, 1, 0.3],
                // this will prevent the opacity of the dots from going outside of the outputRange (i.e. opacity will not be less than 0.3)
              extrapolate: 'clamp'
            });
            return (
              <Animated.View
                key={i}
                style={{...styles.indicatorDot, opacity}}
              />
            );
          })}
        </View>
    </View>
  );
}
