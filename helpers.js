// helper.js

const request = require("request-promise");
const spotifyAccessToken = "BQCURvYXoVl0_lMfOyHH_TtLOFnIZ-OSmHi6z0uzTTfzvBtCpdKlmiBD1uT5L9_4babbcoB8n-8iuPt9ZtZ03FU_YdH4_w44TOPIiofJmB3BVv2dOU8umgiiZ-3WKeP7LaRLZ0UMUlilo9o0AsAxoCDYNt0uaU3BTqk";
const headers = { Authorization: `Bearer ${spotifyAccessToken}` };

const fetchArtistSpotify = (artistName) => {
  const options = {
    url: `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=3`,
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
    const id = data[i].id
    url = `https://api.spotify.com/v1/artists/${data[i].id}/top-tracks?market=ES`;
    let tracks = request({ url, headers });
    topTracksByArtists.push(tracks);
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
        const data = JSON.parse(artist);
        const name = data.tracks[0].artists[0].name;
        recommendations[name] = [];

        for (const track of data.tracks) {
          recommendations[name].push({
            name: track.name,
            album: track.album.name,
            external_url: track.external_urls.spotify,
            cover: track.album.images[0].url,
            header: data.header
          });
        }
      }

      return recommendations;
    })
};

module.exports = {
  recommendedBySpotify
};