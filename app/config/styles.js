import { StyleSheet } from 'react-native';

export const PRIMARY = '#eb8993';
export const ACCENT = '#577590';

export const GREY = '#f2f2f2';
export const DARKER_GREY = '#6D7380';

export const FACEBOOK = '#4c69ba';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    color: ACCENT,
    fontSize: 18,
    paddingHorizontal: 7
  }
});

export default styles;