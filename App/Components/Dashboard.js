import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import api from '../Utils/api';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    height: 350
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
    alignSelf: 'center'
  }
});

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }
  makeBackground(btn) {
    const obj = {
      flexDirection: 'row',
      alignSelf: 'stretch',
      justifyContent: 'center',
      flex: 1
    }

    if (btn === 0) {
      obj.backgroundColor = '#48BBEC';
    } else if (btn === 1) {
      obj.backgroundColor = '#E77AAE';
    } else if (btn === 2) {
      obj.backgroundColor = '#758bF4';
    }

    return obj;
  }
  _onPressButtonLocation() {
    this.props.navigator.push({
      screen: 'MapScreen',
      title: 'MapScreen',
    });
  }
  _onPressButtonLogout() {
    AsyncStorage.removeItem('userData');
    this.props.navigator.push({
      screen: 'Main',
      title: 'Main',
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Image source={{ uri: this.props.user.profile_image_url.replace('_normal.jpg', '_400x400.jpg') }} style={styles.image} />
        <TouchableHighlight
          style={this.makeBackground(0)}
          underlayColor='#88D4F5'>
          <Text style={styles.buttonText}> {this.props.user.name} </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={this.makeBackground(1)}
          underlayColor='#88D4F5'
          onPress={this._onPressButtonLocation.bind(this)}>
          <Text style={styles.buttonText}> Get Location </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={this.makeBackground(2)}
          underlayColor='#88D4F5'
          onPress={this._onPressButtonLogout.bind(this)}>
          <Text style={styles.buttonText}> Logout </Text>
        </TouchableHighlight>
      </View>
    );
  }
}
