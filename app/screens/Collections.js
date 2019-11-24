import React, { Component, Fragment } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
  Image,
  Dimensions,
  PixelRatio,
  ActivityIndicator
} from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

import { DARKER_GREY, GREY, PRIMARY } from '../config/styles.js';
import { SERVER_ADDR, MAPS_API_KEY } from '../config/settings.js';

const {width, height} = Dimensions.get('window');

const CARD_HEIGHT = 200;
const CARD_WIDTH = width - 40;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight + 20
  },
  headerContainer: {
    flexDirection:'row',
    alignItems: 'center',
    paddingBottom: 5
  },
  headerFocused: {
    fontSize: 40,
    marginHorizontal: 17
  },
  headerBlurred: {
    fontSize: 30,
    marginHorizontal: 17,
    color: DARKER_GREY
  },
  safeArea: {
    flex: 1,
    backgroundColor: GREY
  },
  safeStatusArea: {
    flex: 0,
    backgroundColor: '#fff'
  },
});

const cardStyles = StyleSheet.create({
  card: {
    marginVertical: 15,
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: 'hidden',
    borderRadius: 10
  },
  gradient: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  cardImage: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  textContent: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 30,
    position: 'absolute',
    bottom: 0
  },
  cardtitle: {
    fontSize: 20,
    marginBottom: 5,
    color: 'white'
  },
  iconButtonBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 5
  }
});

function RouteCard(props) {
  const ref = props.route.pins[0].properties.photoRefs[0];
  const imgHeight = PixelRatio.getPixelSizeForLayoutSize(CARD_HEIGHT);
  const imgWidth = PixelRatio.getPixelSizeForLayoutSize(CARD_WIDTH);

  let pic = {
    uri: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${ref}&maxheight=${imgHeight}&maxWidth=${imgWidth}`
  };

  let buttons = null;
  if (props.buttons) {
    buttons = (
      <View style={cardStyles.iconButtonBar}>
        <TouchableOpacity onPress={props.onLike}>
          <Icon
            name='favorite'
            size={25}
            color='#e5446d'
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={cardStyles.card}>
        {buttons}
        <Image source={pic} style={cardStyles.cardImage} resizeMode='cover' />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={cardStyles.gradient}
        >
        </LinearGradient>
        <View style={cardStyles.textContent}>
          <Text style={cardStyles.cardtitle}>{props.route.name}</Text>
          <Text style={{marginBottom: 5, color: GREY}}>{props.route.city.name}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name='favorite'
              size={15}
              color='#e5446d'
              style={{marginRight: 3}}
            />
            <Text style={{color: GREY, fontSize: 12}}>{props.route.numLikes}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

function FAB(props) {
  return (
    <TouchableOpacity>
      <View style={{position: 'absolute', bottom: 25, right: 25, borderRadius: 25, height: 50, width: 50, elevation: 2, backgroundColor: PRIMARY, justifyContent: 'center', alignItems: 'center'}}>
        <Icon
          name='add'
          size={40}
          color='white'
        />
      </View>
    </TouchableOpacity>
  );
}

const screens = {
  MYTRIPS: 'm',
  SAVED: 's',
  LIKED: 'l'
}

class CollectionsScreen extends Component {

  state = {
    routes: [],
    liked: [],
    screen: screens.MYTRIPS,
    refreshing: true
  };

  componentDidMount() {
    this.fetchRoutes();
    this.focusListener = this.props.navigation.addListener('didFocus', this.fetchRoutes);
  }

  fetchRoutes = () => {
    this.setState({refreshing: true});
    firebase.auth().currentUser.getIdToken()
    .then(token => {
      let fetches = [];
      for (let identifier of ['routes', 'likes']) {
        fetches.push(
          fetch(`${SERVER_ADDR}/users/${this.props.userId}/${identifier}`, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          })
          .then(response => response.json())
        );
      }

      return Promise.all(fetches);
    })
    .then(responseJsons => {
      this.setState({
        routes: responseJsons[0],
        liked: responseJsons[1],
        refreshing: false
      });
    });
  }

  currentStyle = screen => {
    if (screen == this.state.screen) {
      return styles.headerFocused;
    } else {
      return styles.headerBlurred;
    }
  }

  render() {
    const current = this.state.screen == screens.MYTRIPS ? this.state.routes : this.state.liked;

    const header = (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => this.setState({screen: screens.MYTRIPS})}>
          <Text style={this.currentStyle(screens.MYTRIPS)}>My Trips</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.setState({screen: screens.LIKED})}>
          <Text style={this.currentStyle(screens.LIKED)}>Liked</Text>
        </TouchableOpacity>
      </View>
    );

    let content = null;
    if (this.state.refreshing) {
      content = (
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', flex: 1}}>
          <ActivityIndicator size='large' color={PRIMARY} />
        </View>
      );
    } else {
      content = (
        <View style={styles.container}>
          {header}
          {current.length != 0 ?
            <FlatList
              data={current}
              renderItem={({ item }) => {
                return (
                  <RouteCard
                    key={item._id}
                    route={item}
                    buttons={this.state.screen != screens.MYTRIPS}
                    onPress={() => this.props.navigation.navigate('RouteDetail', {
                      route: item
                    })}
                  />
                );
              }}
              keyExtractor={item => item._id}
              contentContainerStyle={{alignSelf: 'center'}}
              onRefresh={this.fetchRoutes}
              refreshing={this.state.refreshing}
            /> : <Text style={{padding: 30, alignSelf: 'center', color: DARKER_GREY}}>Wow, so empty :)</Text>}
          <FAB />
        </View>
      );
    }

    return (
      <Fragment>
        <SafeAreaView style={styles.safeStatusArea} />
        <SafeAreaView style={styles.safeArea}>
          {content}
        </SafeAreaView>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.userId
  };
}

export default connect(mapStateToProps, null)(CollectionsScreen);
