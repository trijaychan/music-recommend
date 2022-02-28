// helper.js

const request = require("request-promise");
const spotifyAccessToken = "BQDjcUEsnBnj0cNYumGzkK4YWtp4lEOni8RdaRCdk2N6fy3IFF9Cbt3NaZMEf6vEAwTDVqe7gttBMvXaJCm0MQF_fb-M4zNXX6qqeOq6sisGIol7YG7XcP1fDMwhvS0ODYgBHuffI8qQEAt516GDowQ_bCuCJ1JmPb4";
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
    const id = data[i].id;
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
        const name = data.tracks[0].album.artists[0].name;
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

const fetchArtistImage = (artistName) => {
  return fetchArtistSpotify(artistName)
  .then((body) => {
    const artistID = JSON.parse(body).artists.items[0].id;
    const url = `https://api.spotify.com/v1/artists/${artistID}`;

    return request({ url, headers })
      .then((artistBody) => {
        return JSON.parse(artistBody).images[0].url;
      });
  });
};

module.exports = {
  recommendedBySpotify,
  fetchArtistImage
};