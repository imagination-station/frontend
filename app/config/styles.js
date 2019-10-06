import { StyleSheet } from 'react-native';

export const accentColor = '#ff5a5f';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    backgroundColor: 'whitesmoke',
    color: accentColor,
    fontSize: 24,
    padding: 10,
  },
  button: {
    color: accentColor,
    fontSize: 18,
    paddingHorizontal: 7
  }
});

export default styles;