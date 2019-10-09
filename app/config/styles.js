import { StyleSheet } from 'react-native';
import { StatusBar } from 'react-native';

export const ACCENT = '#ff5a5f';
export const GREY = '#f2f2f2';
export const DARKER_GREY = '#c2c2c2';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    backgroundColor: 'whitesmoke',
    fontSize: 16,
    padding: 10,
  },
  button: {
    color: ACCENT,
    fontSize: 18,
    paddingHorizontal: 7
  }
});

export default styles;