import { StyleSheet } from 'react-native';

export const ACCENT = '#ff5a5f';
export const ACCENT_GREEN = '#00A699';
export const GREY = '#f2f2f2';
export const DARKER_GREY = '#c2c2c2';

export const HOF = '#484848';
export const FOGGY = '#767676';

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