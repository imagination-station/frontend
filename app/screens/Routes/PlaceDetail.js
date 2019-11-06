import React, { Component } from 'react';
import { View, StyleSheet, Text, Animated, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import { LongButton } from '../../components/Buttons.js';
import ImageCarousel from '../../components/ImageCarousel.js';
import { GREY, DARKER_GREY, PRIMARY } from '../../config/styles.js';
import { MAPS_API_KEY } from '../../config/settings.js';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollViewContainer: {
    alignItems: 'center'
  },
  imageScrollView: {
    height: 300,
    width: width
  },
  image: {
    height: 300,
    width: width
  },
  textContainer: {
    padding: 10
  },
  mainText: {
    fontSize: 24,
    marginBottom: 3
  },
  secondaryText: {
    color: DARKER_GREY
  },
  sectionHeader: {
    fontSize: 12,
    marginBottom: 5,
    marginTop: 25,
    color: PRIMARY
  },
  buttonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: GREY,
    padding: 10
  }
});

const {width, height} = Dimensions.get('window');

class PlaceDetail extends Component {

  componentWillMount() {
    this.scrollValue = new Animated.Value(0);
  }

  render() {
    const place = this.props.markers[this.props.selected];

    const photos = place.properties.photoRefs ?
      place.properties.photoRefs.map(ref =>
        <Image
          source={{uri: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${ref}&maxheight=800&maxWidth=${CARD_WIDTH}`}}
          style={styles.image}
        />
      ) : [<Image
        source={{uri: `https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/404_Store_Not_Found.jpg/1024px-404_Store_Not_Found.jpg`}}
        style={styles.image}
      />];

    const placeholder = 'Write interesting facts, things to do, or anything you want to record about this place.';

    if (this.props.editable) {
      placeholder = 'Write interesting facts, things to do, or anything you want to record about this place.';
    } else {
      placeholder = 'No notes about this place';
    }

    return (
      <View style={styles.container}>
        <ImageCarousel
          width={width}
          scrollValue={this.scrollValue}
          containerStyle={styles.scrollViewContainer}
          scrollViewStyle={styles.imageScrollView}
        >
          {photos}
        </ImageCarousel>
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>{place.properties.mainText}</Text>
          <Text style={styles.secondaryText}>{place.properties.secondaryText}</Text>
          <Text style={styles.sectionHeader}>NOTES</Text>
          {place.properties.note ? <View>
            <Text>{place.properties.note}</Text>
            <Text style={{color: DARKER_GREY, fontSize: 10, marginTop: 2}}>Last edited 10/18/2019</Text>
          </View> : <Text style={{color: 'grey'}}>
            {placeholder}
          </Text>}
          <LongButton
            icon='create'
            title='Edit notes'
            style={styles.buttonStyle}
            textStyle={{marginLeft: 40}}
            onPress={() => this.props.navigation.navigate('NoteEditor')}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    markers: state.markers,
    selected: state.selected,
  };
}

export default connect(mapStateToProps)(PlaceDetail);