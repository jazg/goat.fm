import express from "express";
import request from "request";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import queryString from "node:querystring";
import Video from "./model/video";

const app = express();
const port = 3000;
const spotifyClientID = "876c87b4c82f4872aa0a4cfc3bca89e8";
const spotifyClientSecret = process.env.SPOTIFY_SECRET;
const googleKeys = process.env.GOOGLE_KEYS
  ? process.env.GOOGLE_KEYS.split(",")
  : [process.env.GOOGLE_KEY];
const redirectURI = `http://localhost:5173/callback`;
const stateKey = "spotify_auth_state";

app.use(cors()).use(cookieParser());
app.use(express.json());

app.get("/login", (req, res) => {
  const state = Math.random().toString(36); // Generate random string to prevent cross-site request forgery.
  res.cookie(stateKey, state);
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      queryString.stringify({
        response_type: "code",
        client_id: spotifyClientID,
        redirect_uri: redirectURI,
        state,
      })
  );
});

app.get("/callback", (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        queryString.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirectURI,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(spotifyClientID + ":" + spotifyClientSecret).toString(
            "base64"
          ),
      },
      json: true,
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        // Pass the token to the browser to make requests from there.
        res.redirect(
          "/#" +
            queryString.stringify({
              access_token: body.access_token,
              expires_in: body.expires_in,
              refresh_token: body.refresh_token,
            })
        );
      } else {
        res.redirect(
          "/#" +
            queryString.stringify({
              error: "invalid_token",
            })
        );
      }
    });
  }
});

app.get("/refresh_token", (req, res) => {
  const refreshToken = req.query.refresh_token;
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(spotifyClientID + ":" + spotifyClientSecret).toString(
          "base64"
        ),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send({
        accessToken: body.access_token,
        expiresIn: body.expires_in,
      });
    }
  });
});

app.post("/find_video", async (req, res) => {
  // Check if the video already exists.
  const video = await Video.findOne({
    artist: req.body.artist,
    title: req.body.title,
  });
  if (video) {
    res.send({ id: video.id });
  } else {
    // Otherwise fetch from YouTube API and store it in the database.
    const key = googleKeys[Math.floor(Math.random() * googleKeys.length)];
    request.get(
      {
        uri: `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          req.body.artist + " - " + req.body.title
        )}&type=videovideoEmbeddable=true&maxResults=1&key=${key}`,
        headers: {
          Referer: req.headers.host,
        },
      },
      async (error, response, body) => {
        if (!error && response.statusCode === 200) {
          const responseData = JSON.parse(body);
          const id = responseData.items[0].id.videoId;
          await Video.create({
            artist: req.body.artist,
            title: req.body.title,
            id,
            timestamp: Date.now(),
          });
          res.send({ id });
        } else {
          console.error(error, response.statusCode, key);
        }
      }
    );
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

const main = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017");
};

main();
