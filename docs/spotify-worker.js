// ! CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN are environment variables defined in Cloudflare

addEventListener("fetch", (event) => {
  var url = new URL(event.request.url);
  var route = url.pathname.replaceAll("/", "");

  switch (route) {
    case "hello":
      event.respondWith(handleHello(event.request));
      break;
    case "authorize":
      event.respondWith(handleAuthorization(event.request));
      break;
    case "callback":
      event.respondWith(handleCallback(event.request));
      break;
    case "get-now-playing":
      event.respondWith(handleNowPlaying(event.request));
      break;
    case "get-recently-played":
      event.respondWith(handleRecentlyPlayed(event.request));
      break;
    default:
      event.respondWith(new Response("ERROR: Unsupported request."));
  }
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET",
  "Access-Control-Max-Age": "86400",
};

async function handleHello(request) {
  return new Response("Hello!, This is my first middleware thingy.");
}

async function handleAuthorization(request) {
  var state = "SPOTIFY_WIDGET";
  var url = new URL(request.url);
  var callback_url = `${url.protocol}//${url.hostname}/callback`;
  // NOTE: added user-read-recently-played scope
  var scope = "user-read-currently-playing user-read-recently-played";
  var params = {
    response_type: "code",
    client_id: CLIENT_ID,
    scope: scope,
    redirect_uri: callback_url,
    state: state,
  };

  var queryString = Object.keys(params)
    .map((key) => key + "=" + encodeURIComponent(params[key]))
    .join("&");

  return Response.redirect(
    "https://accounts.spotify.com/authorize?" + queryString,
    302
  );
}

async function handleCallback(request) {
  var url = new URL(request.url);
  var callback_url = `${url.protocol}//${url.hostname}/callback`;
  var code = url.searchParams.get("code") || null;
  var state = url.searchParams.get("state") || null;

  if (state === "SPOTIFY_WIDGET") {
    return fetch("https://accounts.spotify.com/api/token", {
      method: "post",
      headers: {
        Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `code=${code}&redirect_uri=${callback_url}&grant_type=authorization_code`,
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else return new Response("Something went wrong, retry authorization :/");
      })
      .then((data) => {
        return new Response(`Your refresh token is: ${data.refresh_token}`);
      });
  } else return new Response("Something went wrong, retry authorization :/");
}

// Helper: get a fresh access token from the refresh token
async function getAccessToken() {
  return await fetch("https://accounts.spotify.com/api/token", {
    method: "post",
    headers: {
      Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=refresh_token&refresh_token=${REFRESH_TOKEN}`,
  })
    .then((response) => response.json())
    .then((data) => data.access_token);
}

let lastPlayedSong = null;

async function handleNowPlaying(request) {
  var access_token = await getAccessToken();

  var songData = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: { Authorization: "Bearer " + access_token },
    }
  ).then((response) => response.text());

  if (!songData) {
    if (lastPlayedSong) {
      songData = lastPlayedSong;
    } else {
      songData = { ERROR: "Couldn't retrieve now playing." };
    }
  } else {
    songData = JSON.parse(songData);
    lastPlayedSong = songData;
  }

  return new Response(JSON.stringify(songData, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// NEW: Recently played endpoint
async function handleRecentlyPlayed(request) {
  var access_token = await getAccessToken();

  // Optional ?limit=N (default 10, max 50 per Spotify API)
  var url = new URL(request.url);
  var limit = url.searchParams.get("limit") || "10";

  var recentData = await fetch(
    `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
    {
      headers: { Authorization: "Bearer " + access_token },
    }
  ).then((response) => response.json());

  return new Response(JSON.stringify(recentData, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
