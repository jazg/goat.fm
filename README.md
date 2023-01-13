# goat.fm

A visual music discovery platform.

![Screenshot](./screenshot.png)

## Running locally

To run the client:

```sh
cd client
yarn
yarn dev
```

To run the web server locally, you will need to generate a Spotify client secret and a Google API key. You can do this through the [Spotify developer dashboard](https://developer.spotify.com/dashboard/applications) and [Google Cloud console](https://console.cloud.google.com/apis). Then you can run:

```sh
cd server
yarn
SPOTIFY_SECRET=<your-spotify-client-secret> GOOGLE_KEY=<your-google-key> yarn dev
```

## TODO

- Integrate last.fm API for improved suggestions

## Stack

- vite: Development tooling
- Express: Web server
- React: JS library
- TypeScript: Programming language
- Tailwind: CSS framework
