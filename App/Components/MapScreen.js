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
import { Dimensions } from 'react-native'
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
  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
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

      this.refs.map.animateToRegion(region);

      api.getTweets('hava', region.latitude, region.longitude)
        .then(tweets => {
          const markers = tweets.map((tweet, index) => {
            if (!tweet.geo) return;
            return (<MapView.Marker
              key={index}
              coordinate={{
                latitude: tweet.geo.coordinates[0],
                longitude: tweet.geo.coordinates[1]
              }}
              title={tweet.text}
            />)
          });
          this.setState({ markers });
        });
    }, (error) => console.error(JSON.stringify(error)));

    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({ lastPosition });
    });
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }
  onRegionChange(region) {
    console.log('onRegionChange', region);
  }
  onRegionChangeComplete(region) {
    console.log('onRegionChangeComplete', region);
  }
  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref='map'
          style={styles.map}
          onRegionChange={this.onRegionChange}
          showsUserLocation={true}
        >
          {this.state.markers}
        </MapView>
      </View>
    );
  }
}
