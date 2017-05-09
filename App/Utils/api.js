import { host } from '/config.json';

export default api = {
  getTwitterSigninUrl() {
    const url = `${host}/api/request-token`;
    return fetch(url).then(res => res.json());
  },
  getTwitterUserInfo(tokenAndVerifierParams) {
    const url = `${host}/api/access-token?${tokenAndVerifierParams}`;
    return fetch(url);
  },
  getTweets(query, latitude, longitude) {
    const url = `${host}/api/tweets/${query}/${latitude},${longitude}`;
    return fetch(url).then(res => res.json());
  }
};