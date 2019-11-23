
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { GREY, PRIMARY, AQUAMARINE } from '../config/styles.js';
import { TAGS } from '../config/settings.js';

const styles = StyleSheet.create({
  button: { 
    color: AQUAMARINE,
    fontSize: 18,
    paddingHorizontal: 7,
    marginRight: 10,
    opacity: 1
  },
  container: {
    flex: 1,
    alignItems: 'center'
  },
  box: {
    width: 170,
    height: 170,
    backgroundColor: 'white',
    justifyContent: 'center',
    marginLeft: 15,
    marginBottom: 15,
    borderWidth: 2, borderColor: GREY
  },
  highlighted: {
    width: 170,
    height: 170,
    backgroundColor: AQUAMARINE,
    justifyContent: 'center',
    marginLeft: 15,
    marginBottom: 15,
  }
});

class Interests extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <Text style={{fontSize: 20, marginLeft: 10}}>Interests</Text>,
      headerRight: () => (
        <TouchableOpacity
          // TODO: PUT request to API server
        >
          {/* make Next button opaque until city is chosen */}
          <Text style={{...styles.button, opacity: 1}}>Done!</Text>
        </TouchableOpacity>
      )
    }
  }

  state = {
    interests: []
  };

  onToggleInterestBox = index => {
    if (this.state.interests.includes(index)) {
      this.setState({
        interests: this.state.interests.filter(i => i != index)
      });
    } else {
      this.setState({
        interests: [...this.state.interests, index]
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{width: '90%', marginVertical: 10, marginHorizontal: '5%'}}>
          <Text style={{fontSize: 32, color: 'grey'}}>What are</Text>
          <Text style={{fontSize: 32, color: 'grey'}}>you interested in?</Text>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Icon name='help-outline' size={20} color={PRIMARY} style={{marginRight: 5}}/>
            <Text>This helps us better individualize content.</Text>
          </View>
        </View>
        <FlatList
          style={{padding: 10, width: '100%'}}
          data={TAGS}
          renderItem={({ item , index }) => <TouchableOpacity onPress={() => this.onToggleInterestBox(index)}>
            <View style={this.state.interests.includes(index) ? styles.highlighted : styles.box}>
              <Text style={{fontSize: 18, textAlign: 'center', color: this.state.interests.includes(index) ? 'white' : 'grey'}}>{item}</Text>
            </View>
          </TouchableOpacity>}
          numColumns={2}
          keyExtractor={item => item}
        />
      </View>
    );
  }
}

export default Interests;