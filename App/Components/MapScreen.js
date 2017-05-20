import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import MapView from 'react-native-maps';
import { Dimensions } from 'react-native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import api from '../Utils/api';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default class MapScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: []
    };
  }
  getCurrentLocation(next) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { height, width } = Dimensions.get('window');
        const ASPECT_RATIO = width / height
        const LATITUDE_DELTA = 0.1 //Very high zoom level
        const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          longitudeDelta: LONGITUDE_DELTA,
          latitudeDelta: LATITUDE_DELTA
        };
        next(region);
      },
      error => console.warn(error.message),
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    );

    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({ lastPosition });
    });
  }
  componentDidMount() {
    LocationServicesDialogBox
      .checkLocationServicesIsEnabled({
        message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
        ok: "YES",
        cancel: "NO"
      })
      .then(success => {
        this.getCurrentLocation(region => {
          this.refs.map.animateToRegion(region);
          this.setState({ region });
          return region;
        });
      })
      .catch(error => {
        console.warn(error.message);
      });
  }
  getTweetsAndMarkThem(region) {
    api
      .getTweets('hava', region.latitude, region.longitude)
      .then(tweets => {
        if (tweets.length < 1) {
          return;
        }
        const markers = tweets.map((tweet, index) => {
          if (!tweet.geo) return;
          return (
            <MapView.Marker
              key={index}
              coordinate={{
                latitude: tweet.geo.coordinates[0],
                longitude: tweet.geo.coordinates[1]
              }}
              title={tweet.text}
            />
          );
        });
        this.setState({ markers });
      });
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }
  onRegionChange(region) {
    console.log('onRegionChange', region);
    this.setState({ region });
  }
  onRegionChangeComplete(region) {
    this.getTweetsAndMarkThem(region);
  }
  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref='map'
          style={styles.map}
          onRegionChange={this.onRegionChange.bind(this)}
          onRegionChangeComplete={this.onRegionChangeComplete.bind(this)}
          region={this.state.region}
          showsUserLocation={true}
        >
          {this.state.markers}
        </MapView>
      </View>
    );
  }
}
