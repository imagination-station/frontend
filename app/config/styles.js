import { StyleSheet } from 'react-native';

export const PRIMARY = '#E77728';
export const ACCENT = '#0B3C49';
export const MINT_CREAM = '#ffffff';

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