import { StyleSheet } from 'react-native';

export const accentColor = '#ff5a5f';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    backgroundColor: 'whitesmoke',
    color: accentColor,
    fontSize: 24,
    padding: 10,
  }
});

export default styles;