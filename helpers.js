// helper.js

const request = require("request-promise");
const spotifyAccessToken = "BQBxCFg5ThxPrebALtijVP8lf02gkYpcPwTTiBb7BjEA17Z85QiXbGDgjBydIlt65A-TSt0R8X8LwWFVS82Wc8JzwliZ1qgR4OM5kKSPGp44nPkVQrn5lMuUzl7pNYbztw7i0aXbrcxtWIwuXoxWNNdcwmJye0UhLh4";

const fetchArtistIdSpotify = (artistName) => {
  const options = {
    url: `https://api.spotify.com/v1/search?q=${artistName}&type=artist&limit=3`,
    headers: { Authorization: `Bearer ${spotifyAccessToken}` }
  };

  return request(options);
};

const fetchSimilarArtistsSpotify = (artistName) => {
  return fetchArtistIdSpotify(artistName)
    .then((body) => {
      const artistID = JSON.parse(body).artists.items[0].id;
      const options = {
        url: `https://api.spotify.com/v1/artists/${artistID}/related-artists`,
        headers: { Authorization: `Bearer ${spotifyAccessToken}` }
      };

      return request(options);
    });
};

module.exports = {
  fetchSimilarArtistsSpotify
};