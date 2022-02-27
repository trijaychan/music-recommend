// helper.js

const request = require("request-promise");
const spotifyAccessToken = "BQCbtKM52GoC8L79qCf7rnSfyuIEEL_Jr9uxLZyvt999uuWGgHclv9FJW6CPHJ43BM-3RVJ8NF-TXfO7id3wzZb1HlfIfC0g_l_EEwfXIwkNsbkWFEiMLYTB-e4guBQKCQBV9_IpixOJs1Buq6KIvwBcEYQMW2x_rAM";
const headers = { Authorization: `Bearer ${spotifyAccessToken}` };

const fetchArtistSpotify = (artistName) => {
  const options = {
    url: `https://api.spotify.com/v1/search?q=${artistName}&type=artist&limit=3`,
    headers
  };

  return request(options);
};

const fetchSimilarArtistsSpotify = (body) => {
  const artistID = JSON.parse(body).artists.items[0].id;
  const options = {
    url: `https://api.spotify.com/v1/artists/${artistID}/related-artists`,
    headers
  };

  return request(options);
};

const fetchTopTracks = (body) => {
  const data = JSON.parse(body).artists;
  const topTracksByArtists = [];
  let url;

  for (let i = 0; i < 2; i++) {
    url = `https://api.spotify.com/v1/artists/${data[i].id}/top-tracks?market=ES`;
    topTracksByArtists.push(request({ url, headers }));
  }

  return Promise.all(topTracksByArtists);
}

const recommendedBySpotify = (artistName) => {
  return fetchArtistSpotify(artistName)
    .then(fetchSimilarArtistsSpotify)
    .then(fetchTopTracks)
    .then((arr) => {
      const recommendations = {};
      
      for (const artist of arr) {
        const data = JSON.parse(artist)
        const name = data.tracks[0].artists[0].name
        recommendations[name] = [];

        for (const track of data.tracks) {
          recommendations[name].push({
            name: track.name,
            album: track.album.name,
            external_url: track.external_urls.spotify,
            cover: track.album.images[0].url
          });
        }
      }

      return recommendations;
    })
};

module.exports = {
  recommendedBySpotify
};