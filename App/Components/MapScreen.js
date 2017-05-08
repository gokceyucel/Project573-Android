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

import api from '../Utils/api';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
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
  }
  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> MapScreen componentDidMount');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        console.log('>>>>>>>>>>>>>>>>>>>>>>>> INITIAL POSITIOn', initialPosition);
        this.setState({ initialPosition });
      },
      (error) => {
        console.error('>>>>>>>>>>>> ERROR LOCATION');
        alert(JSON.stringify(error))
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({ lastPosition });
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      </View>
    );
  }
}
