import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
  Platform,
  Linking,
  AppState,
  AsyncStorage
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import api from '../Utils/api';
import Dashboard from './Dashboard';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#00aced',
  },
  title: {
    marginBottom: 20,
    fontSize: 25,
    textAlign: 'center',
    color: '#fff'
  },
  searchInput: {
    height: 50,
    padding: 4,
    marginRight: 5,
    fontSize: 23,
    ...Platform.select({
      ios: {
        borderWidth: 1,
      },
      android: {
        borderWidth: 0,
      },
    }),
    borderColor: 'white',
    borderRadius: 8,
    color: 'white'
  },
  buttonText: {
    fontSize: 18,
    color: '#111',
    alignSelf: 'center'
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      isLoading: false,
      error: false
    };
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
  }
  _handleAppStateChange(currentAppState) {
    this.setState({ currentAppState });
    if (Platform.OS === 'android') {
      this._checkDeepLink();
    }
  }
  _checkDeepLink() {
    Linking.getInitialURL()
      .then(url => {
        if (!url) return;

        try {
          var parts = url.split('//')[1].split('/');
          var welcomePart = parts[parts.length - 1];
          var welcomeProps = welcomePart.split('?')[1];
        } catch (err) {
          console.error(err);
        }

        api.getTwitterUserInfo(welcomeProps)
          .then(res => {
            const userInfoString = res._bodyInit;

            AsyncStorage.setItem('userData', userInfoString, (err) => {
              if (err) console.error('Error saving user data to AsyncStorage');
            });

            this.props.navigator.push({
              screen: 'Dashboard',
              title: 'Dashboard',
              passProps: { user: JSON.parse(userInfoString) }
            });

          });
      });
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  componentDidMount() {
    AsyncStorage.getItem('userData', (err, userDataString) => {
      if (err) return console.error('Error retrieving user data from AsyncStorage');
      if (!userDataString) return console.warn('User data not found');

      this.props.navigator.push({
        screen: 'Dashboard',
        title: 'Dashboard',
        passProps: { user: JSON.parse(userDataString); }
      });
    });
    AppState.addEventListener('change', this._handleAppStateChange);
    this._checkDeepLink();
  }
  handleSubmit() {
    this.setState({
      isLoading: true
    });

    api.getTwitterSigninUrl()
      .then(res => {
        if (res.message === 'Not Found') {
          this.setState({
            error: 'Not found',
            isLoading: false
          });
        } else {
          Linking.canOpenURL(res.redirect_url)
            .then(supported => {
              if (!supported) {
                console.warn('Can\'t handle url: ' + res.redirect_url);
              } else {
                return Linking.openURL(res.redirect_url);
              }
            })
            .catch(err => console.error('An error occurred', err));
          this.setState({
            isLoading: false,
            error: false,
            username: ''
          })
        }
      });
  }
  render() {
    const showErr = (this.state.error ? <Text> {this.state.error} </Text> : <View></View>);
    return (
      <View style={styles.mainContainer}>
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit.bind(this)}
          underlayColor='white'>
          <Text style={styles.buttonText}> Sign In with Twitter </Text>
        </TouchableHighlight>
        <ActivityIndicator
          animating={this.state.isLoading || false}
          color="#111"
          size="large"
        />
        {showErr}
      </View>
    );
  }
}