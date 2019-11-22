import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Picker,
  Platform,
  PixelRatio
} from 'react-native';
import Checkbox from '../components/Checkbox.js';
// import { Checkbox } from 'react-native-elements';
import CheckboxFormX from 'react-native-checkbox-form';
import MapView, { Marker } from 'react-native-maps';
import { Header } from 'react-navigation-stack';
import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import MapViewDirections from 'react-native-maps-directions';
import resolveAssetSource from 'resolveAssetSource';

import Button from '../components/Buttons.js';
import globalStyles, { GREY, DARKER_GREY, PRIMARY, ACCENT } from '../config/styles.js';
import {
  MAPS_API_KEY,
  SERVER_ADDR,
  INIT_LOCATION,
  PLACE_ID,
  TAGS,
  PLACEHOLDER_IMG
} from '../config/settings.js';

// dimensions of the screen
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignSelf: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    }
});

const tags = [
    {
        label: 'Budget',
        RNchecked: false
    },
    {
        label: 'Walkable',
        RNchecked: false
    },
    {
        label: 'Historical',
        RNchecked: false
    },
    {
        label: 'Art & Architecture',
        RNchecked: false
    },
    {
        label: 'Local Approved',
        RNchecked: false
    },
    {
        label: 'Iconic',
        RNchecked: false
    },
    {
        label: 'Foodie',
        RNchecked: false
    }
];

class AddTagsScreen extends Component {

    state = {
      checkboxes: tags.reduce(
        (options, option) => ({
          ...options,
          [option]: false
        }),
        {}
      )
    };

    handleCheckboxChange = changeEvent => {
      const { name } = changeEvent.target;
  
      this.setState(prevState => ({
        checkboxes: {
          ...prevState.checkboxes,
          [name]: !prevState.checkboxes[name]
        }
      }));
    };
  
    handleFormSubmit = formSubmitEvent => {
      formSubmitEvent.preventDefault();
  
      Object.keys(this.state.checkboxes)
        .filter(checkbox => this.state.checkboxes[checkbox])
        .forEach(checkbox => {
          console.log(checkbox, "is selected.");
        });
    };
  
    createCheckbox = option => (
      <Checkbox
        title={option}
        checked={this.state.checked}
      />
    );
  
    createCheckboxes = () => tags.map(this.createCheckbox);
  
    render() {
        return (
          <View style={styles.container}>
              <View style={{ marginVertical: 10 }} >
                  <CheckboxFormX
                      style={{ width: width }}
                      dataSource={tags}
                      itemShowKey="label"
                      itemCheckedKey="RNchecked"
                      iconSize={30}
                      formHorizontal={false}
                      labelHorizontal={true}
                      onChecked={(item) => this.handleCheckboxChange}
                  />
              </View>
         </View>
        );
      }
  }
  
  export default AddTagsScreen;