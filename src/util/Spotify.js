let client_id = '';
let redirect_uri = 'http://localhost:3000/';

const Spotify = {
    getAccessToken() {
        let access_token = this.checkToken();
        if (access_token) {
            return access_token;
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
            return false;
        }
    },

    checkToken() {
        let cookieToken = cookies.getCookie('access_token');
        if (cookieToken != '') return cookieToken;

        let urlToken = window.location.href.match(/access_token=([^&]*)/);
        if (urlToken != null) {
            let token = urlToken[0].slice(13);
            let expires_in = Number(window.location.href.match(/expires_in=([^&]*)/)[0].slice(11));
            cookies.setCookie('access_token', token, expires_in);
            window.history.pushState('Access Token', null, '/');

            return token;
        }

        return false;
    },

    search: async (term) => {
        const headers = {
            headers: {Authorization: `Bearer ${cookies.getCookie('access_token')}`}
        };

        try {
            const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, headers);
            if (response.ok) {
                const jsonResponse = await response.json();
                
                let tracks = jsonResponse.tracks.items;

                if (Object.keys(tracks).length === 0) return [];

                return tracks = Object.keys(tracks).map(key => {
                    return {
                        id: tracks[key].id,
                        name: tracks[key].name,
                        artist: tracks[key].artists[0].name,
                        album: tracks[key].album.name,
                        uri: tracks[key].uri
                    };
                });
            }
            throw new Error('Request failed!');
        } catch(error) {
            console.log(error);
        }
    },

    savePlaylist: async (playlistName, URIs) => {
        if(!playlistName || URIs.length === 0) return;
        
        let access_token = cookies.getCookie('access_token');
        const headers = {Authorization: `Bearer ${access_token}`};
        let user_id = '';

        try {
            let response = await fetch('https://api.spotify.com/v1/me', {headers: headers});
            if (response.ok) {
                const jsonResponse = await response.json();
                user_id = jsonResponse.id;
                console.log(user_id);
                
                let response2 = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({name: playlistName})
                });

                if (response2.ok) {
                    const jsonResponse2 = await response2.json();
                    let playlist_id = jsonResponse2.id;
                    console.log(playlist_id);

                    let response3 = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({uris: URIs})
                    });

                    const jsonResponse3 = await response3.json();
                    console.log(jsonResponse3);
                    return;
                }
            }
            throw new Error('Request failed!');
        } catch(error) {
            console.log(error);
        }
    }
};

const cookies = {
    setCookie: (cname, cvalue, expires_in) => {
        const d = new Date();
        d.setTime(d.getTime() + (expires_in * 1000));
        let expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      },
      
      getCookie: (cname) => {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }
}

export default Spotify;