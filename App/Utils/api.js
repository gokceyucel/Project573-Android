export default api = {
  getBio(username) {
    username = username.toLowerCase().trim();
    const url = `https://api.github.com/users/${username}`;
    return fetch(url).then(res => res.json())
  },
  getRepos(username) {
    username = username.toLowerCase().trim();
    const url = `https://api.github.com/users/${username}/repos`;
    return fetch(url).then(res => res.json())
  },
  getTwitterSigninUrl() {
    // const url = 'https://573.gkcycl.host/api/request-token';
    const url = 'http://192.168.0.19:8080/api/request-token';
    return fetch(url).then(res => res.json());
  },
  getTwitterUserInfo(tokenAndVerifierParams) {
    const url = 'http://192.168.0.19:8080/api/access-token?' + tokenAndVerifierParams;
    return fetch(url);
  }
};