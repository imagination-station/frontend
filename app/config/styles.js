import { StyleSheet } from 'react-native';

export const PRIMARY = '#eb8993';
export const ACCENT = '#7477ad';

export const GREY = '#f2f2f2';
export const DARKER_GREY = '#c2c2c2';

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